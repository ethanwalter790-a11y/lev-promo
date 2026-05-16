/* ============================================================
   Lev Stepanov — site.js
   ============================================================ */

/* ---------- Words pull-up (hero title) ---------- */
function initPullUp() {
  document.querySelectorAll('[data-pullup]').forEach(el => {
    const delay = parseInt(el.dataset.pullupDelay || '0', 10);
    const word = el.querySelector('.pullup-word');
    if (!word) return;
    setTimeout(() => {
      word.classList.add('in');
    }, delay);
  });
}

/* ---------- Cycling skill badge ---------- */
const SKILLS = [
  'Webflow · Taptop · Разработка',
  'Яндекс Директ · 5+ лет',
  'GEO-аудит · SEO',
  'Выхожу на связь быстро',
];

function initSkillCycle() {
  const badge = document.querySelector('[data-skill-badge]');
  if (!badge) return;
  let i = 0;

  function tick() {
    badge.classList.add('fade');
    setTimeout(() => {
      i = (i + 1) % SKILLS.length;
      badge.textContent = SKILLS[i];
      badge.classList.remove('fade');
    }, 350);
  }

  setInterval(tick, 3000);
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.js-reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('.js-reveal:not(.visible)')]
          : [];
        const staggerIdx = siblings.indexOf(entry.target);
        const delay = staggerIdx >= 0 ? staggerIdx * 80 : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.js-reveal').forEach(el => obs.observe(el));
}

/* ---------- Nav scroll shrink ---------- */
function initNavScroll() {
  const nav = document.querySelector('.hero-nav-inner');
  if (!nav) return;
  let scrolled = false;
  window.addEventListener('scroll', () => {
    const now = window.scrollY > 20;
    if (now !== scrolled) {
      scrolled = now;
      nav.style.background = scrolled
        ? 'rgba(12,12,12,0.95)'
        : 'rgba(12,12,12,0.85)';
    }
  }, { passive: true });
}

/* ---------- Avatar fade-in ---------- */
function initAvatar() {
  const av = document.querySelector('.js-avatar');
  if (!av) return;
  setTimeout(() => av.classList.add('in'), 80);
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initAvatar();
  initPullUp();
  initSkillCycle();
  initReveal();
  initNavScroll();
});
