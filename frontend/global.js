/* ===== GLOBAL.JS \u2014 Shared Logic Across All Pages ===== */

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// NAV SCROLL BEHAVIOR
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const navbar = document.getElementById('site-navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// MOBILE MENU
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');
const menuClose = document.getElementById('menu-close');

function openMenu() {
  mobileMenu?.classList.add('open');
  mobileOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu?.classList.remove('open');
  mobileOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburgerBtn?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
mobileOverlay?.addEventListener('click', closeMenu);

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// SCROLL ANIMATION OBSERVER
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
      window.animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

window.triggerAnimations = () => {
  document.querySelectorAll('.animate-in:not(.visible)').forEach(el => window.animObserver.observe(el));
};

window.triggerAnimations();

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// DYNAMIC SETTINGS & GOLD RATES
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.auraSettings = {};
window.liveGoldRates = { 22: 14225, 24: 14936, silver: 285 };

// Global API Base URL resolver
window.getApiBase = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Local development fallback
  if (window.location.port === '8000' || hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:5000`;
  }
  
  // If hosted on Vercel or any other static platform, point to the live Render backend
  if (hostname.includes('vercel.app') || (!hostname.includes('onrender.com') && hostname !== 'localhost')) {
    return 'https://aurajewellers.com';
  }
  
  // Default same-origin (when running directly on the Render server)
  return '';
};

// Global Image URL resolver
window.resolveImageUrl = (url) => {
  if (!url) return 'assets/placeholder.png';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads') || url.startsWith('uploads')) {
    const cleanUrl = url.startsWith('/') ? url : '/' + url;
    return window.getApiBase() + cleanUrl;
  }
  return url;
};

function formatINR(amount) {
  return '\u20b9' + Math.round(amount).toLocaleString('en-IN');
}

async function fetchSettings() {
  try {
    const res = await fetch(window.getApiBase() + '/api/settings');
    const data = await res.json();
    window.auraSettings = data;
    applySettings(data);
  } catch (e) {
    console.error('Failed to fetch settings', e);
  }
}

function applySettings(s) {
  // Apply Hero Title/Subtitle if on homepage
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroTitle && s.heroTitle) heroTitle.innerHTML = s.heroTitle.replace(/\n/g, '<br>');
  if (heroSubtitle && s.heroSubtitle) heroSubtitle.textContent = s.heroSubtitle;
}

async function updateTicker() {
  try {
    const res = await fetch(window.getApiBase() + '/api/rates');
    const data = await res.json();
    
    const updateRate = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = formatINR(val);
      const elDup = document.getElementById(id + '-dup');
      if (elDup) elDup.textContent = formatINR(val);
    };

    
    updateRate('gold22', data.gold22 * 10);
    updateRate('gold24', data.gold24 * 10);
    updateRate('silver', data.silver * 1000);

    if (data.tickerText) {
      const el = document.getElementById('ticker-custom');
      if (el) el.textContent = '\u2726 ' + data.tickerText + ' \u2726';
      const elDup = document.getElementById('ticker-custom-dup');
      if (elDup) elDup.textContent = '\u2726 ' + data.tickerText + ' \u2726';
    }

    window.liveGoldRates = { 22: data.gold22, 24: data.gold24, silver: data.silver };
    
    if (window.calcMiniGold) window.calcMiniGold();
    if (window.updateFloatRates) window.updateFloatRates();
  } catch (error) {
    console.error('Ticker update error:', error);
  }
}


// Initial fetch
fetchSettings();
updateTicker();
setInterval(updateTicker, 60000); // Every 1 minute

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// TOAST NOTIFICATION
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showToast(message, type = 'success') {
  const existing = document.querySelector('.aura-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'aura-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === 'success' ? 'rgba(26,26,26,0.95)' : 'rgba(50,0,0,0.95)'};
    border: 1px solid ${type === 'success' ? 'var(--gold)' : '#e74c3c'};
    color: ${type === 'success' ? 'var(--gold-bright)' : '#e74c3c'};
    padding: 1rem 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    z-index: 9999;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    animation: slideInToast 0.4s ease;
    max-width: 350px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  const style = document.createElement('style');
  style.textContent = `@keyframes slideInToast { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
  document.head.appendChild(style);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// DYNAMIC FLOATING RATES WIDGET INJECTION
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function injectFloatingRatesWidget() {
  // Prevent duplicate injection
  if (document.getElementById('aura-rates-tab')) return;

  const container = document.createElement('div');
  container.className = 'aura-rates-widget-container';
  container.innerHTML = `
    <!-- Floating Tab Trigger -->
    <div class="aura-rates-floating-tab" id="aura-rates-tab" title="View Today's Live Rates">
      <div class="aura-tab-content">
        <svg class="aura-tab-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
        <span class="aura-tab-text">RATES</span>
      </div>
    </div>

    <!-- Slide-out Sidebar Panel -->
    <div class="aura-rates-panel" id="aura-rates-panel">
      <div class="aura-rates-panel-header">
        <div>
          <h3 class="aura-panel-title">Today's Rates</h3>
          <div class="aura-panel-date" id="aura-panel-date">Loading date...</div>
        </div>
        <button class="aura-panel-close-btn" id="aura-panel-close" aria-label="Close rates panel">\u2715</button>
      </div>
      
      <div class="aura-rates-panel-body">
        <!-- Rate Card 1: 22K Gold -->
        <div class="aura-rate-card gold-22k">
          <div class="aura-rate-card-icon">\ud83e\ude99</div>
          <div class="aura-rate-card-details">
            <span class="aura-rate-label">Gold Rate (22K)</span>
            <span class="aura-rate-value" id="aura-float-gold22">\u20b96,842 <span class="aura-unit">/ gram</span></span>
          </div>
          <span class="aura-rate-change positive" id="aura-float-gold22c">\u25b2 0.4%</span>
        </div>

        <!-- Rate Card 2: 24K Gold -->
        <div class="aura-rate-card gold-24k">
          <div class="aura-rate-card-icon">\ud83d\udc51</div>
          <div class="aura-rate-card-details">
            <span class="aura-rate-label">Gold Rate (24K)</span>
            <span class="aura-rate-value" id="aura-float-gold24">\u20b97,490 <span class="aura-unit">/ gram</span></span>
          </div>
          <span class="aura-rate-change positive" id="aura-float-gold24c">\u25b2 0.3%</span>
        </div>

        <!-- Rate Card 3: Silver -->
        <div class="aura-rate-card silver-rate">
          <div class="aura-rate-card-icon">\ud83e\udd48</div>
          <div class="aura-rate-card-details">
            <span class="aura-rate-label">Silver Rate</span>
            <span class="aura-rate-value" id="aura-float-silver">\u20b989.2 <span class="aura-unit">/ gram</span></span>
          </div>
          <span class="aura-rate-change negative" id="aura-float-silverc">\u25bc 0.1%</span>
        </div>
      </div>
      
      <div class="aura-rates-panel-footer">
        <div class="aura-footer-note">\u2726 Rates updated dynamically \u2726</div>
        <a href="calculator.html" class="aura-calc-shortcut-btn">Use Gold Calculator \u25b8</a>
      </div>
    </div>

    <!-- Overlay Backing -->
    <div class="aura-rates-overlay" id="aura-rates-overlay"></div>
  `;
  document.body.appendChild(container);

  // Set today's date formatted beautifully
  const dateEl = document.getElementById('aura-panel-date');
  if (dateEl) {
    const today = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    dateEl.textContent = today.toLocaleDateString('en-IN', options);
  }

  // Toggle Panel Open/Close
  const tabBtn = document.getElementById('aura-rates-tab');
  const panel = document.getElementById('aura-rates-panel');
  const overlay = document.getElementById('aura-rates-overlay');
  const closeBtn = document.getElementById('aura-panel-close');

  const openPanel = () => {
    panel?.classList.add('open');
    overlay?.classList.add('open');
  };

  const closePanel = () => {
    panel?.classList.remove('open');
    overlay?.classList.remove('open');
  };

  tabBtn?.addEventListener('click', openPanel);
  closeBtn?.addEventListener('click', closePanel);
  overlay?.addEventListener('click', closePanel);

  // Also support hover for opening (optional, let's keep click for solid mobile compatibility and hover for desktop)
  tabBtn?.addEventListener('mouseenter', openPanel);
  
  // Close panel if mouse leaves the container on desktop
  container.addEventListener('mouseleave', (e) => {
    // Only auto-close on large viewports
    if (window.innerWidth > 768) {
      closePanel();
    }
  });

  // Call initial rate mapping
  window.updateFloatRates();
}

// Function to update float widget with live rate values
window.updateFloatRates = () => {
  const g22Val = document.getElementById('aura-float-gold22');
  const g24Val = document.getElementById('aura-float-gold24');
  const silVal = document.getElementById('aura-float-silver');

  const fmt = (v, unit = '/ gram') => `\u20b9${Math.round(v).toLocaleString('en-IN')} <span class="aura-unit">${unit}</span>`;

  if (window.liveGoldRates) {
    let r22 = window.liveGoldRates[22] || 6842;
    let r24 = window.liveGoldRates[24] || 7490;
    let rSil = window.liveGoldRates.silver || 89.2;

    if (g22Val) g22Val.innerHTML = fmt(r22);
    if (g24Val) g24Val.innerHTML = fmt(r24);
    if (silVal) silVal.innerHTML = fmt(rSil * 1000, '/ kg'); // Silver per kg in India
  }
};

// Function to dynamically initialize gold saving schemes WhatsApp links
// using safe ASCII and WhatsApp native bold markdown to ensure 100% robust rendering across all devices.
function initSavingSchemeWhatsAppLinks() {
  const phone = '917892314633';
  
  const commonPlanText = 
    `\n\n\u2728 *Introducing the Aura Jewellerys Aurum Advantage Saving Plan* \u2728\n\n` +
    `Turn your jewellery dreams into reality with our exclusive monthly savings scheme designed for smart and secure gold investments.\n\n` +
    `\u2705 Flexible Monthly Savings Plans\n` +
    `\u2705 Special Bonus Benefits from Aura\n` +
    `\u2705 No Making Charges\n` +
    `\u2705 Exclusive Jewellery Purchase Advantages\n\n` +
    `\uD83D\uDCB0 *Plan Options:*\n` +
    `\uD83D\uDD38 \u20B91000 per month - 12 Months\n` +
    `\uD83D\uDD38 \u20B92000 per month - 15 Months\n\n` +
    `Begin your savings journey today and enjoy premium benefits with Aura Jewellerys.\n\n` +
    `\uD83D\uDCCD Visit Aura Jewellers, Bengaluru\n` +
    `\uD83D\uDCDE Contact us for enrollment and complete scheme details.`;

  const bannerText = `Hello Aura! I'd like to know more details about your Aurum Advantage Gold Saving Schemes.` + commonPlanText;
  const plan12Text = `Hello Aura! I'd like to enroll in the Standard 12-Month Gold Saving Scheme (\u20B91,000/month).` + commonPlanText;
  const plan15Text = `Hello Aura! I'd like to enroll in the Premium 15-Month Gold Saving Scheme (\u20B92,000/month).` + commonPlanText;
  const plan18Text = `Hello Aura! I'm extremely interested in pre-registering for your Upcoming Elite 18-Month Scheme with No Wastage and No Making charges.` + commonPlanText;

  const links = {
    'wa-saving-ask-details': bannerText,
    'wa-saving-enroll-12m': plan12Text,
    'wa-saving-enroll-15m': plan15Text,
    'wa-saving-enroll-18m': plan18Text
  };

  for (const [className, text] of Object.entries(links)) {
    const encodedText = encodeURIComponent(text);
    const href = `https://wa.me/${phone}?text=${encodedText}`;
    document.querySelectorAll('.' + className).forEach(el => {
      el.setAttribute('href', href);
    });
  }
}

// Initialize Back to Top Button
function initBackToTopButton() {
  const btn = document.createElement('button');
  btn.className = 'aura-back-to-top';
  btn.setAttribute('aria-label', 'Back to top of page');
  btn.innerHTML = '&#9650;';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Global Luxury Toast Notification Utility
window.showToast = (message, duration = 3000) => {
  let container = document.querySelector('.aura-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'aura-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'aura-toast';
  toast.innerHTML = `<span>✦</span> <span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
};

// Hook into DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectFloatingRatesWidget();
    initSavingSchemeWhatsAppLinks();
    initBackToTopButton();
  });
} else {
  injectFloatingRatesWidget();
  initSavingSchemeWhatsAppLinks();
  initBackToTopButton();
}

// Register Service Worker for offline performance
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      // SW registration failed silently in non-secure or development environments
    });
  });
}




