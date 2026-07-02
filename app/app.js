/* ═══════════════════════════════════════════════════════════
   CLOONE — App Logic
   ═══════════════════════════════════════════════════════════ */

/* ─── ROUTING ─── */
let currentPage = 'home';

function navigate(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  // Show target page
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.remove('hidden');
    target.scrollTop = 0;
  }
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const activeNav = document.getElementById('nav-' + page);
  if (activeNav) activeNav.classList.add('active');
  // Update mobile bottom nav
  document.querySelectorAll('.mbn-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === page) item.classList.add('active');
  });
  currentPage = page;
  // Close sidebar on mobile
  closeSidebar();
  // Init charts if needed
  if (page === 'home') initHomeCharts();
  if (page === 'studio') initStudioCharts();
  if (page === 'analytics') initAnalyticsChart();
  if (page === 'monetization') setTimeout(initMonetizationChart, 100);
  if (page === 'diary') setTimeout(initDiaryPage, 50);
  if (page === 'dialogs') {
    setTimeout(() => {
      renderDialogsList();
      updateDialogCounts();
      selectDialog(activeDialogIndex);
    }, 50);
  }
  if (page === 'settings') {
    setTimeout(updateSettingsLearningStats, 50);
  }
  // Scroll to top
  window.scrollTo(0, 0);
}

/* ─── SIDEBAR ─── */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function toggleUserMenu() {
  const panel = document.querySelector('.clone-status-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'block';
}

/* ─── STUDIO TABS ─── */
function switchTab(btn, contentId) {
  const container = btn.closest('.studio-tabs');
  if (container) {
    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  // Hide all tab contents
  const allContents = document.querySelectorAll('#page-studio .tab-content');
  allContents.forEach(c => c.classList.add('hidden'));
  const target = document.getElementById(contentId);
  if (target) target.classList.remove('hidden');
  if (contentId === 'studio-overview') initStudioCharts();
}

/* ─── SETTINGS TABS ─── */
function switchSettings(btn, panelId) {
  document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.set-panel').forEach(p => p.classList.add('hidden'));
  const target = document.getElementById(panelId);
  if (target) target.classList.remove('hidden');
}

/* ─── DIALOGS ─── */
function switchDialogTab(btn, tabId) {
  const container = btn.closest('.dialogs-tabs-row');
  if (container) {
    container.querySelectorAll('.dialog-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  currentDialogTab = tabId;
  renderDialogsList();
}
function switchChannelPill(btn, channelId) {
  const container = btn.closest('.dialogs-channels-row');
  if (container) {
    container.querySelectorAll('.channel-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  currentDialogChannel = channelId;
  renderDialogsList();
}
/* ─── DIALOGS DATABASE ─── */
let activeDialogIndex = 0;

const dialogsData = [
  {
    name: 'Дмитрий А.',
    avatarLetter: 'Д',
    avatarBg: '#fef3c7', avatarColor: '#92400e',
    channel: 'Telegram', channelClass: 'tg',
    status: '⚡ Эскалация', statusClass: 'inbox-badge escalation',
    time: '09:15 сегодня',
    quality: 41, qualityColor: '#f59e0b',
    plan: 'Pro', planClass: 'pro',
    joinDate: 'с 10.02.2025',
    dialogs: '14 всего',
    tags: ['Продуктивность', 'Бизнес'],
    notes: '',
    transferred: false,
    consentStatus: undefined,  // undefined | 'accepted' | 'declined'
    mode: 'ai',                // 'ai' | 'human'
    learningExamples: 0,
    messages: [
      { type: 'incoming', text: 'Привет! Интересуют цены на консультации. Как лучше связаться?', time: '09:12' },
      { type: 'clone-warn', confidence: '41%', text: 'Привет! По поводу консультаций — лучше уточни напрямую, так как условия могут меняться. Ты можешь написать мне лично @alexey_real, и мы... [клон не завершил ответ]', time: '09:15' },
    ]
  },
  {
    name: 'Мария К.',
    avatarLetter: 'М',
    avatarBg: '#e8d5fb', avatarColor: '#7c3aed',
    channel: 'Telegram', channelClass: 'tg',
    status: '🟢 Активен', statusClass: 'inbox-badge active-now',
    time: '10:42 сегодня',
    quality: 92, qualityColor: 'var(--green)',
    plan: 'Pro', planClass: 'pro',
    joinDate: 'с 23.01.2025',
    dialogs: '28 всего',
    tags: ['Маркетинг', 'Творчество'],
    notes: '',
    transferred: false,
    consentStatus: 'accepted',
    mode: 'ai',
    learningExamples: 28,
    messages: [
      { type: 'incoming', text: 'Алексей, посоветуйте по продвижению в Instagram.', time: '10:40' },
      { type: 'clone', confidence: '92%', text: 'Мария, из опыта вижу: ключевое — аутентичность и регулярность. Раз в неделю Reels + ежедневные Stories. Тогда алгоритм разгоняет чаще.', time: '10:42' },
    ]
  },
  {
    name: 'Екатерина В.',
    avatarLetter: 'Е',
    avatarBg: '#fce7f3', avatarColor: '#be185d',
    channel: 'Instagram', channelClass: 'ig',
    status: '🟢 Активен', statusClass: 'inbox-badge active-now',
    time: '11:30 сегодня',
    quality: 78, qualityColor: '#3b82f6',
    plan: 'VIP', planClass: 'vip',
    joinDate: 'с 05.03.2025',
    dialogs: '9 всего',
    tags: ['Психология', 'Личностный рост'],
    notes: '',
    transferred: false,
    consentStatus: 'declined',
    mode: 'ai',
    learningExamples: 0,
    messages: [
      { type: 'incoming', text: 'Хочу узнать про твоё видение на взаимоотношения.', time: '11:28' },
      { type: 'clone', confidence: '78%', text: 'Главное — понять свои ценности и ценности партнёра. Разногласия избежны, если слушать и уважать друг друга.', time: '11:30' },
    ]
  },
  {
    name: 'Сергей Н.',
    avatarLetter: 'С',
    avatarBg: '#d1fae5', avatarColor: '#065f46',
    channel: 'WhatsApp', channelClass: 'wa',
    status: '⚡ Эскалация', statusClass: 'inbox-badge escalation',
    time: '08:55 сегодня',
    quality: 54, qualityColor: '#f59e0b',
    plan: 'Базовый', planClass: 'basic',
    joinDate: 'с 17.04.2025',
    dialogs: '4 всего',
    tags: ['Технологии', 'AI'],
    notes: '',
    transferred: false,
    consentStatus: undefined,
    mode: 'ai',
    learningExamples: 0,
    messages: [
      { type: 'incoming', text: 'Как начать с AI-инструментами для бизнеса?', time: '08:52' },
      { type: 'clone-warn', confidence: '54%', text: 'Для начала рекомендую ChatGPT или Notion AI... [клон не доответил]', time: '08:55' },
    ]
  },
  {
    name: 'Андрей П.',
    avatarLetter: 'А',
    avatarBg: '#dbeafe', avatarColor: '#2563eb',
    channel: 'Telegram', channelClass: 'tg',
    status: '54% предупреждение', statusClass: 'inbox-badge warn',
    time: '2 мая',
    quality: 54, qualityColor: '#f59e0b',
    plan: 'Базовый', planClass: 'basic',
    joinDate: 'с 02.05.2025',
    dialogs: '3 всего',
    tags: ['Финансы', 'Инвестиции'],
    notes: '',
    transferred: false,
    consentStatus: 'accepted',
    mode: 'ai',
    learningExamples: 3,
    messages: [
      { type: 'incoming', text: 'Есть ли у тебя опыт в инвестициях в недвижимость?', time: '14:05' },
      { type: 'clone-warn', confidence: '54%', text: 'да, занимался несколькими проектами... [клон не уверен в ответе]', time: '14:08' },
    ]
  },
  {
    name: 'Игорь',
    avatarLetter: 'И',
    avatarBg: '#fef3c7', avatarColor: '#92400e',
    channel: 'Instagram', channelClass: 'ig',
    status: '✓ Завершён', statusClass: 'inbox-badge resolved',
    time: '2 мая',
    quality: 79, qualityColor: '#3b82f6',
    plan: 'Базовый', planClass: 'basic',
    joinDate: 'с 20.04.2025',
    dialogs: '6 всего',
    tags: ['Спорт', 'Здоровье'],
    notes: '',
    transferred: false,
    consentStatus: 'accepted',
    mode: 'ai',
    learningExamples: 6,
    messages: [
      { type: 'incoming', text: 'Посоветуйте про режим для бегунов.', time: '09:30' },
      { type: 'clone', confidence: '79%', text: 'Начинай с 3-4 раза в неделю по 20-30 мин. Добавляй +5 мин каждую неделю.', time: '09:32' },
    ]
  },
];

/* ─── DIALOGS STATES & DYNAMIC RENDERING ─── */

let currentDialogTab = 'inbox';
let currentDialogChannel = 'all';
let currentDialogSearch = '';
let infoPanelCollapsed = false;

function renderDialogsList() {
  const container = document.getElementById('dialogsList');
  if (!container) return;

  container.innerHTML = '';

  dialogsData.forEach((d, index) => {
    // 1. Search filter
    if (currentDialogSearch) {
      const q = currentDialogSearch.toLowerCase();
      const nameMatch = d.name.toLowerCase().includes(q);
      const textMatch = d.messages.some(m => m.text.toLowerCase().includes(q));
      if (!nameMatch && !textMatch) return;
    }

    // 2. Tab filter
    const isEscalation = d.quality < 65 && !d.transferred && d.status.includes('Эскалация');
    const isWarning = d.status.includes('предупреждение') || d.status.includes('warn') || (d.quality < 65 && !d.transferred);
    const isFinished = d.status.includes('Завершён') || d.status.includes('resolved');

    if (currentDialogTab === 'escalations') {
      if (!isEscalation && !isWarning) return;
    } else if (currentDialogTab === 'inbox') {
      if (isFinished) return;
    }

    // 3. Channel filter
    if (currentDialogChannel !== 'all') {
      if (d.channel.toLowerCase() !== currentDialogChannel) return;
    }

    // Create list item element
    const el = document.createElement('div');
    const isActive = index === activeDialogIndex;
    el.className = `dc-item ${isActive ? 'active' : ''} ${isEscalation ? 'escalation-item' : ''}`;
    el.setAttribute('data-index', index);
    el.setAttribute('onclick', `selectDialog(${index})`);

    // Badges HTML
    let badgeHtml = '';
    if (isEscalation) {
      badgeHtml += `<span class="inbox-badge escalation">⚡ Эскалация</span>`;
    } else if (isFinished) {
      badgeHtml += `<span class="inbox-badge resolved">✓ Завершён</span>`;
    } else if (isWarning) {
      badgeHtml += `<span class="inbox-badge warn">⚠ ${d.quality}%</span>`;
    } else {
      badgeHtml += `<span class="inbox-badge active-now">🟢 Активен</span>`;
    }

    if (!isWarning && !isFinished) {
      badgeHtml += ` <span class="inbox-badge quality good">${d.quality}%</span>`;
    }

    const lastMsg = d.messages[d.messages.length - 1];
    const previewText = lastMsg ? lastMsg.text : 'Нет сообщений';

    el.innerHTML = `
      <div class="dc-avatar-wrap">
        <div class="dc-avatar" style="background:${d.avatarBg};color:${d.avatarColor}">${d.avatarLetter}</div>
        <div class="dc-channel-icon ${d.channelClass}" title="${d.channel}"></div>
      </div>
      <div class="dc-info">
        <div class="dc-top">
          <span class="dc-name">${d.name}</span>
          <span class="dc-time">${d.time.split(' ')[0]}</span>
        </div>
        <p class="dc-text">${escapeHtml(previewText)}</p>
        <div class="dc-badges-row">
          ${badgeHtml}
        </div>
      </div>
    `;
    container.appendChild(el);
  });
}

function updateDialogCounts() {
  const activeCount = dialogsData.filter(d => !d.status.includes('Завершён') && !d.status.includes('resolved')).length;
  const escalationCount = dialogsData.filter(d => d.quality < 65 && !d.transferred && d.status.includes('Эскалация')).length;

  const tabActive = document.getElementById('tabActiveBadge');
  if (tabActive) tabActive.textContent = activeCount;

  const tabEsc = document.getElementById('tabEscalationBadge');
  if (tabEsc) tabEsc.textContent = escalationCount;

  const statActive = document.getElementById('statActiveCount');
  if (statActive) statActive.textContent = activeCount;

  const statEsc = document.getElementById('statEscalationCount');
  if (statEsc) statEsc.textContent = escalationCount;
}

function filterDialogsList() {
  const input = document.getElementById('dialogsSearchInput');
  if (input) {
    currentDialogSearch = input.value;
    renderDialogsList();
  }
}

function toggleInfoPanel() {
  infoPanelCollapsed = !infoPanelCollapsed;
  const layout = document.getElementById('dialogsLayout');
  const btn = document.getElementById('infoPanelToggleBtn');
  if (layout) {
    layout.classList.toggle('info-collapsed', infoPanelCollapsed);
  }
  if (btn) {
    btn.classList.toggle('active', !infoPanelCollapsed);
  }
}

function selectDialog(index) {
  activeDialogIndex = index;
  const d = dialogsData[index];

  // Update contact list active state without redraw
  const items = document.querySelectorAll('.dc-item');
  items.forEach(item => {
    const idx = parseInt(item.getAttribute('data-index'));
    item.classList.toggle('active', idx === index);
  });

  // On mobile, open chat panel
  const chatPanel = document.getElementById('chatPanel');
  if (window.innerWidth <= 768 && chatPanel) {
    chatPanel.classList.add('open');
  }

  // Update chat header
  const chatAvatar = document.querySelector('#chatPanel .chat-avatar');
  if (chatAvatar) {
    chatAvatar.style.background = d.avatarBg;
    chatAvatar.style.color = d.avatarColor;
    chatAvatar.textContent = d.avatarLetter;
  }
  const chatName = document.querySelector('#chatPanel .chat-name');
  if (chatName) chatName.innerHTML = `${d.name} <span class="inbox-badge channel ${d.channelClass}" style="font-size:10px">${d.channel}</span>`;
  const chatStatus = document.querySelector('#chatPanel .chat-status');
  if (chatStatus) chatStatus.textContent = `${d.plan}-подписчик · ${d.dialogs} · ${d.joinDate}`;

  // Show/hide escalation banner
  const banner = document.getElementById('escalationBanner');
  if (banner) {
    banner.style.display = (d.quality < 65 && !d.transferred) ? 'flex' : 'none';
  }

  // Render messages
  const container = document.getElementById('chatMessages');
  if (container) {
    container.innerHTML = '';

    // ── Mode divider at top of conversation ──
    const topDivider = document.createElement('div');
    topDivider.className = `mode-divider ${d.mode === 'human' ? 'human' : 'ai'}`;
    topDivider.innerHTML = d.mode === 'human'
      ? `<div class="mode-divider-label">👤 Алексей подключился</div>`
      : `<div class="mode-divider-label">🤖 AI-клон Алексея</div>`;
    container.appendChild(topDivider);

    d.messages.forEach(msg => {
      const el = document.createElement('div');
      if (msg.type === 'incoming') {
        el.className = 'msg incoming';
        el.innerHTML = `
          <div class="msg-avatar" style="background:${d.avatarBg};color:${d.avatarColor}">${d.avatarLetter}</div>
          <div class="msg-bubble incoming-bubble">${escapeHtml(msg.text)}<div class="msg-time">${msg.time}</div></div>`;
      } else if (msg.type === 'clone') {
        el.className = 'msg clone-msg';
        el.innerHTML = `
          <div class="msg-confidence">Клон · Уверенность ${msg.confidence}</div>
          <div class="msg-bubble outgoing-bubble">${escapeHtml(msg.text)}<div class="msg-time">${msg.time} ✓</div></div>`;
      } else if (msg.type === 'clone-warn') {
        el.className = 'msg clone-msg';
        el.innerHTML = `
          <div class="msg-confidence warn">Клон · Уверенность ${msg.confidence} · ⚠ Требует проверки</div>
          <div class="msg-bubble outgoing-bubble warn-bubble">${escapeHtml(msg.text)}<div class="msg-time">${msg.time} ✓</div></div>`;
      } else if (msg.type === 'operator') {
        el.className = 'msg clone-msg';
        el.innerHTML = `
          <div class="msg-confidence" style="color:var(--green)">👤 Алексей (лично)</div>
          <div class="msg-bubble outgoing-bubble" style="border:1.5px solid rgba(16,185,129,0.3)">${escapeHtml(msg.text)}<div class="msg-time">${msg.time}</div></div>`;
      } else if (msg.type === 'mode-switch') {
        const modeLabels = {
          human: '👤 Алексей подключился',
          back:  '🤖 Алексей вернул управление клону',
          ai:    '🤖 AI-клон Алексея'
        };
        el.className = `mode-divider ${msg.mode}`;
        el.innerHTML = `<div class="mode-divider-label">${modeLabels[msg.mode] || msg.text}</div>`;
      }
      container.appendChild(el);
    });

    // ── Consent card: inject after first clone message if no decision ──
    const hasCloneMsg = d.messages.some(m => m.type === 'clone' || m.type === 'clone-warn');
    if (hasCloneMsg && d.consentStatus === undefined) {
      const cc = document.createElement('div');
      cc.className = 'consent-card';
      cc.innerHTML = `
        <span class="consent-card-icon">🔒</span>
        <div class="consent-card-title">Соглашение на обучение клона</div>
        <div class="consent-card-body">Алексей (AI-клон) хотел бы использовать этот диалог для улучшения своей модели. Вы контролируете это в любой момент.</div>
        <ul class="consent-card-points">
          <li>Диалог остаётся приватным и не публикуется</li>
          <li>Данные обезличиваются перед обучением</li>
          <li>Согласие можно отозвать в настройках</li>
          <li>Реальный Алексей может подключиться к чату</li>
        </ul>
        <div class="consent-card-actions">
          <button class="consent-btn-accept" onclick="acceptConsent(${index})">✓ Согласиться</button>
          <button class="consent-btn-decline" onclick="declineConsent(${index})">Нет, пропустить</button>
        </div>`;
      container.appendChild(cc);
    } else if (d.consentStatus === 'accepted') {
      const pill = document.createElement('div');
      pill.innerHTML = `
        <div class="consent-status-pill accepted">✓ Согласие на обучение получено</div>
        <div class="consent-status-note">Диалог используется для улучшения клона · <span onclick="navigate('settings')" style="color:var(--accent);cursor:pointer;text-decoration:underline">Управление →</span></div>`;
      container.appendChild(pill);
    } else if (d.consentStatus === 'declined') {
      const pill = document.createElement('div');
      pill.innerHTML = `<div class="consent-status-pill declined">— Обучение отключено для этого диалога</div>`;
      container.appendChild(pill);
    }

    // Add suggestion block for escalation dialogs
    if (d.quality < 65 && !d.transferred) {
      const sugg = document.createElement('div');
      sugg.className = 'inbox-suggestion-block';
      sugg.innerHTML = `
        <div class="isb-header">💡 Предлагаемый ответ от клона</div>
        <div class="isb-text">Привет, ${d.name.split(' ')[0]}! Консультации я провожу через Telegram — напиши @alexey_real.</div>
        <div class="isb-actions">
          <button class="btn-primary sm" onclick="showToast('Ответ одобрен и отправлен ✓')">✓ Одобрить и отправить</button>
          <button class="btn-outline-sm" onclick="showToast('Редактирую...')">✏️ Редактировать</button>
          <button class="btn-outline-sm" onclick="takeoverDialog()">👤 Войти в диалог</button>
        </div>`;
      container.appendChild(sugg);
    }
    container.scrollTop = container.scrollHeight;
  }


  // Update takeover/return button state
  const inputArea = document.getElementById('chatInputArea');
  const monitorArea = document.getElementById('chatMonitorArea');
  if (d.transferred) {
    if (inputArea) inputArea.style.display = 'block';
    if (monitorArea) monitorArea.style.display = 'none';
  } else {
    if (inputArea) inputArea.style.display = 'none';
    if (monitorArea) monitorArea.style.display = 'block';
  }

  // Update right info panel
  const qs = document.getElementById('dipQualityScore');
  const qb = document.getElementById('dipQualityBar');
  const qn = document.getElementById('dipQualityNote');
  if (qs) qs.textContent = d.quality + '%';
  if (qb) { qb.style.width = d.quality + '%'; qb.style.background = d.qualityColor; }
  if (qn) qn.textContent = d.quality >= 80 ? 'Хорошее качество — клон отвечает уверенно' :
    d.quality >= 65 ? 'Среднее качество — небольшая неуверенность' :
    'Ниже нормы — клон не уверен в ответе';

  const dipChannel = document.getElementById('dipChannel');
  if (dipChannel) dipChannel.innerHTML = `<div class="dsn-ch-dot ${d.channelClass}"></div> ${d.channel}`;
  const dipStatus = document.getElementById('dipStatus');
  if (dipStatus) { dipStatus.textContent = d.status; dipStatus.className = d.statusClass; }
  const dipTime = document.getElementById('dipTime');
  if (dipTime) dipTime.textContent = d.time;
  const dipMsgCount = document.getElementById('dipMsgCount');
  if (dipMsgCount) dipMsgCount.textContent = d.messages.length;

  const dipUserAvatar = document.getElementById('dipUserAvatar');
  if (dipUserAvatar) { dipUserAvatar.textContent = d.avatarLetter; dipUserAvatar.style.background = d.avatarBg; dipUserAvatar.style.color = d.avatarColor; }
  const dipUserName = document.getElementById('dipUserName');
  if (dipUserName) dipUserName.textContent = d.name;
  const dipUserTag = document.getElementById('dipUserTag');
  if (dipUserTag) dipUserTag.textContent = `${d.plan} · ${d.joinDate}`;
  const dipUserPlan = document.getElementById('dipUserPlan');
  if (dipUserPlan) { dipUserPlan.textContent = d.plan; dipUserPlan.className = `plan-badge ${d.planClass}`; }
  const dipUserDialogs = document.getElementById('dipUserDialogs');
  if (dipUserDialogs) dipUserDialogs.textContent = d.dialogs;
  const dipUserTags = document.getElementById('dipUserTags');
  if (dipUserTags) dipUserTags.innerHTML = d.tags.map(t => `<span class="tag-chip">${t}</span>`).join('');

  // Load persisted note
  const dipNotes = document.getElementById('dipNotes');
  if (dipNotes) dipNotes.value = d.notes;

  // Update takeover buttons (both right panel and chat header)
  const dipTakeoverBtn = document.getElementById('dipTakeoverBtn');
  if (dipTakeoverBtn) {
    dipTakeoverBtn.textContent = d.transferred ? '← Вернуть клону' : '↗ Взять диалог';
    dipTakeoverBtn.onclick = d.transferred ? returnToClone : takeoverDialog;
  }
  const headerTakeoverBtn = document.getElementById('chatTakeoverBtnHeader');
  if (headerTakeoverBtn) {
    headerTakeoverBtn.textContent = d.transferred ? '← Вернуть клону' : '↗ Взять диалог';
    headerTakeoverBtn.onclick = d.transferred ? returnToClone : takeoverDialog;
  }
}

function saveDialogNote(val) {
  dialogsData[activeDialogIndex].notes = val;
}
function closeChatPanel() {
  const chatPanel = document.getElementById('chatPanel');
  if (chatPanel) chatPanel.classList.remove('open');
}

/* ─── SEND MESSAGE ─── */
function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const targetIndex = activeDialogIndex;

  // Append operator message to array
  dialogsData[targetIndex].messages.push({
    type: 'operator',
    text: msg,
    time: getTime()
  });

  // Clear input
  input.value = '';

  // Redraw messages and scroll
  selectDialog(targetIndex);

  // Update contact list preview
  renderDialogsList();

  // Simulate user incoming reply
  setTimeout(() => {
    dialogsData[targetIndex].messages.push({
      type: 'incoming',
      text: 'Спасибо за ответ! Это очень полезно.',
      time: getTime()
    });

    // Redraw if still looking at the same conversation
    if (activeDialogIndex === targetIndex) {
      selectDialog(targetIndex);
    }

    // Update contact list preview
    renderDialogsList();
  }, 1500);
}

/* ─── MIRROR CHAT ─── */
const mirrorResponses = [
  'Интересный вопрос. Основываясь на твоих паттернах общения, я вижу, что ты часто избегаешь прямых ответов на сложные темы.',
  'Анализируя твои данные за последние 30 дней, могу сказать: ты стал более открытым в разговорах о продуктивности.',
  'Твоя сильная сторона — умение объяснять сложное простыми словами. Это видно в 87% твоих диалогов.',
  'Я замечаю паттерн: когда тебе задают вопросы о личном, ты переводишь разговор на экспертные темы. Это защитная реакция?',
  'Твои ценности говорят о высоком стремлении к развитию. Это мотивирует 68% твоих решений.',
];
let mirrorIdx = 0;

function appendMirrorMsg(chatEl, type, text) {
  const el = document.createElement('div');
  el.className = 'mirror-msg ' + type;
  el.textContent = text;
  chatEl.appendChild(el);
  chatEl.scrollTop = chatEl.scrollHeight;
  return el;
}

function sendMirrorMsg() {
  const input = document.getElementById('mirrorInput');
  const msg = input ? input.value.trim() : '';
  if (!msg) return;
  const chat = document.getElementById('mirrorChat');
  if (!chat) return;
  appendMirrorMsg(chat, 'user', msg);
  input.value = '';
  const typing = appendMirrorMsg(chat, 'clone', '...');
  setTimeout(() => {
    typing.textContent = mirrorResponses[mirrorIdx % mirrorResponses.length];
    mirrorIdx++;
    chat.scrollTop = chat.scrollHeight;
  }, 900);
}

function askMirror(question) {
  const input = document.getElementById('mirrorInput');
  if (input) { input.value = question; sendMirrorMsg(); }
}

function openMirrorSheet() {
  const overlay = document.getElementById('mirrorChatOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  const sheet = document.getElementById('mirrorChatSheet');
  if (sheet && sheet.children.length === 0) {
    appendMirrorMsg(sheet, 'system', '✦ Я твоё зеркало. Задай любой вопрос о себе, своих паттернах или будущем.');
  }
  setTimeout(() => {
    const inp = document.getElementById('mirrorInputSheet');
    if (inp) inp.focus();
  }, 350);
}

function closeMirrorSheet() {
  const overlay = document.getElementById('mirrorChatOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function handleMirrorOverlayClick(e) {
  if (e.target === document.getElementById('mirrorChatOverlay')) closeMirrorSheet();
}

function sendMirrorSheetMsg() {
  const input = document.getElementById('mirrorInputSheet');
  const msg = input ? input.value.trim() : '';
  if (!msg) return;
  const chat = document.getElementById('mirrorChatSheet');
  if (!chat) return;
  appendMirrorMsg(chat, 'user', msg);
  input.value = '';
  const typing = appendMirrorMsg(chat, 'clone', '...');
  setTimeout(() => {
    typing.textContent = mirrorResponses[mirrorIdx % mirrorResponses.length];
    mirrorIdx++;
    chat.scrollTop = chat.scrollHeight;
  }, 900);
}

function askMirrorSheet(question) {
  const input = document.getElementById('mirrorInputSheet');
  if (input) { input.value = question; sendMirrorSheetMsg(); }
}

function openMirrorChat() {
  if (window.innerWidth <= 768) {
    openMirrorSheet();
  } else {
    const input = document.getElementById('mirrorInput');
    if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth' }); }
  }
}

/* ─── ENTER KEY HANDLERS ─── */
document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }
  const mirrorInput = document.getElementById('mirrorInput');
  if (mirrorInput) {
    mirrorInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); sendMirrorMsg(); }
    });
  }
  // Init
  initHomeCharts();
  // Init dialogs rendering
  if (document.getElementById('dialogsList')) {
    renderDialogsList();
    updateDialogCounts();
    selectDialog(0);
  }
  // Animate progress bars
  setTimeout(animateBars, 300);
});

function animateBars() {
  document.querySelectorAll('.progress-bar, .ch-bar, .task-bar, .sr-bar, .trait-bar, .value-bar, .ch-stat-bar, .topic-bar').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = w; }, 50);
  });
}

/* ─── HELPERS ─── */
function getTime() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
}
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ═══════════════════════════════════════════════════════════
   CHARTS (Canvas-based)
   ═══════════════════════════════════════════════════════════ */

/* ─── BRAIN ANIMATION (Home progress card) ─── */
function initBrainCanvas() {
  const canvas = document.getElementById('brainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const nodes = [];
  for (let i = 0; i < 20; i++) {
    nodes.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 1
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - dist / 60)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    // Nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124,58,237,0.6)';
      ctx.fill();
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── ACCURACY LINE CHART ─── */
function drawLineChart(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || canvas.width;
  const H = canvas.height;
  canvas.width = W;
  ctx.clearRect(0, 0, W, H);
  if (!data || data.length < 2) return;
  const min = Math.min(...data) - 5;
  const max = Math.max(...data) + 5;
  const range = max - min || 1;
  const pad = { l: 8, r: 8, t: 10, b: 20 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;
  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * chartW,
    y: pad.t + chartH - ((v - min) / range) * chartH
  }));
  // Gradient fill
  const grad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
  grad.addColorStop(0, color.replace(')', ',0.2)').replace('rgb', 'rgba'));
  grad.addColorStop(1, color.replace(')', ',0)').replace('rgb', 'rgba'));
  ctx.beginPath();
  ctx.moveTo(pts[0].x, H - pad.b);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, H - pad.b);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  // Line
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();
  // Dots
  pts.forEach((p, i) => {
    if (i === pts.length - 1) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.strokeStyle = color.replace(')', ',0.3)').replace('rgb', 'rgba');
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  // X labels
  const labels = ['12 апр', '19 апр', '26 апр', '3 мая', 'Сегодня'];
  ctx.font = '9px Inter, sans-serif';
  ctx.fillStyle = '#9898b0';
  ctx.textAlign = 'center';
  labels.forEach((lbl, i) => {
    const x = pad.l + (i / (labels.length - 1)) * chartW;
    ctx.fillText(lbl, x, H - 2);
  });
}

/* ─── BAR CHART ─── */
function drawBarChart(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || canvas.width;
  const H = canvas.height;
  canvas.width = W;
  ctx.clearRect(0, 0, W, H);
  const max = Math.max(...data);
  const barW = (W - 16) / data.length - 3;
  const pad = { t: 10, b: 24 };
  const chartH = H - pad.t - pad.b;
  data.forEach((v, i) => {
    const x = 8 + i * ((W - 16) / data.length);
    const barH = (v / max) * chartH;
    const y = pad.t + chartH - barH;
    const isLast = i === data.length - 1;
    // Bar
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, isLast ? color : color.replace(')', ',0.4)').replace('rgb', 'rgba'));
    grad.addColorStop(1, color.replace(')', ',0.15)').replace('rgb', 'rgba'));
    ctx.fillStyle = grad;
    const r = 3;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
    ctx.lineTo(x + barW, y + barH);
    ctx.lineTo(x, y + barH);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fill();
    if (isLast) {
      // Tooltip
      ctx.fillStyle = color;
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`+${Math.round(v * 0.05)}`, x + barW / 2, y - 4);
    }
  });
}

/* ─── RADAR CHART ─── */
function drawRadarChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2 + 10;
  const R = Math.min(W, H) * 0.38;
  const labels = ['Стиль', 'Знания', 'Память', 'Эмоции', 'Юмор', 'Длина'];
  const values = [0.91, 0.78, 0.82, 0.68, 0.42, 0.76];
  const N = labels.length;
  const angleStart = -Math.PI / 2;
  // Grid
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const angle = angleStart + (i / N) * Math.PI * 2;
      const x = cx + Math.cos(angle) * R * (ring / 4);
      const y = cy + Math.sin(angle) * R * (ring / 4);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // Spokes
  for (let i = 0; i < N; i++) {
    const angle = angleStart + (i / N) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // Data polygon
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const angle = angleStart + (i / N) * Math.PI * 2;
    const x = cx + Math.cos(angle) * R * values[i];
    const y = cy + Math.sin(angle) * R * values[i];
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  grad.addColorStop(0, 'rgba(124,58,237,0.3)');
  grad.addColorStop(1, 'rgba(124,58,237,0.08)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(124,58,237,0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Labels
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = '#5a5870';
  ctx.textAlign = 'center';
  for (let i = 0; i < N; i++) {
    const angle = angleStart + (i / N) * Math.PI * 2;
    const x = cx + Math.cos(angle) * (R + 16);
    const y = cy + Math.sin(angle) * (R + 16);
    ctx.fillText(labels[i], x, y + 3);
  }
}

/* ─── ANALYTICS CHART ─── */
function initAnalyticsChart() {
  setTimeout(() => {
    drawLineChart('analyticsChart', [38, 42, 55, 48, 65, 72, 58, 80, 88, 76, 95, 110], 'rgb(124,58,237)');
  }, 50);
}

/* ─── INIT HOME ─── */
function initHomeCharts() {
  setTimeout(() => {
    initBrainCanvas();
    drawLineChart('accuracyChart', [78, 80, 79, 82, 84, 83, 85, 84, 86], 'rgb(124,58,237)');
  }, 100);
}

/* ─── INIT STUDIO ─── */
function initStudioCharts() {
  setTimeout(() => {
    drawRadarChart('radarChart');
    drawBarChart('barChart', [120, 145, 135, 160, 175, 155, 190, 210, 180, 220, 240, 247, 270], 'rgb(124,58,237)');
    drawLineChart('studioAccChart', [78, 80, 79, 82, 84, 83, 85, 84, 86], 'rgb(124,58,237)');
  }, 100);
}

/* ─── RESIZE HANDLER ─── */
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (currentPage === 'home') initHomeCharts();
    if (currentPage === 'studio') initStudioCharts();
    if (currentPage === 'analytics') initAnalyticsChart();
  }, 200);
});

/* ─── NOTIFICATION BADGE ─── */
document.getElementById('notifBtn')?.addEventListener('click', () => {
  notifyCreator(0); // Симуляция уведомления для Дмитрия А. (индекс 0)
});

/* ─── TOAST NOTIFICATION ─── */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 80px; right: 20px; z-index: 9999;
    background: ${type === 'error' ? '#ef4444' : '#1a1b2e'};
    color: #fff; padding: 12px 20px; border-radius: 10px;
    font-size: 13px; font-weight: 500; font-family: Inter, sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
    max-width: 300px; line-height: 1.4;
  `;
  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}';
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ─── TEST DIALOG MODAL ─── */
function openTestModal() {
  const modal = document.getElementById('testDialogModal');
  if (modal) {
    modal.classList.remove('hidden');
    setTimeout(() => document.getElementById('testModalInput')?.focus(), 100);
  }
}
function closeTestModal() {
  const modal = document.getElementById('testDialogModal');
  if (modal) modal.classList.add('hidden');
}

const cloneResponses = [
  { text: "Привет! Рад поговорить. Что тебя интересует — продуктивность, предпринимательство или что-то личное?", conf: 94 },
  { text: "Смотри, я обычно структурирую задачи через принцип «три главных дела в день». Всё остальное — если останется время. Это реально помогает не распыляться.", conf: 91 },
  { text: "Хороший вопрос. Я думаю, что лучший инструмент — тот, которым реально пользуешься. Для меня это Notion для заметок и Telegram для быстрых идей.", conf: 88 },
  { text: "Честно говоря, я сам борюсь с прокрастинацией. Главное — начать с самого маленького шага. Буквально «открой файл» — и часто этого достаточно.", conf: 86 },
  { text: "Утро у меня начинается без телефона первые 30 минут. Кофе, записи в дневнике, приоритеты дня. Звучит банально, но это реально работает.", conf: 89 },
  { text: "Это интересная тема. У меня есть по этому поводу несколько мыслей — хочешь разберём подробнее?", conf: 82 },
  { text: "Я не уверен на 100% в этом, давай лучше опираться на то, что я точно знаю из опыта.", conf: 61 },
];
let cloneRespIdx = 0;

function buildCloneReply(chat, text, conf) {
  const confEl = document.createElement('div');
  confEl.className = 'test-confidence ' + (conf >= 75 ? 'high' : 'low');
  confEl.textContent = '🤖 Клон · уверенность: ' + conf + '%';
  chat.appendChild(confEl);
  const msgEl = document.createElement('div');
  msgEl.className = 'mirror-msg clone';
  msgEl.textContent = text;
  chat.appendChild(msgEl);
  chat.scrollTop = chat.scrollHeight;
}

function sendTestModalMsg() {
  const input = document.getElementById('testModalInput');
  const chat = document.getElementById('testModalChat');
  if (!input || !chat || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';
  const userEl = document.createElement('div');
  userEl.className = 'mirror-msg user';
  userEl.textContent = text;
  chat.appendChild(userEl);
  const typingEl = document.createElement('div');
  typingEl.className = 'mirror-msg system';
  typingEl.innerHTML = '<em>Клон печатает...</em>';
  chat.appendChild(typingEl);
  chat.scrollTop = chat.scrollHeight;
  const resp = cloneResponses[cloneRespIdx % cloneResponses.length];
  cloneRespIdx++;
  setTimeout(() => {
    typingEl.remove();
    buildCloneReply(chat, resp.text, resp.conf);
  }, 800 + Math.random() * 600);
}

/* ─── STUDIO SANDBOX (TESTING TAB) ─── */
function sendTestMsg() {
  const input = document.getElementById('testChatInput');
  const chat = document.getElementById('testChatArea');
  if (!input || !chat || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';
  const userEl = document.createElement('div');
  userEl.className = 'mirror-msg user';
  userEl.textContent = text;
  chat.appendChild(userEl);
  const typingEl = document.createElement('div');
  typingEl.className = 'mirror-msg system';
  typingEl.innerHTML = '<em>Клон обрабатывает запрос...</em>';
  chat.appendChild(typingEl);
  chat.scrollTop = chat.scrollHeight;
  const resp = cloneResponses[cloneRespIdx % cloneResponses.length];
  cloneRespIdx++;
  setTimeout(() => {
    typingEl.remove();
    buildCloneReply(chat, resp.text, resp.conf);
  }, 900);
}

function clearTestChat() {
  const chat = document.getElementById('testChatArea');
  if (chat) chat.innerHTML = '<div class="mirror-msg system">Чат очищен. Введите любое сообщение для теста клона.</div>';
}

function runTestScenario(idx, question) {
  const input = document.getElementById('testChatInput');
  if (input) { input.value = question; sendTestMsg(); }
}

/* ─── GO TO LEARNING TAB ─── */
function goToLearning() {
  navigate('studio');
  setTimeout(() => {
    const tabs = document.querySelectorAll('#page-studio .tab-btn');
    const contents = document.querySelectorAll('#page-studio .tab-content');
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.add('hidden'));
    const learningBtn = [...tabs].find(t => t.dataset.tab === 'studio-learning');
    const learningContent = document.getElementById('studio-learning');
    if (learningBtn) learningBtn.classList.add('active');
    if (learningContent) learningContent.classList.remove('hidden');
  }, 80);
}

/* ─── COPY CLONE LINK ─── */
function copyCloneLink() {
  const url = 'https://cloone.app/alexey';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('Ссылка скопирована: ' + url));
  } else { showToast('Ссылка: ' + url); }
}

/* ─── TRAINING START ─── */
function startTraining() {
  const log = document.querySelector('#studio-learning .train-log');
  const statusBadge = document.querySelector('#studio-learning .sr-status');
  if (statusBadge) { statusBadge.textContent = '⏳ Обучается...'; statusBadge.className = 'sr-status pending'; }
  if (log) {
    log.innerHTML = '<div class="tl-item running">⏳ Загрузка источников данных...</div>';
    const steps = [
      '✓ Источники загружены — 24 833 фрагмента',
      '✓ Векторизация данных',
      '✓ Обучение эпоха 1/3',
      '✓ Обучение эпоха 2/3',
      '✓ Обучение эпоха 3/3 — завершено!'
    ];
    steps.forEach((s, i) => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'tl-item success';
        el.textContent = s;
        log.appendChild(el);
        if (i === steps.length - 1 && statusBadge) {
          statusBadge.textContent = '✓ Завершено';
          statusBadge.className = 'sr-status synced';
        }
      }, (i + 1) * 1100);
    });
  }
  showToast('🧠 Обучение запущено...');
}

/* ─── MONETIZATION CHART ─── */
function initMonetizationChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas || canvas.dataset.drawn) return;
  canvas.dataset.drawn = 'true';
  const w = canvas.parentElement.offsetWidth - 48 || 400;
  const h = 130;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
  const values = [18200, 22500, 28300, 33100, 36350, 44550];
  const maxV = Math.max(...values);
  const pad = { t: 16, r: 16, b: 30, l: 52 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
  grad.addColorStop(0, 'rgba(124,58,237,0.22)');
  grad.addColorStop(1, 'rgba(124,58,237,0)');
  const pts = values.map((v, i) => ({
    x: pad.l + (i / (values.length - 1)) * cw,
    y: pad.t + ch - (v / maxV) * ch
  }));
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pad.t + ch);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, pad.t + ch);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();
  pts.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#7c3aed'; ctx.fill();
    ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
  });
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'center';
  months.forEach((m, i) => {
    ctx.fillText(m, pad.l + (i / (values.length - 1)) * cw, h - 6);
  });
  ctx.textAlign = 'right';
  [0, 0.5, 1].forEach(t => {
    const val = (maxV * t / 1000).toFixed(0);
    const y = pad.t + ch - t * ch;
    ctx.fillText(val + 'k', pad.l - 6, y + 4);
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + cw, y); ctx.stroke();
  });
}

/* ─── KEYBOARD & OVERLAY HANDLERS ─── */
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('testDialogModal');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeTestModal(); });
  const voiceOverlay = document.getElementById('voiceInterviewModal');
  if (voiceOverlay) voiceOverlay.addEventListener('click', e => { if (e.target === voiceOverlay) closeVoiceInterview(); });
  document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') { closeTestModal(); closeVoiceInterview(); } 
  });
  const tmi = document.getElementById('testModalInput');
  if (tmi) tmi.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTestModalMsg(); } });
  const tci = document.getElementById('testChatInput');
  if (tci) tci.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); sendTestMsg(); } });
});

/* ─── INTEGRATIONS: DRAG & DROP UPLOAD ─── */
function handleIntDrop(event) {
  event.preventDefault();
  const zone = event.currentTarget;
  zone.classList.remove('drag-over');
  const files = event.dataTransfer.files;
  if (!files || files.length === 0) return;
  const file = files[0];
  const allowed = ['.zip', '.json', '.txt', '.csv'];
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowed.includes(ext)) {
    showToast('⚠️ Формат не поддерживается. Используйте .zip, .json или .txt');
    return;
  }
  const sizeMB = (file.size / 1024 / 1024).toFixed(1);
  showToast(`📂 Загружаю: ${file.name} (${sizeMB} МБ)...`);
  // Simulate parse progress
  setTimeout(() => showToast(`✅ Файл "${file.name}" успешно обработан`), 2200);
}

/* ─── COPY CLONE LINK ─── */
function copyCloneLink() {
  const url = 'cloone.app/alexey';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('🔗 Ссылка скопирована: ' + url));
  } else {
    showToast('🔗 Ссылка: ' + url);
  }
}



/* ─── MONITORING INBOX: TAKEOVER ─── */
function takeoverDialog() {
  const index = activeDialogIndex;
  const d = dialogsData[index];
  d.transferred = true;
  d.mode = 'human';
  
  // Add mode-switch message if not already there
  d.messages.push({
    type: 'mode-switch',
    mode: 'human',
    time: getTime()
  });
  
  selectDialog(index);
  updateDialogCounts();
  renderDialogsList();
  showToast('↗ Вы взяли диалог — теперь отвечаете лично');
  const inp = document.getElementById('chatInput');
  if (inp) inp.focus();
}

function returnToClone() {
  const index = activeDialogIndex;
  const d = dialogsData[index];
  d.transferred = false;
  d.mode = 'ai';
  
  d.messages.push({
    type: 'mode-switch',
    mode: 'back',
    time: getTime()
  });
  
  selectDialog(index);
  updateDialogCounts();
  renderDialogsList();
  showToast('🤖 Диалог возвращён клону');
}

/* ─── CONSENT SYSTEM ACTIONS ─── */
function acceptConsent(index) {
  dialogsData[index].consentStatus = 'accepted';
  showToast('✓ Согласие на обучение получено');
  selectDialog(index);
  updateSettingsLearningStats();
}

function declineConsent(index) {
  dialogsData[index].consentStatus = 'declined';
  showToast('✕ Обучение отключено для этого диалога');
  selectDialog(index);
  updateSettingsLearningStats();
}

/* ─── EXTENDED CREATOR NOTIFICATION ─── */
function notifyCreator(index) {
  // Remove existing creator toast if there is one
  document.querySelector('.toast-creator')?.remove();

  const d = dialogsData[index];
  const lastMsg = d.messages[d.messages.length - 1]?.text || 'Нет сообщений';
  const shortMsg = lastMsg.length > 80 ? lastMsg.substring(0, 80) + '...' : lastMsg;

  const toast = document.createElement('div');
  toast.className = 'toast-creator';
  toast.innerHTML = `
    <button class="toast-creator-close" onclick="this.parentElement.remove()">×</button>
    <div class="toast-creator-header">
      <div class="toast-creator-icon">⚡</div>
      <div>
        <div class="toast-creator-title">Клон просит помощи</div>
        <div class="toast-creator-sub">${d.name} (${d.channel})</div>
      </div>
    </div>
    <div class="toast-creator-preview">"${escapeHtml(shortMsg)}"</div>
    <div class="toast-creator-actions">
      <button class="toast-btn-join" onclick="joinDialog(${index})">Войти в диалог</button>
      <button class="toast-btn-later" onclick="this.parentElement.parentElement.remove()">Позже</button>
    </div>
  `;

  document.body.appendChild(toast);
  
  // Auto-remove after 10 seconds if not clicked
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }
  }, 10000);
}

function joinDialog(index) {
  // Takeover the dialog
  activeDialogIndex = index;
  dialogsData[index].transferred = true;
  dialogsData[index].mode = 'human';

  // Push mode switch message
  const d = dialogsData[index];
  d.messages.push({
    type: 'mode-switch',
    mode: 'human',
    time: getTime()
  });

  // Select and render
  selectDialog(index);
  updateDialogCounts();
  renderDialogsList();

  // Remove the notification toast
  document.querySelector('.toast-creator')?.remove();
  
  showToast('👤 Вы подключились к диалогу');
}

/* ─── LEARNING & CONSENT STATS DASHBOARD ─── */
function updateSettingsLearningStats() {
  const total = dialogsData.length;
  if (total === 0) return;

  let accepted = 0;
  let declined = 0;
  let none = 0;

  dialogsData.forEach(d => {
    if (d.consentStatus === 'accepted') accepted++;
    else if (d.consentStatus === 'declined') declined++;
    else none++;
  });

  const pctAccepted = Math.round((accepted / total) * 100);
  const pctDeclined = Math.round((declined / total) * 100);
  const pctNone = Math.round((none / total) * 100);

  // Update DOM elements if they exist
  const elAccepted = document.getElementById('statConsentAccepted');
  const elNone = document.getElementById('statConsentNone');
  const elDeclined = document.getElementById('statConsentDeclined');

  if (elAccepted) elAccepted.textContent = accepted;
  if (elNone) elNone.textContent = none;
  if (elDeclined) elDeclined.textContent = declined;

  const barAccepted = document.getElementById('barConsentAccepted');
  const barNone = document.getElementById('barConsentNone');
  const barDeclined = document.getElementById('barConsentDeclined');

  if (barAccepted) barAccepted.style.width = pctAccepted + '%';
  if (barNone) barNone.style.width = pctNone + '%';
  if (barDeclined) barDeclined.style.width = pctDeclined + '%';

  const pctElAccepted = document.getElementById('pctConsentAccepted');
  const pctElNone = document.getElementById('pctConsentNone');
  const pctElDeclined = document.getElementById('pctConsentDeclined');

  if (pctElAccepted) pctElAccepted.textContent = pctAccepted + '%';
  if (pctElNone) pctElNone.textContent = pctNone + '%';
  if (pctElDeclined) pctElDeclined.textContent = pctDeclined + '%';
}

function exportConsentLog() {
  showToast('📥 Экспорт лога согласий запущен...');
  setTimeout(() => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Channel,ConsentStatus,Date\n"
      + dialogsData.map(d => `"${d.name}","${d.channel}","${d.consentStatus || 'none'}","${d.joinDate}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `consent_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('📥 Лог согласий сохранён в CSV');
  }, 1000);
}

/* ═══════════════════════════ DIARY ═══════════════════════════ */

const DIARY_MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const DIARY_DAYS_SHORT = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const DIARY_DAYS_LONG = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];

let diaryCalDate = new Date();
let diaryActiveMood = '😊';
let diaryActiveCat = 'reflection';

// Entries with localStorage persistence
let diaryEntries = JSON.parse(localStorage.getItem('clooneDiaryEntries') || '[]');
if (!diaryEntries.length) {
  diaryEntries = [
    { id: 0, date: new Date().toISOString(), title: 'Итоги дня и планы', mood: '😊', cat: 'reflection', text: 'Сегодня я думал о запуске CLOONE и о том, как строится продукт, который по-настоящему отражает человека...', train: true },
    { id: 1, date: new Date(Date.now()-86400000).toISOString(), title: 'Большой прорыв в продукте', mood: '🤩', cat: 'ideas', text: 'Нашёл архитектурное решение для базы данных диалогов. Это меняет всё...', train: true },
    { id: 2, date: new Date(Date.now()-3*86400000).toISOString(), title: 'Сложный разговор с инвестором', mood: '😐', cat: 'events', text: 'Встреча прошла не так, как ожидал. Нужно переосмыслить питч...', train: false },
    { id: 3, date: new Date(Date.now()-5*86400000).toISOString(), title: 'Новые мысли о будущем', mood: '😊', cat: 'thoughts', text: 'Я всё больше думаю о том, что CLOONE — это не просто продукт...', train: true },
    { id: 4, date: new Date(Date.now()-7*86400000).toISOString(), title: 'Благодарность за команду', mood: '🙏', cat: 'gratitude', text: 'Сегодня понял насколько важна команда. Без поддержки...', train: true },
  ];
}

function initDiaryPage() {
  renderDiaryCalendar();
  updateDiaryEditorDate();
}

function renderDiaryCalendar() {
  const grid = document.getElementById('diaryCalGrid');
  const title = document.getElementById('diaryCalTitle');
  if (!grid || !title) return;

  const y = diaryCalDate.getFullYear();
  const m = diaryCalDate.getMonth();
  title.textContent = DIARY_MONTHS[m] + ' ' + y;

  // Day of week headers (Mon first)
  const dows = DIARY_DAYS_SHORT.map(d => `<div class="dcg-dow">${d}</div>`).join('');

  // First day of month (adjust to Mon=0)
  const first = new Date(y, m, 1);
  let startDow = first.getDay(); // 0=Sun
  startDow = (startDow === 0) ? 6 : startDow - 1; // Mon=0

  const daysInMonth = new Date(y, m+1, 0).getDate();
  const today = new Date();
  const entryDays = new Set(diaryEntries.map(e => {
    const d = new Date(e.date);
    return d.getFullYear() === y && d.getMonth() === m ? d.getDate() : null;
  }).filter(Boolean));

  let cells = '';
  // Empty cells for days before start
  for (let i = 0; i < startDow; i++) cells += `<div class="dcg-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
    const hasEntry = entryDays.has(d);
    cells += `<div class="dcg-day${isToday?' today':''}${hasEntry?' has-entry':''}" onclick="jumpDiaryDay(${y},${m},${d})">${d}</div>`;
  }

  grid.innerHTML = dows + cells;
}

function shiftDiaryMonth(delta) {
  diaryCalDate.setMonth(diaryCalDate.getMonth() + delta);
  renderDiaryCalendar();
}

function jumpDiaryDay(y, m, d) {
  const entry = diaryEntries.find(e => {
    const ed = new Date(e.date);
    return ed.getFullYear()===y && ed.getMonth()===m && ed.getDate()===d;
  });
  if (entry) loadDiaryEntry(diaryEntries.indexOf(entry));
}

function updateDiaryEditorDate() {
  const el = document.getElementById('diaryEditorDate');
  if (!el) return;
  const now = new Date();
  el.textContent = `${now.getDate()} ${DIARY_MONTHS[now.getMonth()].toLowerCase()} ${now.getFullYear()}, ${DIARY_DAYS_LONG[now.getDay()]}`;
}

function setMood(btn, mood) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  diaryActiveMood = mood;
}

function setDiaryCat(btn) {
  document.querySelectorAll('.diary-cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  diaryActiveCat = btn.dataset.cat;
}

function insertPrompt(text) {
  const ta = document.getElementById('diaryTextarea');
  if (!ta) return;
  const pos = ta.selectionStart;
  const val = ta.value;
  ta.value = val.slice(0, pos) + (pos > 0 ? '\n' : '') + text + ' ' + val.slice(pos);
  ta.focus();
}

function saveDiaryEntry() {
  const title = document.getElementById('diaryEntryTitle')?.value.trim() || 'Без названия';
  const text = document.getElementById('diaryTextarea')?.value.trim() || '';
  const train = document.getElementById('diaryTrainToggle')?.checked || false;
  if (!text) { showToast('⚠️ Напиши что-нибудь перед сохранением'); return; }
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    title, mood: diaryActiveMood, cat: diaryActiveCat,
    text, train,
  };
  diaryEntries.unshift(entry);
  localStorage.setItem('clooneDiaryEntries', JSON.stringify(diaryEntries));
  renderDiaryCalendar();
  renderDiaryEntriesList();
  showToast(train ? '💾 Запись сохранена и добавлена в обучение клона 🧠' : '💾 Запись сохранена');
  // Clear editor
  document.getElementById('diaryEntryTitle').value = '';
  document.getElementById('diaryTextarea').value = '';
}

function loadDiaryEntry(index) {
  const entry = diaryEntries[index];
  if (!entry) return;
  document.getElementById('diaryEntryTitle').value = entry.title;
  document.getElementById('diaryTextarea').value = entry.text;
  const trainToggle = document.getElementById('diaryTrainToggle');
  if (trainToggle) trainToggle.checked = entry.train;
  // Set mood
  document.querySelectorAll('.mood-btn').forEach(b => {
    b.classList.toggle('active', b.title === moodTitle(entry.mood));
  });
  // Set category
  document.querySelectorAll('.diary-cat').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === entry.cat);
  });
  // Highlight entry in list
  document.querySelectorAll('.diary-entry-item').forEach((el, i) => el.classList.toggle('active', i === index));
}

function moodTitle(emoji) {
  const map = {'🤩':'Отлично','😊':'Хорошо','😐':'Нейтрально','😔':'Устал','😤':'Сложно'};
  return map[emoji] || '';
}

function renderDiaryEntriesList() {
  const list = document.getElementById('diaryEntriesList');
  if (!list) return;
  list.innerHTML = diaryEntries.map((e, i) => {
    const d = new Date(e.date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const dateStr = isToday ? 'Сегодня' : `${d.getDate()} ${DIARY_MONTHS[d.getMonth()].slice(0,3).toLowerCase()}`;
    const catLabel = {reflection:'🪞 Рефлексия',ideas:'💡 Идеи',plans:'🎯 Планы',events:'📅 События',thoughts:'🧠 Мысли',gratitude:'🙏 Благодарность'}[e.cat] || '';
    return `<div class="diary-entry-item${i===0?' active':''}" onclick="loadDiaryEntry(${i})">
      <div class="dei-top">
        <span class="dei-mood">${e.mood}</span>
        <span class="dei-date">${dateStr}</span>
        ${e.train ? '<span class="dei-train" title="Добавлено в обучение">🧠</span>' : ''}
      </div>
      <div class="dei-title">${escapeHtml(e.title)}</div>
      <div class="dei-preview">${escapeHtml(e.text)}</div>
      ${catLabel ? `<div class="dei-tags"><span class="tag-chip" style="font-size:9px">${catLabel}</span></div>` : ''}
    </div>`;
  }).join('');
}

function filterDiary(btn, type) {
  document.querySelectorAll('.diary-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const list = document.getElementById('diaryEntriesList');
  if (!list) return;
  const filtered = type === 'train' ? diaryEntries.filter(e => e.train) : diaryEntries;
  list.innerHTML = filtered.map((e, i) => {
    const d = new Date(e.date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const dateStr = isToday ? 'Сегодня' : `${d.getDate()} ${DIARY_MONTHS[d.getMonth()].slice(0,3).toLowerCase()}`;
    const catLabel = {reflection:'🪞 Рефлексия',ideas:'💡 Идеи',plans:'🎯 Планы',events:'📅 События',thoughts:'🧠 Мысли',gratitude:'🙏 Благодарность'}[e.cat] || '';
    return `<div class="diary-entry-item${i===0?' active':''}" onclick="loadDiaryEntry(${diaryEntries.indexOf(e)})">
      <div class="dei-top">
        <span class="dei-mood">${e.mood}</span>
        <span class="dei-date">${dateStr}</span>
        ${e.train ? '<span class="dei-train">🧠</span>' : ''}
      </div>
      <div class="dei-title">${escapeHtml(e.title)}</div>
      <div class="dei-preview">${escapeHtml(e.text)}</div>
      ${catLabel ? `<div class="dei-tags"><span class="tag-chip" style="font-size:9px">${catLabel}</span></div>` : ''}
    </div>`;
  }).join('');
}

function newDiaryEntry() {
  document.getElementById('diaryEntryTitle').value = '';
  document.getElementById('diaryTextarea').value = '';
  document.querySelectorAll('.diary-entry-item').forEach(el => el.classList.remove('active'));
  document.getElementById('diaryTextarea')?.focus();
}

function addReminder() {
  showToast('⏰ Откроется форма добавления напоминания...');
}

function aiExpandEntry() {
  const ta = document.getElementById('diaryTextarea');
  if (!ta || !ta.value.trim()) { showToast('⚠️ Напиши хотя бы несколько слов'); return; }
  showToast('✦ AI расширяет запись...');
  setTimeout(() => {
    ta.value += '\n\nРазмышляя об этом глубже, я понимаю, что это связано с моим стремлением к постоянному развитию и желанием оставить значимый след. Каждый шаг — это не просто задача, а часть большого пути.';
    showToast('✦ Запись расширена клоном');
  }, 1200);
}

// Init stats on load
updateSettingsLearningStats();

// Dynamic user name injection from localStorage
(function() {
  const userName = localStorage.getItem('cloone_user_name') || 'Алексей';
  if (userName !== 'Алексей') {
    // 1. Update elements with class 'user-name'
    document.querySelectorAll('.user-name').forEach(el => {
      el.textContent = userName;
    });

    // 2. Update page-title welcome headers
    document.querySelectorAll('.page-title').forEach(el => {
      if (el.textContent.includes('Добро пожаловать, Алексей')) {
        el.innerHTML = `Добро пожаловать, ${userName} 👋`;
      }
      if (el.textContent.includes('Зеркало Алексея')) {
        el.textContent = `Зеркало ${userName}`;
      }
    });

    // 3. Update text inputs values
    document.querySelectorAll('input[type="text"]').forEach(input => {
      if (input.value === 'Алексей') {
        input.value = userName;
      }
      if (input.value === 'Алексей (клон)') {
        input.value = `${userName} (клон)`;
      }
    });

    // 4. Update large names in settings profile
    const nameBig = document.querySelector('.set-name-big');
    if (nameBig && nameBig.textContent === 'Алексей') {
      nameBig.textContent = userName;
    }

    // 5. Update onboarding data val
    document.querySelectorAll('.plc-data-val').forEach(el => {
      if (el.textContent.startsWith('Алексей,')) {
        el.textContent = el.textContent.replace('Алексей,', `${userName},`);
      }
    });

    // 6. Update user initials (avatar)
    document.querySelectorAll('.user-avatar, .set-avatar, .chat-avatar').forEach(avatar => {
      if (avatar.textContent === 'А') {
        avatar.textContent = userName.charAt(0).toUpperCase();
      }
    });

    // 7. Update mirror title and sub
    const mTitle = document.querySelector('.mirror-chat-title');
    if (mTitle && mTitle.textContent.includes('Алексея')) {
      mTitle.textContent = `Зеркало ${userName}`;
    }

    // 8. Update public clone cards
    document.querySelectorAll('.mon-clone-card p').forEach(el => {
      if (el.textContent.includes('Алексей (CLOONE)')) {
        el.textContent = `${userName} (CLOONE)`;
      }
      if (el.textContent.includes('cloone.app/alexey')) {
        el.innerHTML = `cloone.app/${userName.toLowerCase().replace(/\s+/g, '')}`;
      }
    });
  }
})();

/* ═══════════════════════════ VOICE INTERVIEW LOGIC ═══════════════════════════ */

const INTERVIEW_QUESTIONS = [
  {
    level: "Уровень 0 · Якорь идентичности",
    question: "Привет! Давай создадим твоего цифрового двойника. Для начала представься: как тебя зовут и как ты предпочитаешь, чтобы к тебе обращались?",
    simText: "Меня зовут [USER_NAME]. Мне нравится, когда ко мне обращаются просто [USER_NAME], на ты. Я предприниматель и исследователь."
  },
  {
    level: "Уровень 1 · Движущие силы (Роли)",
    question: "Супер! Расскажи немного о своей основной деятельности. Кем ты видишь себя сейчас и в какую главную жизненную игру ты играешь?",
    simText: "Сейчас моя главная игра — это создание инновационных технологических проектов, которые реально меняют жизнь людей. Я вижу себя как новатора, изобретателя, но в то же время ответственного родителя и творца."
  },
  {
    level: "Уровень 1 · Движущие силы (Прошлое)",
    question: "Интересно. А если взглянуть в прошлое: какие роли ты перерос, от каких целей отказался и почему?",
    simText: "Раньше я много времени тратил на то, чтобы доказать кому-то свою ценность, гонялся чисто за финансовыми показателями. Был таким классическим достигатором-предпринимателем, но быстро выгорел и понял, что в этом нет живой искры."
  },
  {
    level: "Уровень 1 · Движущие силы (Будущее & Амбиции)",
    question: "Каковы твои главные амбиции и планы на ближайшие 5-10 лет? Каких вершин хочешь достичь?",
    simText: "В ближайшие годы я хочу построить устойчивую экосистему вокруг искусственного интеллекта, которая позволит людям автоматизировать рутину и раскрыть творческий потенциал. Мечтаю создать мировой бренд."
  },
  {
    level: "Уровень 1 · Движущие силы (Вдохновители)",
    question: "Кто из известных личностей или исторических фигур тебя по-настоящему вдохновляет и чем именно?",
    simText: "Меня очень вдохновляют люди вроде Леонардо да Винчи за его универсальность и сочетание науки с искусством, а также Ричард Фейнман за его искреннюю детскую любознательность и простоту в объяснении сложных вещей."
  },
  {
    level: "Уровень 4 · Голос и стиль речи",
    question: "Опиши свой привычный стиль общения. Ты предпочитаешь лаконичность, иронию, или, может, любишь подробные рассуждения?",
    simText: "Я общаюсь достаточно свободно, люблю использовать иронию, но стараюсь не перебарщивать. Предпочитаю баланс между глубоким смыслом и простотой формулировок, иногда использую сленг, но по делу."
  }
];

let currentInterviewIdx = 0;
let isInterviewRecording = false;
let interviewSpeechInterval = null;
let interviewSpeechTimeout = null;

function openVoiceInterview() {
  currentInterviewIdx = 0;
  isInterviewRecording = false;
  clearInterval(interviewSpeechInterval);
  clearTimeout(interviewSpeechTimeout);
  
  const modal = document.getElementById('voiceInterviewModal');
  if (modal) modal.classList.remove('hidden');
  
  updateInterviewUI();
}

function closeVoiceInterview() {
  isInterviewRecording = false;
  clearInterval(interviewSpeechInterval);
  clearTimeout(interviewSpeechTimeout);
  
  const modal = document.getElementById('voiceInterviewModal');
  if (modal) modal.classList.add('hidden');
  
  // Stop recording animation
  const btn = document.getElementById('btnRecord');
  if (btn) {
    btn.classList.remove('recording');
    btn.innerHTML = "🎙️ Начать говорить";
  }
  const wave = document.getElementById('waveCircle');
  if (wave) wave.classList.remove('recording');
  const bars = document.getElementById('waveformBars');
  if (bars) bars.classList.remove('recording');
}

function updateInterviewUI() {
  const userName = localStorage.getItem('cloone_user_name') || 'Алексей';
  const qData = INTERVIEW_QUESTIONS[currentInterviewIdx];
  
  document.getElementById('interviewLevel').textContent = qData.level;
  document.getElementById('interviewQuestion').textContent = qData.question.replace(/\[USER_NAME\]/g, userName);
  document.getElementById('interviewTimer').textContent = `Вопрос ${currentInterviewIdx + 1} из ${INTERVIEW_QUESTIONS.length}`;
  
  document.getElementById('transcriptionStatus').textContent = "🎙️ Готов к записи...";
  document.getElementById('transcriptionStatus').style.color = "var(--text-dim)";
  document.getElementById('transcriptionText').textContent = "Нажмите кнопку «Начать говорить», чтобы дать ответ голосом...";
  document.getElementById('transcriptionText').style.opacity = "0.6";
  
  document.getElementById('btnPrevQuestion').disabled = (currentInterviewIdx === 0);
  document.getElementById('btnNextQuestion').textContent = (currentInterviewIdx === INTERVIEW_QUESTIONS.length - 1) ? "Завершить интервью ➔" : "Пропустить →";
  
  const btn = document.getElementById('btnRecord');
  if (btn) {
    btn.classList.remove('recording');
    btn.innerHTML = "🎙️ Начать говорить";
  }
  const wave = document.getElementById('waveCircle');
  if (wave) wave.classList.remove('recording');
  const bars = document.getElementById('waveformBars');
  if (bars) bars.classList.remove('recording');
}

function toggleInterviewRecording() {
  const btn = document.getElementById('btnRecord');
  const wave = document.getElementById('waveCircle');
  const bars = document.getElementById('waveformBars');
  const status = document.getElementById('transcriptionStatus');
  const textContainer = document.getElementById('transcriptionText');
  const userName = localStorage.getItem('cloone_user_name') || 'Алексей';
  
  if (!isInterviewRecording) {
    // Start Recording
    isInterviewRecording = true;
    btn.classList.add('recording');
    btn.innerHTML = "⏹️ Остановить запись";
    if (wave) wave.classList.add('recording');
    if (bars) bars.classList.add('recording');
    
    status.textContent = "🎙️ Идёт запись аудиопотока...";
    status.style.color = "var(--orange)";
    textContainer.style.opacity = "1";
    textContainer.textContent = "...";
    
    // Simulate real-time speech-to-text
    const qData = INTERVIEW_QUESTIONS[currentInterviewIdx];
    const fullText = qData.simText.replace(/\[USER_NAME\]/g, userName);
    const words = fullText.split(' ');
    let wordIdx = 0;
    
    interviewSpeechInterval = setInterval(() => {
      if (wordIdx < words.length) {
        textContainer.textContent = words.slice(0, wordIdx + 1).join(' ') + "...";
        wordIdx++;
      } else {
        clearInterval(interviewSpeechInterval);
        stopInterviewRecording(true);
      }
    }, 350);
  } else {
    // Manually Stop Recording
    clearInterval(interviewSpeechInterval);
    stopInterviewRecording(false);
  }
}

function stopInterviewRecording(autoCompleted) {
  isInterviewRecording = false;
  
  const btn = document.getElementById('btnRecord');
  const wave = document.getElementById('waveCircle');
  const bars = document.getElementById('waveformBars');
  const status = document.getElementById('transcriptionStatus');
  const textContainer = document.getElementById('transcriptionText');
  const userName = localStorage.getItem('cloone_user_name') || 'Алексей';
  
  if (btn) {
    btn.classList.remove('recording');
    btn.innerHTML = "🎙️ Говорить заново";
  }
  if (wave) wave.classList.remove('recording');
  if (bars) bars.classList.remove('recording');
  
  status.textContent = "✅ Аудио записано и транскрибировано!";
  status.style.color = "var(--green)";
  
  const qData = INTERVIEW_QUESTIONS[currentInterviewIdx];
  const fullText = qData.simText.replace(/\[USER_NAME\]/g, userName);
  textContainer.textContent = fullText;
}

function prevInterviewQuestion() {
  if (currentInterviewIdx > 0) {
    currentInterviewIdx--;
    clearInterval(interviewSpeechInterval);
    clearTimeout(interviewSpeechTimeout);
    isInterviewRecording = false;
    updateInterviewUI();
  }
}

function nextInterviewQuestion() {
  clearInterval(interviewSpeechInterval);
  clearTimeout(interviewSpeechTimeout);
  isInterviewRecording = false;
  
  if (currentInterviewIdx < INTERVIEW_QUESTIONS.length - 1) {
    currentInterviewIdx++;
    updateInterviewUI();
  } else {
    // Complete Onboarding - Show Calibration screen
    startInterviewCalibration();
  }
}

function startInterviewCalibration() {
  const body = document.querySelector('.voice-interview-body');
  const modalBox = document.querySelector('.voice-interview-box');
  
  // Hide normal interview body, show calibration loader
  body.style.display = 'none';
  
  const calLoader = document.createElement('div');
  calLoader.className = 'calibration-loader';
  calLoader.id = 'calibrationLoader';
  calLoader.innerHTML = `
    <div class="cal-spinner"></div>
    <h3 class="cal-title">Калибровка личности и 24 векторов...</h3>
    <div class="cal-steps-list">
      <div class="cal-step-item active" id="cs1">⏳ Транскрипция аудиофайлов...</div>
      <div class="cal-step-item" id="cs2">🧬 Вычисление семантических связей векторов...</div>
      <div class="cal-step-item" id="cs3">🎙️ Тональный анализ и слепок голоса...</div>
      <div class="cal-step-item" id="cs4">🧠 Инициализация Personality Core v1.0...</div>
    </div>
  `;
  modalBox.appendChild(calLoader);
  
  // Animate steps
  setTimeout(() => {
    const cs1 = document.getElementById('cs1');
    if (cs1) {
      cs1.classList.remove('active');
      cs1.classList.add('done');
      cs1.innerHTML = '✅ Транскрипция аудиофайлов завершена';
    }
    const cs2 = document.getElementById('cs2');
    if (cs2) cs2.classList.add('active');
  }, 1000);
  
  setTimeout(() => {
    const cs2 = document.getElementById('cs2');
    if (cs2) {
      cs2.classList.remove('active');
      cs2.classList.add('done');
      cs2.innerHTML = '✅ Семантические связи векторов вычислены';
    }
    const cs3 = document.getElementById('cs3');
    if (cs3) cs3.classList.add('active');
  }, 2000);
  
  setTimeout(() => {
    const cs3 = document.getElementById('cs3');
    if (cs3) {
      cs3.classList.remove('active');
      cs3.classList.add('done');
      cs3.innerHTML = '✅ Тональный анализ и слепок голоса готовы';
    }
    const cs4 = document.getElementById('cs4');
    if (cs4) cs4.classList.add('active');
  }, 3000);
  
  setTimeout(() => {
    const cs4 = document.getElementById('cs4');
    if (cs4) {
      cs4.classList.remove('active');
      cs4.classList.add('done');
      cs4.innerHTML = '✅ Personality Core v1.0 успешно инициализирован';
    }
    
    setTimeout(() => {
      // Finalize
      localStorage.setItem('cloone_onboarded', 'true');
      closeVoiceInterview();
      
      // Restore layout
      calLoader.remove();
      body.style.display = 'block';
      
      showToast('🎉 Успешно! Характер клона откалиброван на основе вашего голоса. 24 вектора личности обновлены!', 'success');
      
      // Update UI elements in profile to show done status
      const plc1 = document.querySelector('.profile-level-card.partial');
      if (plc1) {
        plc1.className = 'profile-level-card done';
        const status = plc1.querySelector('.plc-status');
        if (status) {
          status.textContent = '✓ Заполнен';
          status.className = 'plc-status done';
        }
        const btn = plc1.querySelector('.btn-primary');
        if (btn) {
          btn.className = 'btn-outline-xs';
          btn.textContent = 'Изменить';
          btn.style.padding = '';
          btn.style.fontSize = '';
          btn.onclick = function() { showToast('Редактирование уровня 1...'); };
        }
      }
      
      const plc4 = document.querySelector('.profile-level-card.critical');
      if (plc4) {
        plc4.className = 'profile-level-card done';
        const badge = plc4.querySelector('.plc-critical-badge');
        if (badge) badge.remove();
        const status = plc4.querySelector('.plc-status');
        if (status) {
          status.textContent = '✓ Заполнен';
          status.className = 'plc-status done';
        }
        const btn = plc4.querySelector('.btn-primary');
        if (btn) {
          btn.className = 'btn-outline-xs';
          btn.textContent = 'Изменить';
          btn.style.padding = '';
          btn.style.fontSize = '';
          btn.onclick = function() { showToast('Редактирование уровня 4...'); };
        }
      }
      
      // Switch level status in sidebar/widgets
      document.querySelectorAll('.onb-level.partial').forEach(el => {
        el.className = 'onb-level done';
        const bar = el.querySelector('.onb-level-bar');
        if (bar) bar.style.width = '100%';
        const status = el.querySelector('.onb-level-status');
        if (status) {
          status.textContent = '✓ 100%';
          status.className = 'onb-level-status done';
        }
      });
      document.querySelectorAll('.onb-level.critical').forEach(el => {
        el.className = 'onb-level done';
        const bar = el.querySelector('.onb-level-bar');
        if (bar) bar.style.width = '100%';
        const status = el.querySelector('.onb-level-status');
        if (status) {
          status.textContent = '✓ 100%';
          status.className = 'onb-level-status done';
        }
      });
      
      // Update general metrics
      const psbVals = document.querySelectorAll('.psb-val');
      if (psbVals.length >= 4) {
        psbVals[0].textContent = '41 / 47';
        psbVals[1].textContent = '3.5 / 6';
        psbVals[3].textContent = 'Готов к работе';
        psbVals[3].className = 'psb-val green';
      }
      
    }, 800);
  }, 4000);
}

