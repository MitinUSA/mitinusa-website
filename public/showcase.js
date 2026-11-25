// The display uses the original front-facing photography at three depths.
const displays = [
  { key: 'ramen', title: 'OTOKI cheesy ramen', ids: ['ramen-01', 'ramen-02', 'ramen-03'] },
  { key: 'kitkat', title: 'Japanese KitKat', ids: ['kitkat-03', 'kitkat-02', 'kitkat-01'] },
  { key: 'water', title: 'High Up sparkling water', ids: ['water-01', 'water-02', 'water-12'] }
];

function displayProducts(display) {
  return display.ids.map((id, i) => {
    const product = items.find(item => item.id === id);
    if (!product) return '';
    const photo = display.key === 'water'
      ? `<span class="can-photo can-${product.id}">${img(product.image, product.name, 'eager')}</span>`
      : img(product.image, product.name, 'eager');
    return `<button class="display-pack position-${i}" data-item="${esc(id)}" aria-label="View ${esc(product.name)}">
      ${photo}
      <span class="pack-note" aria-hidden="true">View details</span>
    </button>`;
  }).join('');
}

function showcase() {
  const firstDisplay = displays[0];
  return `<div class="showcase" data-collection="${firstDisplay.key}">
    <div class="display-window">
      <div class="display-layers">
        <div class="display-disc" aria-hidden="true"></div>
        <div class="display-plinth" aria-hidden="true"></div>
        <div class="display-products">${displayProducts(firstDisplay)}</div>
      </div>
    </div>
    <div class="display-bar">
      <span class="showcase-caption" aria-live="polite">${firstDisplay.title}</span>
      <div class="display-switches" role="group" aria-label="Featured collection">
        ${displays.map((display, i) => `<button data-display="${i}" aria-pressed="${i === 0}">${esc(cats[display.key])}</button>`).join('')}
      </div>
    </div>
  </div>`;
}

function bindShowcase() {
  const display = document.querySelector('.showcase');
  if (!display) return;
  const windowEl = display.querySelector('.display-window');
  const layers = display.querySelector('.display-layers');
  const motion = matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)');
  let frame;
  function center() {
    cancelAnimationFrame(frame);
    layers.style.removeProperty('--yaw');
    layers.style.removeProperty('--pitch');
  }
  windowEl.addEventListener('pointermove', event => {
    if (!motion.matches || event.pointerType === 'touch') return;
    const bounds = windowEl.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      layers.style.setProperty('--yaw', `${(x * 9).toFixed(2)}deg`);
      layers.style.setProperty('--pitch', `${(-y * 6).toFixed(2)}deg`);
    });
  });
  windowEl.addEventListener('pointerleave', center);
  windowEl.addEventListener('pointercancel', center);
  motion.addEventListener('change', center);
  display.addEventListener('click', event => {
    const button = event.target.closest('[data-display]');
    if (!button || button.getAttribute('aria-pressed') === 'true') return;
    const next = displays[Number(button.dataset.display)];
    center();
    display.dataset.collection = next.key;
    display.querySelector('.display-products').innerHTML = displayProducts(next);
    display.querySelector('.showcase-caption').textContent = next.title;
    for (const sibling of display.querySelectorAll('[data-display]')) {
      sibling.setAttribute('aria-pressed', String(button === sibling));
    }
  });
}
