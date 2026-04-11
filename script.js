/**
 * Zorgeloos Autotransport — Main JavaScript
 * Handles: Navigation, Scroll effects, FAQ, Form, Animations
 * Multi-page compatible
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Header Scroll Effect ───
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  if (header) {
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  }

  // ─── Mobile Navigation ───
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav when clicking a link (for same-page anchor links)
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── Smooth Scroll for Same-Page Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // skip plain # links
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── FAQ Accordion ───
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all FAQ items
        faqItems.forEach(faq => {
          faq.classList.remove('active');
        });

        // Open clicked item if it wasn't already open
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // ─── Scroll Reveal Animations ───
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // ─── Counter Animation (only on homepage) ───
  const counterElements = document.querySelectorAll('.hero-stat-number');
  let countersAnimated = false;

  if (counterElements.length > 0) {
    function animateCounters() {
      if (countersAnimated) return;
      
      const heroSection = document.querySelector('.hero');
      if (!heroSection) return;
      
      const rect = heroSection.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      countersAnimated = true;
      
      counterElements.forEach(counter => {
        const text = counter.textContent;
        const match = text.match(/\d+/);
        if (!match) return;
        
        const target = parseInt(match[0]);
        const suffix = text.replace(match[0], '');
        let current = 0;
        const increment = target / 60;
        const duration = 2000;
        const stepTime = duration / 60;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          const accentMatch = counter.querySelector('.accent');
          if (accentMatch) {
            const accentText = accentMatch.textContent;
            counter.innerHTML = `${Math.floor(current)}<span class="accent">${accentText}</span>`;
          }
        }, stepTime);
      });
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters(); // Run on load too
  }

  // ─── Cookie Banner ───
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
      cookieBanner.style.display = 'block';
    }, 2000);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      if (cookieBanner) cookieBanner.style.display = 'none';
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'false');
      if (cookieBanner) cookieBanner.style.display = 'none';
    });
  }

  // ─── Parallax Effect on Hero (homepage only) ───
  const heroImage = document.querySelector('.hero .hero-bg img');
  
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }

  console.log('🚗 Zorgeloos Autotransport — Website geladen');
});

// ─── Form Submit Handler (global) ───
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector('#form-submit-btn');
  if (!submitBtn) return;
  
  const originalText = submitBtn.innerHTML;

  // Show loading state
  submitBtn.innerHTML = `
    <svg class="btn-icon" style="animation: spin 1s linear infinite; transform: none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
    Verzenden...
  `;
  submitBtn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    submitBtn.innerHTML = `
      <svg class="btn-icon" style="transform: none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Verzonden! Wij nemen contact op.
    `;
    submitBtn.style.background = 'var(--green-700)';
    
    // Reset after 4 seconds
    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 4000);
  }, 1500);
}

// Add spin animation for loading
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
