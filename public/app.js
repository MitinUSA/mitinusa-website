const page=document.body.dataset.page;
const cats={kitkat:'KitKat',water:'Sparkling Water',coffee:'BTS Coffee',ramen:'Ramen'};
const desc={kitkat:'Japanese chocolate wafers in seasonal and collaborative editions.',water:'High Up sparkling waters in character-inspired cans.',coffee:'For BTS Coffee assortment and ordering information, contact our team.',ramen:'Explore our selection of packaged ramen and noodles.'};
const items=window.products||[], assets=window.brandAssets||{}, co=window.company;
const main=document.querySelector('main'), dialog=document.querySelector('dialog'), panel=document.querySelector('#panel');
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const link=(key,label)=>'<a href="'+key+'.html" '+(key===page?'aria-current="page"':'')+'>'+esc(label)+'</a>';
const img=(url,alt,loading='lazy')=>url?'<img loading="'+loading+'" src="'+esc(url)+'" alt="'+esc(alt)+'">':'';
const categoryLinks=Object.entries(cats).map(([k,v])=>link(k,v)).join('');
const brand=()=>'<a class="brand" href="index.html" aria-label="MITIN USA home">'+(img(assets.logo,'MITIN Trading','eager')||'MITIN <small>TRADING</small>')+'</a>';
function headerBrand() {
 return `<a class="header-brand" href="index.html" aria-label="MITIN USA home"><span class="brand-symbol">${img(assets.logo,'','eager')}</span><span class="brand-type">MITIN<small>TRADING</small></span></a>`;
}
document.querySelector('header').innerHTML='<div class="wrap nav">'+headerBrand()+'<button class="menu" aria-expanded="false" aria-controls="navigation">Menu</button><nav id="navigation">'+link('index','Home')+'<div class="navgroup">'+link('products','Products')+'<button class="toggle" aria-label="Product categories" aria-expanded="false" aria-controls="categories">⌄</button><div id="categories">'+categoryLinks+'</div></div>'+link('about','About Us')+link('contact','Contact Us')+'</nav><a class="trade" href="contact.html">Wholesale inquiries</a></div>';
const menu=document.querySelector('.menu'),toggle=document.querySelector('.toggle'),group=toggle.parentElement;
function expand(button,on){button.setAttribute('aria-expanded',String(on));}
menu.onclick=()=>expand(menu,menu.getAttribute('aria-expanded')==='false');
let hoverOpened=false;
toggle.onclick=()=>{expand(toggle,hoverOpened||toggle.getAttribute('aria-expanded')==='false');hoverOpened=false};
group.onpointerenter=e=>{if(e.pointerType==='mouse'&&innerWidth>640){hoverOpened=true;expand(toggle,true)}};
group.onpointerleave=e=>{if(e.pointerType==='mouse'&&!group.contains(document.activeElement))expand(toggle,false)};
group.onfocusout=e=>{if(!group.contains(e.relatedTarget))expand(toggle,false)};
document.addEventListener('click',e=>{if(!group.contains(e.target))expand(toggle,false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.open){if(toggle.getAttribute('aria-expanded')==='true'){expand(toggle,false);toggle.focus()}else if(menu.getAttribute('aria-expanded')==='true'){expand(menu,false);menu.focus()}}});
const first=k=>items.find(p=>p.category===k);
const button=(href,label,style='')=>'<a class="button '+style+'" href="'+esc(href)+'">'+esc(label)+'</a>';
function picker(){return '<div class="picks">'+Object.entries(cats).map(([k,v])=>'<a class="pick '+k+'" href="'+k+'.html"><span>'+esc(v)+'</span>'+img(first(k)?.image,'')+'</a>').join('')+'</div>'}
function tile(p){return '<button class="tile '+p.category+'" data-item="'+esc(p.id)+'"><span class="photo">'+img(p.image,p.name)+'<span class="hint">'+esc(p.flavor||cats[p.category])+' · View details</span></span><small>'+cats[p.category]+'</small><strong>'+esc(p.name)+'</strong></button>'}
function collectionSpread() {
 const illustrations = {
   kitkat: img(assets.hero, ''),
   water: img(items.find(p => p.id === 'water-08')?.image, ''),
   ramen: img(first('ramen')?.image, ''),
   coffee: '<i class="cup" aria-hidden="true"></i>'
 };
 return `<div class="collection-spread">${['kitkat','water','coffee','ramen'].map(key => `
   <a class="collection-cover ${key}" href="${key}.html">
     <div class="cover-art">${illustrations[key]}</div>
     <div class="cover-title"><h3>${cats[key]}</h3><span>${key === 'coffee' ? 'Coffee inquiries' : 'Explore collection'}</span></div>
   </a>`).join('')}</div>`;
}

function home() {
 const featured = ['kitkat-08','water-02','ramen-05'].map(id => items.find(p => p.id === id)).filter(Boolean);
 return `<section class="market-hero">
   <div class="wrap market-layout">
     <div class="market-copy">
       <p class="kicker">MITIN Trading · Portland, Oregon</p>
       <h1>A taste <br>of <em>Asia.</em></h1>
       <p class="lede">Asian snacks, drinks and noodles, curated in Portland for retailers across the United States and Canada.</p>
       <div class="actions">${button('products.html','Explore products')}${button('about.html','About MITIN','secondary')}</div>
     </div>
     ${showcase()}
   </div>
 </section>
 <section class="home-collections wrap section">
   <div class="section-heading"><div><div class="kicker">Product collections</div><h2>Browse the shelves.</h2></div><a class="text-link" href="products.html">View all products</a></div>
   ${collectionSpread()}
 </section>
 <section class="featured section"><div class="wrap"><div class="kicker">From the catalog</div><h2>In the spotlight</h2><div class="grid">${featured.map(tile).join('')}</div></div></section>
 ${conveyor()}
 <section class="wrap section story"><button data-company class="company-art" aria-label="Explore MITIN Trading">${img(assets.company,'MITIN Trading artwork')}</button>
 <div><div class="kicker">About MITIN</div><h2>Meeting happiness.</h2><p>From our home in Portland, Oregon, we distribute products from Taiwan, Japan, South Korea, Thailand and beyond.</p><div class="actions">${button('about.html','Learn more')}<button class="button secondary" data-company>Explore MITIN Trading</button></div></div></section>${inquiry()}`;
}
function inquiry(){return '<section class="inquiry"><div class="wrap"><h2>Stock your shelves.</h2><p>Talk with MITIN about wholesale products and distribution.</p>'+button('contact.html','Contact us')+'</div></section>'}
function conveyor(){
 const picks=[0,1,2].flatMap(i=>['kitkat','ramen','water'].map(k=>items.filter(p=>p.category===k)[i])).filter(Boolean);
 const track=picks.map(tile).join('');
 return '<section class="belt section"><div class="wrap belt-label"><div><div class="kicker">Explore the assortment</div><h2>The tasting line</h2></div><button class="button secondary" data-pause aria-pressed="false">Pause motion</button></div><div class="belt-window"><div class="track"><div>'+track+'</div><div aria-hidden="true">'+track.replaceAll('<button ','<button tabindex="-1" ')+'</div></div></div></section>';
}
let opener,closeTimer;
function show(content){
 clearTimeout(closeTimer);dialog.classList.remove('leaving');panel.innerHTML=content;
 if(!dialog.open){opener=document.activeElement;dialog.showModal();document.body.classList.add('modal-open')}
 dialog.querySelector('.close').focus();dialog.scrollTop=0;
}
function dismiss(){dialog.classList.add('leaving');closeTimer=setTimeout(()=>dialog.close(),matchMedia('(prefers-reduced-motion:reduce)').matches?0:170)}
dialog.querySelector('.close').onclick=dismiss;dialog.oncancel=e=>{e.preventDefault();dismiss()};dialog.onclick=e=>{if(e.target===dialog)dismiss()};
dialog.onclose=()=>{document.body.classList.remove('modal-open');opener?.focus({preventScroll:true})};
function detail(p) {
  const rows = [...document.querySelectorAll('#results [data-item]')];
  const resultIds = rows.map(row => row.dataset.item);
  const sequence = resultIds.includes(p.id) ? resultIds : items.filter(item => item.category === p.category).map(item => item.id);
  const index = sequence.indexOf(p.id);
  const facts = [['Flavor', p.flavor], ['Pack size', p.size]].filter(([, value]) => value);
  const nextId = sequence[(index + 1) % sequence.length];
  const previousId = sequence[(index + sequence.length - 1) % sequence.length];
  show(`<div class="detail product-detail ${p.category}">
    <figure>${img(p.image, p.name, 'eager')}</figure>
    <div class="product-specs">
      <a class="kicker" href="${p.category}.html">${esc(cats[p.category])}</a>
      <h2 id="dialog-title" aria-live="polite">${esc(p.name)}</h2>
      ${facts.length ? `<dl>${facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>` : ''}
      <div class="actions">${button('contact.html?item=' + encodeURIComponent(p.id), 'Inquire about this item')}</div>
      ${sequence.length > 1 ? `<div class="item-pager" role="group" aria-label="Browse items">
        <button data-browse="previous" data-target="${esc(previousId)}" aria-label="Previous item"><i aria-hidden="true"></i></button>
        <span aria-live="polite">Item ${index + 1} of ${sequence.length}</span>
        <button data-browse="next" data-target="${esc(nextId)}" aria-label="Next item"><i aria-hidden="true"></i></button>
      </div>` : ''}
    </div>
  </div>`);
  for (const button of panel.querySelectorAll('[data-browse]')) {
    button.onclick = () => {
      const target = items.find(item => item.id === button.dataset.target);
      if (!target) return;
      detail(target);
      panel.querySelector('[data-browse="' + button.dataset.browse + '"]')?.focus({preventScroll:true});
    };
  }
}
document.addEventListener('click',e=>{
 const el=e.target.closest('button');if(!el)return;
 if(el.dataset.item){const p=items.find(p=>p.id===el.dataset.item);if(p)detail(p)}
 if(el.hasAttribute('data-company'))show('<div class="detail"><figure>'+img(assets.company,'MITIN Trading','eager')+'</figure><div><div class="kicker">Portland, Oregon</div><h2 id="dialog-title">MITIN Trading</h2><p>We import food and beverages from Taiwan, Japan, South Korea, Thailand and other countries, serving retailers across the United States and Canada.</p><button class="button" data-picker>View All Items</button></div></div>');
 if(el.hasAttribute('data-picker'))show('<div class="selection"><h2 id="dialog-title">Explore the collections</h2>'+picker()+'</div>');
 if(el.hasAttribute('data-pause')){const paused=el.closest('.belt').classList.toggle('paused');el.textContent=paused?'Resume motion':'Pause motion';el.setAttribute('aria-pressed',paused)}
});
function collectionArtwork(key, assortment) {
  // Use selected originals with different silhouettes and package colors.
  const featuredIds = {
    products: ['kitkat-08', 'ramen-03', 'water-12'],
    kitkat: ['kitkat-01', 'kitkat-08', 'kitkat-04'],
    water: ['water-01', 'water-12', 'water-05'],
    ramen: ['ramen-05', 'ramen-02', 'ramen-04']
  };
  const selected = (featuredIds[key] || [])
    .map(id => assortment.find(product => product.id === id))
    .filter(Boolean);
  const products = selected.length ? selected : assortment.slice(0, 3);
  if (!products.length) {
    return '<div class="roast-rings" aria-hidden="true"><i></i><i></i><i></i></div>';
  }

  return `<div class="assortment-scene" aria-label="Featured products">
    <span class="display-shelf" aria-hidden="true"></span>
    ${products.map((p, index) => `<button class="display-item position-${index}" data-item="${esc(p.id)}" aria-label="View ${esc(p.name)}">
      ${img(p.image, '', 'eager')}
      <span class="display-label">${esc(p.name)}</span>
    </button>`).join('')}
  </div>`;
}

function catalog(key) {
  const collection = key !== 'products';
  const assortment = collection ? items.filter(p => p.category === key) : items;
  const title = cats[key] || 'Our products';
  const description = desc[key] || 'Explore our collection of Japanese chocolate, character drinks and Asian noodles.';
  const searchTools = `<div class="tools catalog-tools">
    <label class="catalog-search">Search products
      <span class="search-input"><input id="search" type="search" placeholder="Search by name or flavor"></span>
    </label>
    ${collection ? '' : `<label>Category<select id="filter"><option value="">All categories</option>
      ${Object.entries(cats).map(([value, label]) => `<option value="${value}">${esc(label)}</option>`).join('')}
    </select></label>`}
  </div>`;

  return `<section class="collection catalog-cover ${key}">
    <div class="wrap">
      <div class="cover-copy">
        <div class="kicker">${collection ? '<a href="products.html">Product catalog</a>' : 'MITIN Trading'}</div>
        <h1>${esc(title)}</h1><p>${esc(description)}</p>
      </div>
      ${collectionArtwork(key, assortment)}
    </div>
  </section>
  <div class="wrap section catalog-body">
    <div class="category-nav" role="navigation" aria-label="Product collections">${link('products', 'All products')}${categoryLinks}</div>
    ${key === 'coffee' && !assortment.length ? `<div class="coffee-note">
      <h2>Inquire about BTS Coffee</h2><p>Our team can help with current product and wholesale inquiries.</p>
      ${button('contact.html?category=coffee', 'Contact MITIN')}
    </div>` : `${searchTools}<p id="count" role="status"></p><div class="grid" id="results"></div>`}
  </div>`;
}
function filterCatalog(){
 const search=document.querySelector('#search');if(!search)return;
 const select=document.querySelector('#filter');
 function update(){const q=search.value.trim().toLowerCase(),k=select?select.value:page;
 const matches=items.filter(p=>(!k||p.category===k)&&[p.name,cats[p.category],p.flavor,p.size].join(' ').toLowerCase().includes(q));
 document.querySelector('#count').textContent=matches.length+' '+(matches.length===1?'item':'items');
 document.querySelector('#results').innerHTML=matches.map(tile).join('')||(k==='coffee'?'<p>Contact MITIN for BTS Coffee inquiries. '+link('coffee','Explore BTS Coffee')+'</p>':'<p>No matching products. Try a different name or flavor.</p>');}
 search.oninput=update;if(select)select.onchange=update;update();
}
function about(){
 const brands = ['High Up', 'Carry Carry', 'KitKat Japan', 'Heart', 'Vita Jalkton', 'Thai Lay’s'];
 return `<section class="origin-cover">
   ${img(assets.about,'A cyclist riding past colorful city lights at night','eager')}
   <div class="wrap origin-title">
     <div class="kicker">About MITIN Trading</div>
     <h1>Meeting <em>happiness.</em></h1>
   </div>
 </section>
 <section class="wrap origin-story">
   <div><div class="kicker">Portland, Oregon</div><h2>From Asia to<br>your shelves.</h2></div>
   <div class="origin-copy">
     <p>MITIN Trading imports food and beverages from Taiwan, Japan, South Korea, Thailand and other countries around the world.</p>
     <p>Our Portland headquarters supports distribution throughout the United States and Canada. Our approach centers on reliability, customer satisfaction and finding new products for the businesses we serve.</p>
   </div>
 </section>
 <section class="origin-brands">
   <div class="wrap origin-spread">
     <a class="origin-print" href="kitkat.html">
       ${img(assets.hero,'Assorted Japanese KitKat wrappers on a pink floral background')}
       <span>Explore Japanese KitKat</span>
     </a>
     <div>
       <div class="kicker">Our assortment</div><h2>Brands we distribute</h2>
       <ul class="brand-list">${brands.map(name=>'<li>'+esc(name)+'</li>').join('')}</ul>
       <div class="actions">${button('products.html','Browse products')}<a class="editorial-link" href="https://www.ustrading.com/en/products/brands/all.php">Brand directory</a></div>
     </div>
   </div>
 </section>${inquiry()}`;
}

function contact(){
 const params = new URLSearchParams(location.search);
 const item = items.find(p=>p.id===params.get('item'));
 const subject = item?.name || cats[params.get('category')] || '';
 const fields = [
   ['Full name', 'name', 'text', 'name', true],
   ['Company', 'company', 'text', 'organization', false],
   ['Email', 'email', 'email', 'email', true],
   ['Phone', 'phone', 'tel', 'tel', false]
 ].map(([label,name,type,autocomplete,required])=>
   `<label>${label}${required?' *':''}<input name="${name}" type="${type}" autocomplete="${autocomplete}" ${required?'required':''}></label>`
 ).join('');
 const inquiryTypes = ['General inquiry','Product inquiry','Wholesale inquiry','Distribution inquiry','Business partnership','Other'];
 const options = inquiryTypes.map(type=>`<option ${subject&&type==='Product inquiry'?'selected':''}>${type}</option>`).join('');
 return `<div class="correspondence">
   <div class="wrap correspondence-grid">
     <section class="letter-intro">
       <div class="kicker">Business inquiries</div><h1>Contact <em>us.</em></h1>
       <p>Ask our Portland team about a product, wholesale ordering or distribution.</p>
       <a class="editorial-link" href="mailto:${esc(co.email)}">${esc(co.email)}</a>
       <a class="letter-jump button secondary" href="#inquiry">Write an inquiry</a>
     </section>
     <aside class="office-card" aria-labelledby="office-heading">
       <div class="office-art">${img(assets.company,'MITIN Trading illustrated brand artwork')}</div>
       <div class="office-details">
         <h2 id="office-heading">MITIN Trading</h2>
         <address>Portland, Oregon</address>
         <a class="editorial-link" href="${esc(co.faire)}">Wholesale on Faire</a>
       </div>
     </aside>
     <form class="letter-form" id="inquiry" aria-labelledby="inquiry-heading">
       <div class="letter-heading"><h2 id="inquiry-heading">Get in touch</h2><p>* Required</p></div>
       <div class="fields">${fields}</div>
       <label>Inquiry type<select name="type">${options}</select></label>
       <label>Subject *<input name="subject" required value="${esc(subject)}"></label>
       <label>Message *<textarea name="message" rows="5" required></textarea></label>
       <button class="button" type="submit">${co.contactEndpoint?'Send inquiry':'Open email draft'}</button>
       <p role="status"></p>
     </form>
   </div>
 </div>`;
}
function bindForm(form,endpoint){
 if(!form)return;
 form.onsubmit=async e=>{
 e.preventDefault();const values=Object.fromEntries(new FormData(form)),status=form.querySelector('[role=status]'),submit=form.querySelector('button');
 if(!endpoint){const body=Object.entries(values).filter(([,v])=>v).map(([k,v])=>k+': '+v).join('\n');location.href='mailto:'+co.email+'?subject='+encodeURIComponent(values.subject)+'&body='+encodeURIComponent(body);status.textContent='Send the draft from your email app. You can also email '+co.email+' directly.';return}
 submit.disabled=true;status.textContent='Sending…';
 try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});if(!response.ok)throw Error();status.textContent='Thank you. Your request was received.';form.reset()}catch{status.textContent='Your request could not be confirmed. Please try again or contact us by email.'}finally{submit.disabled=false}
 };
}
function footer(){
 const newsletter=co.newsletterEndpoint?'<form id="newsletter"><label>Product updates<input type="email" name="email" required></label><button class="button">Subscribe</button><p role="status"></p></form>':'';
 return '<div class="wrap foot">'+ '<div>'+brand()+'<p>International food and beverage distribution from Portland, Oregon.</p></div><div><h3>MITIN</h3>'+link('index','Home')+link('products','Products')+link('about','About us')+link('contact','Contact us')+'</div><div><h3>Collections</h3>'+categoryLinks+'</div><div><h3>Contact</h3><a href="mailto:'+co.email+'">'+co.email+'</a><a href="'+co.faire+'">MITIN on Faire</a>'+newsletter+'</div></div><div class="wrap copyright">© '+new Date().getFullYear()+' MITIN Trading</div>';
}
main.innerHTML=page==='index'?home():page==='about'?about():page==='contact'?contact():catalog(page);
document.querySelector('footer').innerHTML=footer();
filterCatalog();
if (page === 'index') bindShowcase();
bindForm(document.querySelector('#inquiry'),co.contactEndpoint);
bindForm(document.querySelector('#newsletter'),co.newsletterEndpoint);
