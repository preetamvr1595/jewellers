/* ===== INDEX.JS \u2014 Homepage Logic ===== */

// Dynamic content loaders
let products = [];
let offers = [];

async function loadInitialData() {
  await Promise.all([
    loadProducts(),
    loadOffers()
  ]);
}

async function loadProducts() {
  try {
    const res = await fetch(window.getApiBase() + '/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    products = data.map(p => ({
      id: p._id || p.id,
      name: p.name || 'Untitled',
      category: p.category || 'uncategorized',
      tag: p.tag || '',
      image: window.resolveImageUrl((p.images && p.images[0]) || p.image),
      images: (p.images || (p.image ? [p.image] : [])).map(img => window.resolveImageUrl(img)),
      hallmark: p.hallmark || 'HUID',
      purity: p.purity || '',
      weight: p.weight || '',
      priceLabel: (p.price ? '\u20b9' + p.price.toLocaleString('en-IN') : (p.priceLabel || 'Inquire for Price')),
      desc: p.description || p.desc || ''
    }));
    
    // renderFilters();
    // renderProducts(activeFilter);
  } catch (e) {
    console.error('Error loading products', e);
  }
}



async function loadOffers() {
  try {
    const res = await fetch(window.getApiBase() + '/api/offers');
    const data = await res.json();
    offers = data.filter(o => o.active);
    if (offers.length > 0) {
      renderActiveOffer(offers[0]);
    }
  } catch (e) {
    console.error('Error loading offers', e);
  }
}

function renderActiveOffer(offer) {
  const section = document.getElementById('festive-offers');
  const container = document.getElementById('active-offer-content');
  if (!section || !container) return;

  section.style.display = 'block';
  container.innerHTML = `
    <div class="offer-poster-main">
      <img src="${offer.poster || 'assets/diwali_poster.png'}" alt="${offer.title}" id="active-poster">
      ${offer.endDate ? `
        <div class="offer-countdown">
          <span class="countdown-label">Offer Ends In</span>
          <div class="countdown-display" id="countdown-display">
            <div class="cd-unit"><span id="cd-days">--</span><span>Days</span></div>
            <div class="cd-sep">:</div>
            <div class="cd-unit"><span id="cd-hours">--</span><span>Hrs</span></div>
            <div class="cd-sep">:</div>
            <div class="cd-unit"><span id="cd-mins">--</span><span>Min</span></div>
            <div class="cd-sep">:</div>
            <div class="cd-unit"><span id="cd-secs">--</span><span>Sec</span></div>
          </div>
        </div>
      ` : ''}
    </div>
    <div class="offer-details-panel">
      <span class="label">SPECIAL FESTIVAL OFFER</span>
      <h3 id="offer-title">${offer.title}</h3>
      <p id="offer-desc">${offer.description}</p>
      <div class="offer-pills">
        <div class="offer-pill gold">${offer.wastage} WASTAGE</div>
        <div class="offer-pill green">${offer.discount} Making OFF</div>
        ${offer.extraValue ? `<div class="offer-pill amber">Extra ${offer.extraValue} on Old Gold</div>` : ''}
      </div>
      <div class="offer-actions">
        <a href="https://wa.me/917892314633?text=Hello!%20I'm%20interested%20in%20the%20${encodeURIComponent(offer.title)}" target="_blank" class="btn btn-whatsapp" id="offer-whatsapp-btn">\u2726 Claim on WhatsApp</a>
        <a href="offers.html" class="btn btn-outline">All Offers \u25b8</a>
      </div>
    </div>
  `;

  if (offer.endDate) {
    initCountdown(new Date(offer.endDate));
  }
}


let activeFilter = 'bridal';

function getWhatsAppMsg(productName) {
  const baseMsg = `Hello Aura Jewellers! I'm interested in the *${productName}*. Please share the current price and availability.`;
  const welcomeMsg = 
    `\n\nWelcome to Aura Jewellers, Bengaluru \u2728\n\n` +
    `Thank you for contacting us. We are pleased to assist you with our exclusive jewellery collections and services.\n\n` +
    `By continuing this conversation, you agree to our privacy policy regarding the collection and processing of your information.\n\n` +
    `How may we assist you today?\n\n` +
    `\u0031\uFE0F\u20E3 Today\u2019s Gold Rate\n` +
    `\u0032\uFE0F\u20E3 Store Location\n` +
    `\u0033\uFE0F\u20E3 Gold Savings Scheme\n` +
    `\u0034\uFE0F\u20E3 Bridal Jewellery Collections\n` +
    `\u0035\uFE0F\u20E3 Diamond Jewellery\n` +
    `\u0036\uFE0F\u20E3 Customer Support Assistance\n\n` +
    `Please reply with the option number or type your query below. We look forward to serving you.`;
  return `https://wa.me/917892314633?text=${encodeURIComponent(baseMsg + welcomeMsg)}`;
}



// Filter buttons are now handled by renderFilters()

// Initial load
loadInitialData();

// HERO THUMBNAIL SWITCHER
const heroImg = document.getElementById('hero-product-img');
const floatTagName = document.querySelector('.tag-name');
const floatTagPurity = document.querySelector('.tag-purity');

document.querySelectorAll('.hero-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    document.querySelectorAll('.hero-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    if (heroImg) {
      heroImg.style.opacity = '0';
      heroImg.style.transform = 'scale(1.05)';
      setTimeout(() => {
        heroImg.src = thumb.dataset.img;
        heroImg.alt = thumb.dataset.name + ' \u2014 HUID/BIS Hallmark, Aura Jewellers';
        heroImg.style.opacity = '1';
        heroImg.style.transform = 'scale(1)';
      }, 300);
    }
    if (floatTagName) floatTagName.textContent = thumb.dataset.name;
    if (floatTagPurity) floatTagPurity.textContent = thumb.dataset.purity;
  });
});

// OFFER COUNTDOWN TIMER
function initCountdown(endDate) {
  function updateCountdown() {
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');

    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = pad(val); };
    el('cd-days', days);
    el('cd-hours', hours);
    el('cd-mins', mins);
    el('cd-secs', secs);
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();
}

// MINI GOLD CALCULATOR
window.calcMiniGold = function() {
  const weight = parseFloat(document.getElementById('mini-weight')?.value) || 0;
  const purity = parseInt(document.getElementById('mini-purity')?.value) || 22;
  const rate = window.liveGoldRates[purity] || 6842;
  const wastage = (parseFloat(window.auraSettings.wastageRate) / 100) || 0.0799;
  const total = weight * rate * (1 + wastage);
  const resultEl = document.getElementById('mini-result');
  if (resultEl) {
    resultEl.textContent = '\u20b9' + Math.round(total).toLocaleString('en-IN');
  }
}

document.getElementById('mini-weight')?.addEventListener('input', window.calcMiniGold);
document.getElementById('mini-purity')?.addEventListener('change', window.calcMiniGold);

// ==========================================
// WHY CHOOSE CAROUSEL LOGIC
// ==========================================
function initWhyCarousel() {
  const track = document.getElementById('why-carousel-track');
  const dotsContainer = document.getElementById('why-carousel-dots');
  if (!track || !dotsContainer) return;

  const slides = Array.from(track.children);
  const dotCount = slides.length;
  let currentIndex = 0;
  let slideInterval;

  // Render Dots
  dotsContainer.innerHTML = '';
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('button');
    dot.className = `aura-carousel-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dotsContainer.appendChild(dot);

    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      moveToSlide(i);
      startAutoSlide();
    });
  }

  const dots = Array.from(dotsContainer.children);

  function moveToSlide(index) {
    if (index < 0) index = dotCount - 1;
    if (index >= dotCount) index = 0;
    
    track.style.transform = `translateX(-${index * 100}%)`;
    dots[currentIndex].classList.remove('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  function startAutoSlide() {
    slideInterval = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, 5000);
  }

  // Touch / Swipe Navigation
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    clearInterval(slideInterval);
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        moveToSlide(currentIndex + 1);
      } else {
        moveToSlide(currentIndex - 1);
      }
    }
    isDragging = false;
    startAutoSlide();
  }, { passive: true });

  // Init Auto Slide
  startAutoSlide();
}

// ==========================================
// LIGHTBOX MODAL LOGIC FOR POSTER
// ==========================================
function initPosterLightbox() {
  const adCard = document.getElementById('savings-ad-card');
  const modal = document.getElementById('aura-poster-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('aura-lightbox-close');

  if (!adCard || !modal || !modalImg) return;

  adCard.addEventListener('click', (e) => {
    // Prevent opening if the user clicked the WhatsApp button directly
    if (e.target.closest('.btn-gold')) return;

    const img = adCard.querySelector('img');
    if (img) {
      modalImg.src = img.src;
      modal.style.display = 'block';
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    }
  });

  function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    }, 400);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target !== modalImg) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
}

// Call on DOMContentLoaded / load
document.addEventListener('DOMContentLoaded', () => {
  initWhyCarousel();
  initPosterLightbox();
});
// Also call immediately just in case
initWhyCarousel();
initPosterLightbox();
