import { GetServerSideProps } from 'next';

const EXTERNAL_DATA_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://edu-news-35vza0wnv-vickyrrrrrrs-projects.vercel.app';

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
            .map(({ id, updated_at }) => {
                return `
       <url>
           <loc>${SITE_URL}/article/${id}</loc>
           <lastmod>${updated_at || new Date().toISOString()}</lastmod>
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
    try {
        const request = await fetch(`${EXTERNAL_DATA_URL}/api/feed?limit=1000`);
        const data = await request.json();
        const articles = data.items || [];

        // We generate the XML sitemap with the articles data
        const sitemap = generateSiteMap(articles);

        res.setHeader('Content-Type', 'text/xml');
        // we send the XML to the browser
        res.write(sitemap);
        res.end();
    } catch (e) {
        console.error('Error generating sitemap:', e);
        res.write('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
        res.end();
    }

    return {
        props: {},
    };
};

export default SiteMap;
