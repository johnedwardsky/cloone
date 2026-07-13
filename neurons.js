// Neural Network Canvas — interactive brain-like impulses
(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, mouse = { x: -999, y: -999 }, nodes = [], impulses = [];
  const NODE_COUNT = 80;
  const CONNECT_DIST = 160;
  const MOUSE_RADIUS = 200;

  function resize() {
    W = canvas.width = canvas.offsetWidth * devicePixelRatio;
    H = canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  function init() {
    resize();
    nodes = [];
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        pulse: 0,
      });
    }
  }

  function spawnImpulse(a, b) {
    impulses.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, t: 0, speed: 0.02 + Math.random() * 0.02 });
  }

  function tick() {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    // Move nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      n.pulse *= 0.95;

      // Mouse attraction
      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 1) {
        n.vx += dx / dist * 0.03;
        n.vy += dy / dist * 0.03;
        n.pulse = Math.min(n.pulse + 0.15, 1);
      }

      // Dampen velocity
      n.vx *= 0.995;
      n.vy *= 0.995;
    }

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.15;
          const pulse = Math.max(a.pulse, b.pulse);
          if (pulse > 0.1) {
            ctx.strokeStyle = `rgba(108, 92, 231, ${alpha + pulse * 0.3})`;
            ctx.lineWidth = 0.8 + pulse;
          } else {
            ctx.strokeStyle = `rgba(108, 92, 180, ${alpha})`;
            ctx.lineWidth = 0.5;
          }
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Randomly fire impulses
    if (Math.random() < 0.03 && nodes.length > 1) {
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      let closest = null, minD = Infinity;
      for (const b of nodes) {
        if (b === a) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < CONNECT_DIST && d < minD) { minD = d; closest = b; }
      }
      if (closest) spawnImpulse(a, closest);
    }

    // Draw impulses
    for (let i = impulses.length - 1; i >= 0; i--) {
      const imp = impulses[i];
      imp.t += imp.speed;
      if (imp.t > 1) { impulses.splice(i, 1); continue; }
      const x = imp.ax + (imp.bx - imp.ax) * imp.t;
      const y = imp.ay + (imp.by - imp.ay) * imp.t;
      const glow = 6 + Math.sin(imp.t * Math.PI) * 8;

      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(108, 92, 231, 0.9)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, glow, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(x, y, 0, x, y, glow);
      g.addColorStop(0, 'rgba(108, 92, 231, 0.3)');
      g.addColorStop(1, 'rgba(108, 92, 231, 0)');
      ctx.fillStyle = g;
      ctx.fill();
    }

    // Draw nodes
    for (const n of nodes) {
      const glow = n.pulse;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 3, 0, Math.PI * 2);
      if (glow > 0.1) {
        ctx.fillStyle = `rgba(108, 92, 231, ${0.4 + glow * 0.6})`;
        ctx.shadowColor = 'rgba(108, 92, 231, 0.5)';
        ctx.shadowBlur = 12 * glow;
      } else {
        ctx.fillStyle = 'rgba(120, 120, 160, 0.35)';
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(tick);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  // Touch support
  canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }, { passive: true });
  canvas.addEventListener('touchend', () => { mouse.x = -999; mouse.y = -999; });

  // Click burst
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    for (const n of nodes) {
      const d = Math.hypot(n.x - cx, n.y - cy);
      if (d < 250) {
        n.pulse = 1;
        const force = (1 - d / 250) * 2;
        n.vx += (n.x - cx) / d * force;
        n.vy += (n.y - cy) / d * force;
      }
    }
    // Chain impulses from click point
    const nearby = nodes.filter(n => Math.hypot(n.x - cx, n.y - cy) < 150).slice(0, 6);
    for (let i = 0; i < nearby.length - 1; i++) {
      setTimeout(() => spawnImpulse(nearby[i], nearby[i + 1]), i * 80);
    }
  });

  window.addEventListener('resize', () => { resize(); init(); });
  init();
  tick();
})();

// ── MOBILE MENU TOGGLE ──
(function () {
  function initMobileMenu() {
    const container = document.querySelector('nav .container');
    if (!container) return;
    
    // Check if toggle already exists to prevent duplicate insertion
    if (document.getElementById('menuToggle')) return;
    
    // Create hamburger toggle button
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.id = 'menuToggle';
    toggle.setAttribute('aria-label', 'Toggle Menu');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(toggle);
    
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
          toggle.classList.remove('active');
          navLinks.classList.remove('active');
        }
      });
      
      // Close menu when clicking any nav link/button/select
      navLinks.querySelectorAll('a, button, select').forEach(item => {
        item.addEventListener('click', () => {
          toggle.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();

// ── ACCELERATOR: Synaptic storm ──
(function () {
  const canvas = document.getElementById('accel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [], sparks = [], running = false;

  function resize() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function init() {
    resize();
    particles = [];
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5, life: Math.random(),
      });
    }
  }

  function tick() {
    if (!running) return;
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      p.life += 0.003;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 140) {
          const alpha = (1 - d / 140) * 0.1;
          ctx.strokeStyle = `rgba(108, 92, 231, ${alpha})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    // Random sparks
    if (Math.random() < 0.06) {
      const p = particles[Math.floor(Math.random() * particles.length)];
      sparks.push({ x: p.x, y: p.y, r: 0, maxR: 20 + Math.random() * 30, alpha: 0.5 });
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.r += 1.2; s.alpha *= 0.95;
      if (s.alpha < 0.01) { sparks.splice(i, 1); continue; }
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(108, 92, 231, ${s.alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Nodes
    for (const p of particles) {
      const glow = Math.sin(p.life * 3) * 0.3 + 0.3;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(128, 112, 231, ${glow})`;
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; tick(); }
    else if (!e.isIntersecting) { running = false; }
  }, { threshold: 0.1 });
  obs.observe(canvas.parentElement);

  window.addEventListener('resize', () => { resize(); init(); });
  init();
})();

// ── WAITLIST: Floating constellation ──
(function () {
  const canvas = document.getElementById('waitlist-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dots = [], running = false, time = 0;

  function resize() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function init() {
    resize();
    dots = [];
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    for (let i = 0; i < 40; i++) {
      dots.push({
        x: Math.random() * w, y: Math.random() * h,
        baseX: Math.random() * w, baseY: Math.random() * h,
        r: Math.random() * 1.2 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.003,
        amp: 20 + Math.random() * 40,
      });
    }
  }

  function tick() {
    if (!running) return;
    time++;
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    // Float dots gently
    for (const d of dots) {
      d.x = d.baseX + Math.sin(time * d.speed + d.phase) * d.amp;
      d.y = d.baseY + Math.cos(time * d.speed * 0.7 + d.phase) * d.amp * 0.6;
    }

    // Connections
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = `rgba(200, 200, 220, ${alpha})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    // Draw dots
    for (const d of dots) {
      const flicker = 0.2 + Math.sin(time * 0.02 + d.phase) * 0.15;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 180, 210, ${flicker})`;
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; tick(); }
    else if (!e.isIntersecting) { running = false; }
  }, { threshold: 0.1 });
  obs.observe(canvas.parentElement);

  window.addEventListener('resize', () => { resize(); init(); });
  init();
})();
