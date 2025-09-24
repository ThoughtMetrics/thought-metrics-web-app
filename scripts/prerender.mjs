// scripts/prerender.mjs
import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

// Static routes from your router
const staticRoutes = [
  '/',
  '/industries',
  '/industries/advertising_marketing',
  '/industries/internet',
  '/industries/retail',
  '/industries/healthcare',
  '/industries/hr',
  '/industries/finance',
  '/industries/automotive',
  '/industries/education',
  '/industries/fmcg',
  '/industries/investor',
  '/industries/technology',
  '/capabilities',
  '/capabilities/branding_advertising',
  '/capabilities/market_opportunity',
  '/capabilities/product_research',
  '/capabilities/customer_research',
  '/research_methods',
  '/research_methods/quantitative_research',
  '/research_methods/qualitative_research',
  '/research_methods/fieldwork',
  '/research_methods/focus_group',
  '/research_methods/surveys',
  '/research_methods/quality',
  '/our_panel',
  '/respondent_landing',
  '/advocate_landing',
];

// Fetch dynamic routes from Strapi
async function fetchDynamicRoutes() {
  try {
    const response = await fetch(
      `${process.env.VITE_STRAPI_API_URL}/api/contents?pagination[limit]=1000`
    );
    const data = await response.json();
    return data.data.map((content) => `/resources/${content.slug}`);
  } catch (error) {
    console.error('⚠️  Could not fetch dynamic routes:', error);
    return [];
  }
}

// Pre-render all pages
async function prerender() {
  console.log('🚀 Starting SSG build...\n');

  // Start preview server
  console.log('📦 Starting preview server...');
  const serverProcess = exec('npx vite preview --port 4173', {
    cwd: path.join(__dirname, '..'),
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // Get all routes
    const dynamicRoutes = await fetchDynamicRoutes();
    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    console.log(`\n📄 Pre-rendering ${allRoutes.length} pages...\n`);

    for (const route of allRoutes) {
      const page = await browser.newPage();

      try {
        // Set viewport for consistent rendering
        await page.setViewport({ width: 1920, height: 1080 });

        // Navigate to route
        await page.goto(`http://localhost:4173${route}`, {
          waitUntil: 'networkidle0',
          timeout: 30000,
        });

        // Wait for React to fully render
        await page.waitForSelector('#root', { timeout: 10000 });

        // Additional wait for dynamic content
        await page.evaluate(
          () => new Promise((resolve) => setTimeout(resolve, 1000))
        );

        // Get the rendered HTML
        const html = await page.content();

        // Determine file path
        const fileName = route === '/' ? 'index.html' : `${route}.html`;
        const filePath = path.join(distDir, fileName);

        // Ensure directory exists
        await fs.ensureDir(path.dirname(filePath));

        // Write HTML file
        await fs.writeFile(filePath, html);

        console.log(`✅ ${route}`);
      } catch (error) {
        console.error(`❌ Failed ${route}:`, error.message);
      } finally {
        await page.close();
      }
    }

    console.log('\n✨ SSG build complete!\n');

    // Generate sitemap
    await generateSitemap(allRoutes);
  } finally {
    await browser.close();
    // Kill the preview server
    if (serverProcess.pid) {
      process.kill(serverProcess.pid, 'SIGTERM');
    }
  }
}

// Generate sitemap.xml
async function generateSitemap(routes) {
  console.log('🗺️  Generating sitemap...');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${process.env.VITE_SITE_URL}${route}</loc>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated\n');
}

// Run the prerender
prerender().catch(console.error);
