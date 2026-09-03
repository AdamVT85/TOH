// Build-time image dimension lookup for files under public/.
//
// Keystatic stores images as root-relative paths ("/images/venues/x/hero.jpg").
// Astro's <Image> needs an intrinsic width/height for a string src, so the
// <Img> component asks here. Results are cached per process; a missing file
// or an external URL returns null and the caller falls back to a plain <img>.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Every width the Vercel Image Optimization API is allowed to produce. Shared
// with astro.config.mjs (imagesConfig.sizes) so the <Img> presets, the
// build-time snapping below and the edge optimiser always agree.
export const IMAGE_SIZES = [320, 640, 828, 1080, 1200, 1920, 2048];

/** Largest configured size that does not exceed `width` (never upscales). */
export function snapToSize(width) {
  const fit = IMAGE_SIZES.filter((s) => s <= width);
  return fit.length ? fit[fit.length - 1] : IMAGE_SIZES[0];
}

const cache = new Map();

export async function imageDimensions(src) {
  if (typeof src !== 'string' || !src.startsWith('/') || src.startsWith('//')) return null;
  if (cache.has(src)) return cache.get(src);

  const file = path.join(process.cwd(), 'public', decodeURIComponent(src.split('?')[0]));
  let result = null;
  try {
    if (fs.existsSync(file)) {
      const { width, height } = await sharp(file).metadata();
      if (width && height) result = { width, height };
    }
  } catch {
    result = null;
  }
  cache.set(src, result);
  return result;
}
