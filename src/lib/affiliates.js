// ─────────────────────────────────────────────────────────────────────────────
// AFFILIATE LINK REGISTRY — single source of truth for every monetised link.
//
// WHY: pages never hardcode an affiliate URL. They link to /go/<slug> instead.
// To repoint a link (new program, new URL, expired deal) you edit ONE entry here
// and every page that uses it updates automatically. The /go/<slug> endpoint
// (src/pages/go/[slug].ts) reads this registry, appends a per-page sub-ID for
// attribution, logs the click, and 302-redirects the visitor to the partner.
//
// TO ADD A LINK once a program is approved:
//   1. Paste the real affiliate URL (with YOUR partner/affiliate ID already in it).
//   2. Set `network` so the right sub-ID parameter is used.
//   3. Set `active: true`.
//   Until active:true with a url, /go/<slug> falls back gracefully to the homepage.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sub-ID / click-reference parameter each network uses, so we can tell WHICH page
 * drove a click inside the network's own reporting. VERIFY per program on signup —
 * these are the documented defaults but networks occasionally change them.
 */
export const AFFILIATE_NETWORKS = {
  awin:          { subParam: 'clickref' },   // Awin
  travelpayouts: { subParam: 'sub_id' },     // Travelpayouts (Booking.com, Viator, GYG, flights…)
  amazon:        { subParam: 'ascsubtag' },  // Amazon Associates
  impact:        { subParam: 'subId1' },     // impact.com (e.g. Airalo)
  partnerize:    { subParam: 'pubref' },     // Partnerize (e.g. Trainline)
  sovrn:         { subParam: 'xcust' },       // Sovrn //Commerce (Skimlinks)
  cj:            { subParam: 'sid' },         // CJ / Commission Junction
  rakuten:       { subParam: 'u1' },          // Rakuten Advertising
  discovercars:  { subParam: null },          // DiscoverCars (attribution handled in-link)
  direct:        { subParam: null },          // direct/brand programs with no sub-ID
};

/**
 * The links. Key = a stable slug used in /go/<slug>. Convention: use the content
 * slug where there's a 1:1 mapping (e.g. a venue's own slug), or a descriptive
 * slug for generic links (e.g. 'discovercars-global').
 *
 * Entry shape:
 *   url       {string}  destination affiliate URL (your partner ID already embedded)
 *   network   {string}  key from AFFILIATE_NETWORKS (drives sub-ID handling)
 *   label     {string}  human reference (admin only; never shown to visitors)
 *   active    {boolean} false (or missing) = not live yet; /go falls back to '/'
 *   subParam  {string=} optional override of the network's sub-ID parameter
 *
 * Examples are commented out — uncomment & fill once the program is approved:
 */
export const AFFILIATE_LINKS = {
  // 'beverly-hills-hotel': { url: 'https://www.booking.com/hotel/us/the-beverly-hills.html?aid=YOUR_TP_ID', network: 'travelpayouts', label: 'Beverly Hills Hotel — Booking.com via Travelpayouts', active: false },
  // 'wb-studio-tour':      { url: 'https://www.getyourguide.com/...?partner_id=YOUR_ID',                    network: 'travelpayouts', label: 'Warner Bros Studio Tour — GetYourGuide',                 active: false },
  // 'discovercars-global': { url: 'https://www.discovercars.com/?a_aid=YOUR_ID',                            network: 'discovercars', label: 'DiscoverCars — global car hire',                          active: false },
  // 'airalo-esim':         { url: 'https://airalo.pxf.io/YOUR_IMPACT_LINK',                                 network: 'impact',       label: 'Airalo — travel eSIM',                                   active: false },
  // 'trainline':           { url: 'https://trainline.prf.hn/click/camref:YOUR_REF',                         network: 'partnerize',   label: 'Trainline — UK/EU rail',                                 active: false },
  // 'amazon-search':       { url: 'https://www.amazon.co.uk/s?k=old+hollywood&tag=YOUR_TAG-21',             network: 'amazon',       label: 'Amazon UK — Old Hollywood books/DVDs',                   active: false },
};

/** Raw registry entry for a slug, or null. */
export function getAffiliateLink(slug) {
  return AFFILIATE_LINKS[slug] || null;
}

/** True only when the link exists, is active, and has a URL. */
export function hasAffiliateLink(slug) {
  const e = AFFILIATE_LINKS[slug];
  return !!(e && e.active === true && e.url);
}

/**
 * The internal URL templates should link to. `src` = the page driving the click
 * (e.g. '/venues/beverly-hills-hotel'), carried through for sub-ID attribution.
 */
export function goUrl(slug, src) {
  const q = src ? `?src=${encodeURIComponent(src)}` : '';
  return `/go/${slug}${q}`;
}

/**
 * Resolve the final partner URL with a sub-ID appended (used server-side in /go).
 * Returns null if the link is missing/inactive so the endpoint can fall back.
 */
export function resolveTarget(slug, src) {
  const entry = AFFILIATE_LINKS[slug];
  if (!entry || entry.active !== true || !entry.url) return null;

  const net = AFFILIATE_NETWORKS[entry.network] || {};
  const subParam = entry.subParam || net.subParam || null;
  if (!subParam || !src) return entry.url;

  // sanitise the sub-id: keep it short and URL/report-safe
  const subVal = String(src).replace(/[^a-zA-Z0-9_\-/]/g, '').slice(0, 80) || 'site';
  const sep = entry.url.includes('?') ? '&' : '?';
  return `${entry.url}${sep}${subParam}=${encodeURIComponent(subVal)}`;
}
