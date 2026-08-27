/* ==========================================================================
   NATAN PAINT - MASTER SCRIPT (UI & VERCEL INTEGRATION)
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

  // --- 2. Interactive Product & Color Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterableCards = document.querySelectorAll('[data-category]');

  if (filterBtns.length > 0 && filterableCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        filterableCards.forEach(card => {
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

  // --- 3. FAQ Accordion Toggle ---
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const accordionItem = header.parentElement;
      const accordionContent = accordionItem.querySelector('.accordion-content');

      // Close other open items
      document.querySelectorAll('.accordion-item').forEach(item => {
        if (item !== accordionItem) {
          item.classList.remove('active');
          const content = item.querySelector('.accordion-content');
          if (content) content.style.maxHeight = null;
        }
      });

      // Toggle current item
      accordionItem.classList.toggle('active');

      if (accordionItem.classList.contains('active')) {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      } else {
        accordionContent.style.maxHeight = null;
      }
    });
  });

  // --- 4. Paint Coverage Calculator ---
  const calcBtn = document.getElementById('calcBtn');
  const calcResultBox = document.getElementById('calcResult');
  const resultText = document.getElementById('resultText');

  if (calcBtn && calcResultBox && resultText) {
    calcBtn.addEventListener('click', () => {
      const length = parseFloat(document.getElementById('roomLength')?.value) || 0;
      const height = parseFloat(document.getElementById('wallHeight')?.value) || 0;
      const coats = parseInt(document.getElementById('coatCount')?.value) || 2;

      if (length <= 0 || height <= 0) {
        alert('Please enter valid positive numbers for wall dimensions.');
        return;
      }

      const totalArea = length * height;
      const coveragePerLiter = 10; // Standard coverage (10 m²/L)
      const litersNeeded = ((totalArea / coveragePerLiter) * coats).toFixed(1);
      const bucketsNeeded = Math.ceil(litersNeeded / 20);

      resultText.innerHTML = `${litersNeeded} Liters <span style="font-size: 1rem; font-weight: 400; color: #555;">(Approx. ${bucketsNeeded} x 20L Bucket${bucketsNeeded > 1 ? 's' : ''})</span>`;
      calcResultBox.style.display = 'block';
    });
  }

  // --- 5. Contact Form Submission (Vercel Serverless Function Endpoint) ---
  const contactForm = document.getElementById('natanContactForm') || document.querySelector('#contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Extract input values safely across potential ID name variations
      const fullName = (document.getElementById('fullName') || document.getElementById('name'))?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const serviceType = document.getElementById('serviceType')?.value || 'General Inquiry';
      const message = document.getElementById('message')?.value.trim();

      // Basic Client Validation
      if (!fullName || !email || !message) {
        showFeedback('Please fill in all required fields.', 'error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
      }

      // Indicate loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerText : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
      }

      try {
        // Relative API route for Vercel Serverless Function
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName,
            email: email,
            phone: phone,
            serviceType: serviceType,
            message: message
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showFeedback('Thank you! Your inquiry has been sent.', 'success');
          contactForm.reset();
        } else {
          showFeedback(data.error || 'Server processing error. Please try again.', 'error');
        }
      } catch (err) {
        console.error('Submission Error:', err);
        showFeedback('Could not reach backend service. Please try again later.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      }
    });
  }

  // Helper feedback display
  function showFeedback(msg, type) {
    if (formFeedback) {
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
    } else {
      alert(msg);
    }
  }

});