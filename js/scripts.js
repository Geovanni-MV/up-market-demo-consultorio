document.addEventListener('DOMContentLoaded', () => {

  /* -------- AOS -------- */
  if (window.AOS) AOS.init({ duration: 650, once: true, offset: 60 });
  /* -------- Back to top -------- */
  const toTopBtn = document.getElementById('toTop');
  function toggleBackToTop(){
    toTopBtn.classList.toggle('is-visible', window.scrollY > 500);
  }
  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* -------- Sticky nav shadow -------- */
  const nav = document.getElementById('siteNav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
    toggleBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------- Mobile menu -------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* -------- Scrollspy -------- */
  const sections = ['servicios', 'nosotros', 'testimonios', 'contacto-reservar-cita']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navAnchors = document.querySelectorAll('[data-nav]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));


  /* -------- Counter animation (+500 pacientes) -------- */
  const counterEl = document.querySelector('.counter');
  if (counterEl) {
    const target = parseInt(counterEl.dataset.target, 10) || 0;
    let started = false;
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          const duration = 1200;
          const start = performance.now();
          function tick(now){
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counterEl.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    counterObserver.observe(counterEl);
  }

  /* -------- Testimonial carousel -------- */
  if (window.Swiper) {
    new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {
        720: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  /* -------- Appointment form validation -------- */
  const form = document.getElementById('appointmentForm');
  const successBox = document.getElementById('formSuccess');
  if (form) {
    const validators = {
      name: (v) => v.trim().length >= 2,
      phone: (v) => /^[0-9()+\-\s]{7,15}$/.test(v.trim()),
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    };

    function setFieldState(fieldName, valid) {
      const field = form.querySelector(`[data-field="${fieldName}"]`);
      if (field) field.classList.toggle('has-error', !valid);
    }

    Object.keys(validators).forEach(name => {
      const input = form.elements[name];
      if (!input) return;
      input.addEventListener('input', () => setFieldState(name, validators[name](input.value)));
      input.addEventListener('blur', () => setFieldState(name, validators[name](input.value)));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successBox.classList.remove('is-visible');
      let allValid = true;
      Object.keys(validators).forEach(name => {
        const input = form.elements[name];
        const valid = input ? validators[name](input.value) : true;
        setFieldState(name, valid);
        if (!valid) allValid = false;
      });
      if (!allValid) {
        const firstError = form.querySelector('.has-error');
        if (firstError) firstError.querySelector('input,select').focus();
        return;
      }
      // No backend wired up yet — replace this block with a real fetch()/API call.
      successBox.classList.add('is-visible');
      form.reset();
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

});