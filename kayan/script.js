/* ===========================================
   KAYAN COFFEESHOP: MENU
   scroll reveal, category tabs + scroll-spy, hero parallax
=========================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- sticky bar height -> CSS var (used for anchor offsets) ---------- */
  var head = document.getElementById('siteHead');
  function setHeadHeight() {
    if (!head) return;
    document.documentElement.style.setProperty('--head-h', head.offsetHeight + 'px');
  }
  setHeadHeight();
  window.addEventListener('resize', setHeadHeight);

  /* ---------- scroll reveal ----------
     threshold 0 + an immediate "already on screen" pass, so a section is never
     left invisible on phones (same lesson as the other Colart menus). */
  var cats = Array.prototype.slice.call(document.querySelectorAll('.cat'));

  function reveal(el) { el.classList.add('is-visible'); }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
    cats.forEach(function (el) { io.observe(el); });

    var vh = window.innerHeight || document.documentElement.clientHeight;
    cats.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.98 && r.bottom > 0) { reveal(el); io.unobserve(el); }
    });
  } else {
    cats.forEach(reveal);
  }

  /* ---------- category tabs: sliding ink + scroll-spy ---------- */
  var track = document.getElementById('tabsTrack');
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
    var menu = document.getElementById('menu');
    var menuTop = menu ? menu.getBoundingClientRect().top : 0;
    /* before the first section reaches the bar, keep the first tab lit */
    setActive(current || (cats[0] && cats[0].id), false);
    return menuTop;
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      /* highlight right away instead of waiting for the scroll to land */
      setActive(t.getAttribute('data-target'), false);
    });
  });

  window.addEventListener('resize', function () {
    var cur = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0];
    if (cur) moveInk(cur);
  });

  /* ---------- scroll handler (one rAF-throttled listener) ---------- */
  var hero = document.getElementById('top');
  var oliveEls = Array.prototype.slice.call(document.querySelectorAll('.hero .olive'));
  var ticking = false;
  var heroH = hero ? hero.offsetHeight : 0;

  function onScroll() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (!reduceMotion && y < heroH + 200) {
      var py = Math.round(y * -0.12);
      oliveEls.forEach(function (el) { el.style.setProperty('--py', py + 'px'); });
    }
    spy();
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });

  window.addEventListener('resize', function () {
    heroH = hero ? hero.offsetHeight : 0;
  });

  /* pause the looping hero animations while the hero is off-screen */
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      hero.classList.toggle('is-offscreen', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(hero);
  }

  /* initial state */
  spy();
  var first = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0];
  if (first) { setActive(first.getAttribute('data-target'), true); }
  /* fonts change tab widths after load: re-measure the ink once everything is in */
  window.addEventListener('load', function () {
    setHeadHeight();
    var cur = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0];
    if (cur) moveInk(cur);
  });
})();
