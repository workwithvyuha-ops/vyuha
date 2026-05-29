/* ==========================================================================
   VYUHA CREATION - MASONRY GALLERY FILTER & LIGHTBOX JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
});

function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (galleryItems.length === 0) return;
  
  // Custom Lightbox Elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-nav lightbox-prev">&lsaquo;</button>
    <div class="lightbox-content">
      <button class="lightbox-close">&times;</button>
      <img class="lightbox-image" src="" alt="Cinematic portfolio showcase">
    </div>
    <button class="lightbox-nav lightbox-next">&rsaquo;</button>
  `;
  document.body.appendChild(lightbox);
  
  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  let currentVisibleItems = Array.from(galleryItems);
  let currentIndex = 0;
  
  // Category Filtering Action
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      currentVisibleItems = [];
      
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // Subtle fade in scale animation
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
          currentVisibleItems.push(item);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // Open Lightbox
  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    const overlay = item.querySelector('.item-overlay');
    
    const openTrigger = overlay ? overlay : img;
    
    if (openTrigger) {
      openTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Find visible image's index in the filtered collection
        const clickedItem = img.closest('.gallery-item');
        currentIndex = currentVisibleItems.indexOf(clickedItem);
        
        if (currentIndex !== -1) {
          updateLightboxContent();
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    }
  });
  
  function updateLightboxContent() {
    if (currentIndex < 0 || currentIndex >= currentVisibleItems.length) return;
    
    const targetItem = currentVisibleItems[currentIndex];
    const imgEl = targetItem.querySelector('img');
    const highResSrc = targetItem.getAttribute('data-highres') || imgEl.getAttribute('src');
    const imgAlt = imgEl.getAttribute('alt') || 'Vyuha Creation Cinematic Shot';
    
    // Add visual loading fade out
    lightboxImg.style.opacity = '0.3';
    lightboxImg.style.transform = 'scale(0.95)';
    
    const tempImage = new Image();
    tempImage.onload = () => {
      lightboxImg.setAttribute('src', highResSrc);
      lightboxImg.setAttribute('alt', imgAlt);
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    };
    tempImage.src = highResSrc;
  }
  
  // Close Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Navigation
  const showNext = () => {
    currentIndex = (currentIndex + 1) % currentVisibleItems.length;
    updateLightboxContent();
  };
  
  const showPrev = () => {
    currentIndex = (currentIndex - 1 + currentVisibleItems.length) % currentVisibleItems.length;
    updateLightboxContent();
  };
  
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });
  
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });
  
  // Keyboard Bindings
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}
