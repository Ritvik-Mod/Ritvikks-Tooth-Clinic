/* =========================================================
   main.js — Ritvikk's Tooth Clinic
   Nav, smooth scroll, reveals, FAQ, ambient parallax
   ========================================================= */

(function () {
  'use strict';

  /* ---------------- NAV ---------------- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const toggle = nav.querySelector('.site-nav__toggle');
    toggle?.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
      document.body.style.overflow = !open ? 'hidden' : '';
    });

    // dropdowns (hover desktop, click mobile)
    // Uses a close-delay so the cursor can cross the gap between toggle and menu
    // without losing the dropdown. Hovering the menu itself also keeps it open.
    nav.querySelectorAll('.site-nav__dropdown').forEach(d => {
      const btn = d.querySelector('.site-nav__dropdown-toggle');
      const menu = d.querySelector('.site-nav__dropdown-menu');
      let closeTimer = null;
      const cancelClose = () => { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } };
      const open = (v) => { cancelClose(); d.setAttribute('data-open', String(v)); };
      const scheduleClose = () => { cancelClose(); closeTimer = setTimeout(() => open(false), 200); };

      btn?.addEventListener('click', e => {
        e.preventDefault();
        open(d.getAttribute('data-open') !== 'true');
      });
      // Whole dropdown (toggle area)
      d.addEventListener('mouseenter', () => open(true));
      d.addEventListener('mouseleave', scheduleClose);
      // Menu itself — keeps dropdown open while cursor is over the menu,
      // even though the menu is absolutely positioned outside the toggle's bbox.
      menu?.addEventListener('mouseenter', cancelClose);
      menu?.addEventListener('mouseleave', scheduleClose);
    });

    // scroll state
    let lastScroll = 0;
    const onScroll = () => {
      if (nav.getAttribute('data-open') === 'true') return;
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 24);
      lastScroll = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Auto-detect "is-dark" based on current section
    const darkSections = document.querySelectorAll('[data-nav-dark]');
    if (darkSections.length) {
      const ob = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          // when a dark section crosses the top of the viewport
          if (e.boundingClientRect.top < 80 && e.boundingClientRect.bottom > 80) {
            nav.classList.add('is-dark');
          }
        });
        // separately: if no dark section is currently at top, remove
        let anyDark = false;
        darkSections.forEach(sec => {
          const r = sec.getBoundingClientRect();
          if (r.top < 80 && r.bottom > 80) anyDark = true;
        });
        nav.classList.toggle('is-dark', anyDark);
      }, { threshold: [0, 0.01, 0.99, 1], rootMargin: '0px' });
      darkSections.forEach(s => ob.observe(s));
      // also recheck on scroll for reliability
      window.addEventListener('scroll', () => {
        let anyDark = false;
        darkSections.forEach(sec => {
          const r = sec.getBoundingClientRect();
          if (r.top < 80 && r.bottom > 80) anyDark = true;
        });
        nav.classList.toggle('is-dark', anyDark);
      }, { passive: true });
    }
  }

  /* ---------------- FAQ ---------------- */
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__question');
    q?.addEventListener('click', () => {
      const open = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', String(!open));
    });
  });

  /* ---------------- WhatsApp links ---------------- */
  const WA_NUMBER = '919016071487';
  document.querySelectorAll('[data-whatsapp]').forEach(a => {
    const ctx = a.getAttribute('data-whatsapp-context') || "Hi, I'd like to know more.";
    a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(ctx)}`;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------------- Year ---------------- */
  const yEl = document.getElementById('footer-year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-mask]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => io.observe(el));

  // Stagger nested mask reveals (split-line style)
  document.querySelectorAll('[data-reveal-stagger]').forEach(group => {
    const items = group.querySelectorAll('[data-reveal], [data-reveal-mask]');
    items.forEach((el, i) => el.style.setProperty('--reveal-delay', `${i * 90}ms`));
  });

  /* ---------------- Ambient floating objects ---------------- */
  const ambient = document.querySelectorAll('.ambient');
  if (ambient.length) {
    let mouseX = 0, mouseY = 0;
    let scrollY = window.scrollY;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    });
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    // turn on after a beat
    setTimeout(() => ambient.forEach(a => a.classList.add('is-on')), 250);

    const raf = () => {
      ambient.forEach(el => {
        const depth = parseFloat(el.dataset.depth || '0.4');
        const baseRot = parseFloat(el.dataset.rot || '0');
        const sx = parseFloat(el.dataset.x || '0') * depth * 30;
        const sy = parseFloat(el.dataset.y || '0') * depth * 30;
        const py = -scrollY * depth * 0.25;
        const rot = baseRot + scrollY * 0.02 * depth;
        el.style.transform = `translate3d(${mouseX * depth * 40 + sx}px, ${mouseY * depth * 40 + sy + py}px, 0) rotate(${rot}deg)`;
      });
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  /* ---------------- Hero parallax for scene ---------------- */
  const heroScene = document.querySelector('.hero__scene');
  if (heroScene) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroScene.style.transform = `translateY(${y * 0.18}px)`;
      }
    }, { passive: true });
  }

  /* ---------------- Contact form → WhatsApp ---------------- */
  const formBtn = document.getElementById('form-submit-btn');
  if (formBtn) {
    formBtn.addEventListener('click', () => {
      const form = document.getElementById('appointment-form');
      if (!form) return;
      const name    = (form.querySelector('#name')?.value || '').trim();
      const phone   = (form.querySelector('#phone')?.value || '').trim();
      const reason  = (form.querySelector('#reason')?.value || '').trim();
      const time    = (form.querySelector('#preferred_time')?.value || '').trim();
      const notes   = (form.querySelector('#notes')?.value || '').trim();

      if (!name || !phone) {
        alert('Please enter your name and phone number.');
        return;
      }

      let msg = `Hi, I'd like to book an appointment.\n\nName: ${name}\nPhone: ${phone}`;
      if (reason) msg += `\nReason: ${reason}`;
      if (time)   msg += `\nPreferred time: ${time}`;
      if (notes)  msg += `\nNotes: ${notes}`;

      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }

})();
