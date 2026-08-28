/* ==========================================================================
   NATAN PAINT - MAIN INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
  // --- 1. Mobile Hamburger Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  // --- 2. Interactive Product Filtering (Products Page) ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.products-grid .product-card');

  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active state from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active state to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        productCards.forEach(card => {
          const category = card.getAttribute('data-category');

          if (filterValue === 'all' || filterValue === category) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 3. Contact Form Validation ---
  const contactForm = document.getElementById('natanContactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!fullName || !email || !phone || !message) {
        showFeedback('Please fill in all required fields.', 'error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
      }

      showFeedback('Thank you! Your message has been sent successfully. We will get back to you shortly.', 'success');
      contactForm.reset();
    });
  }

  function showFeedback(msg, type) {
    if (!formFeedback) return;
    formFeedback.textContent = msg;
    formFeedback.style.display = 'block';
    formFeedback.style.padding = '1rem';
    formFeedback.style.borderRadius = '8px';
    formFeedback.style.marginBottom = '1.5rem';

    if (type === 'error') {
      formFeedback.style.backgroundColor = '#fee2e2';
      formFeedback.style.color = '#991b1b';
      formFeedback.style.border = '1px solid #f87171';
    } else {
      formFeedback.style.backgroundColor = '#dcfce7';
      formFeedback.style.color = '#166534';
      formFeedback.style.border = '1px solid #4ade80';
    }
  }
});