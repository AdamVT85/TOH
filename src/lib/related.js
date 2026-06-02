// Resolve related-content slugs into card data for the "related" render slots.
// Looks each slug up in its collection and returns { href, title, label, image }.
const SPECS = {
  venues: { coll: 'venues', route: 'venues', title: 'name', img: 'heroImage', label: 'Venue' },
  stars: { coll: 'starGuides', route: 'stars', title: 'name', img: 'portraitImage', label: 'Star Guide' },
  articles: { coll: 'articles', route: 'articles', title: 'title', img: 'heroImage', label: 'Article' },
  destinations: { coll: 'destinations', route: 'destinations', title: 'title', img: 'heroImage', label: 'Destination' },
};

export async function resolveRelated(reader, rel) {
  const out = [];
  const seen = new Set();
  for (const key of Object.keys(SPECS)) {
    const s = SPECS[key];
    for (const slug of (rel[key] || []).filter(Boolean)) {
      const dedupeKey = key + ':' + slug;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      let entry;
      try {
        entry = await reader.collections[s.coll].read(slug);
      } catch (e) {
        entry = null;
      }
      if (!entry) continue;
      out.push({
        href: `/${s.route}/${slug}`,
        title: entry[s.title],
        label: s.label,
        image: entry[s.img] || undefined,
      });
    }
  }
  return out;
}
