import { GetServerSideProps } from 'next';

const EXTERNAL_DATA_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://edu-news-35vza0wnv-vickyrrrrrrs-projects.vercel.app';

import { getLatestNews } from '../lib/news/ingest';

// ... (keep generateSiteMap but update it to use publishedAt)

function generateSiteMap(articles: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static Pages -->
     <url>
       <loc>${SITE_URL}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${SITE_URL}/feed</loc>
       <changefreq>hourly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${SITE_URL}/login</loc>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>
     <url>
       <loc>${SITE_URL}/signup</loc>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>

     <!-- Dynamic Article Pages -->
     ${articles
      .map(({ id, publishedAt, updated_at }) => {
        return `
       <url>
           <loc>${SITE_URL}/article/${id}</loc>
           <lastmod>${updated_at || publishedAt || new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
      })
      .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // We make an API call to gather the URLs for our site
  let articles: any[] = [];

  try {
    const result = await getLatestNews('all', 1000);
    articles = result.articles;
  } catch (e) {
    console.error('Error fetching articles for sitemap (using static pages only):', e);
    // Continue with empty articles array - will generate static sitemap
  }

  // We generate the XML sitemap with the articles data (or empty array)
  const sitemap = generateSiteMap(articles);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
