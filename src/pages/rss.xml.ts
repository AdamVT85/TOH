import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export async function GET(context: APIContext) {
  const reader = createReader(process.cwd(), keystaticConfig);
  const articles = await reader.collections.articles.all();

  const items = articles
    .filter((a) => a.entry.publishDate)
    .sort((a, b) => {
      const da = new Date(a.entry.publishDate!);
      const db = new Date(b.entry.publishDate!);
      return db.getTime() - da.getTime();
    })
    .map((article) => ({
      title: typeof article.entry.title === 'string' ? article.entry.title : article.slug,
      pubDate: new Date(article.entry.publishDate!),
      description: article.entry.excerpt || '',
      link: `/articles/${article.slug}/`,
    }));

  return rss({
    title: 'Travel Old Hollywood',
    description: 'Where Golden-Age glamour meets modern travel — curated guides to the destinations, hotels, and hideaways of classic Hollywood.',
    site: context.site!.toString(),
    items,
    customData: '<language>en-us</language>',
  });
}
