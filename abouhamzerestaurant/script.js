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
        link.style.color = '#e6bb1f';
        link.style.borderColor = '#e6bb1f';
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}
