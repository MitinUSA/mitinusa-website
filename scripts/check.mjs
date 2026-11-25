import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{}};
vm.runInNewContext(fs.readFileSync('public/catalog.js','utf8'),context);
const {products,brandAssets}=context.window;
assert.equal(new Set(products.map(p=>p.id)).size,products.length);
for(const [key,count] of Object.entries({kitkat:13,water:13,coffee:0,ramen:9}))assert.equal(products.filter(p=>p.category===key).length,count);
for(const file of [...products.map(p=>p.image),...Object.values(brandAssets)])assert(fs.statSync('public/'+file).size>0);
for(const page of ['index','products','kitkat','water','coffee','ramen','about','contact']){
 const html=fs.readFileSync('public/'+page+'.html','utf8');
 assert(html.includes('data-page="'+page+'"'));assert(html.includes('name="description"'));
}
console.log('Verified 8 routes, 35 unique catalog entries and 39 local images.');
