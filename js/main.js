/**
 * Oaklyn Interiors - Modern 2027 Interactive Experience
 * Pure Vanilla JavaScript (ES6+) with zero unnecessary bloat
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Sticky Header & Glassmorphism on Scroll ---
  const header = document.querySelector('.main-header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 2. Mobile Offcanvas / Navigation Close on Anchor Click ---
  const navLinks = document.querySelectorAll('.nav-link-custom, .mobile-nav-link');
  const offcanvasElement = document.getElementById('mobileNavOffcanvas');
  let bsOffcanvas = null;

  if (offcanvasElement && typeof bootstrap !== 'undefined') {
    bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
          e.preventDefault();
          if (bsOffcanvas && offcanvasElement.classList.contains('show')) {
            bsOffcanvas.hide();
          }
          const headerHeight = header ? header.offsetHeight : 70;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- 3. Scroll Reveal Animations (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // --- 4. Animated Number Counters ---
  const counterElements = document.querySelectorAll('.counter-value');
  let countersAnimated = false;

  const animateCounters = () => {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const counterSection = document.querySelector('.bento-metrics-section');
  if (counterSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.25 });

    counterObserver.observe(counterSection);
  }

  // --- 5. Interactive Portfolio Gallery Filter ---
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-wrap');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 6. Lightbox Modal Gallery ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  let activeGalleryItems = [];

  const updateActiveGalleryList = () => {
    activeGalleryItems = Array.from(document.querySelectorAll('.gallery-item-wrap'))
      .filter(item => item.style.display !== 'none');
  };

  const openLightbox = (index) => {
    updateActiveGalleryList();
    if (activeGalleryItems.length === 0) return;

    currentGalleryIndex = (index + activeGalleryItems.length) % activeGalleryItems.length;
    const currentItem = activeGalleryItems[currentGalleryIndex];
    const trigger = currentItem.querySelector('.gallery-item');

    const src = trigger.getAttribute('data-image') || trigger.querySelector('img').src;
    const title = trigger.getAttribute('data-title') || '';
    const desc = trigger.getAttribute('data-desc') || '';
    const category = trigger.getAttribute('data-category-label') || '';

    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.innerHTML = `<strong>${title}</strong> — ${desc}`;
    if (lightboxCategory) lightboxCategory.textContent = category;

    if (lightboxModal) {
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Add click events to gallery items
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      updateActiveGalleryList();
      const parentWrap = item.closest('.gallery-item-wrap');
      const index = activeGalleryItems.indexOf(parentWrap);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => openLightbox(currentGalleryIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => openLightbox(currentGalleryIndex + 1));

  // Close on backdrop click
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop-click')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentGalleryIndex + 1);
  });

  // --- 7. Interactive Interior Cost Estimator ---
  const typeButtons = document.querySelectorAll('.estimator-type-btn');
  const gradeButtons = document.querySelectorAll('.estimator-grade-btn');
  const sqftInput = document.getElementById('estimatorSqft');
  const sqftDisplay = document.getElementById('estimatorSqftDisplay');
  const priceDisplay = document.getElementById('estimatorPriceDisplay');
  const timelineDisplay = document.getElementById('estimatorTimelineDisplay');
  const whatsappEstimateBtn = document.getElementById('whatsappEstimateBtn');

  // Base rates per sq ft in INR according to grade
  const rates = {
    standard: 1350,   // Premium Classic (BWP Plywood, Merino/Century laminate, Hettich soft-close)
    luxury: 1850,     // Luxury Contemporary (HDHMR/PU Gloss, Hafele hardware, profile lighting, fluted glass)
    bespoke: 2650     // Ultra-Bespoke Architectural (Natural Teak/Walnut veneers, Blum Legrabox, ceramic slabs, custom brass)
  };

  const propertyDefaults = {
    '2bhk': { sqft: 1050, weeks: '4-5 Weeks', name: '2 BHK Luxury Apartment' },
    '3bhk': { sqft: 1650, weeks: '5-6 Weeks', name: '3 BHK Contemporary Residence' },
    '4bhk': { sqft: 2800, weeks: '7-9 Weeks', name: '4 BHK / Luxury Kerala Villa' },
    'kitchen': { sqft: 180, weeks: '3-4 Weeks', name: 'Designer Modular Kitchen Only' },
    'wardrobe': { sqft: 240, weeks: '2-3 Weeks', name: 'Master Bedroom & Wardrobe Suite' },
    'office': { sqft: 2200, weeks: '6-8 Weeks', name: 'Full-Floor Corporate Office Fit-out' }
  };

  let selectedType = '3bhk';
  let selectedGrade = 'luxury';

  const calculateEstimate = () => {
    const sqft = parseInt(sqftInput ? sqftInput.value : 1650, 10);
    if (sqftDisplay) sqftDisplay.textContent = `${sqft.toLocaleString()} sq.ft`;

    const rate = rates[selectedGrade] || rates.luxury;
    const basePrice = sqft * rate;

    // Formatting in Indian currency (Lakhs / Crores)
    let formattedPrice = '';
    if (basePrice >= 10000000) {
      formattedPrice = `₹ ${(basePrice / 10000000).toFixed(2)} Cr`;
    } else if (basePrice >= 100000) {
      formattedPrice = `₹ ${(basePrice / 100000).toFixed(2)} Lakhs`;
    } else {
      formattedPrice = `₹ ${basePrice.toLocaleString('en-IN')}`;
    }

    if (priceDisplay) {
      priceDisplay.textContent = formattedPrice;
    }

    const currentProp = propertyDefaults[selectedType] || propertyDefaults['3bhk'];
    if (timelineDisplay) {
      timelineDisplay.textContent = currentProp.weeks;
    }

    // Dynamic WhatsApp button link
    if (whatsappEstimateBtn) {
      const gradeNames = {
        standard: 'Premium Classic',
        luxury: 'Luxury Contemporary',
        bespoke: 'Ultra-Bespoke Architectural'
      };
      const text = encodeURIComponent(
        `Hello Oaklyn Interiors! I used your online estimator for my project:\n` +
        `• Space: ${currentProp.name}\n` +
        `• Area: ~${sqft} sq.ft\n` +
        `• Finish Grade: ${gradeNames[selectedGrade]}\n` +
        `• Estimated Budget: ${formattedPrice}\n\n` +
        `Could you please share a detailed consultation and sample material catalog?`
      );
      whatsappEstimateBtn.href = `https://wa.me/919249536373?text=${text}`;
    }
  };

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedType = btn.getAttribute('data-type');
      if (propertyDefaults[selectedType] && sqftInput) {
        sqftInput.value = propertyDefaults[selectedType].sqft;
      }
      calculateEstimate();
    });
  });

  gradeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      gradeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGrade = btn.getAttribute('data-grade');
      calculateEstimate();
    });
  });

  if (sqftInput) {
    sqftInput.addEventListener('input', calculateEstimate);
  }

  calculateEstimate();

  // --- 8. Contact & Consultation Form Handling ---
  const contactForm = document.getElementById('consultationForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Enquiry';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Transmitting Enquiry...`;
      }

      // Simulate prompt server response
      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        if (formSuccessAlert) {
          formSuccessAlert.classList.remove('d-none');
          formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            formSuccessAlert.classList.add('d-none');
          }, 8000);
        }
      }, 1200);
    });
  }

  // --- 9. Dynamic Current Year in Footer ---
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
