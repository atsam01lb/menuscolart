document.getElementById('year').textContent = new Date().getFullYear();

// Highlight the active category in the top nav while scrolling
const sections = document.querySelectorAll('.menu-section[id]');
const navLinks = document.querySelectorAll('.topbar__nav a');

if ('IntersectionObserver' in window && sections.length) {
  const map = new Map();
  navLinks.forEach(a => map.set(a.getAttribute('href').slice(1), a));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = map.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.style.color = '');
        navLinks.forEach(a => a.style.borderColor = 'transparent');
        link.style.color = '#e3c793';
        link.style.borderColor = '#e3c793';
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

// Scroll-in reveal for each menu block (photo + list) and a gentle
// price-row stagger inside it. Progressive enhancement: the hidden/
// offset styles in style.css only apply once ".js-anim" is on <body>,
// so content stays fully visible if JS doesn't run at all.
if ('IntersectionObserver' in window) {
  document.body.classList.add('js-anim');

  const blocks = document.querySelectorAll('.anim-block');
  blocks.forEach(block => {
    block.querySelectorAll('.anim-item').forEach((item, i) => {
      item.style.setProperty('--anim-delay', (i * 70) + 'ms');
    });
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  blocks.forEach(block => revealObserver.observe(block));
}
