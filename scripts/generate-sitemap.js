import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://www.carebow.com';
const currentDate = new Date().toISOString().split('T')[0];

const routes = [
  { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: currentDate },
  { url: '/services', priority: '0.9', changefreq: 'weekly', lastmod: currentDate },
  { url: '/technology', priority: '0.8', changefreq: 'monthly', lastmod: currentDate },
  { url: '/about', priority: '0.8', changefreq: 'monthly', lastmod: currentDate },
  { url: '/contact', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
  { url: '/careers', priority: '0.6', changefreq: 'weekly', lastmod: currentDate },
  { url: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
  { url: '/diabetes-home-care', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
  { url: '/post-stroke-recovery', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
  { url: '/alzheimers-care', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
  { url: '/ask-carebow', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
  { url: '/ask-carebow/app', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
  { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly', lastmod: currentDate },
  { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly', lastmod: currentDate },
  { url: '/hipaa-compliance', priority: '0.4', changefreq: 'yearly', lastmod: currentDate },
];

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <image:image>
      <image:loc>${baseUrl}/images/carebow-logo.png</image:loc>
      <image:title>CareBow - AI-Powered In-Home Healthcare Network</image:title>
      <image:caption>CareBow logo representing AI-powered in-home healthcare services</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

  const publicPath = path.join(__dirname, '../public');
  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap);
  console.log('Enhanced sitemap with images generated successfully!');
  
  // Generate robots.txt with sitemap reference
  const robotsTxt = `User-agent: *
Allow: /

# Important pages
Allow: /services
Allow: /technology
Allow: /about
Allow: /contact
Allow: /blog
Allow: /ask-carebow

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/
Disallow: /*.json$
Disallow: /*?*utm_*
Disallow: /*?*fbclid*
Disallow: /*?*gclid*

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Cache directive
Cache-Control: public, max-age=86400`;

  fs.writeFileSync(path.join(publicPath, 'robots.txt'), robotsTxt);
  console.log('Enhanced robots.txt generated successfully!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export { generateSitemap };