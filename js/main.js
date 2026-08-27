/* ==========================================================================
   VYUHA CREATION - GLOBAL INTERACTION JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollObserver();
  initVideoModals();
  initWhatsAppPreFill();
  initGlobalFocusWidget();
  initHeroViewfinder();
});

/**
 * Navbar background transform on scroll
 */
function initNavbar() {
  const header = document.querySelector('header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  // Trigger on load in case page is refreshed half-scrolled
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/**
 * Mobile Hamburger Menu Overlay Toggle
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  
  if (!hamburger || !mobileNav) return;
  
  const toggleMenu = () => {
    const isActive = mobileNav.classList.toggle('active');
    
    // Transform Hamburger bars to 'X'
    const spans = hamburger.querySelectorAll('span');
    if (isActive) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  };
  
  hamburger.addEventListener('click', toggleMenu);
  
  // Close menu when clicking links
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Intersection Observer for scroll-triggered fades and slide-ins
 */
function initScrollObserver() {
  const elementsToReveal = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);
  
  elementsToReveal.forEach(el => {
    observer.observe(el);
  });
}

/**
 * Fullscreen Cinematic Video Modal Player
 */
function initVideoModals() {
  const playButtons = document.querySelectorAll('.play-btn-trigger');
  
  if (playButtons.length === 0) return;
  
  // Create video modal container dynamically
  const modal = document.createElement('div');
  modal.className = 'lightbox';
  modal.id = 'video-modal';
  modal.innerHTML = `
    <div class="lightbox-content" style="width: 80%; max-width: 900px; aspect-ratio: 16/9;">
      <button class="lightbox-close" style="top: -45px;">&times;</button>
      <iframe class="video-iframe" src="" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="width:100%; height:100%; border-radius: 8px;"></iframe>
    </div>
  `;
  document.body.appendChild(modal);
  
  const iframe = modal.querySelector('.video-iframe');
  const closeBtn = modal.querySelector('.lightbox-close');
  
  playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoUrl = btn.getAttribute('data-video-url');
      if (!videoUrl) return;
      
      // Auto-play configurations for Youtube/Vimeo
      let embedUrl = videoUrl;
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = videoUrl.match(regExp);
        if (match && match[2].length === 11) {
          embedUrl = `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
        }
      } else if (videoUrl.includes('vimeo.com')) {
        const id = videoUrl.split('/').pop();
        embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1`;
      }
      
      iframe.setAttribute('src', embedUrl);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  const closeModal = () => {
    modal.classList.remove('active');
    iframe.setAttribute('src', '');
    document.body.style.overflow = '';
  };
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/**
 * WhatsApp message pre-fill for dynamic query categories
 */
function initWhatsAppPreFill() {
  const whatsappTriggers = document.querySelectorAll('.whatsapp-booking-btn');
  
  whatsappTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceType = btn.getAttribute('data-service') || 'Photography & Cinematic services';
      const nameField = document.getElementById('name');
      const name = nameField ? nameField.value.trim() : '';
      
      let baseMsg = `Hello Vyuha Creation, I am interested in booking your "${serviceType}" service.`;
      if (name) {
        baseMsg = `Hello Vyuha Creation, my name is ${name}. I am highly interested in booking your "${serviceType}" service. Could you please share details?`;
      }
      
      const whatsappUrl = `https://wa.me/919640050176?text=${encodeURIComponent(baseMsg)}`;
      btn.setAttribute('href', whatsappUrl);
    });
  });
}

/**
 * Handle Preloader Dismissal on Page Fully Loaded
 */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.remove(); // Remove loader from page flow
    }, 600);
  }
});

/**
 * Dynamic setup of Global Floating Focus Adjuster dial/slider
 */
function initGlobalFocusWidget() {
  const widget = document.createElement('div');
  widget.className = 'floating-focus-adjuster';
  widget.innerHTML = `
    <div class="adjuster-panel">
      <div class="focus-dial-label">
        <span><i class="fa-solid fa-sliders"></i> LENS BLUR</span>
      </div>
      <input type="range" id="global-focus-slider" min="0" max="100" value="100" class="focus-slider">
      <div class="focus-dial-markers">
        <span>0.28m</span>
        <span>∞</span>
      </div>
    </div>
    <button class="adjuster-btn" aria-label="Adjust Page Focus" title="Lens Manual Focus">
      <i class="fa-solid fa-camera"></i>
    </button>
  `;
  document.body.appendChild(widget);

  const btn = widget.querySelector('.adjuster-btn');
  const panel = widget.querySelector('.adjuster-panel');
  const slider = widget.querySelector('#global-focus-slider');

  // Toggle active styling
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    widget.classList.toggle('active');
  });

  panel.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid triggering document clicks
  });

  document.addEventListener('click', () => {
    widget.classList.remove('active');
  });

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    // Blur ranges from 0px (at 100%) to 12px (at 0%)
    const blurPx = ((100 - val) / 100) * 12;
    document.documentElement.style.setProperty('--focus-blur', `${blurPx}px`);
  });
}

/**
 * Homepage Hero Viewfinder & Manual Focus interaction
 */
function initHeroViewfinder() {
  const slider = document.getElementById('focus-slider');
  const bg = document.querySelector('.hero-bg');
  const hudCenter = document.querySelector('.hud-center');
  const indicatorVal = document.querySelector('.focus-indicator-val');
  const afBtn = document.getElementById('autofocus-btn');

  if (!slider || !bg) return;

  let hasBeeped = false;

  function playFocusBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playBeep = (time, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200, time);
        gain.gain.setValueAtTime(0.03, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };

      const now = audioCtx.currentTime;
      playBeep(now, 0.08);
      playBeep(now + 0.12, 0.08); // Camera dual lock beep
    } catch (e) {
      console.log('Audio focus locked beep failed', e);
    }
  }

  function updateFocus(val, isAuto = false) {
    // Slider value is 0 to 100.
    // Blur ranges from 15px (at 0%) to 0px (at 100%)
    const blurPx = ((100 - val) / 100) * 15;
    bg.style.setProperty('--focus-blur', `${blurPx}px`);

    // Lock updates
    if (val >= 98) {
      hudCenter.classList.add('focus-locked');
      indicatorVal.textContent = 'AF-S [ • ]';
      if (!hasBeeped && !isAuto) {
        playFocusBeep();
        hasBeeped = true;
      }
    } else {
      hudCenter.classList.remove('focus-locked');
      const distance = (0.28 + (val / 100) * 10).toFixed(2);
      indicatorVal.textContent = `MF [${distance}m]`;
      hasBeeped = false;
    }
  }

  slider.addEventListener('input', (e) => {
    afBtn.classList.remove('active');
    updateFocus(parseInt(e.target.value));
  });

  afBtn.addEventListener('click', () => {
    afBtn.classList.add('active');
    slider.value = 100;
    updateFocus(100, true);
    playFocusBeep();
  });

  // Start blurry to invite interaction
  updateFocus(parseInt(slider.value));
}
