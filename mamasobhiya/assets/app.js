(function () {
  var secs = [].slice.call(document.querySelectorAll('.sec'));
  var tabs = [].slice.call(document.querySelectorAll('.tabs a'));
  var bar = document.querySelector('.tabs-in');

  // reveal on scroll
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }) : null;
  secs.forEach(function (s) { if (io) io.observe(s); else s.classList.add('in'); });

  if (!tabs.length) return;

  // scroll-spy for the tab bar
  function setOn(id) {
    tabs.forEach(function (a) {
      var on = a.getAttribute('data-t') === id;
      a.classList.toggle('on', on);
      if (on && bar) {
        var l = a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2;
        try { bar.scrollTo({ left: l, behavior: 'smooth' }); } catch (e) { bar.scrollLeft = l; }
      }
    });
  }
  var lock = 0;
  function spy() {
    if (Date.now() < lock) return;
    var y = window.innerHeight * 0.32, cur = secs[0].id;
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= y) cur = s.id; });
    setOn(cur);
  }
  window.addEventListener('scroll', spy, { passive: true });
  tabs.forEach(function (a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      var id = a.getAttribute('data-t'), t = document.getElementById(id);
      lock = Date.now() + 900; setOn(id);
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });
  spy();
})();
