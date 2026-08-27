document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   SCROLL-IN REVEAL (progressive enhancement — see style.css)
   Content stays fully visible if JS never runs.
========================================================= */
if ('IntersectionObserver' in window) {
  document.body.classList.add('js-anim');

  const blocks = document.querySelectorAll('.anim-block');
  blocks.forEach(block => {
    block.querySelectorAll('.anim-item').forEach((item, i) => {
      item.style.setProperty('--anim-delay', (i * 45) + 'ms');
    });
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  blocks.forEach(block => revealObserver.observe(block));
}

/* =========================================================
   CATEGORY PILL ACTIVE STATE (scroll spy, lightweight)
========================================================= */
(function () {
  const pills = Array.from(document.querySelectorAll('.cat-pill'));
  const sections = pills
    .map(p => document.querySelector(p.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const pill = pills.find(p => p.getAttribute('href') === id);
      if (!pill) return;
      if (entry.isIntersecting) {
        pills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => spy.observe(s));
})();

/* =========================================================
   BASKET / CART
========================================================= */
const WHATSAPP_NUMBER = '96179328109';
const CART_STORAGE_KEY = 'glowbites_cart_v1';
const ORDER_INFO_STORAGE_KEY = 'glowbites_order_info_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    /* storage unavailable — cart just won't persist across reloads */
  }
}

function loadOrderInfo() {
  try {
    const raw = localStorage.getItem(ORDER_INFO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { type: 'pickup', address: '' };
  } catch (e) {
    return { type: 'pickup', address: '' };
  }
}

function saveOrderInfo(info) {
  try {
    localStorage.setItem(ORDER_INFO_STORAGE_KEY, JSON.stringify(info));
  } catch (e) {
    /* storage unavailable */
  }
}

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
}

let cart = loadCart();

function formatPrice(n) {
  return Math.round(n).toLocaleString('en-US') + ' L.L';
}

function cartCount() {
  return Object.values(cart).reduce((sum, line) => sum + line.qty, 0);
}

function cartTotal() {
  return Object.values(cart).reduce((sum, line) => sum + line.qty * line.price, 0);
}

/* --- DOM refs --- */
const basketToggle = document.getElementById('basketToggle');
const basketFab = document.getElementById('basketFab');
const basketOverlay = document.getElementById('basketOverlay');
const basketDrawer = document.getElementById('basketDrawer');
const basketClose = document.getElementById('basketClose');
const basketCountEl = document.getElementById('basketCount');
const basketFabCountEl = document.getElementById('basketFabCount');
const basketLinesEl = document.getElementById('basketLines');
const basketEmptyEl = document.getElementById('basketEmpty');
const basketSubtotalEl = document.getElementById('basketSubtotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearBtn = document.getElementById('clearBtn');
const toastEl = document.getElementById('toast');

let toastTimer = null;
function showToast(message) {
  toastEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + message;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2200);
}

function openBasket() {
  basketOverlay.classList.add('is-open');
  basketDrawer.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeBasket() {
  basketOverlay.classList.remove('is-open');
  basketDrawer.classList.remove('is-open');
  document.body.style.overflow = '';
}

basketToggle.addEventListener('click', openBasket);
basketFab.addEventListener('click', openBasket);
basketClose.addEventListener('click', closeBasket);
basketOverlay.addEventListener('click', closeBasket);

function renderBasketBadges() {
  const count = cartCount();
  basketCountEl.textContent = count;
  basketFabCountEl.textContent = count;
  basketFab.classList.toggle('is-visible', count > 0);
}

function renderBasketDrawer() {
  const ids = Object.keys(cart);

  if (!ids.length) {
    basketEmptyEl.style.display = 'flex';
    basketLinesEl.style.display = 'none';
    checkoutBtn.disabled = true;
  } else {
    basketEmptyEl.style.display = 'none';
    basketLinesEl.style.display = 'flex';
    checkoutBtn.disabled = false;
  }

  basketLinesEl.innerHTML = ids.map(id => {
    const line = cart[id];
    const variantHtml = line.variant ? `<div class="basket-line__variant">${line.variant}</div>` : '';
    return `
      <li class="basket-line" data-id="${id}">
        <div class="basket-line__info">
          <div class="basket-line__name">${line.name}</div>
          ${variantHtml}
          <div class="basket-line__price">${formatPrice(line.price)} &times; ${line.qty} = ${formatPrice(line.price * line.qty)}</div>
        </div>
        <div class="basket-line__controls">
          <div class="qty-stepper">
            <button class="qty-btn" data-line-action="minus" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-value">${line.qty}</span>
            <button class="qty-btn" data-line-action="plus" aria-label="Increase quantity">+</button>
          </div>
          <button class="basket-line__remove" data-line-action="remove" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </li>
    `;
  }).join('');

  basketSubtotalEl.textContent = formatPrice(cartTotal());
  renderBasketBadges();
  saveCart(cart);
}

basketLinesEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-line-action]');
  if (!btn) return;
  const li = btn.closest('.basket-line');
  const id = li.getAttribute('data-id');
  const action = btn.getAttribute('data-line-action');

  if (!cart[id]) return;

  if (action === 'plus') {
    cart[id].qty += 1;
  } else if (action === 'minus') {
    cart[id].qty -= 1;
    if (cart[id].qty <= 0) delete cart[id];
  } else if (action === 'remove') {
    delete cart[id];
  }
  renderBasketDrawer();
});

clearBtn.addEventListener('click', () => {
  if (!Object.keys(cart).length) return;
  cart = {};
  renderBasketDrawer();
  showToast('Basket cleared');
});

/* --- Order type: Pickup / Delivery --- */
const orderTypePickup = document.getElementById('orderTypePickup');
const orderTypeDelivery = document.getElementById('orderTypeDelivery');
const deliveryAddressWrap = document.getElementById('deliveryAddressWrap');
const deliveryAddressInput = document.getElementById('deliveryAddress');

const savedOrderInfo = loadOrderInfo();
if (savedOrderInfo.type === 'delivery') {
  orderTypeDelivery.checked = true;
} else {
  orderTypePickup.checked = true;
}
deliveryAddressInput.value = savedOrderInfo.address || '';

function updateOrderTypeUI() {
  deliveryAddressWrap.hidden = !orderTypeDelivery.checked;
}
updateOrderTypeUI();

orderTypePickup.addEventListener('change', () => {
  updateOrderTypeUI();
  saveOrderInfo({ type: 'pickup', address: deliveryAddressInput.value.trim() });
});
orderTypeDelivery.addEventListener('change', () => {
  updateOrderTypeUI();
  saveOrderInfo({ type: 'delivery', address: deliveryAddressInput.value.trim() });
});
deliveryAddressInput.addEventListener('input', () => {
  deliveryAddressWrap.classList.remove('has-error');
  saveOrderInfo({ type: orderTypeDelivery.checked ? 'delivery' : 'pickup', address: deliveryAddressInput.value.trim() });
});

checkoutBtn.addEventListener('click', () => {
  const ids = Object.keys(cart);
  if (!ids.length) return;

  const isDelivery = orderTypeDelivery.checked;
  const address = deliveryAddressInput.value.trim();
  if (isDelivery && !address) {
    deliveryAddressWrap.classList.add('has-error');
    deliveryAddressInput.focus();
    showToast('Please add your delivery address');
    return;
  }
  deliveryAddressWrap.classList.remove('has-error');

  let message = 'Hi Glow Bites! I would like to order:\n\n';
  ids.forEach((id, i) => {
    const line = cart[id];
    const variantText = line.variant ? ` (${line.variant})` : '';
    message += `${i + 1}. ${line.name}${variantText} x${line.qty} = ${formatPrice(line.price * line.qty)}\n`;
  });
  message += `\nTotal: ${formatPrice(cartTotal())}`;
  message += `\n\nOrder Type: ${isDelivery ? 'Delivery' : 'Pickup'}`;
  if (isDelivery) message += `\nDelivery Address: ${address}`;

  pendingCheckoutMessage = message;
  openThankYou();
});

/* --- Thank You / confirm modal — shown before the WhatsApp redirect.
   The cart only clears once the customer actually proceeds to WhatsApp;
   closing/canceling this modal leaves the basket untouched. --- */
const thankyouOverlay = document.getElementById('thankyouOverlay');
const thankyouModal = document.getElementById('thankyouModal');
const thankyouClose = document.getElementById('thankyouClose');
const thankyouCancel = document.getElementById('thankyouCancel');
const proceedWhatsAppBtn = document.getElementById('proceedWhatsAppBtn');
let pendingCheckoutMessage = null;

function openThankYou() {
  thankyouOverlay.classList.add('is-open');
  thankyouModal.classList.add('is-open');
}
function closeThankYou() {
  thankyouOverlay.classList.remove('is-open');
  thankyouModal.classList.remove('is-open');
}

thankyouOverlay.addEventListener('click', closeThankYou);
thankyouClose.addEventListener('click', closeThankYou);
thankyouCancel.addEventListener('click', closeThankYou);

proceedWhatsAppBtn.addEventListener('click', () => {
  if (pendingCheckoutMessage) {
    openWhatsApp(pendingCheckoutMessage);
    pendingCheckoutMessage = null;

    /* Order actually sent — clear the basket so a returning visitor
       starts fresh. If they never reach this point, the cart (saved
       in localStorage) stays exactly as they left it. */
    cart = {};
    renderBasketDrawer();
  }
  closeThankYou();
  closeBasket();
});

/* =========================================================
   ITEM CARDS — quantity stepper, add-ons, add to basket / ask
========================================================= */
document.querySelectorAll('.item-card').forEach(card => {
  const id = card.getAttribute('data-id');
  const name = card.getAttribute('data-name');
  const baseVariant = card.getAttribute('data-variant') || '';
  const priceAttr = card.getAttribute('data-price');
  const price = priceAttr ? parseFloat(priceAttr) : null;
  const minQty = parseInt(card.getAttribute('data-min-qty'), 10) || 1;

  const qtyValueEl = card.querySelector('.qty-value');
  const addBtn = card.querySelector('[data-action="add"]');
  const askBtn = card.querySelector('[data-action="ask"]');
  const optionChecks = Array.from(card.querySelectorAll('.option-check'));
  let qty = minQty;

  function checkedOptions() {
    return optionChecks.filter(cb => cb.checked);
  }

  card.querySelectorAll('[data-action="minus"], [data-action="plus"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (action === 'plus') qty += 1;
      if (action === 'minus') qty = Math.max(minQty, qty - 1);
      qtyValueEl.textContent = qty;
    });
  });

  if (addBtn && price !== null) {
    addBtn.addEventListener('click', () => {
      const opts = checkedOptions();
      const optsLabel = opts.map(cb => cb.dataset.optionLabel).join(' + ');
      const optsPrice = opts.reduce((sum, cb) => sum + parseFloat(cb.dataset.optionPrice), 0);
      const unitPrice = price + optsPrice;
      const displayVariant = [baseVariant, optsLabel].filter(Boolean).join(' + ');
      const cartKey = optsLabel ? `${id}::${optsLabel}` : id;

      if (cart[cartKey]) {
        cart[cartKey].qty += qty;
      } else {
        cart[cartKey] = { name, variant: displayVariant, price: unitPrice, qty };
      }
      renderBasketDrawer();
      showToast(`${name} added to basket`);

      addBtn.classList.add('is-added');
      const original = addBtn.innerHTML;
      addBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      setTimeout(() => {
        addBtn.classList.remove('is-added');
        addBtn.innerHTML = original;
      }, 1100);

      qty = minQty;
      qtyValueEl.textContent = qty;
    });
  }

  if (askBtn) {
    askBtn.addEventListener('click', () => {
      const opts = checkedOptions().map(cb => cb.dataset.optionLabel);
      let msg = `Hi Glow Bites! I'd like to ask about pricing for ${name}`;
      if (baseVariant) msg += ` (${baseVariant})`;
      if (opts.length) msg += ` with ${opts.join(' + ')}`;
      if (minQty > 1) msg += ` — minimum order ${minQty} pcs`;
      msg += '.';
      openWhatsApp(msg);
    });
  }
});

/* =========================================================
   BALLS BOX — flavor checklist (up to 4 flavors, 3 pcs each)
   Priced item: adds to the basket like any other card, with
   the chosen flavors carried as the line's variant text.
========================================================= */
(function () {
  const card = document.getElementById('ballsBoxCard');
  const checklist = document.getElementById('ballsBoxChecklist');
  if (!card || !checklist) return;

  const BALLS_BOX_PRICE = 100000;
  const MAX_FLAVORS = 4;
  const flavorChecks = Array.from(checklist.querySelectorAll('.ballsbox-flavor'));
  const counterEl = document.getElementById('ballsBoxCounter');
  const addBtn = document.getElementById('ballsBoxAddBtn');
  const qtyValueEl = card.querySelector('.qty-value');

  function update() {
    const checked = flavorChecks.filter(cb => cb.checked);
    counterEl.textContent = `${checked.length}/${MAX_FLAVORS} selected`;
    flavorChecks.forEach(cb => {
      if (!cb.checked) cb.disabled = checked.length >= MAX_FLAVORS;
    });
    addBtn.disabled = checked.length === 0;
  }

  flavorChecks.forEach(cb => cb.addEventListener('change', update));
  update();

  addBtn.addEventListener('click', () => {
    const flavors = flavorChecks.filter(cb => cb.checked).map(cb => cb.value);
    if (!flavors.length) return;

    const qty = parseInt(qtyValueEl.textContent, 10) || 1;
    const flavorsLabel = flavors.join(', ');
    const cartKey = `balls-box::${flavorsLabel}`;

    if (cart[cartKey]) {
      cart[cartKey].qty += qty;
    } else {
      cart[cartKey] = { name: 'Balls Box (12 pcs)', variant: flavorsLabel, price: BALLS_BOX_PRICE, qty };
    }
    renderBasketDrawer();
    showToast('Balls Box added to basket');

    addBtn.classList.add('is-added');
    const original = addBtn.innerHTML;
    addBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
    setTimeout(() => {
      addBtn.classList.remove('is-added');
      addBtn.innerHTML = original;
    }, 1100);

    qtyValueEl.textContent = '1';
  });
})();

/* =========================================================
   CHOCO CUP — custom order CTA
========================================================= */
(function () {
  const btn = document.getElementById('chocoCupAskBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    openWhatsApp("Hi Glow Bites! I'd like to customize my own Choco Cup. Can you help me build it?");
  });
})();

renderBasketDrawer();
