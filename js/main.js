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
  // El logo queda fijo detrás de la web. Recién cuando se llega a "Lo que hacemos"
  // empieza a bajar y a desvanecerse, hasta desaparecer.
  const heroMark = document.getElementById('hero-mark');
  if (heroMark) {
    const servicesHead = document.querySelector('#servicios .home-head');
    let fadeStart = window.innerHeight;
    let fadeLen = window.innerHeight;

    const measure = () => {
      const vh = window.innerHeight;
      if (servicesHead) {
        const top = servicesHead.getBoundingClientRect().top + window.scrollY;
        fadeStart = Math.max(vh * 0.5, top - vh * 0.8);  // cuando el título empieza a asomar
      } else {
        fadeStart = vh;
      }
      fadeLen = vh * 0.9;
    };

    let ticking = false;
    const updateHeroMark = () => {
      const d = window.scrollY - fadeStart;
      const p = Math.min(Math.max(d / fadeLen, 0), 1);
      heroMark.style.opacity = String(1 - p);
      heroMark.style.transform = reduceMotion || d <= 0 ? '' : `translate3d(0, ${(d * 0.35).toFixed(1)}px, 0)`;
      heroMark.style.visibility = p >= 1 ? 'hidden' : 'visible';
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
        const r = card.getBoundingClientRect();
        const x = (ex - r.left) / r.width - 0.5;
        const y = (ey - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) translateY(-6px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
      };

      card.addEventListener('mouseenter', () => { card.style.transition = FOLLOW; });
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
