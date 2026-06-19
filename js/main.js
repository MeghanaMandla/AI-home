// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// ===== SEARCH OVERLAY =====
const searchToggle = document.getElementById('searchToggle');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const globalSearch = document.getElementById('globalSearch');
const searchResults = document.getElementById('searchResults');

// Collect all tools data
const allTools = [];
document.querySelectorAll('.tool-card').forEach(card => {
  allTools.push({
    name: card.dataset.name,
    desc: card.dataset.desc,
    cat: card.dataset.cat,
    href: card.href,
    icon: card.querySelector('.tool-icon')?.textContent || '🤖'
  });
});

function openSearch() {
  if (searchOverlay) {
    searchOverlay.classList.add('open');
    setTimeout(() => globalSearch?.focus(), 100);
  }
}
function closeSearch() {
  if (searchOverlay) {
    searchOverlay.classList.remove('open');
    if (globalSearch) globalSearch.value = '';
    if (searchResults) searchResults.innerHTML = '';
  }
}

if (searchToggle) searchToggle.addEventListener('click', openSearch);
if (searchClose) searchClose.addEventListener('click', closeSearch);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

if (globalSearch && searchResults) {
  globalSearch.addEventListener('input', () => {
    const q = globalSearch.value.toLowerCase().trim();
    if (!q) { searchResults.innerHTML = ''; return; }
    const matches = allTools.filter(t =>
      t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.cat.includes(q)
    ).slice(0, 8);
    if (!matches.length) {
      searchResults.innerHTML = '<div style="text-align:center;color:var(--text2);padding:2rem;">No tools found</div>';
      return;
    }
    searchResults.innerHTML = matches.map(t => `
      <a class="search-result-item" href="${t.href}" target="_blank">
        <span class="result-icon">${t.icon}</span>
        <div class="result-info">
          <h4>${t.name}</h4>
          <p>${t.desc.slice(0, 70)}...</p>
        </div>
      </a>
    `).join('');
  });
}

// ===== TYPED TEXT =====
const typedEl = document.getElementById('typedText');
if (typedEl) {
  const phrases = ['Artificial Intelligence', 'AI Chatbots', 'Image Generation', 'AI Coding Tools', 'Creative AI'];
  let pi = 0, ci = 0, deleting = false;
  function type() {
    const current = phrases[pi];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) {
        setTimeout(() => { deleting = true; }, 1800);
        setTimeout(type, 2000);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 50 : 80);
  }
  type();
}

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = Math.ceil(target / 50);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 30);
}

// ===== SCROLL ANIMATIONS =====
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger counters
      entry.target.querySelectorAll?.('.stat-num[data-target]').forEach(animateCounter);
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

// Stats observer for hero
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// Card stagger observer
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 50);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
document.querySelectorAll('.tool-card').forEach(card => cardObserver.observe(card));

// ===== FILTER TABS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const toolSections = document.querySelectorAll('.tool-section');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;

    toolSections.forEach(section => {
      if (cat === 'all' || section.dataset.section === cat) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });

    // Re-observe cards in visible sections
    document.querySelectorAll('.tool-section:not(.hidden) .tool-card').forEach(card => {
      if (!card.classList.contains('visible')) {
        cardObserver.observe(card);
      }
    });
  });
});

// ===== SMOOTH SCROLL for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (mobileMenu) mobileMenu.classList.remove('open');
    }
  });
});

// ===== CARD HOVER 3D TILT =====
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `translateY(-4px) perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
