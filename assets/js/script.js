document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Progress Bar ──
  const scrollProgress = document.getElementById('scroll-progress');
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ── Cursor Glow ──
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = -500, mouseY = -500;
  let glowX = -500, glowY = -500;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateGlow = () => {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  };
  animateGlow();

  // Hide cursor glow on mobile / touch
  if ('ontouchstart' in window) {
    cursorGlow.style.display = 'none';
  }

  // ── Floating Particles ──
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.015;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      const alpha = this.opacity * (0.6 + Math.sin(this.pulse) * 0.4);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
      ctx.fill();
    }
  }

  // Create particles (fewer on mobile)
  const particleCount = window.innerWidth < 768 ? 30 : 60;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw lines between nearby particles
  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  };
  animateParticles();

  // ── Parallax on orbs ──
  const orbs = document.querySelectorAll('.bg-mesh .orb');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.03;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile menu ──
  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav.querySelectorAll('a');

  menuBtn.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuBtn.innerHTML = open
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = '';
    });
  });

  // ── Active nav link highlighting ──
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  // ── Typing animation ──
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = [
      'ML Developer',
      'Full-Stack Developer',
      'Electronics Engineer',
      'IoT Builder'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    const type = () => {
      const current = phrases[phraseIdx];
      typingEl.textContent = current.substring(0, charIdx);

      if (!deleting) {
        charIdx++;
        if (charIdx > current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        charIdx--;
        if (charIdx < 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          charIdx = 0;
          setTimeout(type, 400);
          return;
        }
      }
      setTimeout(type, deleting ? 35 : 70);
    };
    type();
  }

  // ── Scroll reveal ──
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // ── Skill bar animation ──
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width;
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  // ── Counter animation for hero stats ──
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ── Timeline draw-in animation ──
  const timelines = document.querySelectorAll('.timeline');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('draw-in');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  timelines.forEach(tl => timelineObserver.observe(tl));

  // ── Tilt effect on cards ──
  const tiltCards = document.querySelectorAll('.skill-card, .project-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});