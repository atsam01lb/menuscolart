/* Al Mallah Bakeries: branch menu (items, basket, delivery form, WhatsApp) */
(function () {
  'use strict';
  try { if (sessionStorage.getItem('mallah_splash')) document.documentElement.classList.add('no-splash'); sessionStorage.setItem('mallah_splash', '1'); } catch (e) {}

  var D = window.MALLAH;
  var slug = document.body.getAttribute('data-branch');
  var branch = D && D.branches.filter(function (b) { return b.slug === slug; })[0];
  if (!branch) return;

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var yr = $('year'); if (yr) yr.textContent = new Date().getFullYear();

  var ICON = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>'
  };

  function fmt(n) { return Math.round(n).toLocaleString('en-US') + ' ' + D.currency; }

  /* ---------- Render items ---------- */
  var catalog = {};           // id -> {name, price}
  var wrap = $('menuWrap'), n = 0;
  wrap.innerHTML = D.menu.map(function (cat) {
    var cards = cat.items.map(function (it) {
      catalog[it.id] = it;
      n += 1;
      var hasPrice = typeof it.price === 'number' && it.price >= 0;
      return '<article class="item-card" data-id="' + it.id + '" style="--i:' + n + '">' +
        '<div class="ph"><img class="ph__logo" src="../assets/logo.png" alt="" loading="lazy" decoding="async">' +
        '<img class="ph__real" src="../assets/items/' + it.id + '.jpg" alt="' + esc(it.name) + '" loading="lazy" decoding="async" onerror="this.remove()"></div>' +
        '<div class="item-card__body"><h3 class="item-card__name">' + esc(it.name) + '</h3>' +
        '<div class="item-card__bottom' + (hasPrice ? '' : ' item-card__bottom--np') + '">' +
        (hasPrice ? '<span class="item-card__price">' + Math.round(it.price).toLocaleString('en-US') + '<span class="cur"> ' + D.currency + '</span></span>' : '') +
        '<div class="qty-stepper"><button type="button" class="qty-btn" data-action="minus" aria-label="إنقاص الكمية">' + ICON.minus + '</button>' +
        '<span class="qty-value">1</span>' +
        '<button type="button" class="qty-btn" data-action="plus" aria-label="زيادة الكمية">' + ICON.plus + '</button></div></div>' +
        '<button type="button" class="add-btn" data-action="add">' + ICON.plus + '<span>أضف إلى السلة</span></button></div></article>';
    }).join('');
    return '<section class="menu" id="' + cat.id + '"><div class="menu__head"><h2>' + esc(cat.title) + '</h2><span>' + cat.items.length + ' أصناف</span></div>' +
      '<div class="item-grid">' + cards + '</div></section>';
  }).join('');

  /* ---------- Storage ---------- */
  var CART_KEY = 'almallah_' + slug + '_cart_v1';
  var ADDR_KEY = 'almallah_address_v1';
  function read(key, fb) { try { var r = localStorage.getItem(key); var p = r ? JSON.parse(r) : fb; return (p && typeof p === 'object') ? p : fb; } catch (e) { return fb; } }
  function write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* not persisted */ } }

  var cart = read(CART_KEY, {});
  Object.keys(cart).forEach(function (id) { if (!catalog[id] || !(cart[id] > 0)) delete cart[id]; });   // cart = { itemId: qty }

  function priced(it) { return typeof it.price === 'number' && it.price >= 0; }
  function count() { return Object.keys(cart).reduce(function (s, id) { return s + cart[id]; }, 0); }
  function allPriced() { var ids = Object.keys(cart); return ids.length > 0 && ids.every(function (id) { return priced(catalog[id]); }); }
  function total() { return Object.keys(cart).reduce(function (s, id) { return s + cart[id] * (priced(catalog[id]) ? catalog[id].price : 0); }, 0); }

  /* ---------- Refs ---------- */
  var toggle = $('basketToggle'), fab = $('basketFab'), overlay = $('basketOverlay'), drawer = $('basketDrawer'), closeBtn = $('basketClose');
  var countEl = $('basketCount'), fabCount = $('basketFabCount'), fabTotal = $('basketFabTotal');
  var linesEl = $('basketLines'), emptyEl = $('basketEmpty'), foot = $('basketFoot'), totalWrap = $('basketTotalWrap'), totalEl = $('basketSubtotal');
  var checkoutBtn = $('checkoutBtn'), clearBtn = $('clearBtn'), toastEl = $('toast');

  var toastT = null;
  function toast(msg) {
    toastEl.innerHTML = ICON.check + '<span>' + esc(msg) + '</span>';
    toastEl.classList.add('is-visible');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2200);
  }

  /* iOS-safe scroll lock */
  var lockY = 0, locked = false;
  function lock() { if (locked) return; locked = true; lockY = window.scrollY || 0; document.body.style.top = '-' + lockY + 'px'; document.body.classList.add('scroll-locked'); }
  function unlock() {
    if (!locked) return; locked = false;
    document.body.classList.remove('scroll-locked'); document.body.style.top = '';
    document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, lockY); document.documentElement.style.scrollBehavior = '';
  }
  var open = false;
  function openBasket() { if (open) return; open = true; overlay.classList.add('is-open'); drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); lock(); }
  function closeBasket() { if (!open) return; open = false; overlay.classList.remove('is-open'); drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); unlock(); }
  toggle.addEventListener('click', openBasket); fab.addEventListener('click', openBasket);
  closeBtn.addEventListener('click', closeBasket); overlay.addEventListener('click', closeBasket);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBasket(); });

  /* ---------- Render cart ---------- */
  function render() {
    var ids = Object.keys(cart), has = ids.length > 0, c = count(), showTotal = allPriced();
    emptyEl.style.display = has ? 'none' : 'flex';
    linesEl.style.display = has ? 'flex' : 'none';
    foot.classList.toggle('is-empty', !has);
    checkoutBtn.disabled = !has;
    clearBtn.hidden = !has;
    totalWrap.hidden = !showTotal;

    linesEl.innerHTML = ids.map(function (id) {
      var it = catalog[id], q = cart[id];
      var sub = priced(it) ? '<div class="basket-line__price">' + fmt(it.price) + ' &times; ' + q + ' = <b>' + fmt(it.price * q) + '</b></div>' : '';
      return '<li class="basket-line" data-id="' + id + '"><div><div class="basket-line__name">' + esc(it.name) + '</div>' + sub + '</div>' +
        '<div class="basket-line__controls"><div class="qty-stepper">' +
        '<button type="button" class="qty-btn" data-line="minus" aria-label="إنقاص الكمية">' + ICON.minus + '</button>' +
        '<span class="qty-value">' + q + '</span>' +
        '<button type="button" class="qty-btn" data-line="plus" aria-label="زيادة الكمية">' + ICON.plus + '</button></div>' +
        '<button type="button" class="basket-line__remove" data-line="remove" aria-label="إزالة الصنف">' + ICON.trash + '</button></div></li>';
    }).join('');

    totalEl.textContent = fmt(total());
    countEl.textContent = c; countEl.classList.toggle('is-on', c > 0);
    fabCount.textContent = c; fabTotal.textContent = showTotal ? fmt(total()) : (c + ' ' + (c === 1 ? 'صنف' : 'أصناف'));
    fab.classList.toggle('is-visible', c > 0);
    document.body.classList.toggle('has-cart', c > 0);
    write(CART_KEY, cart);
  }

  linesEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-line]'); if (!b) return;
    var id = b.closest('.basket-line').getAttribute('data-id'); if (!cart[id]) return;
    var a = b.getAttribute('data-line');
    if (a === 'plus') cart[id] += 1;
    else if (a === 'minus') { cart[id] -= 1; if (cart[id] <= 0) delete cart[id]; }
    else delete cart[id];
    render();
  });
  clearBtn.addEventListener('click', function () { cart = {}; render(); toast('تم إفراغ السلة'); });

  /* ---------- Cards ---------- */
  function bump() { toggle.classList.remove('is-bump'); void toggle.offsetWidth; toggle.classList.add('is-bump'); }
  function fly(from) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var target = (fab.classList.contains('is-visible') ? fab : toggle).getBoundingClientRect();
    var a = from.getBoundingClientRect();
    var dot = document.createElement('span'); dot.className = 'fly';
    dot.style.left = (a.left + a.width / 2 - 11) + 'px'; dot.style.top = (a.top + a.height / 2 - 11) + 'px';
    document.body.appendChild(dot);
    requestAnimationFrame(function () {
      dot.style.transform = 'translate(' + (target.left + target.width / 2 - a.left - a.width / 2) + 'px,' + (target.top + target.height / 2 - a.top - a.height / 2) + 'px) scale(.3)';
      dot.style.opacity = '.2';
    });
    setTimeout(function () { dot.remove(); bump(); }, 720);
  }

  document.querySelectorAll('.item-card').forEach(function (card) {
    var id = card.getAttribute('data-id'), qty = 1;
    var qEl = card.querySelector('.qty-value'), add = card.querySelector('[data-action="add"]'), t = null;
    card.querySelectorAll('.qty-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        qty = b.getAttribute('data-action') === 'plus' ? qty + 1 : Math.max(1, qty - 1);
        qEl.textContent = qty;
      });
    });
    add.addEventListener('click', function () {
      cart[id] = (cart[id] || 0) + qty;
      render();
      fly(add);
      toast('تمت إضافة ' + catalog[id].name + ' إلى السلة');
      var sp = add.querySelector('span'); add.classList.add('is-added'); sp.textContent = 'تمت الإضافة';
      clearTimeout(t); t = setTimeout(function () { add.classList.remove('is-added'); sp.textContent = 'أضف إلى السلة'; }, 1100);
      qty = 1; qEl.textContent = 1;
    });
  });

  /* ---------- Delivery form ---------- */
  var FIELDS = ['name', 'phone', 'area', 'street', 'building', 'floor', 'notes'];
  var REQUIRED = ['name', 'phone', 'area', 'street', 'building', 'floor'];
  var LABEL = { name: 'الإسم', phone: 'رقم الهاتف', area: 'المنطقة', street: 'الشارع', building: 'البناية', floor: 'الطابق', notes: 'ملاحظات وتعليمات' };
  var inp = {}; FIELDS.forEach(function (k) { inp[k] = $('addr' + k.charAt(0).toUpperCase() + k.slice(1)); });
  var saved = read(ADDR_KEY, {});
  FIELDS.forEach(function (k) { if (inp[k] && typeof saved[k] === 'string') inp[k].value = saved[k]; });
  function wrapOf(k) { return inp[k].closest('.field'); }
  FIELDS.forEach(function (k) {
    inp[k].addEventListener('input', function () {
      wrapOf(k).classList.remove('has-error');
      var a = read(ADDR_KEY, {}); a[k] = inp[k].value.trim(); write(ADDR_KEY, a);
    });
  });

  checkoutBtn.addEventListener('click', function () {
    var ids = Object.keys(cart); if (!ids.length) return;
    var v = {}; FIELDS.forEach(function (k) { v[k] = inp[k].value.trim(); });
    var bad = REQUIRED.filter(function (k) { return !v[k]; });
    if (v.phone && v.phone.replace(/\D/g, '').length < 7 && bad.indexOf('phone') === -1) bad.unshift('phone');
    FIELDS.forEach(function (k) { wrapOf(k).classList.toggle('has-error', bad.indexOf(k) !== -1); });
    if (bad.length) {
      var first = REQUIRED.filter(function (k) { return bad.indexOf(k) !== -1; })[0];
      wrapOf(first).scrollIntoView({ block: 'center', behavior: 'smooth' });
      inp[first].focus({ preventScroll: true });
      toast(first === 'phone' && v.phone ? 'الرجاء إدخال رقم هاتف صحيح' : 'الرجاء تعبئة معلومات التوصيل كاملة');
      return;
    }
    write(ADDR_KEY, v);

    var m = 'مرحباً Mallah Bakeries، فرع ' + branch.ar + '!\nأرغب بطلب توصيل:\n\n';
    ids.forEach(function (id, i) {
      var it = catalog[id], q = cart[id];
      m += (i + 1) + '. ' + it.name + ' x' + q + (priced(it) ? ' = ' + fmt(it.price * q) : '') + '\n';
    });
    if (allPriced()) m += '\nالمجموع: ' + fmt(total()) + '\n';
    m += '\nمعلومات التوصيل:';
    ['name', 'phone', 'area', 'street', 'building', 'floor'].forEach(function (k) { m += '\n' + LABEL[k] + ': ' + v[k]; });
    if (v.notes) m += '\n' + LABEL.notes + ': ' + v.notes;

    window.open('https://wa.me/' + branch.wa + '?text=' + encodeURIComponent(m), '_blank', 'noopener');
    cart = {}; render(); closeBasket();
  });

  render();
})();
