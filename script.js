/* =========================================
   MEHARAJ PORTFOLIO — SCRIPT.JS
   ========================================= */

'use strict';

// ── 1. PARTICLE CANVAS ─────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = 90;
  const COLORS = ['rgba(99,102,241,', 'rgba(6,182,212,', 'rgba(168,85,247,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(1, 3),
      dx: rand(-0.4, 0.4),
      dy: rand(-0.4, 0.4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: rand(0.15, 0.6),
    };
  }

  function initParticleArray() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function drawLine(p1, p2, dist, maxDist) {
    const alpha = (1 - dist / maxDist) * 0.25;
    ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // mouse repulsion
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 120) {
        const force = (120 - md) / 120 * 0.8;
        p.dx += (mdx / md) * force;
        p.dy += (mdy / md) * force;
      }

      p.dx *= 0.99;
      p.dy *= 0.99;

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;

      // draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      // connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) drawLine(p, q, dist, 120);
      }
    }

    requestAnimationFrame(loop);
  }

  resize();
  initParticleArray();
  loop();

  window.addEventListener('resize', () => { resize(); initParticleArray(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
})();


// ── 2. NAVBAR SCROLL EFFECT ─────────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    updateActiveLink();
  });

  function updateActiveLink() {
    const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
    let current = 'hero';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => navLinksEl?.classList.toggle('open'));
  navLinksEl?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinksEl.classList.remove('open'));
  });
})();


// ── 3. TYPEWRITER ────────────────────────────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const phrases = [
    'scalable software.',
    'beautiful UIs.',
    'robust backends.',
    'impactful products.',
    'clean code.',
    'great user experiences.',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (deleting) {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 500);
        return;
      }
      setTimeout(tick, 40);
    } else {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 70);
    }
  }

  setTimeout(tick, 1000);
})();


// ── 4. SCROLL REVEAL ─────────────────────────────────────────────────────────
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();


// ── 5. SKILL BARS ─────────────────────────────────────────────────────────────
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const target = fill.dataset.width || '80';
        fill.style.width = target + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();


// ── 6. COUNTER ANIMATION ─────────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  const heroSection = document.getElementById('hero');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, duration / steps);
      });
    }
  }, { threshold: 0.5 });

  if (heroSection) observer.observe(heroSection);
})();


// ── 7. SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── 8. CONTACT FORM ───────────────────────────────────────────────────────────
(function initForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Disable button
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';

    // Simulate sending (replace with real backend / EmailJS / etc.)
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1200);
  });
})();


// ── 9. SKILL CARD TILT ────────────────────────────────────────────────────────
(function initTilt() {
  document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
