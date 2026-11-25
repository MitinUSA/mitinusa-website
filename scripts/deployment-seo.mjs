import fs from 'node:fs';
const base=new URL(process.argv[2]);
if(base.protocol!=='https:'||base.search||base.hash||!base.pathname.endsWith('/')) throw Error('Supply the approved HTTPS site URL ending in /');
const pages=fs.readdirSync('public').filter(file=>file.endsWith('.html'));
const url=file=>new URL(file,base).href.replaceAll('&','&amp;');
fs.writeFileSync('public/sitemap.xml','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(file=>'<url><loc>'+url(file==='index.html'?'':file)+'</loc></url>').join('')+'</urlset>');
fs.writeFileSync('public/robots.txt','User-agent: *\nAllow: /\nSitemap: '+url('sitemap.xml')+'\n');
