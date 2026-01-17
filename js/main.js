/**
 * ERV Teknikk Mandal AS - Main JavaScript
 * Professional electrician website functionality
 */

(function() {
  'use strict';

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav__toggle');
  const navList = document.querySelector('.nav__list');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const cookieConsent = document.getElementById('cookie-consent');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const faqItems = document.querySelectorAll('.faq-item');
  const projectFilters = document.querySelectorAll('.project-filter');
  const projectCards = document.querySelectorAll('.project-card');

  // ==========================================================================
  // Mobile Navigation
  // ==========================================================================

  function initMobileNav() {
    if (!navToggle || !navList) return;

    navToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('nav__toggle--active');
      navList.classList.toggle('nav__list--open');

      // Prevent body scroll when menu is open
      document.body.classList.toggle('nav-open', !isExpanded);
    });

    // Close menu when clicking on a link
    navList.querySelectorAll('.nav__link').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('nav__toggle--active');
        navList.classList.remove('nav__list--open');
        document.body.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav') && navList.classList.contains('nav__list--open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('nav__toggle--active');
        navList.classList.remove('nav__list--open');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // ==========================================================================
  // Header Scroll Behavior
  // ==========================================================================

  function initHeaderScroll() {
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      // Add scrolled class for styling
      if (currentScroll > scrollThreshold) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      // Hide/show header on scroll direction
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ==========================================================================
  // Scroll to Top Button
  // ==========================================================================

  function initScrollTop() {
    if (!scrollTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('scroll-top--visible');
      } else {
        scrollTopBtn.classList.remove('scroll-top--visible');
      }
    }, { passive: true });

    // Scroll to top on click
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // Cookie Consent
  // ==========================================================================

  function initCookieConsent() {
    if (!cookieConsent) return;

    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('erv-cookie-consent');

    if (!cookieChoice) {
      // Show consent banner after a short delay
      setTimeout(function() {
        cookieConsent.classList.add('cookie-consent--visible');
      }, 1500);
    }

    // Handle accept
    if (cookieAccept) {
      cookieAccept.addEventListener('click', function() {
        localStorage.setItem('erv-cookie-consent', 'accepted');
        cookieConsent.classList.remove('cookie-consent--visible');
        // Initialize analytics here if needed
      });
    }

    // Handle decline
    if (cookieDecline) {
      cookieDecline.addEventListener('click', function() {
        localStorage.setItem('erv-cookie-consent', 'declined');
        cookieConsent.classList.remove('cookie-consent--visible');
      });
    }
  }

  // ==========================================================================
  // Contact Form
  // ==========================================================================

  function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Check honeypot field (spam protection)
      const honeypot = contactForm.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) {
        // Likely a bot, silently fail
        return;
      }

      // Basic validation
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const phone = contactForm.querySelector('#phone');
      const service = contactForm.querySelector('#service');
      const message = contactForm.querySelector('#message');
      const privacy = contactForm.querySelector('#privacy');

      let isValid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-field--error').forEach(function(field) {
        field.classList.remove('form-field--error');
      });

      // Validate required fields
      if (!name.value.trim()) {
        name.closest('.form-field').classList.add('form-field--error');
        isValid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        email.closest('.form-field').classList.add('form-field--error');
        isValid = false;
      }

      if (!phone.value.trim() || !isValidPhone(phone.value)) {
        phone.closest('.form-field').classList.add('form-field--error');
        isValid = false;
      }

      if (!service.value) {
        service.closest('.form-field').classList.add('form-field--error');
        isValid = false;
      }

      if (!message.value.trim()) {
        message.closest('.form-field').classList.add('form-field--error');
        isValid = false;
      }

      if (!privacy.checked) {
        privacy.closest('.form-field').classList.add('form-field--error');
        isValid = false;
      }

      if (!isValid) {
        // Scroll to first error
        const firstError = contactForm.querySelector('.form-field--error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Simulate form submission (replace with actual endpoint)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Sender...';

      // Simulate API call
      setTimeout(function() {
        // Hide form, show success message
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Reset form for future submissions
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });

    // Real-time validation feedback
    contactForm.querySelectorAll('input, textarea, select').forEach(function(input) {
      input.addEventListener('blur', function() {
        validateField(this);
      });

      input.addEventListener('input', function() {
        // Remove error state when user starts typing
        this.closest('.form-field').classList.remove('form-field--error');
      });
    });
  }

  function validateField(field) {
    const fieldWrapper = field.closest('.form-field');
    if (!fieldWrapper) return;

    let isValid = true;

    if (field.required && !field.value.trim()) {
      isValid = false;
    }

    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
      isValid = false;
    }

    if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
      isValid = false;
    }

    if (!isValid) {
      fieldWrapper.classList.add('form-field--error');
    } else {
      fieldWrapper.classList.remove('form-field--error');
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    // Norwegian phone number validation (8 digits, with optional +47 or 0047)
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(\+47|0047)?[2-9]\d{7}$/.test(cleaned);
  }

  // ==========================================================================
  // FAQ Accordion
  // ==========================================================================

  function initFAQ() {
    if (!faqItems.length) return;

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-item__question');
      const answer = item.querySelector('.faq-item__answer');

      if (!question || !answer) return;

      question.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Close all other items
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item) {
            const otherQuestion = otherItem.querySelector('.faq-item__question');
            const otherAnswer = otherItem.querySelector('.faq-item__answer');
            if (otherQuestion && otherAnswer) {
              otherQuestion.setAttribute('aria-expanded', 'false');
              otherItem.classList.remove('faq-item--open');
              otherAnswer.style.maxHeight = null;
            }
          }
        });

        // Toggle current item
        this.setAttribute('aria-expanded', !isExpanded);
        item.classList.toggle('faq-item--open', !isExpanded);

        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = null;
        }
      });
    });
  }

  // ==========================================================================
  // Project Filtering
  // ==========================================================================

  function initProjectFilters() {
    if (!projectFilters.length || !projectCards.length) return;

    projectFilters.forEach(function(filter) {
      filter.addEventListener('click', function() {
        const filterValue = this.dataset.filter;

        // Update active filter
        projectFilters.forEach(function(f) {
          f.classList.remove('project-filter--active');
        });
        this.classList.add('project-filter--active');

        // Filter projects
        projectCards.forEach(function(card) {
          const categories = card.dataset.category.split(' ');

          if (filterValue === 'alle' || categories.includes(filterValue)) {
            card.style.display = '';
            // Add animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(function() {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without triggering scroll
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // ==========================================================================
  // Intersection Observer for Animations
  // ==========================================================================

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.service-card, .feature-card, .value-card, .certification-card, .team-card, .project-card, .testimonial-card'
    );

    if (!animatedElements.length) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(function(element) {
      element.classList.add('animate-ready');
      observer.observe(element);
    });
  }

  // ==========================================================================
  // Service Tabs (if present)
  // ==========================================================================

  function initServiceTabs() {
    const tabButtons = document.querySelectorAll('.services-tabs__btn');
    const tabPanels = document.querySelectorAll('.services-tabs__panel');

    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const targetTab = this.dataset.tab;

        // Update button states
        tabButtons.forEach(function(btn) {
          btn.classList.remove('services-tabs__btn--active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('services-tabs__btn--active');
        this.setAttribute('aria-selected', 'true');

        // Update panel visibility
        tabPanels.forEach(function(panel) {
          if (panel.id === targetTab) {
            panel.hidden = false;
            panel.classList.add('services-tabs__panel--active');
          } else {
            panel.hidden = true;
            panel.classList.remove('services-tabs__panel--active');
          }
        });
      });
    });
  }

  // ==========================================================================
  // Lazy Loading Images
  // ==========================================================================

  function initLazyLoad() {
    // Native lazy loading is used in HTML, but add fallback for older browsers
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback for browsers without native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if (!lazyImages.length) return;

    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.removeAttribute('loading');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ==========================================================================
  // Phone Number Formatting
  // ==========================================================================

  function initPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(function(input) {
      input.addEventListener('input', function() {
        // Remove non-numeric characters except + at the start
        let value = this.value.replace(/[^\d+]/g, '');

        // Keep + only at the start
        if (value.indexOf('+') > 0) {
          value = value.replace(/\+/g, '');
        }

        // Format Norwegian numbers
        if (value.startsWith('+47') || value.startsWith('47')) {
          const cleaned = value.replace(/^\+?47/, '');
          if (cleaned.length > 0) {
            // Format: XXX XX XXX
            let formatted = cleaned.slice(0, 3);
            if (cleaned.length > 3) formatted += ' ' + cleaned.slice(3, 5);
            if (cleaned.length > 5) formatted += ' ' + cleaned.slice(5, 8);
            value = '+47 ' + formatted;
          }
        }

        this.value = value;
      });
    });
  }

  // ==========================================================================
  // Initialize Everything
  // ==========================================================================

  function init() {
    initMobileNav();
    initHeaderScroll();
    initScrollTop();
    initCookieConsent();
    initContactForm();
    initFAQ();
    initProjectFilters();
    initSmoothScroll();
    initScrollAnimations();
    initServiceTabs();
    initLazyLoad();
    initPhoneFormatting();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
