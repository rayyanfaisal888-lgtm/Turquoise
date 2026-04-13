/* ============================================
   TURQUOISE FLOORING INC. — SCRIPT
   ============================================ */

// ---------- NAVBAR SCROLL ----------
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ---------- MOBILE MENU ----------
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
let   menuOpen     = false;

hamburger.addEventListener('click', toggleMobile);

function toggleMobile() {
  menuOpen = !menuOpen;
  hamburger.classList.toggle('open', menuOpen);
  if (menuOpen) {
    mobileMenu.style.display = 'flex';
    requestAnimationFrame(() => mobileMenu.classList.add('open'));
    document.body.style.overflow = 'hidden';
  } else {
    closeMobile();
  }
}

function closeMobile() {
  menuOpen = false;
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  // hide after transition
  setTimeout(() => {
    if (!mobileMenu.classList.contains('open')) {
      mobileMenu.style.display = 'none';
    }
  }, 380);
}
window.closeMobile = closeMobile; // expose for onclick attributes

// ---------- SCROLL REVEAL ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- COUNTER ANIMATION ----------
function animateCounter(el, target, duration = 1800) {
  const start      = performance.now();
  const startValue = 0;
  const easeOut    = t => 1 - Math.pow(1 - t, 3);

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOut(progress) * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target, 10);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ---------- FOOTER YEAR ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- QUOTE FORM ----------
const ZAPIER_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/27153078/u7palin/';

const form       = document.getElementById('quoteForm');
const submitBtn  = document.getElementById('formSubmit');
const msgEl      = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic validation
  const name    = form.name.value.trim();
  const phone   = form.phone.value.trim();
  const email   = form.email.value.trim();
  const service = form.service.value;

  if (!name || !phone || !email || !service) {
    showMsg('Please fill in all required fields.', 'error');
    return;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    showMsg('Please enter a valid email address.', 'error');
    return;
  }

  // Disable button
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:1.1rem;animation:spin .8s linear infinite">progress_activity</span> Sending…`;

  const payload = {
    name,
    phone,
    email,
    service,
    message: form.message.value.trim(),
    source:  'Turquoise Flooring Website'
  };

  try {
    await fetch(ZAPIER_WEBHOOK, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
    showMsg('Thank you! We\'ll be in touch with your free quote shortly.', 'success');
    form.reset();
  } catch (err) {
    showMsg('Something went wrong. Please call us at (403) 690-0046 or email kemalnil@gmail.com.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:1.1rem">send</span> Send My Quote Request`;
  }
});

function showMsg(text, type) {
  msgEl.textContent  = text;
  msgEl.className    = `form-message ${type}`;
}

// ---------- SPIN KEYFRAME (injected) ----------
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
