/* ============ EDIT THESE ============ */
const CONFIG = {
  availability: "Open to Opportunities",              // hero badge text
  email:        "mobongjubola@example.com",             // used for the mailto link
  emailSubject: "Hello Jamaldeen",
  github:       "https://github.com/your-username",
  linkedin:     "https://www.linkedin.com/in/your-profile",
  x:            "",                                   // leave empty to hide the X link
  choplyLive:   "#", choplyCode:   "#",               // replace "#" with real URLs
  doctorsLive:  "#", doctorsCode:  "#"
};
/* ==================================== */

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function applyConfig() {
  $$('[data-config]').forEach(el => { el.textContent = CONFIG[el.dataset.config]; });
  $$('[data-link]').forEach(el => {
    const key = el.dataset.link;
    if (key === 'email') {
      el.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(CONFIG.emailSubject)}`;
    } else if (!CONFIG[key]) {
      el.hidden = true; el.style.display = 'none';
      el.closest('li')?.setAttribute('hidden', '');
    } else {
      el.href = CONFIG[key];
      if (CONFIG[key] === '#') { el.removeAttribute('target'); }
    }
  });
  $('#year').textContent = new Date().getFullYear();
}

function initMenu() {
  const burger = $('#burger'), links = $('#links');
  const set = open => {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => set(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => e.key === 'Escape' && set(false));
}

function initScroll() {
  const nav = $('#nav'), bar = $('#progress');
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    nav.classList.toggle('scrolled', scrollY > 20);
  };
  addEventListener('scroll', update, { passive: true });
  update();
  $('#top').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
}

function initActiveLinks() {
  const map = new Map($$('.links a[href^="#"]:not(.btn)').map(a => [a.getAttribute('href').slice(1), a]));
  const set = id => map.forEach((a, k) => {
    a.classList.toggle('active', k === id);
    k === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
  });
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && set(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => io.observe(s));
  addEventListener('scroll', () => {
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) set('contact');
  }, { passive: true });
}

function initEffects() {
  const hero = $('#home'), vis = $('.hero-vis'), links = $('#links'), burger = $('#burger');
  new IntersectionObserver(([e]) => hero.classList.toggle('paused', !e.isIntersecting)).observe(hero);
  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    let raf;
    hero.addEventListener('pointermove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        vis.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(3));
        vis.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(3));
      });
    });
    $$('.proj').forEach(c => c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--x', e.clientX - r.left + 'px');
      c.style.setProperty('--y', e.clientY - r.top + 'px');
    }));
  }
  const close = () => { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); };
  addEventListener('resize', () => innerWidth > 820 && close());
  document.addEventListener('click', e => !e.target.closest('#nav') && close());
}

function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyConfig(); initMenu(); initScroll(); initActiveLinks(); initReveal(); initEffects();
});