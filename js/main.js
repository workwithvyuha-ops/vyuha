/* ==========================================================================
   VYUHA CREATION - GLOBAL INTERACTION JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollObserver();
  initVideoModals();
  initWhatsAppPreFill();
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
