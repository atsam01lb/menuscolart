/* Nakha Khasa Delivery: one-page ordering (search, categories, cart, address, WhatsApp) */
(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header height -> CSS var (for scroll offset) ---------- */
  var siteHead = document.getElementById('siteHead');
  function setHeadH() {
    if (!siteHead) return;
    document.documentElement.style.setProperty('--head-h', siteHead.offsetHeight + 'px');
  }
  setHeadH();
  window.addEventListener('resize', setHeadH);
  if (window.ResizeObserver && siteHead) new ResizeObserver(setHeadH).observe(siteHead);

  /* ---------- Settings ---------- */
  var WHATSAPP_NUMBER = '96181425150';
  var CART_KEY = 'nakhakhasadelivery_cart_v1';
  var ADDRESS_KEY = 'nakhakhasadelivery_address_v1';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var ICON_TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Storage ---------- */
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object') ? parsed : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* not persisted */ }
  }

  /* ---------- Cart state ---------- */
  var cart = readJSON(CART_KEY, {});
  // drop malformed lines from older/corrupt storage
  Object.keys(cart).forEach(function (k) {
    var l = cart[k];
    if (!l || typeof l.name !== 'string' || !(l.price >= 0) || !(l.qty > 0)) delete cart[k];
  });

  function formatPrice(n) { return Math.round(n).toLocaleString('en-US') + ' ل.ل'; }
  function cartCount() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k].qty; }, 0); }
  function cartTotal() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k].qty * cart[k].price; }, 0); }

  /* ---------- DOM refs ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var basketToggle = $('basketToggle'), basketFab = $('basketFab'), basketOverlay = $('basketOverlay');
  var basketDrawer = $('basketDrawer'), basketClose = $('basketClose');
  var basketCountEl = $('basketCount'), basketFabCountEl = $('basketFabCount'), basketFabTotalEl = $('basketFabTotal');
  var basketLinesEl = $('basketLines'), basketEmptyEl = $('basketEmpty'), basketSubtotalEl = $('basketSubtotal');
  var checkoutBtn = $('checkoutBtn'), clearBtn = $('clearBtn'), toastEl = $('toast');
  var basketFoot = $('basketFoot');

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function showToast(msg) {
    toastEl.innerHTML = ICON_CHECK + '<span>' + escapeHtml(msg) + '</span>';
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2200);
  }

  /* ---------- Scroll lock (iOS safe) ---------- */
  var lockY = 0, lockDepth = 0;
  function lockScroll() {
    if (lockDepth === 0) {
      lockY = window.scrollY || window.pageYOffset || 0;
      document.body.style.top = '-' + lockY + 'px';
      document.body.classList.add('scroll-locked');
    }
    lockDepth += 1;
  }
  function unlockScroll() {
    lockDepth = Math.max(0, lockDepth - 1);
    if (lockDepth === 0) {
      document.body.classList.remove('scroll-locked');
      document.body.style.top = '';
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, lockY);
      document.documentElement.style.scrollBehavior = '';
    }
  }

  var drawerOpen = false;
  function openBasket() {
    if (drawerOpen) return;
    drawerOpen = true;
    basketOverlay.classList.add('is-open');
    basketDrawer.classList.add('is-open');
    basketDrawer.setAttribute('aria-hidden', 'false');
    lockScroll();
  }
  function closeBasket() {
    if (!drawerOpen) return;
    drawerOpen = false;
    basketOverlay.classList.remove('is-open');
    basketDrawer.classList.remove('is-open');
    basketDrawer.setAttribute('aria-hidden', 'true');
    unlockScroll();
  }
  basketToggle.addEventListener('click', openBasket);
  basketFab.addEventListener('click', openBasket);
  basketClose.addEventListener('click', closeBasket);
  basketOverlay.addEventListener('click', closeBasket);

  /* ---------- Cart rendering ---------- */
  function renderBadges() {
    var c = cartCount(), t = cartTotal();
    basketCountEl.textContent = c;
    basketCountEl.classList.toggle('is-on', c > 0);
    basketFabCountEl.textContent = c;
    basketFabTotalEl.textContent = formatPrice(t);
    basketFab.classList.toggle('is-visible', c > 0);
    document.body.classList.toggle('has-cart', c > 0);
  }

  function renderCart() {
    var ids = Object.keys(cart);
    var has = ids.length > 0;
    basketEmptyEl.style.display = has ? 'none' : 'flex';
    basketLinesEl.style.display = has ? 'flex' : 'none';
    basketFoot.classList.toggle('is-empty', !has);
    checkoutBtn.disabled = !has;
    clearBtn.hidden = !has;

    basketLinesEl.innerHTML = ids.map(function (id) {
      var l = cart[id];
      var label = l.sizeLabel ? ' <span class="basket-line__size">' + escapeHtml(l.sizeLabel) + '</span>' : '';
      return '<li class="basket-line" data-id="' + escapeHtml(id) + '">' +
        '<div class="basket-line__info">' +
          '<div class="basket-line__name">' + escapeHtml(l.name) + label + '</div>' +
          '<div class="basket-line__price">' + formatPrice(l.price) + ' &times; ' + l.qty + ' = <b>' + formatPrice(l.price * l.qty) + '</b></div>' +
        '</div>' +
        '<div class="basket-line__controls">' +
          '<div class="qty-stepper">' +
            '<button type="button" class="qty-btn" data-line-action="minus" aria-label="إنقاص الكمية">&minus;</button>' +
            '<span class="qty-value">' + l.qty + '</span>' +
            '<button type="button" class="qty-btn" data-line-action="plus" aria-label="زيادة الكمية">+</button>' +
          '</div>' +
          '<button type="button" class="basket-line__remove" data-line-action="remove" aria-label="إزالة الصنف">' + ICON_TRASH + '</button>' +
        '</div></li>';
    }).join('');

    basketSubtotalEl.textContent = formatPrice(cartTotal());
    renderBadges();
    writeJSON(CART_KEY, cart);
  }

  basketLinesEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-line-action]');
    if (!btn) return;
    var id = btn.closest('.basket-line').getAttribute('data-id');
    if (!cart[id]) return;
    var a = btn.getAttribute('data-line-action');
    if (a === 'plus') cart[id].qty += 1;
    else if (a === 'minus') { cart[id].qty -= 1; if (cart[id].qty <= 0) delete cart[id]; }
    else if (a === 'remove') delete cart[id];
    renderCart();
  });

  clearBtn.addEventListener('click', function () {
    if (!Object.keys(cart).length) return;
    cart = {};
    renderCart();
    showToast('تم إفراغ السلة');
  });

  /* ---------- Item cards: size chips, qty stepper, add ---------- */
  document.querySelectorAll('.item-card').forEach(function (card) {
    var baseId = card.getAttribute('data-id');
    var name = card.getAttribute('data-name');
    var hasSizes = card.hasAttribute('data-has-sizes');
    var priceEl = card.querySelector('.item-card__price');
    var qtyEl = card.querySelector('.qty-value');
    var addBtn = card.querySelector('[data-action="add"]');
    var chips = Array.prototype.slice.call(card.querySelectorAll('.size-chip'));
    var qty = 1;
    var price = parseFloat(card.getAttribute('data-price'));
    var size = null, sizeLabel = '';

    if (hasSizes && chips.length) {
      var first = chips.filter(function (c) { return c.classList.contains('is-active'); })[0] || chips[0];
      size = first.getAttribute('data-size');
      sizeLabel = first.getAttribute('data-label');
      price = parseFloat(first.getAttribute('data-price'));
    }

    function renderPrice() {
      priceEl.innerHTML = Math.round(price).toLocaleString('en-US') + '<span class="cur"> ل.ل</span>';
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        size = chip.getAttribute('data-size');
        sizeLabel = chip.getAttribute('data-label');
        price = parseFloat(chip.getAttribute('data-price'));
        renderPrice();
      });
    });

    card.querySelectorAll('.qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.getAttribute('data-action') === 'plus') qty += 1;
        else qty = Math.max(1, qty - 1);
        qtyEl.textContent = qty;
      });
    });

    var resetTimer = null;
    addBtn.addEventListener('click', function () {
      var key = size ? baseId + '|' + size : baseId;
      if (cart[key]) cart[key].qty += qty;
      else cart[key] = { name: name, price: price, qty: qty, sizeLabel: size ? sizeLabel : '' };
      renderCart();
      showToast('تمت إضافة ' + name + (size ? ' (' + sizeLabel + ')' : '') + ' إلى السلة');

      var span = addBtn.querySelector('span');
      addBtn.classList.add('is-added');
      if (span) span.textContent = 'تمت الإضافة';
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        addBtn.classList.remove('is-added');
        if (span) span.textContent = 'أضف إلى السلة';
      }, 1100);

      qty = 1;
      qtyEl.textContent = qty;
    });
  });

  /* ---------- Search (Arabic-normalised) ---------- */
  (function () {
    var input = $('itemSearch'), clear = $('itemSearchClear');
    var noRes = $('noResults'), reset = $('noResultsReset');
    var sections = Array.prototype.slice.call(document.querySelectorAll('.menu-category'));
    var pills = Array.prototype.slice.call(document.querySelectorAll('.cat-pill'));

    function norm(s) {
      return String(s || '').trim().toLowerCase()
        .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
        .replace(/[ً-ْـ]/g, '')
        .replace(/\s+/g, ' ');
    }

    function apply() {
      var q = norm(input.value);
      clear.hidden = !q;
      document.body.classList.toggle('is-searching', !!q);
      var total = 0;
      sections.forEach(function (sec) {
        var vis = 0;
        var h2 = sec.querySelector('h2');
        var catHit = !!q && !!h2 && norm(h2.textContent).indexOf(q) !== -1;
        sec.querySelectorAll('.item-card').forEach(function (card) {
          var hit = !q || catHit || norm(card.getAttribute('data-name')).indexOf(q) !== -1;
          card.classList.toggle('is-search-hidden', !hit);
          if (hit) vis += 1;
        });
        sec.classList.toggle('is-search-empty', vis === 0);
        pills.forEach(function (p) {
          if (p.getAttribute('data-target') === sec.id) p.classList.toggle('is-dim', !!q && vis === 0);
        });
        total += vis;
      });
      noRes.hidden = total !== 0;
    }

    input.addEventListener('input', apply);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
    });
    clear.addEventListener('click', function () { input.value = ''; apply(); input.focus(); });
    if (reset) reset.addEventListener('click', function () { input.value = ''; apply(); });
  })();

  /* ---------- Category pills: smooth jump + scroll spy ---------- */
  (function () {
    var track = $('catPillsTrack');
    var pills = Array.prototype.slice.call(document.querySelectorAll('.cat-pill'));
    var sections = pills.map(function (p) { return $(p.getAttribute('data-target')); });
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lockSpyUntil = 0;

    function headH() { return siteHead ? siteHead.offsetHeight : 0; }

    function centerPill(pill) {
      if (!track || !pill) return;
      var tr = track.getBoundingClientRect(), pr = pill.getBoundingClientRect();
      var delta = (pr.left + pr.width / 2) - (tr.left + tr.width / 2);
      if (Math.abs(delta) > 2) track.scrollBy({ left: delta, behavior: reduce ? 'auto' : 'smooth' });
    }

    function setActive(pill) {
      pills.forEach(function (p) {
        var on = p === pill;
        p.classList.toggle('is-active', on);
        if (on) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current');
      });
      centerPill(pill);
    }

    pills.forEach(function (pill, i) {
      pill.addEventListener('click', function (e) {
        e.preventDefault();
        var sec = sections[i];
        if (!sec || sec.classList.contains('is-search-empty')) return;
        var y = sec.getBoundingClientRect().top + window.pageYOffset - headH() - 8;
        lockSpyUntil = Date.now() + 900;
        setActive(pill);
        window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
      });
    });

    function spy() {
      if (Date.now() < lockSpyUntil) return;
      var line = headH() + 24, current = null;
      for (var i = 0; i < sections.length; i++) {
        var s = sections[i];
        if (!s || s.classList.contains('is-search-empty')) continue;
        if (s.getBoundingClientRect().top <= line) current = pills[i];
      }
      // before the first section: no active pill
      if (current !== (pills.filter(function (p) { return p.classList.contains('is-active'); })[0] || null)) {
        if (current) setActive(current);
        else pills.forEach(function (p) { p.classList.remove('is-active'); p.removeAttribute('aria-current'); });
      }
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; spy(); });
    }, { passive: true });
    spy();
  })();

  /* Hero CTA: offset for the sticky header */
  var cta = document.querySelector('.hero__cta');
  if (cta) cta.addEventListener('click', function (e) {
    var first = document.querySelector('.cat-pill');
    if (first) { e.preventDefault(); first.click(); }
  });

  /* ---------- Delivery address ---------- */
  var wrapAddr = $('deliveryAddressWrap');
  var FIELDS = ['name', 'area', 'street', 'building', 'floor', 'notes'];
  var REQUIRED = ['name', 'area', 'street', 'building', 'floor'];
  var LABELS = { name: 'الإسم', area: 'المنطقة', street: 'الشارع', building: 'البناية', floor: 'الطابق', notes: 'ملاحظات لعامل التوصيل' };
  var inputs = {
    name: $('addrName'), area: $('addrArea'), street: $('addrStreet'),
    building: $('addrBuilding'), floor: $('addrFloor'), notes: $('addrNotes')
  };

  var savedAddr = readJSON(ADDRESS_KEY, {});
  FIELDS.forEach(function (k) {
    if (inputs[k] && typeof savedAddr[k] === 'string' && savedAddr[k]) inputs[k].value = savedAddr[k];
  });

  function fieldWrap(k) { return inputs[k] ? inputs[k].closest('.delivery-field') : null; }

  FIELDS.forEach(function (k) {
    var el = inputs[k];
    if (!el) return;
    el.addEventListener('input', function () {
      var w = fieldWrap(k);
      if (w) w.classList.remove('has-error');
      var a = readJSON(ADDRESS_KEY, {});
      a[k] = el.value.trim();
      writeJSON(ADDRESS_KEY, a);
    });
  });

  /* ---------- Checkout -> confirm modal -> WhatsApp ---------- */
  var tyOverlay = $('thankyouOverlay'), tyModal = $('thankyouModal');
  var tyClose = $('thankyouClose'), tyCancel = $('thankyouCancel'), proceedBtn = $('proceedWhatsAppBtn');
  var pendingMessage = null;
  var modalOpen = false;

  function openThankYou() {
    modalOpen = true;
    tyOverlay.classList.add('is-open');
    tyModal.classList.add('is-open');
    tyModal.setAttribute('aria-hidden', 'false');
  }
  function closeThankYou() {
    modalOpen = false;
    tyOverlay.classList.remove('is-open');
    tyModal.classList.remove('is-open');
    tyModal.setAttribute('aria-hidden', 'true');
  }
  tyOverlay.addEventListener('click', closeThankYou);
  tyClose.addEventListener('click', closeThankYou);
  tyCancel.addEventListener('click', closeThankYou);

  checkoutBtn.addEventListener('click', function () {
    var ids = Object.keys(cart);
    if (!ids.length) return;

    var v = {};
    FIELDS.forEach(function (k) { v[k] = inputs[k] ? inputs[k].value.trim() : ''; });

    var missing = REQUIRED.filter(function (k) { return !v[k]; });
    if (missing.length) {
      missing.forEach(function (k) { var w = fieldWrap(k); if (w) w.classList.add('has-error'); });
      wrapAddr.scrollIntoView({ block: 'center', behavior: 'smooth' });
      inputs[missing[0]].focus({ preventScroll: true });
      showToast('الرجاء تعبئة عنوان التوصيل كاملاً');
      return;
    }
    FIELDS.forEach(function (k) { var w = fieldWrap(k); if (w) w.classList.remove('has-error'); });
    writeJSON(ADDRESS_KEY, v);

    var m = 'مرحباً نكهة خاصة! أرغب بطلب توصيل:\n\n';
    ids.forEach(function (id, i) {
      var l = cart[id];
      m += (i + 1) + '. ' + l.name + (l.sizeLabel ? ' (' + l.sizeLabel + ')' : '') + ' x' + l.qty + ' = ' + formatPrice(l.price * l.qty) + '\n';
    });
    m += '\nالمجموع: ' + formatPrice(cartTotal());
    m += '\nملاحظة: هذا السعر لا يشمل سعر خدمة التوصيل';
    m += '\n\nعنوان التوصيل:';
    ['name', 'area', 'street', 'building', 'floor'].forEach(function (k) { m += '\n' + LABELS[k] + ': ' + v[k]; });
    if (v.notes) m += '\n' + LABELS.notes + ': ' + v.notes;

    pendingMessage = m;
    openThankYou();
  });

  proceedBtn.addEventListener('click', function () {
    if (pendingMessage) {
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(pendingMessage);
      window.open(url, '_blank', 'noopener');
      pendingMessage = null;
      cart = {};
      renderCart();
    }
    closeThankYou();
    closeBasket();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (modalOpen) closeThankYou();
    else if (drawerOpen) closeBasket();
  });

  renderCart();
})();
