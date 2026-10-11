/* ===========================================
   LEIL COFFEE: MENU
   starry sky + embers, scroll reveal, category tabs + scroll-spy
=========================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- decorative night sky + hero embers (purely visual) ---------- */
  function rand(min, max) { return min + Math.random() * (max - min); }

  var sky = document.getElementById('sky');
  if (sky) {
    var starCount = window.innerWidth < 700 ? 34 : 70;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < starCount; i++) {
      var s = document.createElement('span');
      s.className = 'star';
      var size = rand(1, 2.6).toFixed(1);
      s.style.cssText = 'left:' + rand(0, 100).toFixed(1) + '%;top:' + rand(0, 100).toFixed(1) + '%;' +
        'width:' + size + 'px;height:' + size + 'px;' +
        '--d:' + rand(3, 7).toFixed(1) + 's;--t:' + (-rand(0, 7)).toFixed(1) + 's';
      frag.appendChild(s);
    }
    sky.appendChild(frag);
  }

  var embers = document.getElementById('embers');
  if (embers && !reduceMotion) {
    var emberCount = window.innerWidth < 700 ? 12 : 22;
    var f2 = document.createDocumentFragment();
    for (var j = 0; j < emberCount; j++) {
      var em = document.createElement('span');
      em.className = 'ember';
      em.style.cssText = '--x:' + rand(4, 96).toFixed(1) + '%;--s:' + rand(2.5, 5.5).toFixed(1) + 'px;' +
        '--d:' + rand(7, 13).toFixed(1) + 's;--t:' + (-rand(0, 12)).toFixed(1) + 's;' +
        '--dx:' + rand(-50, 50).toFixed(0) + 'px';
      f2.appendChild(em);
    }
    embers.appendChild(f2);
  }

  /* ---------- sticky bar height -> CSS var (anchor offsets) ---------- */
  var head = document.getElementById('siteHead');
  function setHeadHeight() {
    if (!head) return;
    document.documentElement.style.setProperty('--head-h', head.offsetHeight + 'px');
  }
  setHeadHeight();
  window.addEventListener('resize', setHeadHeight);

  /* ---------- scroll reveal ----------
     threshold 0 + an immediate "already on screen" pass, so a section is never
     left invisible on phones (same rule as the other Colart menus). */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.cat, .group'));
  var cats = Array.prototype.slice.call(document.querySelectorAll('.cat'));

  function reveal(el) { el.classList.add('is-visible'); }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { reveal(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });

    var vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.98 && r.bottom > 0) { reveal(el); io.unobserve(el); }
    });
  } else {
    revealEls.forEach(reveal);
  }

  /* ---------- soft orange spotlight following the pointer on each card ---------- */
  if (canHover && !reduceMotion) {
    cats.forEach(function (card) {
      card.addEventListener('pointermove', function (ev) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
        card.style.setProperty('--my', (ev.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- category tabs: sliding ink + scroll-spy ---------- */
  var tabsWrap = document.getElementById('tabs');
  var ink = document.getElementById('tabsInk');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var activeId = null;

  function moveInk(tab) {
    if (!ink || !tab) return;
    ink.style.width = tab.offsetWidth + 'px';
    ink.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
  }

  function centerTab(tab) {
    if (!tabsWrap || !tab) return;
    var target = tab.offsetLeft - (tabsWrap.clientWidth - tab.offsetWidth) / 2;
    /* scroll only the tab strip, never the page */
    tabsWrap.scrollTo({ left: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function setActive(id, instant) {
    if (id === activeId) return;
    activeId = id;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-target') === id;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
      if (on) {
        if (instant && ink) {
          var prev = ink.style.transition;
          ink.style.transition = 'none';
          moveInk(t);
          void ink.offsetWidth;
          ink.style.transition = prev;
        } else {
          moveInk(t);
        }
        centerTab(t);
      }
    });
  }

  function spy() {
    var probe = head ? head.offsetHeight + 40 : 100;
    var current = null;
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].getBoundingClientRect().top - probe <= 0) current = cats[i].id;
    }
    setActive(current || (cats[0] && cats[0].id), false);
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      setActive(t.getAttribute('data-target'), false);
    });
  });

  function remeasure() {
    var cur = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0];
    if (cur) moveInk(cur);
  }
  window.addEventListener('resize', remeasure);

  /* ---------- one rAF-throttled scroll listener ---------- */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; spy(); });
    }
  }, { passive: true });

  /* pause the looping hero animations while the hero is off-screen (saves battery) */
  var hero = document.getElementById('top');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      hero.classList.toggle('is-offscreen', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(hero);
  }

  /* initial state */
  spy();
  var first = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0];
  if (first) setActive(first.getAttribute('data-target'), true);
  /* web fonts change tab widths after load: re-measure once everything is in */
  window.addEventListener('load', function () { setHeadHeight(); remeasure(); });
})();
