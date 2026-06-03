// Fetches the latest Instagram posts for the homepage "Latest Dispatches" grid.
//
// Instagram has no open public API, so this reads from a JSON feed endpoint
// (e.g. a free Behold.so feed connected to @oldhollywoodtravelguide). Set the
// endpoint as the INSTAGRAM_FEED_URL environment variable (locally in .env, and
// in the Vercel project settings for production). With no URL set, or on any
// fetch error, this returns [] and the homepage shows a "follow" fallback —
// it never invents posts.
const FEED_URL = import.meta.env.INSTAGRAM_FEED_URL;

function fmtDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
}

function firstLine(caption) {
  if (!caption) return 'View on Instagram';
  const line = String(caption).split('\n')[0].trim();
  if (!line) return 'View on Instagram';
  return line.length > 48 ? line.slice(0, 46).trimEnd() + '…' : line;
}

export async function getInstagramPosts(limit = 4) {
  if (!FEED_URL) return [];
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(FEED_URL, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    const data = await res.json();
    // Normalise across common feed shapes (Behold array or {posts}, Graph {data}).
    const arr = Array.isArray(data) ? data : data.posts || data.media || data.data || [];
    return arr
      .slice(0, limit)
      .map((p) => ({
        img:
          p.thumbnailUrl || p.thumbnail_url || p.mediaUrl || p.media_url ||
          (p.images && p.images.standard_resolution && p.images.standard_resolution.url) || '',
        caption: firstLine(p.caption || p.title || ''),
        permalink: p.permalink || p.url || p.link || 'https://instagram.com/oldhollywoodtravelguide/',
        date: fmtDate(p.timestamp || p.takenAt || p.taken_at || p.created_time || p.date || ''),
      }))
      .filter((p) => p.img);
  } catch (e) {
    return [];
  }
}
