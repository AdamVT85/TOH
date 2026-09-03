// One-off / repeatable optimiser for everything under public/images.
//
//   npm run images:optimize            # rewrite oversized images in place
//   npm run images:optimize -- --dry   # report only, change nothing
//
// What it does, per file:
//   • resizes so the long edge is at most MAX_EDGE px (never upscales)
//   • re-encodes JPEG (mozjpeg, progressive, q82) and WebP (q80)
//   • converts PNG photos to JPEG and rewrites every reference in src/content
//   • strips metadata
// Files that are already small and within MAX_EDGE are left untouched, so the
// script is safe to re-run after editors upload new images via Keystatic.
// GIFs are skipped (they are usually tiny film-poster thumbnails).
//
// Originals are in git; `git checkout -- public/images` restores them.

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const CONTENT_DIR = path.join(ROOT, 'src', 'content');

const MAX_EDGE = 2000;           // px, long edge
const SKIP_UNDER_BYTES = 700_000; // already-small files inside MAX_EDGE are left alone
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 80;
const DRY = process.argv.includes('--dry');

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function rewriteContentRefs(renames) {
  if (renames.length === 0) return 0;
  const files = (await walk(CONTENT_DIR)).filter((f) => /\.(ya?ml|mdoc)$/.test(f));
  let touched = 0;
  for (const file of files) {
    let text = await fs.readFile(file, 'utf8');
    let changed = false;
    for (const [from, to] of renames) {
      if (text.includes(from)) {
        text = text.split(from).join(to);
        changed = true;
      }
    }
    if (changed) {
      touched++;
      if (!DRY) await fs.writeFile(file, text);
    }
  }
  return touched;
}

const fmt = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

async function main() {
  const files = (await walk(IMAGES_DIR)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const renames = [];
  let before = 0;
  let after = 0;
  let processed = 0;

  for (const file of files) {
    // Read into memory first: on Windows sharp keeps a path-based input open,
    // which blocks overwriting the same file.
    const input = await fs.readFile(file);
    const stat = { size: input.length };
    before += stat.size;
    const meta = await sharp(input).metadata();
    const edge = Math.max(meta.width ?? 0, meta.height ?? 0);
    const isPng = meta.format === 'png';
    const needsWork = isPng || edge > MAX_EDGE || stat.size > SKIP_UNDER_BYTES;

    if (!needsWork) {
      after += stat.size;
      continue;
    }

    const rel = '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/');
    const outExt = meta.format === 'webp' ? '.webp' : isPng ? '.jpg' : path.extname(file);
    const outFile = isPng ? file.replace(/\.png$/i, '.jpg') : file;

    let pipeline = sharp(input).rotate().resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    });
    pipeline =
      outExt === '.webp'
        ? pipeline.webp({ quality: WEBP_QUALITY })
        : pipeline.flatten({ background: '#fdfbf2' }).jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true });

    const buf = await pipeline.toBuffer();
    // Never make a file bigger than it already was.
    const keepOriginal = !isPng && buf.length >= stat.size;
    const outSize = keepOriginal ? stat.size : buf.length;
    after += outSize;
    processed++;

    console.log(
      `${keepOriginal ? 'keep ' : 'write'} ${rel}${isPng ? ' → .jpg' : ''}  ${meta.width}x${meta.height} ${fmt(stat.size)} → ${fmt(outSize)}`
    );

    if (DRY || keepOriginal) continue;
    await fs.writeFile(outFile, buf);
    if (isPng) {
      await fs.unlink(file);
      renames.push([rel, rel.replace(/\.png$/i, '.jpg')]);
    }
  }

  const touched = await rewriteContentRefs(renames);
  console.log(
    `\n${DRY ? '[dry run] ' : ''}${processed} of ${files.length} images ${DRY ? 'would be ' : ''}rewritten; ` +
      `${fmt(before)} → ${fmt(after)}; ${renames.length} PNG→JPG renames, ${touched} content files updated.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
