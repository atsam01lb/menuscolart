(function () {
  'use strict';
  try { if (sessionStorage.getItem('mallah_splash')) document.documentElement.classList.add('no-splash'); sessionStorage.setItem('mallah_splash', '1'); } catch (e) {}
  var D = window.MALLAH, grid = document.getElementById('branchGrid');
  var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();
  if (!D || !grid) return;
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 5l-7 7 7 7"/></svg>';
  grid.innerHTML = D.branches.map(function (b, i) {
    return '<a class="branch-card" href="' + b.slug + '/" style="--i:' + i + '">' +
      '<div class="ph"><span class="branch-card__num">' + (i + 1) + '</span>' +
      '<img class="ph__logo" src="assets/logo.png" alt="" loading="lazy" decoding="async">' +
      '<img class="ph__real" src="assets/branches/' + b.slug + '.jpg" alt="' + b.en + '" loading="lazy" decoding="async" onerror="this.remove()"></div>' +
      '<div class="branch-card__body"><div class="branch-card__names"><h3 class="branch-card__ar">' + b.ar + '</h3>' +
      '<p class="branch-card__en" dir="ltr">' + b.en + '</p></div><span class="branch-card__go">' + ARROW + '</span></div></a>';
  }).join('');
})();
