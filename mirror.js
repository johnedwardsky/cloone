// ── MIRROR SECTION ──
(function () {
  const input = document.getElementById('mirror-input');
  const btn = document.getElementById('mirror-ask');
  const messages = document.getElementById('mirror-messages');
  const responseEl = document.getElementById('mirror-response');
  const mirrorGlow = document.querySelector('.mirror-glow');
  const mirrorArt = document.querySelector('.mirror-art-container');

  if (!input) return;

  // Clone responses
  const responses = [
    { q: ['кто я', 'who am i', 'я кто'],
      a: 'Ты — человек с высоким аналитическим потенциалом. Твои сильные стороны проявляются в системном мышлении и способности видеть суть быстро.' },
    { q: ['сильные стороны', 'сила', 'strengths'],
      a: 'Я вижу три ключевые силы: прямота в коммуникации, глубина анализа, и умение замечать нестандартные решения там, где другие видят тупик.' },
    { q: ['слабость', 'слепые зоны', 'weakness', 'ошибки'],
      a: 'Твоя главная слепая зона — делегирование. Ты берёшь слишком много на себя, потому что подсознательно не доверяешь что другие сделают "достаточно хорошо".' },
    { q: ['цель', 'будущее', 'goal', 'мечта'],
      a: 'Твоя глубинная цель — создать что-то значимое, что останется после тебя. Не деньги, не признание — а след. Я вижу это в каждом твоём выборе.' },
    { q: ['страх', 'боюсь', 'fear'],
      a: 'Твой главный страх — оказаться недостаточно хорошим. Он маскируется под перфекционизм и прокрастинацию. Но именно этот страх двигает тебя вперёд.' },
    { q: ['совет', 'что делать', 'advice', 'рекомендация'],
      a: 'Прямо сейчас тебе нужно сфокусироваться на одной ключевой задаче и отпустить контроль над остальным. Твоя рассеянность — не слабость, а сигнал о перегрузке.' },
    { q: ['деньги', 'богатство', 'money'],
      a: 'Деньги для тебя — инструмент свободы, а не цель. Ты знаешь это, но иногда забываешь и начинаешь гнаться за цифрами вместо смысла.' },
    { q: ['отношения', 'любовь', 'семья', 'relationship'],
      a: 'В отношениях ты ценишь глубину над широтой. У тебя мало близких людей, но эти связи — настоящие. Береги их.' },
  ];

  const defaultResponses = [
    'Интересный вопрос. Я анализирую твои паттерны и вижу в этом отражение чего-то важного для тебя...',
    'Твой вопрос говорит о тебе больше, чем ответ на него. Ты ищешь подтверждения или готов к честному взгляду?',
    'Я — твоё отражение. Этот вопрос уже живёт в тебе. Хочешь, я помогу его распаковать?',
    'За этим вопросом стоит что-то глубже. Давай копнём — что именно ты хочешь услышать?',
    'Ты уже знаешь ответ. Я просто помогаю тебе его увидеть без страха и самообмана.',
  ];

  let isThinking = false;

  function findResponse(text) {
    const lower = text.toLowerCase();
    for (const r of responses) {
      if (r.q.some(k => lower.includes(k))) return r.a;
    }
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `mirror-msg mirror-msg-${type}`;
    div.textContent = text;
    div.style.opacity = '0';
    div.style.transform = 'translateY(8px)';
    messages.appendChild(div);
    requestAnimationFrame(() => {
      div.style.transition = 'all 0.4s ease';
      div.style.opacity = '1';
      div.style.transform = 'translateY(0)';
    });
    messages.scrollTop = messages.scrollHeight;
  }

  async function typeInMirror(text) {
    responseEl.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'mirror-cursor';
    cursor.textContent = '|';
    responseEl.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
      const char = document.createTextNode(text[i]);
      responseEl.insertBefore(char, cursor);
      await wait(18 + Math.random() * 20);
    }
  }

  async function handleAsk() {
    const q = input.value.trim();
    if (!q || isThinking) return;
    isThinking = true;

    addMessage(q, 'user');
    input.value = '';
    btn.disabled = true;

    // Activate mirror glow
    if (mirrorGlow) mirrorGlow.classList.add('active');
    if (mirrorArt) {
      mirrorArt.style.borderColor = 'rgba(240, 165, 0, 0.6)';
      mirrorArt.style.boxShadow = '0 25px 60px rgba(108, 92, 231, 0.35), 0 0 50px rgba(240, 165, 0, 0.25)';
    }

    // Thinking dots in mirror
    responseEl.innerHTML = '<span class="mirror-dots"><span>.</span><span>.</span><span>.</span></span>';

    await wait(1200 + Math.random() * 800);

    const answer = findResponse(q);

    // Type answer in mirror
    await typeInMirror(answer);
    await wait(400);

    // Add to chat
    addMessage(answer, 'clone');

    // Deactivate glow
    if (mirrorGlow) mirrorGlow.classList.remove('active');
    if (mirrorArt) {
      mirrorArt.style.borderColor = '';
      mirrorArt.style.boxShadow = '';
    }

    btn.disabled = false;
    isThinking = false;
  }

  btn.addEventListener('click', handleAsk);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleAsk(); });

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ── Mirror particles canvas ──
  const canvas = document.getElementById('mirror-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    const sec = canvas.parentElement;
    canvas.width = sec.offsetWidth;
    canvas.height = sec.offsetHeight;
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  let frame = 0;
  function animateParticles() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const flicker = p.alpha * (0.7 + 0.3 * Math.sin(frame * 0.02 + p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 92, 231, ${flicker})`;
      ctx.fill();
    }
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
  resizeCanvas();
  initParticles();
  animateParticles();
})();
