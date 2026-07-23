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

  reveals.forEach(el => observer.observe(el));

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
