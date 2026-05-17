/* ============================================================
   Lev Stepanov — site.js
   ============================================================ */

/* ---------- Scroll reveal ---------- */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.js-reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.querySelectorAll('.js-reveal:not(.visible)')]
        : [];
      const delay = Math.max(0, siblings.indexOf(entry.target)) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.js-reveal').forEach(el => obs.observe(el));
}

/* ---------- Nav hide-on-scroll-down + light theme past hero ---------- */
function initNavScroll() {
  const nav = document.querySelector('.nav_component');
  if (!nav) return;
  const hero = document.querySelector('.hero');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Hide/show
    if (y > lastY && y > 80) {
      nav.classList.add('nav_component--hidden');
    } else {
      nav.classList.remove('nav_component--hidden');
    }

    // Light theme when past hero
    const heroH = hero ? hero.offsetHeight : window.innerHeight;
    if (y > heroH - 80) {
      nav.classList.add('nav_component--scrolled');
    } else {
      nav.classList.remove('nav_component--scrolled');
    }

    lastY = y;
  }, { passive: true });
}

/* ============================================================
   TYPEWRITER — 3 phases across 3 video loops

   Phase 0 (video loop 1): reset all → type nav + title (stays)
   Phase 1 (video loop 2): type description (stays)
   Phase 2 (video loop 3): type CTA buttons (stays)
   Phase 0 again: reset + retype
   ============================================================ */

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function typeInto(el, msPerChar) {
  const text = el.dataset.tw || '';
  el.textContent = '';

  const cur = document.createElement('span');
  cur.className = 'tw-cursor';
  el.appendChild(cur);

  return new Promise(resolve => {
    if (!text.length) { cur.remove(); resolve(); return; }
    let i = 0;
    function step() {
      if (i >= text.length) {
        cur.classList.add('tw-done');
        setTimeout(() => { if (cur.parentNode) cur.remove(); resolve(); }, 420);
        return;
      }
      cur.insertAdjacentText('beforebegin', text[i++]);
      setTimeout(step, msPerChar);
    }
    step();
  });
}

function clearAll() {
  document.querySelectorAll('.tw-el').forEach(el => {
    el.querySelectorAll('.tw-cursor').forEach(c => c.remove());
    el.textContent = '';
  });
}

/* Phase 0: nav + title  (~3800ms total, fits in 4s loop) */
async function phase0() {
  clearAll();

  const navEls = [...document.querySelectorAll('.tw-nav')];
  const name1  = document.querySelector('.tw-name-1');
  const name2  = document.querySelector('.tw-name-2');

  // Nav links all at once (longest = "Связаться" 9 ch × 38ms = 342ms)
  await Promise.all(navEls.map(el => typeInto(el, 38)));
  await wait(60);

  // Title: ЛЕВ (3 ch × 130ms = 390ms) → СТЕПАНОВ (8 ch × 90ms = 720ms)
  if (name1) await typeInto(name1, 130);
  await wait(50);
  if (name2) await typeInto(name2, 90);
  // ~1620ms — stays for remainder of 4s loop
}

/* Phase 1: description (~2080ms, fits in 4s loop) */
async function phase1() {
  const descEl = document.querySelector('.tw-desc');
  // "Сайты, реклама и GEO‑аудит по всей России удалённо." = 52 ch × 40ms = 2080ms
  if (descEl) await typeInto(descEl, 40);
}

/* Phase 2: CTA buttons (~360ms, then stays until loop end) */
async function phase2() {
  const ctaEls = [...document.querySelectorAll('.tw-cta')];
  // All buttons type simultaneously (longest "+7 (906) 110-90-00" = 18 ch × 20ms = 360ms)
  await Promise.all(ctaEls.map(el => typeInto(el, 20)));
}

const PHASES = [phase0, phase1, phase2];

function initTypewriter() {
  const video = document.querySelector('.hero-video');
  let twPhase = 0;
  let running = false;

  async function runNextPhase() {
    if (running) return;
    running = true;
    await PHASES[twPhase]();
    twPhase = (twPhase + 1) % PHASES.length;
    running = false;
  }

  let started = false;
  function start() {
    if (started) return;
    started = true;
    if (video) video.play().catch(() => {});
    runNextPhase();
    setInterval(runNextPhase, 4000);
  }

  if (!video) { start(); return; }

  if (video.readyState >= 3) start();
  else video.addEventListener('canplay', start, { once: true });
  setTimeout(start, 900);
}

/* ---------- Services carousel ---------- */
function initServicesCarousel() {
  document.querySelectorAll('.services_carousel-wrap').forEach(wrap => {
    const track = wrap.querySelector('.services_carousel-track');
    if (!track) return;
    const btns = wrap.querySelectorAll('.services_carousel-btn');
    const cardW = () => (track.querySelector('.service_card')?.offsetWidth || 300) + 14;

    function updateBtns() {
      btns.forEach(btn => {
        const dir = Number(btn.dataset.dir);
        if (dir < 0) btn.disabled = track.scrollLeft <= 4;
        else btn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
      });
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        track.scrollBy({ left: Number(btn.dataset.dir) * cardW(), behavior: 'smooth' });
      });
    });

    track.addEventListener('scroll', updateBtns, { passive: true });
    updateBtns();
  });
}

/* ---------- Hero parallax ---------- */
function initParallax() {
  const video = document.querySelector('.hero-video');
  const hero  = document.querySelector('.hero');
  if (!video || !hero) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > hero.offsetHeight) return;
    // Video moves at 30% of scroll speed — creates depth
    video.style.transform = `translateY(${scrollY * 0.3}px)`;
  }, { passive: true });
}

/* ---------- Preloader ---------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  let hidden = false;
  function hide() {
    if (hidden) return;
    hidden = true;
    preloader.classList.add('is-hidden');
    setTimeout(() => preloader.remove(), 700);
  }

  if (document.readyState === 'complete') {
    setTimeout(hide, 200);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 200));
  }
  setTimeout(hide, 5000); // safety fallback
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTypewriter();
  initReveal();
  initNavScroll();
  initParallax();
  initServicesCarousel();
});
