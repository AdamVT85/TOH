import type { APIRoute } from 'astro';
import { getAffiliateLink, resolveTarget } from '../../lib/affiliates.js';

// On-demand serverless function (not prerendered) so it can read query params,
// log the click, and redirect at request time.
export const prerender = false;

export const GET: APIRoute = ({ params, url }) => {
  const slug = params.slug || '';
  const src = url.searchParams.get('src') || '';

  const entry = getAffiliateLink(slug);
  const target = resolveTarget(slug, src);

  // Structured click log — visible in Vercel function logs. The authoritative
  // per-page attribution is the sub-ID we pass to the network (see resolveTarget).
  console.log(
    JSON.stringify({
      evt: 'affiliate_click',
      slug,
      src: src || null,
      network: entry?.network ?? null,
      resolved: !!target,
      ts: new Date().toISOString(),
    })
  );

  // Unknown or not-yet-active link → send the visitor home rather than erroring.
  const destination = target || '/';

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination,
      // Never cache a redirect: links may change, and we want every click logged.
      'Cache-Control': 'no-store, max-age=0',
      // Keep these gateway URLs out of search indexes.
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
};
