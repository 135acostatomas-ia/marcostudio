// ============================================
// MARCO STUDIO — Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- MOBILE MENU ----------
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');
      body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });

    // Cerrar menu al click en link
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        body.style.overflow = '';
      });
    });
  }

  // ---------- SCROLL REVEAL ----------
  const reveals = document.querySelectorAll('.reveal');

  // Cada elemento entra desde el lado del viewport donde está ubicado
  // (izquierda o derecha), para que converjan hacia el centro al hacer scroll.
  const viewportCenter = window.innerWidth / 2;
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    const elCenter = rect.left + rect.width / 2;
    el.classList.add(elCenter < viewportCenter ? 'reveal--from-left' : 'reveal--from-right');
  });

  // Un elemento se anima recién cuando ya asomó una buena parte de la pantalla
  // (no cuando apenas se ve el borde): así la animación se aprecia mientras se hace scroll.
  // Los que entran juntos (grillas en escritorio) salen escalonados; en celular, al ser
  // una columna, cada tarjeta entra sola y sin demora.
  const show = (el, i) => {
    if (el.classList.contains('is-visible')) return;
    const delay = i * 0.1;
    el.style.transitionDelay = `${delay}s`;
    el.classList.add('is-visible');
    observer.unobserve(el);
    // Al terminar la entrada se quita el retraso y la tarjeta vuelve a su transición
    // de hover (si no, todos sus hover responderían con demora).
    setTimeout(() => {
      el.style.transitionDelay = '';
      el.classList.add('reveal-done');
    }, delay * 1000 + 1000);
  };

  const observer = new IntersectionObserver((entries) => {
    let i = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) show(entry.target, i++);
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px -22% 0px'
  });

  // Al llegar al final de la página, lo que haya quedado sin animar entra igual
  // (el último bloque puede no llegar a subir hasta la zona de disparo).
  window.addEventListener('scroll', () => {
    if (!revealsStarted) return;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      let i = 0;
      reveals.forEach(el => { if (!el.classList.contains('is-visible')) show(el, i++); });
    }
  }, { passive: true });

  // ---------- PRESENTACIÓN DE INICIO ----------
  // Mientras corre la presentación (css/home.css) se bloquea el scroll y las
  // animaciones de entrada del hero esperan a que termine.
  const intro = document.getElementById('intro');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealsStarted = false;

  const startReveals = () => {
    if (revealsStarted) return;
    revealsStarted = true;
    reveals.forEach(el => observer.observe(el));
  };

  const root = document.documentElement;
  if (intro && root.classList.contains('is-intro')) {
    let playing = false;
    let finished = false;

    const finishIntro = () => {
      if (finished) return;
      finished = true;
      root.classList.remove('is-intro');
      startReveals();
    };

    // Arranca la línea de tiempo recién cuando el logo ya está cargado
    // (en celulares con conexión lenta, si no, la intro pasaría sin verse).
    const play = () => {
      if (playing) return;
      playing = true;
      root.classList.add('is-playing');
      setTimeout(finishIntro, 5000); // seguro por si la animación no corre
    };

    intro.addEventListener('animationend', (e) => {
      if (e.animationName === 'introOut') finishIntro();
    });

    const logo = intro.querySelector('.intro__logo');
    if (!logo || (logo.complete && logo.naturalWidth)) {
      play();
    } else {
      logo.addEventListener('load', play, { once: true });
      logo.addEventListener('error', play, { once: true });
      setTimeout(play, 2500); // no esperar más que esto
    }
  } else {
    startReveals();
  }

  // ---------- MARCA DE FONDO DEL HERO ----------
  // El logo arranca 100% opaco y fijo detrás de la web. Con el scroll se va volviendo
  // traslúcido de a poco y, al llegar a "Lo que hacemos", baja y se desvanece del todo.
  const heroMark = document.getElementById('hero-mark');
  if (heroMark) {
    const servicesHead = document.querySelector('#servicios .home-head');
    const FLOOR = 0.3;          // opacidad a la que llega antes de empezar a desaparecer
    let softEnd = window.innerHeight * 0.6;   // scroll hasta el que se vuelve traslúcido
    let fadeLen = window.innerHeight;         // scroll que tarda en desaparecer

    const measure = () => {
      const vh = window.innerHeight;
      if (servicesHead) {
        const top = servicesHead.getBoundingClientRect().top + window.scrollY;
        softEnd = Math.max(vh * 0.35, top - vh * 0.6);   // cuando "Lo que hacemos" asoma
      } else {
        softEnd = vh * 0.6;
      }
      fadeLen = vh * 0.9;
    };

    let ticking = false;
    const updateHeroMark = () => {
      const y = window.scrollY;
      let opacity, d = 0;
      if (y < softEnd) {
        opacity = 1 - (1 - FLOOR) * (y / softEnd);             // 1 -> FLOOR, parejo con el scroll
      } else {
        d = y - softEnd;
        opacity = FLOOR * (1 - Math.min(d / fadeLen, 1));      // FLOOR -> 0
      }
      heroMark.style.opacity = opacity.toFixed(3);
      heroMark.style.transform = reduceMotion || d <= 0 ? '' : `translate3d(0, ${(d * 0.35).toFixed(1)}px, 0)`;
      heroMark.style.visibility = opacity <= 0.001 ? 'hidden' : 'visible';
      ticking = false;
    };

    const refresh = () => { measure(); updateHeroMark(); };
    window.addEventListener('resize', refresh);
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateHeroMark);
      }
    }, { passive: true });
    refresh();
  }

  // ---------- FAQ ACCORDION ----------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('is-active');
        // Cerrar todos
        faqItems.forEach(i => i.classList.remove('is-active'));
        // Abrir el clickeado si no estaba activo
        if (!isActive) {
          item.classList.add('is-active');
        }
      });
    }
  });

  // ---------- TARJETAS DE SERVICIOS 3D ----------
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canTilt) {
    const FOLLOW = 'transform 0.12s ease-out, background-size 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.4s ease';
    const SETTLE = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-size 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.4s ease';

    document.querySelectorAll('.service-card').forEach(card => {
      let frame = 0, ex = 0, ey = 0;

      const tilt = () => {
        frame = 0;
        if (card.classList.contains('is-active')) return;   // la tarjeta abierta no se inclina
        const r = card.getBoundingClientRect();
        const x = (ex - r.left) / r.width - 0.5;
        const y = (ey - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) translateY(-6px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
      };

      card.addEventListener('mouseenter', () => { if (!card.classList.contains('is-active')) card.style.transition = FOLLOW; });
      card.addEventListener('mousemove', (e) => {
        ex = e.clientX; ey = e.clientY;
        if (!frame) frame = requestAnimationFrame(tilt);   // una vez por cuadro
      });
      card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(frame); frame = 0;
        card.style.transition = SETTLE;
        card.style.transform = '';
      });
    });
  }

  // ---------- TARJETAS DE SERVICIOS: "pintado" al tocar ----------
  // En pantallas táctiles no hay :hover, así que se pinta al apoyar el dedo.
  document.querySelectorAll('.service-card').forEach(card => {
    let startX = 0, startY = 0, releaseTimer = null;

    const paint = () => {
      clearTimeout(releaseTimer);
      card.classList.add('is-touched');
    };
    const release = (delay = 0) => {
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(() => card.classList.remove('is-touched'), delay);
    };

    card.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      paint();
    }, { passive: true });

    // Si el dedo se desliza (scroll), se suelta el pintado
    card.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (Math.abs(t.clientX - startX) > 10 || Math.abs(t.clientY - startY) > 10) release();
    }, { passive: true });

    card.addEventListener('touchend', () => release(450), { passive: true });
    card.addEventListener('touchcancel', () => release(), { passive: true });
  });


  // ---------- SERVICIOS: se abren en la misma página ----------
  // Clic en una tarjeta → las otras desaparecen, la elegida va al centro y se
  // despliega hacia abajo con la info del servicio. Sin cambiar de página.
  (() => {
    const grid = document.querySelector('.services-grid');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.service-card')];
    const head = document.querySelector('#servicios .home-head');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const PHASE_OUT = 240;
    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    let active = null, busy = false;

    const trigger = (c) => c.querySelector('.service-card__trigger');
    const detail = (c) => c.querySelector('.service-card__detail');

    const setState = (card, on) => {
      card.classList.toggle('is-active', on);
      trigger(card).setAttribute('aria-expanded', String(on));
      detail(card).inert = !on;
    };

    // Las tarjetas pueden estar sin "revelar" si se entra por un enlace con #
    const forceVisible = () => cards.forEach(c => c.classList.add('is-visible', 'reveal-done'));

    const scrollToY = (y, smooth) => window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'instant' });
    const cardTop = (c) => c.getBoundingClientRect().top + window.scrollY;

    async function open(card, opts = {}) {
      if (busy || card === active) return;
      busy = true;
      forceVisible();
      const animate = !reduce.matches && !opts.instant;
      const prev = active;
      const first = card.getBoundingClientRect();
      const others = cards.filter(c => c !== card);

      // 1) Las demás se apartan; la elegida "se levanta"
      let held = [];
      if (animate) {
        held = others.map(c => c.animate(
          [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(18px) scale(0.96)' }],
          { duration: PHASE_OUT, easing: 'ease-in', fill: 'forwards' }));
        if (!prev) held.push(card.animate(
          [{ transform: 'none' }, { transform: 'translateY(-8px) scale(1.02)' }],
          { duration: PHASE_OUT, easing: 'ease-out', fill: 'forwards' }));
        await wait(PHASE_OUT);
      }

      // 2) Cambio de layout (la tarjeta pasa al frente, ocupa todo el ancho)
      card.style.transform = ''; card.style.transition = '';
      grid.style.setProperty('--card-w', Math.round(first.width) + 'px');
      grid.classList.add('has-active');
      if (prev) setState(prev, false);
      setState(card, true);
      active = card;
      held.forEach(a => a.cancel());
      const next = card.getBoundingClientRect();

      // 3) Scroll para que el panel quede a la vista
      const targetY = cardTop(card) - 104;
      const inside = first.left >= next.left - 1 && first.right <= next.right + 1 &&
                     first.top >= next.top - 1 && first.bottom <= next.bottom + 1;
      if (opts.instant) scrollToY(targetY, false);
      else if (inside && animate) scrollToY(targetY, true);
      else scrollToY(targetY, false);

      // 4) Entrada coreografiada
      if (animate) {
        const main = card.querySelector('.service-card__main');
        if (inside) {
          // la tarjeta viaja desde su lugar hasta el centro
          main.animate(
            [{ transform: `translate(${first.left - next.left}px, ${first.top - next.top}px)` }, { transform: 'none' }],
            { duration: 820, easing: EASE, fill: 'backwards' });
        } else {
          card.animate(
            [{ opacity: 0, transform: 'translateY(36px) scale(0.97)' }, { opacity: 1, transform: 'none' }],
            { duration: 700, easing: EASE, fill: 'backwards' });
        }
        // la información se despliega hacia abajo y hacia los costados, desde la tarjeta
        detail(card).animate(
          [{ clipPath: 'inset(0 50% 100% 50%)' }, { clipPath: 'inset(0 0 0 0)' }],
          { duration: 900, delay: 220, easing: EASE, fill: 'backwards' });
        others.forEach((c, i) => c.animate(
          [{ opacity: 0, transform: 'translateY(34px) scale(0.96)' }, { opacity: 1, transform: 'none' }],
          { duration: 700, delay: 380 + i * 90, easing: EASE, fill: 'backwards' }));
      }

      history.replaceState(null, '', '#' + card.id);
      if (opts.focus) detail(card).querySelector('.detail__close')?.focus({ preventScroll: true });
      await wait(animate ? 900 : 0);
      busy = false;
    }

    async function close(opts = {}) {
      if (busy || !active) return;
      busy = true;
      const card = active;
      const animate = !reduce.matches && !opts.instant;

      let held = [];
      if (animate) {
        held = [card, ...cards.filter(c => c !== card)].map(c => c.animate(
          [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(14px) scale(0.985)' }],
          { duration: PHASE_OUT, easing: 'ease-in', fill: 'forwards' }));
        await wait(PHASE_OUT);
      }

      setState(card, false);
      grid.classList.remove('has-active');
      active = null;
      held.forEach(a => a.cancel());
      const headTop = head ? cardTop(head) - 100 : cardTop(grid) - 140;
      if (window.scrollY > headTop + 40 || cardTop(grid) - window.scrollY > window.innerHeight * 0.6) scrollToY(headTop, false);

      if (animate) {
        cards.forEach((c, i) => c.animate(
          [{ opacity: 0, transform: 'translateY(30px) scale(0.97)' }, { opacity: 1, transform: 'none' }],
          { duration: 700, delay: i * 80, easing: EASE, fill: 'backwards' }));
      }
      history.replaceState(null, '', '#servicios');
      if (opts.focus) trigger(card).focus({ preventScroll: true });
      await wait(animate ? 700 : 0);
      busy = false;
    }

    cards.forEach(card => {
      trigger(card).addEventListener('click', (e) => {
        if (card === active) close({ focus: e.detail === 0 });
        else open(card, { focus: e.detail === 0 });
      });
      detail(card).querySelector('.detail__close').addEventListener('click', (e) => close({ focus: e.detail === 0 }));
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && active) close({ focus: true }); });

    // Enlaces del menú / footer / trabajos: #servicio-xxx abre la tarjeta en la misma página
    const byHash = (hash) => cards.find(c => '#' + c.id === hash);
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#servicio-"]');
      if (!a) return;
      const card = byHash(a.getAttribute('href'));
      if (!card) return;
      e.preventDefault();
      if (card === active) { scrollToY(cardTop(card) - 104, true); return; }
      if (!active) scrollToY(cardTop(grid) - 140, true);
      setTimeout(() => open(card), active ? 0 : 350);
    });

    // Entrada directa con #servicio-xxx (ej. viejos enlaces a las páginas)
    const initial = byHash(location.hash);
    if (initial) open(initial, { instant: true });
  })();

  // ---------- MODALIDADES (+) ----------
  document.querySelectorAll('.plan__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.closest('.plan');
      const open = !plan.classList.contains('is-open');
      document.querySelectorAll('.plan').forEach(p => {
        p.classList.remove('is-open');
        p.querySelector('.plan__toggle')?.setAttribute('aria-expanded', 'false');
      });
      if (open) {
        plan.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------- HEADER SCROLL ----------
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (header) {
      if (currentScroll > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    lastScroll = currentScroll;
  });

  // ---------- FORM HANDLING (placeholder) ----------
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Aquí integrar con el servicio real (Formspree, Mailchimp, etc.)
      alert('Gracias por tu consulta. Te responderemos en menos de 24hs.');
      contactForm.reset();
    });
  }

  // ---------- CURRENT YEAR ----------
  const yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
