/* ========================================
   APPIFY — Landing Page
   JavaScript Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Initialize EmailJS ---
  emailjs.init('UFcqwZcNawQ_Amo0D');

  // --- 1. Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. Mobile Nav Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // --- 3. Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- 4. Scroll-Triggered Animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-right, .fade-in-left').forEach(el => observer.observe(el));

  // --- 5. Portfolio Accordion ---
  const accordion = document.getElementById('portfolioAccordion');
  const toggleAllBtn = document.getElementById('toggleAllBtn');

  if (accordion) {
    accordion.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const category = header.closest('.accordion-category');
        category.classList.toggle('open');
        updateToggleAllButton();
      });
    });

    if (toggleAllBtn) {
      toggleAllBtn.addEventListener('click', () => {
        const categories = accordion.querySelectorAll('.accordion-category');
        const allOpen = Array.from(categories).every(c => c.classList.contains('open'));
        categories.forEach(c => {
          if (allOpen) c.classList.remove('open');
          else c.classList.add('open');
        });
        updateToggleAllButton();
      });
    }
  }

  function updateToggleAllButton() {
    if (!toggleAllBtn || !accordion) return;
    const categories = accordion.querySelectorAll('.accordion-category');
    const allOpen = Array.from(categories).every(c => c.classList.contains('open'));
    toggleAllBtn.innerHTML = allOpen
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="18 15 12 9 6 15"/></svg> Collapse All'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg> Expand All';
  }

  // --- 6. Contact Form Handler (EmailJS) ---
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit .btn');
      const originalText = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0110 10"/></svg>
        Sending...
      `;
      submitBtn.disabled = true;

      // Collect form data — all field values sent via template
      const templateParams = {
        from_name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        from_email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || 'Not provided',
        message: document.getElementById('message').value || 'No message provided',
        to_email: 'contact@appifyapps.com'
      };

      // Send via EmailJS
      emailjs.send('service_qbrbi42', 'template_4ir4lio', templateParams)
        .then(() => {
          submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Message Sent Successfully!
          `;
          submitBtn.style.background = '#10B981';
          submitBtn.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.style.boxShadow = '';
            contactForm.reset();
          }, 4000);
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
            Failed to send. Try again.
          `;
          submitBtn.style.background = '#EF4444';
          submitBtn.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.style.boxShadow = '';
          }, 3000);
        });
    });
  }

  // --- 7. Add spin animation dynamically ---
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);

});
