// Cloone Interactive Dashboard Tour — v2 (fixed layout with i18n)
(function () {
  const container = document.getElementById('clone-demo');
  if (!container) return;

  const lang = document.documentElement.lang || 'en';

  // Translation Dictionary
  const t = {
    en: {
      title: 'Cloone — Alex (Pro)',
      online: 'Clone Online',
      tab_home: 'Home',
      tab_mon: 'Monetization',
      tab_mon_tag: '$600',
      tab_int: 'Channels',
      tab_int_tag: '5',
      tab_mir: 'AI Mirror',
      tab_mir_tag: 'New',
      user_name: 'Alex',
      user_plan: 'Pro Plan',
      mob_home: 'Home',
      mob_mon: 'Revenue',
      mob_int: 'Channels',
      mob_mir: 'Mirror',
      
      // Home Tab
      home_head: 'Dashboard',
      home_sub: 'Clone status and daily activity metrics.',
      home_progress: 'Digitization Progress',
      home_accuracy: 'Accuracy: 84%',
      home_hint: 'The clone adopted your Tone of Voice based on 14,000 processed messages.',
      home_today: 'For Today',
      home_replied: 'Replied by clone',
      home_replied_val: '47 messages',
      home_saved: 'Time saved',
      home_saved_val: '5h 20m',
      home_escalated: 'On escalation',
      home_escalated_val: '3 chats',
      home_sync: 'Real-time sync with Telegram & Instagram',
      home_mimicry: 'Personality mimicry by channels',
      
      // Monetization Tab
      mon_head: 'Monetization',
      mon_sub: 'Expert earnings and platform business model.',
      mon_rev_lbl: '30-Day Revenue',
      mon_rev_val: '$600',
      mon_rev_sub: '+$110 vs last month',
      mon_net_lbl: 'Net Revenue (90%)',
      mon_net_val: '$540',
      mon_net_sub: 'Cloone Fee (10%): ',
      mon_net_sub_val: '$60',
      mon_subs_lbl: 'Subscriptions',
      mon_subs_val: '127',
      mon_subs_sub: '+14 new',
      mon_plans_lbl: 'Active Clone Plans',
      mon_plan_basic: 'Basic',
      mon_plan_basic_desc: 'Basic Access',
      mon_plan_basic_price: '$7 / mo.',
      mon_plan_basic_subs: '54 subscribers',
      mon_plan_basic_feat: '50 msgs/day · Telegram',
      mon_plan_pro: 'Pro',
      mon_plan_pro_desc: 'Premium Access',
      mon_plan_pro_price: '$14 / mo.',
      mon_plan_pro_subs: '30 subscribers',
      mon_plan_pro_feat: 'Unlimited · All channels',
      mon_hint: 'Experts set subscription plans, subscribers pay for direct value. The platform receives a 10% royalty on successful transactions.',
      
      // Channels Tab
      int_head: 'Communication Channels',
      int_sub: 'Your clone replies automatically in messengers.',
      int_tg: 'Telegram Bot',
      int_tg_desc: 'Auto-replies in DMs and channels',
      int_ig: 'Instagram Direct',
      int_ig_desc: 'Auto-replies on mentions and DMs',
      int_wa: 'WhatsApp Business',
      int_wa_desc: 'Customer support agent',
      int_em: 'Email Inbox',
      int_em_desc: 'Drafts responses to emails',
      int_wb: 'Web Widget',
      int_wb_desc: 'Clone on your personal blog',
      int_connected: 'Connected',
      int_connect: 'Connect',
      
      // Mirror Tab
      mir_head: 'AI Mirror',
      mir_sub: 'AI objectively analyzes your personality patterns.',
      mir_ins1_title: 'Blind Spot: Avoiding Delegation',
      mir_ins1_desc: 'In 74% of analyzed cases, you take complex tasks on yourself instead of delegating to your team.',
      mir_ins1_meta: '12 days ago · Accuracy 91%',
      mir_ins2_title: 'Strength: Crisis Communication',
      mir_ins2_desc: 'In conflict dialogues, the clone retains a friendly tone and reduces tension within 3 replies.',
      mir_ins2_meta: '3 weeks ago · Accuracy 88%',
      mir_ins3_title: 'Focus: Business & Systems',
      mir_ins3_desc: '82% of your thoughts are about scaling business and schedule optimization.',
      mir_ins3_meta: 'Yesterday · Accuracy 95%'
    },
    ru: {
      title: 'Cloone — Алексей (Pro)',
      online: 'Клон онлайн',
      tab_home: 'Главная',
      tab_mon: 'Монетизация',
      tab_mon_tag: '₽44к',
      tab_int: 'Интеграции',
      tab_int_tag: '5',
      tab_mir: 'Зеркало ИИ',
      tab_mir_tag: 'New',
      user_name: 'Алексей',
      user_plan: 'Pro-тариф',
      mob_home: 'Главная',
      mob_mon: '₽ Доходы',
      mob_int: 'Каналы',
      mob_mir: 'Зеркало',
      
      // Home Tab
      home_head: 'Панель управления',
      home_sub: 'Статус клона и активность за сегодня.',
      home_progress: 'Прогресс оцифровки',
      home_accuracy: 'Точность: 84%',
      home_hint: 'Клон перенял ваш Tone of Voice на основе 14 000 сообщений.',
      home_today: 'За сегодня',
      home_replied: 'Отвечено клоном',
      home_replied_val: '47 сообщений',
      home_saved: 'Сэкономлено времени',
      home_saved_val: '5ч 20м',
      home_escalated: 'На эскалации',
      home_escalated_val: '3 диалога',
      home_sync: 'Синхронизация с Telegram & Instagram в реальном времени',
      home_mimicry: 'Имитация личности по каналам',
      
      // Monetization Tab
      mon_head: 'Монетизация',
      mon_sub: 'Доходы эксперта и бизнес-модель платформы.',
      mon_rev_lbl: 'Доход за 30 дней',
      mon_rev_val: '₽44 550',
      mon_rev_sub: '+₽8 200 vs прошлый мес.',
      mon_net_lbl: 'Чистый доход (90%)',
      mon_net_val: '₽40 095',
      mon_net_sub: 'Комиссия Cloone (10%): ',
      mon_net_sub_val: '₽4 455',
      mon_subs_lbl: 'Подписки',
      mon_subs_val: '127',
      mon_subs_sub: '+14 новых',
      mon_plans_lbl: 'Активные тарифы клона',
      mon_plan_basic: 'Basic',
      mon_plan_basic_desc: 'Базовый доступ',
      mon_plan_basic_price: '₽490 / мес.',
      mon_plan_basic_subs: '54 подписчика',
      mon_plan_basic_feat: '50 сообщ./день · Telegram',
      mon_plan_pro: 'Pro',
      mon_plan_pro_desc: 'Расширенный доступ',
      mon_plan_pro_price: '₽990 / мес.',
      mon_plan_pro_subs: '30 подписчиков',
      mon_plan_pro_feat: 'Безлимит · Все каналы',
      mon_hint: 'Эксперты создают тарифы, подписчики платят за прямую ценность. Платформа получает 10% от каждой успешной транзакции.',
      
      // Channels Tab
      int_head: 'Каналы связи',
      int_sub: 'Клон отвечает автоматически в ваших мессенджерах.',
      int_tg: 'Telegram Bot',
      int_tg_desc: 'Автоответы в ЛС и каналах',
      int_ig: 'Instagram Direct',
      int_ig_desc: 'Автоответы на отметки и в ЛС',
      int_wa: 'WhatsApp Business',
      int_wa_desc: 'Поддержка клиентов',
      int_em: 'Email Inbox',
      int_em_desc: 'Подготовка ответов на письма',
      int_wb: 'Виджет для сайта',
      int_wb_desc: 'Клон в вашем блоге',
      int_connected: 'Подключено',
      int_connect: 'Подключить',
      
      // Mirror Tab
      mir_head: 'Зеркало ИИ',
      mir_sub: 'ИИ беспристрастно анализирует паттерны вашей личности.',
      mir_ins1_title: 'Слепая зона: Избегание делегирования',
      mir_ins1_desc: 'В 74% случаев вы берёте сложные задачи на себя вместо делегирования команде.',
      mir_ins1_meta: '12 дней назад · Точность 91%',
      mir_ins2_title: 'Сильная сторона: Кризис-коммуникация',
      mir_ins2_desc: 'В конфликтных диалогах клон удерживает дружелюбный тон и снижает напряжение за 3 ответа.',
      mir_ins2_meta: '3 недели назад · Точность 88%',
      mir_ins3_title: 'Фокус: Бизнес и Системы',
      mir_ins3_desc: '82% ваших рассуждений — о масштабировании бизнеса и оптимизации расписания.',
      mir_ins3_meta: 'Вчера · Точность 95%'
    },
    zh: {
      title: 'Cloone — 亚历克斯 (Pro)',
      online: '克隆体在线',
      tab_home: '主页',
      tab_mon: '商业化',
      tab_mon_tag: '$600',
      tab_int: '集成',
      tab_int_tag: '5',
      tab_mir: 'AI镜子',
      tab_mir_tag: '新',
      user_name: '亚历克斯',
      user_plan: '专业版',
      mob_home: '主页',
      mob_mon: '收益',
      mob_int: '渠道',
      mob_mir: '镜子',
      
      // Home Tab
      home_head: '控制面板',
      home_sub: '克隆体状态及今日活动指标。',
      home_progress: '数字化进度',
      home_accuracy: '匹配度: 84%',
      home_hint: '克隆体基于对14,000条历史信息的学习，完美继承了您的表达习惯和个性。',
      home_today: '今日概况',
      home_replied: '克隆体自动回复',
      home_replied_val: '47条消息',
      home_saved: '节省时间',
      home_saved_val: '5小时20分',
      home_escalated: '转人工跟进',
      home_escalated_val: '3个对话',
      home_sync: '与 Telegram 和 Instagram 实时同步中',
      home_mimicry: '分渠道人格匹配度',
      
      // Monetization Tab
      mon_head: '商业化变现',
      mon_sub: '专家收益与平台商业模式。',
      mon_rev_lbl: '30天总收益',
      mon_rev_val: '$600',
      mon_rev_sub: '比上月增长 +$110',
      mon_net_lbl: '净收益 (90%)',
      mon_net_val: '$540',
      mon_net_sub: 'Cloone 平台抽成 (10%): ',
      mon_net_sub_val: '$60',
      mon_subs_lbl: '订阅用户',
      mon_subs_val: '127人',
      mon_subs_sub: '新增 +14人',
      mon_plans_lbl: '克隆体定价方案',
      mon_plan_basic: '基础版',
      mon_plan_basic_desc: '基础访问权限',
      mon_plan_basic_price: '$7 / 月',
      mon_plan_basic_subs: '54位订阅者',
      mon_plan_basic_feat: '50条消息/天 · Telegram',
      mon_plan_pro: '专业版',
      mon_plan_pro_desc: '高级访问权限',
      mon_plan_pro_price: '$14 / 月',
      mon_plan_pro_subs: '30位订阅者',
      mon_plan_pro_feat: '无限次消息 · 支持所有渠道',
      mon_hint: '专家自主设定订阅计划，粉丝付费购买直接价值。平台仅收取每次交易的10%服务费。',
      
      // Channels Tab
      int_head: '沟通渠道',
      int_sub: '克隆体可在您的社交软件上实现自动回复。',
      int_tg: 'Telegram 机器人',
      int_tg_desc: '私信和频道自动回复',
      int_ig: 'Instagram 私信',
      int_ig_desc: '被提及及私信自动回复',
      int_wa: 'WhatsApp 商业版',
      int_wa_desc: '全天候智能客服助理',
      int_em: '电子邮箱收件箱',
      int_em_desc: '自动生成邮件回复草稿',
      int_wb: '网站悬浮插件',
      int_wb_desc: '部署在个人博客的智能分身',
      int_connected: '已连接',
      int_connect: '未连接',
      
      // Mirror Tab
      mir_head: 'AI人格镜子',
      mir_sub: '客观剖析你的人格特质与思维模型。',
      mir_ins1_title: '盲区: 倾向于过度亲力亲为',
      mir_ins1_desc: '在 74% 的事务处理中，您选择自己解决，而不是合理授权并分配给团队成员。',
      mir_ins1_meta: '12天前分析 · 准确率 91%',
      mir_ins2_title: '核心优势: 危机沟通与情绪安抚',
      mir_ins2_desc: '在面对具有冲突性的对话时，克隆体能在3句回复内迅速平息对方情绪并引导正面沟通。',
      mir_ins2_meta: '3周前分析 · 准确率 88%',
      mir_ins3_title: '思维焦点: 商业逻辑与流程系统',
      mir_ins3_desc: '您有 82% 的对话 and 记录聚焦于商业扩张、系统优化和日程管理。',
      mir_ins3_meta: '昨日分析 · 准确率 95%'
    },
    es: {
      title: 'Cloone — Alex (Pro)',
      online: 'Clon en línea',
      tab_home: 'Inicio',
      tab_mon: 'Monetización',
      tab_mon_tag: '$600',
      tab_int: 'Canales',
      tab_int_tag: '5',
      tab_mir: 'Espejo IA',
      tab_mir_tag: 'Nuevo',
      user_name: 'Alex',
      user_plan: 'Plan Pro',
      mob_home: 'Inicio',
      mob_mon: 'Ingresos',
      mob_int: 'Canales',
      mob_mir: 'Espejo',
      
      // Home Tab
      home_head: 'Panel de Control',
      home_sub: 'Estado del clon e indicadores de actividad diaria.',
      home_progress: 'Progreso de Digitalización',
      home_accuracy: 'Precisión: 84%',
      home_hint: 'El clon ha adoptado su Tone of Voice basado en 14,000 mensajes procesados.',
      home_today: 'Para Hoy',
      home_replied: 'Respondido por el clon',
      home_replied_val: '47 mensajes',
      home_saved: 'Tiempo ahorrado',
      home_saved_val: '5h 20m',
      home_escalated: 'En escalación',
      home_escalated_val: '3 chats',
      home_sync: 'Sincronización en tiempo real con Telegram e Instagram',
      home_mimicry: 'Imitación de personalidad por canales',
      
      // Monetization Tab
      mon_head: 'Monetización',
      mon_sub: 'Ganancias del experto y modelo de negocio.',
      mon_rev_lbl: 'Ingresos (30 días)',
      mon_rev_val: '$600',
      mon_rev_sub: '+$110 vs el mes anterior',
      mon_net_lbl: 'Ingresos Netos (90%)',
      mon_net_val: '$540',
      mon_net_sub: 'Comisión de Cloone (10%): ',
      mon_net_sub_val: '$60',
      mon_subs_lbl: 'Suscripciones',
      mon_subs_val: '127',
      mon_subs_sub: '+14 nuevos',
      mon_plans_lbl: 'Planes Activos del Clon',
      mon_plan_basic: 'Basic',
      mon_plan_basic_desc: 'Acceso Básico',
      mon_plan_basic_price: '$7 / mes',
      mon_plan_basic_subs: '54 suscriptores',
      mon_plan_basic_feat: '50 msgs/día · Telegram',
      mon_plan_pro: 'Pro',
      mon_plan_pro_desc: 'Acceso Premium',
      mon_plan_pro_price: '$14 / mes',
      mon_plan_pro_subs: '30 suscriptores',
      mon_plan_pro_feat: 'Ilimitado · Todos los canales',
      mon_hint: 'Los expertos configuran planes, los seguidores pagan por valor directo. La plataforma recibe una regalía del 10% por transacción.',
      
      // Channels Tab
      int_head: 'Canales de Comunicación',
      int_sub: 'El clon responde automáticamente en sus mensajerías.',
      int_tg: 'Bot de Telegram',
      int_tg_desc: 'Respuestas automáticas en DMs y canales',
      int_ig: 'Instagram Direct',
      int_ig_desc: 'Respuestas automáticas en menciones y DMs',
      int_wa: 'WhatsApp Business',
      int_wa_desc: 'Asistente de atención al cliente',
      int_em: 'Email Inbox',
      int_em_desc: 'Prepara borradores de respuestas a correos',
      int_wb: 'Widget Web',
      int_wb_desc: 'Clon en su blog personal',
      int_connected: 'Conectado',
      int_connect: 'Conectar',
      
      // Mirror Tab
      mir_head: 'Espejo IA',
      mir_sub: 'La IA analiza objetivamente sus patrones de personalidad.',
      mir_ins1_title: 'Punto Ciego: Evitar Delegar',
      mir_ins1_desc: 'En el 74% de los casos analizados, asume tareas complejas usted mismo en lugar de delegarlas en su equipo.',
      mir_ins1_meta: 'Hace 12 días · Precisión 91%',
      mir_ins2_title: 'Fortaleza: Comunicación de Crisis',
      mir_ins2_desc: 'En diálogos conflictivos, el clon mantiene un tono amable y reduce la tensión dentro de 3 respuestas.',
      mir_ins2_meta: 'Hace 3 semanas · Precisión 88%',
      mir_ins3_title: 'Enfoque: Negocios y Sistemas',
      mir_ins3_desc: 'El 82% de sus pensamientos son sobre el escalamiento del negocio y la optimización del tiempo.',
      mir_ins3_meta: 'Ayer · Precisión 95%'
    },
    ar: {
      title: 'Cloone — أليكس (Pro)',
      online: 'النسخة متصلة الآن',
      tab_home: 'الرئيسية',
      tab_mon: 'الأرباح',
      tab_mon_tag: '$600',
      tab_int: 'القنوات',
      tab_int_tag: '5',
      tab_mir: 'مرآة الذكاء',
      tab_mir_tag: 'جديد',
      user_name: 'أليكس',
      user_plan: 'الباقة الاحترافية',
      mob_home: 'الرئيسية',
      mob_mon: 'الأرباح',
      mob_int: 'القنوات',
      mob_mir: 'المرآة',
      
      // Home Tab
      home_head: 'لوحة التحكم',
      home_sub: 'حالة النسخة ومقاييس النشاط اليومي.',
      home_progress: 'مستوى التدريب الرقمي',
      home_accuracy: 'الدقة: 84%',
      home_hint: 'اكتسبت النسخة نبرة صوتك وأسلوبك استنادًا إلى 14,000 رسالة تمت معالجتها.',
      home_today: 'ملخص اليوم',
      home_replied: 'أجابت عنها النسخة',
      home_replied_val: '47 رسالة',
      home_saved: 'الوقت الموفر',
      home_saved_val: '5س 20د',
      home_escalated: 'تحتاج لتدخلك',
      home_escalated_val: '3 محادثات',
      home_sync: 'مزامنة مباشرة مع تليجرام وإنستغرام',
      home_mimicry: 'مستوى مطابقة الشخصية حسب القناة',
      
      // Monetization Tab
      mon_head: 'التحقيق المالي',
      mon_sub: 'أرباح الخبراء ونموذج عمل المنصة.',
      mon_rev_lbl: 'أرباح الـ 30 يومًا الماضية',
      mon_rev_val: '$600',
      mon_rev_sub: '+$110 مقارنة بالشهر الماضي',
      mon_net_lbl: 'صافي الربح (90%)',
      mon_net_val: '$540',
      mon_net_sub: 'رسوم المنصة (10%): ',
      mon_net_sub_val: '$60',
      mon_subs_lbl: 'الاشتراكات الفعالة',
      mon_subs_val: '127',
      mon_subs_sub: '+14 اشتراكًا جديدًا',
      mon_plans_lbl: 'باقات اشتراك النسخة الفعالة',
      mon_plan_basic: 'الأساسية',
      mon_plan_basic_desc: 'وصول محدود للنسخة',
      mon_plan_basic_price: '$7 / شهريًا',
      mon_plan_basic_subs: '54 مشتركًا',
      mon_plan_basic_feat: '50 رسالة/يوم · تليجرام',
      mon_plan_pro: 'الاحترافية',
      mon_plan_pro_desc: 'وصول كامل للنسخة',
      mon_plan_pro_price: '$14 / شهريًا',
      mon_plan_pro_subs: '30 مشتركًا',
      mon_plan_pro_feat: 'بلا حدود · كافة قنوات الاتصال',
      mon_hint: 'يحدد الخبراء باقات الاشتراك، ويدفع المتابعون مقابل القيمة المباشرة. تحصل المنصة على 10% من قيمة المعاملات الناجحة.',
      
      // Channels Tab
      int_head: 'قنوات الاتصال المتاحة',
      int_sub: 'تتفاعل النسخة وتجيب تلقائيًا في تطبيقات المراسلة الخاصة بك.',
      int_tg: 'بوت تليجرام',
      int_tg_desc: 'الرد التلقائي في القنوات والمحادثات الخاصة',
      int_ig: 'رسائل إنستغرام',
      int_ig_desc: 'الرد التلقائي على الإشارات والرسائل الخاصة',
      int_wa: 'واتساب للأعمال',
      int_wa_desc: 'الرد الفوري وخدمة العملاء على مدار الساعة',
      int_em: 'البريد الإلكتروني',
      int_em_desc: 'إعداد مسودات الرد على الرسائل الواردة',
      int_wb: 'أداة الويب للـموقع',
      int_wb_desc: 'النسخة الرقمية مدمجة في مدونتك الخاصة',
      int_connected: 'متصل',
      int_connect: 'اتصال',
      
      // Mirror Tab
      mir_head: 'مرآة الشخصية الذكية',
      mir_sub: 'يقوم الذكاء الاصطناعي بتحليل أنماط شخصيتك وتحديد سلوكك بموضوعية.',
      mir_ins1_title: 'المنطقة العمياء: تجنب التفويض',
      mir_ins1_desc: 'في 74% من الحالات التي تم تحليلها، تتولى المهام المعقدة بنفسك بدلاً من تفويضها لفريقك.',
      mir_ins1_meta: 'منذ 12 يومًا · الدقة 91%',
      mir_ins2_title: 'نقطة القوة: إدارة الأزمات والاتصال الفعال',
      mir_ins2_desc: 'في المحادثات المتوترة، تحافظ النسخة على نبرة ودية وتخفف الاحتقان خلال 3 ردود فقط.',
      mir_ins2_meta: 'منذ 3 أسابيع · الدقة 88%',
      mir_ins3_title: 'التركيز الأساسي: الأعمال والأنظمة المنهجية',
      mir_ins3_desc: 'يرتكز 82% من تفكيرك ونقاشاتك حول توسيع نطاق العمل وتنظيم المواعيد والجداول.',
      mir_ins3_meta: 'أمس · الدقة 95%'
    }
  };

  const curr = t[lang] || t.en;
  let activeTab = 'home';

  // ─── Build shell ───────────────────────────────────────────────
  function renderLayout() {
    container.className = 'dt-window';
    container.innerHTML = `
      <!-- macOS titlebar -->
      <div class="dt-titlebar">
        <div class="dt-dots">
          <span class="dt-dot dtd-r"></span>
          <span class="dt-dot dtd-y"></span>
          <span class="dt-dot dtd-g"></span>
        </div>
        <span class="dt-title-text">${curr.title}</span>
        <span class="dt-online"><span class="dt-ping"></span> ${curr.online}</span>
      </div>

      <!-- Body: sidebar + content -->
      <div class="dt-body">

        <!-- Sidebar (desktop) -->
        <aside class="dt-sidebar">
          <div class="dt-nav-list">
            <button class="dt-ni active" data-tab="home">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>${curr.tab_home}</span>
            </button>
            <button class="dt-ni" data-tab="monetization">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>
              <span>${curr.tab_mon}</span>
              <em class="dt-tag dt-tag-green">${curr.tab_mon_tag}</em>
            </button>
            <button class="dt-ni" data-tab="integrations">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="6" height="6" rx="1"/><rect x="16" y="7" width="6" height="6" rx="1"/><rect x="9" y="14" width="6" height="6" rx="1"/><path d="M5 13v2a2 2 0 0 0 2 2h2"/><path d="M19 13v2a2 2 0 0 1-2 2h-2"/></svg>
              <span>${curr.tab_int}</span>
              <em class="dt-tag dt-tag-gray">${curr.tab_int_tag}</em>
            </button>
            <button class="dt-ni" data-tab="mirror">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>${curr.tab_mir}</span>
              <em class="dt-tag dt-tag-purple">${curr.tab_mir_tag}</em>
            </button>
          </div>
          <div class="dt-user-row">
            <div class="dt-avatar">${curr.user_name[0]}</div>
            <div class="dt-user-meta">
              <strong>${curr.user_name}</strong>
              <small>${curr.user_plan}</small>
            </div>
          </div>
        </aside>

        <!-- Mobile tab bar (shown only on small screens) -->
        <div class="dt-tabbar">
          <button class="dt-tab active" data-tab="home">${curr.mob_home}</button>
          <button class="dt-tab" data-tab="monetization">${curr.mob_mon}</button>
          <button class="dt-tab" data-tab="integrations">${curr.mob_int}</button>
          <button class="dt-tab" data-tab="mirror">${curr.mob_mir}</button>
        </div>

        <!-- Main screen -->
        <main class="dt-screen" id="dt-screen"></main>
      </div>
    `;

    // Bind clicks for both sidebar and mobile tabbar
    container.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    switchTab('home');
  }

  // ─── Tab switch ────────────────────────────────────────────────
  function switchTab(name) {
    activeTab = name;

    // Mark active on all buttons (sidebar + tabbar)
    container.querySelectorAll('[data-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === name);
    });

    const screen = document.getElementById('dt-screen');
    if (!screen) return;

    screen.style.opacity = '0';
    screen.style.transform = 'translateY(6px)';

    setTimeout(() => {
      screen.innerHTML = tabContent(name);
      if (name === 'home') animProgress();
      if (name === 'monetization') animNumbers();
      screen.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      screen.style.opacity = '1';
      screen.style.transform = 'translateY(0)';
    }, 160);
  }

  // ─── Tab content ───────────────────────────────────────────────
  function tabContent(name) {
    if (name === 'home') return `
      <div class="dt-page-head">
        <h3>${curr.home_head}</h3>
        <p>${curr.home_sub}</p>
      </div>
      <div class="dt-row-2">
        <div class="dt-card">
          <div class="dt-card-top">
            <span class="dt-card-label">${curr.home_progress}</span>
            <span class="dt-chip dt-chip-accent">${curr.home_accuracy}</span>
          </div>
          <div class="dt-circle-wrap">
            <svg class="dt-circle-svg" viewBox="0 0 36 36">
              <path class="dt-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <path class="dt-circle-fg" id="dt-fg" stroke-dasharray="0,100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            </svg>
            <span class="dt-circle-num" id="dt-pct">0%</span>
          </div>
          <p class="dt-hint">${curr.home_hint}</p>
        </div>
        <div class="dt-card">
          <div class="dt-card-top">
            <span class="dt-card-label">${curr.home_today}</span>
          </div>
          <div class="dt-rows">
            <div class="dt-row-item">
              <span>💬</span>
              <span class="dt-ri-label">${curr.home_replied}</span>
              <strong>${curr.home_replied_val}</strong>
            </div>
            <div class="dt-row-item">
              <span>⏳</span>
              <span class="dt-ri-label">${curr.home_saved}</span>
              <strong class="dt-green">${curr.home_saved_val}</strong>
            </div>
            <div class="dt-row-item">
              <span>⚠️</span>
              <span class="dt-ri-label">${curr.home_escalated}</span>
              <strong class="dt-orange">${curr.home_escalated_val}</strong>
            </div>
          </div>
          <div class="dt-live-row">
            <span class="dt-live-dot"></span>
            <span>${curr.home_sync}</span>
          </div>
        </div>
      </div>
      <div class="dt-card dt-card-full">
        <div class="dt-card-top">
          <span class="dt-card-label">${curr.home_mimicry}</span>
        </div>
        <div class="dt-bars">
          <div class="dt-bar-row">
            <span class="dt-bar-name">Telegram</span>
            <div class="dt-bar-track"><div class="dt-bar-fill" style="width:92%;background:#229ED9"></div></div>
            <span class="dt-bar-pct">92%</span>
          </div>
          <div class="dt-bar-row">
            <span class="dt-bar-name">Instagram Direct</span>
            <div class="dt-bar-track"><div class="dt-bar-fill" style="width:88%;background:#E1306C"></div></div>
            <span class="dt-bar-pct">88%</span>
          </div>
        </div>
      </div>
    `;

    if (name === 'monetization') return `
      <div class="dt-page-head">
        <h3>${curr.mon_head}</h3>
        <p>${curr.mon_sub}</p>
      </div>
      <div class="dt-row-3">
        <div class="dt-card dt-stat-card">
          <small>${curr.mon_rev_lbl}</small>
          <strong class="dt-big-num" id="dt-rev">${lang === 'ru' ? '₽0' : '$0'}</strong>
          <span class="dt-green dt-sub">${curr.mon_rev_sub}</span>
        </div>
        <div class="dt-card dt-stat-card">
          <small>${curr.mon_net_lbl}</small>
          <strong class="dt-big-num dt-green" id="dt-net">${lang === 'ru' ? '₽0' : '$0'}</strong>
          <span class="dt-sub">${curr.mon_net_sub}<b id="dt-fee">${lang === 'ru' ? '₽0' : '$0'}</b></span>
        </div>
        <div class="dt-card dt-stat-card">
          <small>${curr.mon_subs_lbl}</small>
          <strong class="dt-big-num dt-accent" id="dt-subs">0</strong>
          <span class="dt-accent dt-sub">${curr.mon_subs_sub}</span>
        </div>
      </div>
      <div class="dt-card dt-card-full">
        <div class="dt-card-top">
          <span class="dt-card-label">${curr.mon_plans_lbl}</span>
        </div>
        <div class="dt-plans">
          <div class="dt-plan">
            <div class="dt-plan-left">
              <span class="dt-plan-badge dt-pb-basic">${curr.mon_plan_basic}</span>
              <span>${curr.mon_plan_basic_desc}</span>
            </div>
            <span class="dt-plan-price">${curr.mon_plan_basic_price}</span>
            <span class="dt-dim">${curr.mon_plan_basic_subs}</span>
            <span class="dt-plan-feat">${curr.mon_plan_basic_feat}</span>
          </div>
          <div class="dt-plan dt-plan-active">
            <div class="dt-plan-left">
              <span class="dt-plan-badge dt-pb-pro">${curr.mon_plan_pro}</span>
              <span>${curr.mon_plan_pro_desc}</span>
            </div>
            <span class="dt-plan-price">${curr.mon_plan_pro_price}</span>
            <span class="dt-dim">${curr.mon_plan_pro_subs}</span>
            <span class="dt-plan-feat">${curr.mon_plan_pro_feat}</span>
          </div>
        </div>
        <p class="dt-hint" style="margin-top:10px;text-align:center">${curr.mon_hint}</p>
      </div>
    `;

    if (name === 'integrations') return `
      <div class="dt-page-head">
        <h3>${curr.int_head}</h3>
        <p>${curr.int_sub}</p>
      </div>
      <div class="dt-integrations">
        ${[
          { cls: 'tg', label: 'TG', name: curr.int_tg, desc: curr.int_tg_desc, on: true },
          { cls: 'ig', label: 'IG', name: curr.int_ig, desc: curr.int_ig_desc, on: true },
          { cls: 'wa', label: 'WA', name: curr.int_wa, desc: curr.int_wa_desc, on: true },
          { cls: 'em', label: '@', name: curr.int_em, desc: curr.int_em_desc, on: true },
          { cls: 'wb', label: '📝', name: curr.int_wb, desc: curr.int_wb_desc, on: false },
        ].map(ch => `
          <div class="dt-ch ${ch.on ? 'dt-ch-on' : ''}">
            <span class="dt-ch-icon dt-chi-${ch.cls}">${ch.label}</span>
            <div class="dt-ch-info">
              <strong>${ch.name}</strong>
              <small>${ch.desc}</small>
            </div>
            <span class="dt-ch-status ${ch.on ? 'dt-st-on' : 'dt-st-off'}">${ch.on ? curr.int_connected : curr.int_connect}</span>
          </div>
        `).join('')}
      </div>
    `;

    if (name === 'mirror') return `
      <div class="dt-page-head">
        <h3>${curr.mir_head}</h3>
        <p>${curr.mir_sub}</p>
      </div>
      <div class="dt-insights">
        <div class="dt-insight">
          <span class="dt-ins-icon dt-ins-red">👁️</span>
          <div class="dt-ins-body">
            <strong>${curr.mir_ins1_title}</strong>
            <p>${curr.mir_ins1_desc}</p>
            <small>${curr.mir_ins1_meta}</small>
          </div>
        </div>
        <div class="dt-insight">
          <span class="dt-ins-icon dt-ins-green">✨</span>
          <div class="dt-ins-body">
            <strong>${curr.mir_ins2_title}</strong>
            <p>${curr.mir_ins2_desc}</p>
            <small>${curr.mir_ins2_meta}</small>
          </div>
        </div>
        <div class="dt-insight">
          <span class="dt-ins-icon dt-ins-purple">🎯</span>
          <div class="dt-ins-body">
            <strong>${curr.mir_ins3_title}</strong>
            <p>${curr.mir_ins3_desc}</p>
            <small>${curr.mir_ins3_meta}</small>
          </div>
        </div>
      </div>
    `;

    return '';
  }

  // ─── Animations ────────────────────────────────────────────────
  function animProgress() {
    const fg = document.getElementById('dt-fg');
    const pct = document.getElementById('dt-pct');
    if (!fg || !pct) return;
    let v = 0;
    const t = setInterval(() => {
      if (v >= 84) { clearInterval(t); return; }
      v++;
      fg.style.strokeDasharray = `${v},100`;
      pct.textContent = v + '%';
    }, 14);
  }

  // Animating financials based on currency
  function animNumbers() {
    function run(id, end, prefix) {
      const el = document.getElementById(id);
      if (!el) return;
      let v = 0, s = null;
      requestAnimationFrame(function step(ts) {
        if (!s) s = ts;
        const p = Math.min((ts - s) / 900, 1);
        v = Math.floor(p * end);
        el.textContent = prefix + v.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US');
        if (p < 1) requestAnimationFrame(step);
      });
    }
    
    if (lang === 'ru') {
      run('dt-rev', 44550, '₽');
      run('dt-net', 40095, '₽');
      run('dt-fee', 4455, '₽');
    } else {
      run('dt-rev', 600, '$');
      run('dt-net', 540, '$');
      run('dt-fee', 60, '$');
    }
    run('dt-subs', 127, '');
  }

  // ─── Init ──────────────────────────────────────────────────────
  renderLayout();
})();
