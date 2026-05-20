// Clone Demo — interactive interface simulation
(function () {
  const demo = document.getElementById('clone-demo');
  if (!demo) return;

  // Demo data
  const personality = [
    { label: 'Аналитика', value: 0 },
    { label: 'Креативность', value: 0 },
    { label: 'Эмпатия', value: 0 },
    { label: 'Лидерство', value: 0 },
    { label: 'Юмор', value: 0 },
    { label: 'Прямота', value: 0 },
  ];
  const targetValues = [82, 65, 71, 58, 74, 88];

  const chatScript = [
    { role: 'system', text: 'Клон анализирует загруженные данные...' },
    { role: 'clone', text: 'Привет! Я твоя цифровая копия. Я изучил твои тексты и переписки. Готов к диалогу.' },
    { role: 'user', text: 'Какие мои сильные стороны ты видишь?' },
    { role: 'clone', text: 'Ты силён в аналитике и прямоте. Твои тексты показывают системное мышление и способность видеть суть быстро.' },
    { role: 'user', text: 'А над чем стоит поработать?' },
    { role: 'clone', text: 'Ты часто избегаешь делегирования — берёшь всё на себя. Это твоя слепая зона. Рекомендую фокус на доверии к команде.' },
  ];

  const memories = [
    'Стиль общения: прямой, без воды',
    'Ценности: честность, эффективность',
    'Тон: дружелюбно-деловой',
    'Экспертиза: технологии, бизнес',
    'Паттерн: системное мышление',
    'Слепая зона: делегирование',
  ];

  let chatIndex = 0;
  let trainingProgress = 0;
  let memoryIndex = 0;
  let radarAnimated = false;
  let isRunning = false;

  // Build UI
  demo.innerHTML = `
    <div class="demo-window">
      <div class="demo-toolbar">
        <div class="demo-dots"><span></span><span></span><span></span></div>
        <div class="demo-toolbar-title">Cloone — Обучение клона</div>
        <div></div>
      </div>
      <div class="demo-body">
        <div class="demo-sidebar">
          <div class="demo-sidebar-section">
            <div class="demo-sidebar-label">Профиль</div>
            <div class="demo-avatar">
              <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#181630"/><circle cx="20" cy="15" r="7" fill="#6c5ce7" opacity="0.8"/><path d="M8 35a12 12 0 0124 0" fill="#6c5ce7" opacity="0.5"/></svg>
            </div>
            <div class="demo-profile-name">Мой Клон</div>
          </div>
          <div class="demo-sidebar-section">
            <div class="demo-sidebar-label">Обучение</div>
            <div class="demo-progress-bar"><div class="demo-progress-fill" id="demo-progress"></div></div>
            <div class="demo-progress-text" id="demo-progress-text">0%</div>
          </div>
          <div class="demo-sidebar-section">
            <div class="demo-sidebar-label">Память</div>
            <div class="demo-memory-list" id="demo-memories"></div>
          </div>
        </div>
        <div class="demo-main">
          <div class="demo-chat" id="demo-chat"></div>
          <div class="demo-input-row">
            <input type="text" class="demo-input" id="demo-input" placeholder="Спроси клона..." readonly>
            <button class="demo-send" id="demo-send-btn">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 10l7-7v4.5h9v5H9V17z" transform="rotate(180 10 10)"/></svg>
            </button>
          </div>
        </div>
        <div class="demo-panel">
          <div class="demo-sidebar-label">Личность клона</div>
          <canvas id="demo-radar" width="220" height="220"></canvas>
          <div class="demo-stats" id="demo-stats"></div>
        </div>
      </div>
    </div>
  `;

  const chatEl = document.getElementById('demo-chat');
  const progressEl = document.getElementById('demo-progress');
  const progressText = document.getElementById('demo-progress-text');
  const memoriesEl = document.getElementById('demo-memories');
  const radarCanvas = document.getElementById('demo-radar');
  const statsEl = document.getElementById('demo-stats');
  const inputEl = document.getElementById('demo-input');
  const sendBtn = document.getElementById('demo-send-btn');

  function addChat(msg) {
    const div = document.createElement('div');
    div.className = `demo-msg demo-msg-${msg.role}`;
    if (msg.role === 'system') {
      div.innerHTML = `<span class="demo-msg-sys">${msg.text}</span>`;
    } else if (msg.role === 'clone') {
      div.innerHTML = `<div class="demo-msg-avatar">C</div><div class="demo-msg-bubble">${msg.text}</div>`;
    } else {
      div.innerHTML = `<div class="demo-msg-bubble">${msg.text}</div>`;
    }
    div.style.opacity = '0';
    div.style.transform = 'translateY(10px)';
    chatEl.appendChild(div);
    requestAnimationFrame(() => {
      div.style.transition = 'all 0.4s ease';
      div.style.opacity = '1';
      div.style.transform = 'translateY(0)';
    });
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function updateProgress(val) {
    trainingProgress = val;
    progressEl.style.width = val + '%';
    progressText.textContent = val + '%';
  }

  function addMemory(text) {
    const div = document.createElement('div');
    div.className = 'demo-memory-item';
    div.textContent = text;
    div.style.opacity = '0';
    memoriesEl.appendChild(div);
    requestAnimationFrame(() => {
      div.style.transition = 'opacity 0.5s';
      div.style.opacity = '1';
    });
  }

  function drawRadar(progress) {
    const ctx = radarCanvas.getContext('2d');
    const cx = 110, cy = 110, r = 85;
    ctx.clearRect(0, 0, 220, 220);

    // Grid
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      const rr = r * ring / 4;
      for (let i = 0; i <= 6; i++) {
        const angle = (Math.PI * 2 * i / 6) - Math.PI / 2;
        const x = cx + Math.cos(angle) * rr;
        const y = cy + Math.sin(angle) * rr;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Axes
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i / 6) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Data shape
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i / 6) - Math.PI / 2;
      const val = (targetValues[i] / 100) * r * progress;
      const x = cx + Math.cos(angle) * val;
      const y = cy + Math.sin(angle) * val;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(108, 92, 231, 0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(108, 92, 231, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Points + Labels
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i / 6) - Math.PI / 2;
      const val = (targetValues[i] / 100) * r * progress;
      const x = cx + Math.cos(angle) * val;
      const y = cy + Math.sin(angle) * val;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#6c5ce7';
      ctx.fill();

      // Label
      const lx = cx + Math.cos(angle) * (r + 14);
      const ly = cy + Math.sin(angle) * (r + 14);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(personality[i].label, lx, ly);
    }
  }

  function updateStats(progress) {
    statsEl.innerHTML = personality.map((p, i) => {
      const val = Math.round(targetValues[i] * progress);
      return `<div class="demo-stat-row">
        <span>${p.label}</span>
        <div class="demo-stat-bar"><div style="width:${val}%"></div></div>
        <span class="demo-stat-val">${val}%</span>
      </div>`;
    }).join('');
  }

  // Animation sequence
  async function runDemo() {
    if (isRunning) return;
    isRunning = true;

    // Reset
    chatEl.innerHTML = '';
    memoriesEl.innerHTML = '';
    updateProgress(0);
    drawRadar(0);
    updateStats(0);

    await wait(600);

    // Step 1: System message
    addChat(chatScript[0]);
    await wait(1200);
    updateProgress(15);
    addMemory(memories[0]);
    await wait(600);
    addMemory(memories[1]);
    updateProgress(30);
    await wait(600);

    // Step 2: Clone greeting
    inputEl.value = '';
    addChat(chatScript[1]);
    addMemory(memories[2]);
    updateProgress(45);
    animateRadar(0, 0.45, 800);
    await wait(1500);

    // Step 3: User question
    await typeInInput(chatScript[2].text);
    addChat(chatScript[2]);
    await wait(400);
    inputEl.value = '';
    await wait(800);

    // Step 4: Clone answer
    addChat(chatScript[3]);
    addMemory(memories[3]);
    addMemory(memories[4]);
    updateProgress(70);
    animateRadar(0.45, 0.7, 800);
    await wait(2000);

    // Step 5: Follow-up
    await typeInInput(chatScript[4].text);
    addChat(chatScript[4]);
    inputEl.value = '';
    await wait(800);

    // Step 6: Deep answer
    addChat(chatScript[5]);
    addMemory(memories[5]);
    updateProgress(92);
    animateRadar(0.7, 1, 1000);
    await wait(1500);

    updateProgress(100);
    isRunning = false;
  }

  function animateRadar(from, to, duration) {
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const val = from + (to - from) * ease;
      drawRadar(val);
      updateStats(val);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  async function typeInInput(text) {
    inputEl.value = '';
    for (let i = 0; i < text.length; i++) {
      inputEl.value += text[i];
      await wait(30 + Math.random() * 30);
    }
    await wait(300);
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  // Auto-run when visible
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !isRunning) runDemo();
  }, { threshold: 0.3 });
  obs.observe(demo);

  // Replay button
  sendBtn.addEventListener('click', () => {
    if (!isRunning) runDemo();
  });

  // Initial draw
  drawRadar(0);
  updateStats(0);
})();
