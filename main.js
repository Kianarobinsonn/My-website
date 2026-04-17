const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const revealElements = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const readStoredTheme = () => {
  try {
    return localStorage.getItem('theme');
  } catch (error) {
    return null;
  }
};
const writeStoredTheme = (theme) => {
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    // Ignore storage failures and continue using the in-memory theme.
  }
};

const getPreferredTheme = () => {
  const savedTheme = readStoredTheme();
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  return themeMediaQuery.matches ? 'dark' : 'light';
};

const applyTheme = (theme, persist = false) => {
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;

  if (themeMeta) {
    themeMeta.setAttribute('content', theme === 'dark' ? '#161311' : '#FAF8F5');
  }

  if (persist) {
    writeStoredTheme(theme);
  }

  if (themeToggle) {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    themeToggle.setAttribute('title', `Switch to ${nextTheme} mode`);
  }
};

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });
}

themeMediaQuery.addEventListener('change', (event) => {
  if (readStoredTheme()) return;
  applyTheme(event.matches ? 'dark' : 'light');
});

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
}
