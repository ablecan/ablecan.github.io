import './styles.css';

/**
 * Progressive enhancement only: the page is complete static HTML.
 * Reveals sections with a subtle fade as they scroll into view,
 * unless the visitor prefers reduced motion.
 */
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (!reduceMotion.matches && 'IntersectionObserver' in window && targets.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  root.classList.add('reveal-ready');
  targets.forEach((el) => observer.observe(el));
}
