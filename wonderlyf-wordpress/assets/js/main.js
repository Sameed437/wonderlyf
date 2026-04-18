/* ============================================================
   WONDERLYF — Main JavaScript
   Animations, interactions, performance-optimised
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const rand = (min, max) => Math.random() * (max - min) + min;
  const isMobile = () => window.innerWidth < 768;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Navbar scroll behaviour ──────────────────────────── */
  function initNavbar() {
    const header = $('#site-header');
    if (!header) return;

    const isHome = header.classList.contains('hero-transparent');

    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
        if (isHome) header.classList.remove('hero-transparent');
      } else {
        header.classList.remove('scrolled');
        if (isHome) header.classList.add('hero-transparent');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile hamburger */
    const hamburger = $('#hamburger');
    const mobileNav = $('#mobileNav');
    const overlay   = $('#navOverlay');
    const closeBtn  = $('#mobileNavClose');

    function openNav() {
      mobileNav.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      mobileNav.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger && hamburger.addEventListener('click', openNav);
    closeBtn  && closeBtn.addEventListener('click',  closeNav);
    overlay   && overlay.addEventListener('click',   closeNav);
  }

  /* ── 2. Floating Honey Elements ──────────────────────────── */
  function initFloatingElements() {
    if (prefersReduced) return;

    const container = $('#floating-elements');
    if (!container) return;

    const count = isMobile() ? 6 : 14;

    const shapes = {
      hex: (size, color) => {
        const r = size / 2;
        const pts = Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          return `${r + r * 0.85 * Math.cos(a)},${r + r * 0.85 * Math.sin(a)}`;
        }).join(' ');
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <polygon points="${pts}" fill="${color}" stroke="rgba(184,134,11,0.3)" stroke-width="1.5"/>
        </svg>`;
      },
      drop: (size, color) => {
        const h = size * 1.5;
        return `<svg width="${size}" height="${h}" viewBox="0 0 30 45">
          <path d="M15 0 C15 0 0 20 0 28 C0 37 6.7 45 15 45 C23.3 45 30 37 30 28 C30 20 15 0 15 0Z" fill="${color}"/>
        </svg>`;
      },
      leaf: (size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 40 40">
        <path d="M20 2 C30 8 38 18 36 30 C34 36 28 38 20 38 C12 38 6 36 4 30 C2 18 10 8 20 2Z" fill="${color}"/>
      </svg>`,
      petal: (size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 30 30">
        <ellipse cx="15" cy="15" rx="6" ry="13" fill="${color}"/>
        <ellipse cx="15" cy="15" rx="13" ry="6" fill="${color}" opacity="0.7"/>
        <circle cx="15" cy="15" r="4" fill="rgba(212,148,10,0.9)"/>
      </svg>`,
    };

    const shapeKeys = Object.keys(shapes);
    const colors = ['#F0C14B', '#D4940A', '#E8A317', '#C68E17', '#7BA05B', '#F5D68A'];

    // Trajectory paths (from% to%)
    const trajectories = [
      { x1: -5,  y1: -5,  x2: 105, y2: 105 },
      { x1: 105, y1: -5,  x2: -5,  y2: 105 },
      { x1: -5,  y1: 105, x2: 105, y2: -5  },
      { x1: 105, y1: 105, x2: -5,  y2: -5  },
      { x1: -5,  y1: 35,  x2: 105, y2: 65  },
      { x1: 105, y1: 25,  x2: -5,  y2: 75  },
      { x1: 35,  y1: -5,  x2: 65,  y2: 105 },
      { x1: 65,  y1: 105, x2: 35,  y2: -5  },
    ];

    for (let i = 0; i < count; i++) {
      const shape    = shapeKeys[i % shapeKeys.length];
      const color    = colors[Math.floor(rand(0, colors.length))];
      const size     = isMobile() ? rand(18, 32) : rand(28, 60);
      const traj     = trajectories[i % trajectories.length];
      const duration = (isMobile() ? rand(10, 16) : rand(16, 28)) + 's';
      const delay    = (i * 0.6) + 's';
      const rotateDeg = rand(60, 360) * (Math.random() > 0.5 ? 1 : -1);

      const el = document.createElement('div');
      el.className = 'float-el';
      el.innerHTML = shapes[shape](size, color);
      el.style.cssText = `
        left: ${traj.x1}%;
        top:  ${traj.y1}%;
        --x-end: ${traj.x2}%;
        --y-end: ${traj.y2}%;
        animation-duration: ${duration};
        animation-delay: -${delay};
        animation-name: floatEl${i};
        will-change: transform, opacity;
      `;

      // Inject keyframe per-element for unique path
      const midX = (traj.x1 + traj.x2) / 2 + rand(-15, 15);
      const midY = (traj.y1 + traj.y2) / 2 + rand(-12, 12);

      const style = document.createElement('style');
      style.textContent = `
        @keyframes floatEl${i} {
          0%   { left:${traj.x1}%; top:${traj.y1}%; opacity:0; transform:rotate(0deg) scale(0.8); }
          10%  { opacity:${rand(0.45, 0.7).toFixed(2)}; }
          50%  { left:${midX}%; top:${midY}%; transform:rotate(${rotateDeg * 0.5}deg) scale(1); }
          90%  { opacity:${rand(0.45, 0.7).toFixed(2)}; }
          100% { left:${traj.x2}%; top:${traj.y2}%; opacity:0; transform:rotate(${rotateDeg}deg) scale(1.1); }
        }
      `;
      document.head.appendChild(style);
      container.appendChild(el);
    }
  }

  /* ── 3. Scroll Reveal ────────────────────────────────────── */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      els.forEach(el => io.observe(el));
    } else {
      els.forEach(el => el.classList.add('visible'));
    }
  }

  /* ── 4. Animated Counters ────────────────────────────────── */
  function initCounters() {
    const counters = $$('.stat-num[data-target]');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const isFloat = String(target).includes('.');
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const value = eased * target;
          el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => io.observe(c));
  }

  /* ── 5. Hero Products Float ──────────────────────────────── */
  function initHeroProducts() {
    const items = $$('.hero-product-item');
    items.forEach((item, i) => {
      const duration = rand(4, 7);
      const floatY   = rand(10, 20);
      item.style.animationDuration  = duration + 's';
      item.style.animationDelay     = -(i * 0.5) + 's';
      item.style.setProperty('--float-y', `-${floatY}px`);
    });
  }

  /* ── 6. Category Carousel ────────────────────────────────── */
  function initCarousel() {
    const wrap  = $('.category-carousel-wrap');
    if (!wrap) return;

    const track = $('.category-track', wrap);
    const cards = $$('.category-card', wrap);
    const prevBtn = $('.carousel-btn-prev', wrap.parentElement);
    const nextBtn = $('.carousel-btn-next', wrap.parentElement);

    if (!track || !cards.length) return;

    let current = 0;
    const visibleCount = () => isMobile() ? 1 : (window.innerWidth < 1024 ? 2 : 4);
    const maxIndex = () => Math.max(0, cards.length - visibleCount());

    function updateCarousel() {
      const cardWidth = cards[0].offsetWidth + 24; // gap=24
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      if (prevBtn) prevBtn.style.opacity = current === 0 ? '0.4' : '1';
      if (nextBtn) nextBtn.style.opacity = current >= maxIndex() ? '0.4' : '1';
    }

    nextBtn && nextBtn.addEventListener('click', () => {
      if (current < maxIndex()) { current++; updateCarousel(); }
    });
    prevBtn && prevBtn.addEventListener('click', () => {
      if (current > 0) { current--; updateCarousel(); }
    });

    // Auto-play
    let autoPlay = setInterval(() => {
      current = current >= maxIndex() ? 0 : current + 1;
      updateCarousel();
    }, 3800);

    wrap.addEventListener('mouseenter', () => clearInterval(autoPlay));
    wrap.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        current = current >= maxIndex() ? 0 : current + 1;
        updateCarousel();
      }, 3800);
    });

    // Touch swipe
    let touchStartX = 0;
    wrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0 && current < maxIndex()) current++;
        else if (diff < 0 && current > 0) current--;
        updateCarousel();
      }
    });

    window.addEventListener('resize', updateCarousel, { passive: true });
    updateCarousel();
  }

  /* ── 7. Add to Cart (AJAX) ───────────────────────────────── */
  function initAddToCart() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.js-add-to-cart');
      if (!btn) return;
      e.preventDefault();

      const productId = btn.dataset.productId;
      if (!productId || !window.wonderlyfData) return;

      btn.disabled = true;
      btn.textContent = 'Adding...';

      const formData = new FormData();
      formData.append('action',     'wonderlyf_add_to_cart');
      formData.append('product_id', productId);
      formData.append('nonce',      wonderlyfData.nonce);

      fetch(wonderlyfData.ajaxUrl, { method: 'POST', body: formData })
        .then(r => r.json())
        .then(res => {
          if (res.success) {
            const count = $('.cart-count');
            if (count) count.textContent = res.data.count;
            btn.textContent = '✓ Added!';
            btn.style.background = '#4CAF50';
            setTimeout(() => {
              btn.textContent = 'Add to Cart';
              btn.style.background = '';
              btn.disabled = false;
            }, 2000);
          } else {
            btn.textContent = 'Try Again';
            btn.disabled = false;
          }
        })
        .catch(() => { btn.textContent = 'Error'; btn.disabled = false; });
    });
  }

  /* ── 8. Lazy-load images ──────────────────────────────────── */
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;
    const imgs = $$('img[data-src]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          io.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    imgs.forEach(img => io.observe(img));
  }

  /* ── 9. Process timeline entrance ────────────────────────── */
  function initProcessTimeline() {
    const steps = $$('.process-step');
    if (!steps.length) return;

    steps.forEach(step => step.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    steps.forEach(step => io.observe(step));
  }

  /* ── 10. Smooth anchor scroll ─────────────────────────────── */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    initNavbar();
    initReveal();
    initCounters();
    initAddToCart();
    initLazyImages();
    initProcessTimeline();
    initSmoothScroll();

    if (!prefersReduced) {
      initFloatingElements();
      initHeroProducts();
      initCarousel();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
