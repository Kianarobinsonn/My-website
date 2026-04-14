const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

let maxScrollDepth = 0;

window.addEventListener('scroll', () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const depth = scrollHeight > 0 ? Math.round((window.scrollY / scrollHeight) * 100) : 100;

  if (depth >= maxScrollDepth + 25 || (depth === 100 && maxScrollDepth < 100)) {
    maxScrollDepth = depth;
    console.log('Scroll depth:', `${Math.min(depth, 100)}%`);
  }
}, { passive: true });

document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    console.log('Link click:', link.getAttribute('href'));
  });
});
