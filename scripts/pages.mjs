import fs from 'node:fs';
import {createHash} from 'node:crypto';

// Give revised local assets a new URL when generating the static pages.
function versionAssets(html) {
 return html.replace(/(href|src)="([a-z-]+\.(?:css|js))"/g, (_, attribute, file) => {
   const revision = createHash('sha256').update(fs.readFileSync('public/' + file)).digest('hex').slice(0, 10);
   return `${attribute}="${file}?v=${revision}"`;
 });
}
const pages={
 index:['Home','Discover Asian snacks, drinks and noodles distributed by MITIN Trading, based in Portland, Oregon.'],
 products:['Products','Explore the MITIN catalog by product name, flavor and category.'],
 kitkat:['KitKat','Discover Japanese KitKat varieties in the MITIN collection.'],
 water:['Sparkling Water','Browse High Up sparkling waters by flavor and can design.'],
 coffee:['BTS Coffee','Contact MITIN Trading about the BTS Coffee collection.'],
 ramen:['Ramen','Explore the original ramen and noodle assortment from MITIN.'],
 about:['About Us','Learn about MITIN Trading and its distribution business in the United States and Canada.'],
 contact:['Contact Us','Contact MITIN for product, wholesale and distribution inquiries.']
};
for(const [page,[name,description]] of Object.entries(pages)){
 const title=name+' | MITIN USA';
 fs.writeFileSync('public/'+page+'.html',versionAssets(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><link rel="icon" href="assets/logo.webp" type="image/webp"><meta property="og:image" content="assets/company.webp"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"MITIN Trading","email":"customerservice@mitinusa.com","address":{"@type":"PostalAddress","addressLocality":"Portland","addressRegion":"OR","addressCountry":"US"}}</script><link rel="stylesheet" href="site.css"><link rel="stylesheet" href="catalog-style.css">${['about','contact'].includes(page)?'<link rel="stylesheet" href="editorial.css">':''}${page==='index'?'<link rel="stylesheet" href="home.css"><script defer src="showcase.js"></script>':''}<script defer src="company.js"></script><script defer src="catalog.js"></script><script defer src="app.js"></script></head><body data-page="${page}"><a class="skip" href="#main">Skip to content</a><header></header><main id="main" tabindex="-1"><h1>${name}</h1><p>${description}</p></main><footer></footer><dialog aria-labelledby="dialog-title"><button class="close" aria-label="Close dialog">×</button><div id="panel"></div></dialog></body></html>\n`));
}
