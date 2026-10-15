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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

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

  if (intro && !reduceMotion) {
    const root = document.documentElement;
    root.classList.add('is-intro');
    const finishIntro = () => {
      root.classList.remove('is-intro');
      startReveals();
    };
    intro.addEventListener('animationend', (e) => {
      if (e.animationName === 'introOut') finishIntro();
    });
    setTimeout(finishIntro, 4200); // seguro por si la animación no corre
  } else {
    startReveals();
  }

  // ---------- MARCA DE FONDO DEL HERO ----------
  // Baja con el scroll y se desvanece hasta desaparecer.
  const heroMark = document.getElementById('hero-mark');
  if (heroMark) {
    let ticking = false;
    const updateHeroMark = () => {
      const y = window.scrollY;
      const p = Math.min(y / (window.innerHeight * 0.6), 1);
      heroMark.style.opacity = String(1 - p);
      heroMark.style.transform = reduceMotion ? '' : `translate3d(0, ${(y * 0.45).toFixed(1)}px, 0)`;
      heroMark.style.visibility = p >= 1 ? 'hidden' : 'visible';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateHeroMark);
      }
    }, { passive: true });
    updateHeroMark();
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
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform 0.12s ease-out, background-size 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.4s ease';
        card.style.transform = `perspective(1000px) translateY(-6px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-size 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.4s ease';
        card.style.transform = '';
      });
    });
  }

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
