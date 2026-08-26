document.getElementById('year').textContent = new Date().getFullYear();

// Scroll-in reveal for the menu card and a gentle stagger across its rows.
// Progressive enhancement: the hidden/offset styles in style.css only apply
// once ".js-anim" is on <body>, so content stays fully visible if JS
// doesn't run at all.
if ('IntersectionObserver' in window) {
  document.body.classList.add('js-anim');

  const blocks = document.querySelectorAll('.anim-block');
  blocks.forEach(block => {
    block.querySelectorAll('.anim-item').forEach((item, i) => {
      item.style.setProperty('--anim-delay', (i * 35) + 'ms');
    });
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  blocks.forEach(block => revealObserver.observe(block));
}
