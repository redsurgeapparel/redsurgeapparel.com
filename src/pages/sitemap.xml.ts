import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.toString() || 'https://redsurgeapparel.com/').replace(/\/$/, '');

  // Static pages — add/remove to match your src/pages/ structure
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog', priority: '0.9', changefreq: 'daily' },
    { path: '/contact-us', priority: '0.5', changefreq: 'yearly' },
    { path: '/projects', priority: '0.7', changefreq: 'monthly' },
    { path: '/components', priority: '0.5', changefreq: 'monthly' },
    { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  ];

  // Blog posts (all published English posts)
  const posts = await getCollection('blog', ({ data }) => {
    return data.locale === 'en' && (import.meta.env.PROD ? data.draft !== true : true);
  });

  // Projects (all published projects)
  const projects = await getCollection('projects', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const urls: SitemapUrl[] = [
    ...staticPages.map((p) => ({
      loc: `${baseUrl}${p.path}`,
      changefreq: p.changefreq,
      priority: p.priority,
    })),

    ...posts.map((post) => {
      const dateValue = post.data.updatedAt || post.data.publishedAt;
      return {
        loc: `${baseUrl}/${post.id.replace('en/', '')}`,
        ...(dateValue ? { lastmod: new Date(dateValue).toISOString() } : {}),
        changefreq: 'monthly',
        priority: '0.7',
      };
    }),

    // Projects schema has `year` (e.g. 2024), not publishedAt/updatedAt.
    // Use Jan 1 of that year as the lastmod, falling back to none if year is missing.
    ...projects.map((project) => {
      const year = project.data.year as number | string | undefined;
      const lastmod = year ? new Date(`${year}-01-01`).toISOString() : undefined;
      return {
        loc: `${baseUrl}/projects/${project.id.replace(/\.mdx?$/, '')}`,
        ...(lastmod ? { lastmod } : {}),
        changefreq: 'monthly',
        priority: '0.6',
      };
    }),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escape(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ''}${u.priority ? `\n    <priority>${u.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
