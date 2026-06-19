// ── MIRROR SECTION (i18n supported) ──
(function () {
  const input = document.getElementById('mirror-input');
  const btn = document.getElementById('mirror-ask');
  const messages = document.getElementById('mirror-messages');
  const responseEl = document.getElementById('mirror-response');
  const mirrorGlow = document.querySelector('.mirror-glow');
  const mirrorArt = document.querySelector('.mirror-art-container');
  const chipsContainer = document.getElementById('mirror-chips');

  if (!input) return;

  const lang = document.documentElement.lang || 'en';

  // Dialogue state variables
  let dialogueState = 'idle'; // 'idle', 'followup_waiting'
  let lastTopic = ''; // 'who_am_i', 'strengths', 'blind_spots', 'advice', 'generic'

  // Multilingual responses database
  const t = {
    en: {
      welcome: 'Hello! I am your digital twin, trained on your personal journals and behavior patterns. Ask me any question about yourself below or choose a quick topic.',
      positive_words: ['yes', 'yeah', 'sure', 'agree', 'indeed', 'yep', 'i do', 'ok', 'okay'],
      negative_words: ['no', 'nope', 'disagree', 'not really', 'don\'t', 'do not', 'never'],
      responses: {
        who_am_i: {
          a: 'You are a person with high analytical potential. Your strengths lie in systemic thinking and the ability to grasp the essence quickly. Do you feel this aligns with your self-perception?',
          yes: 'Excellent. Accepting your traits is the first step to scaling your personality. This is exactly what we work on in the Cloone app.',
          no: 'I understand. Resistance is also a pattern. AI sometimes reveals things we consciously hide from ourselves. In the Cloone app, you can explore this deeper.',
          default: 'An interesting perspective. The digital clone records your reactions to refine your personality model. Full analytics are available in the dashboard.'
        },
        strengths: {
          a: 'I see three key strengths: directness in communication, depth of analysis, and finding solutions where others see a dead end. However, these traits can sometimes distance you from people. Have you noticed this?',
          yes: 'Yes, that is a common dilemma for analytical minds. Balancing intellect and empathy is a major feature of training your clone in Cloone.',
          no: 'It\'s great that you maintain a healthy balance. The clone will help replicate this balanced style of communication and handle it 24/7.',
          default: 'Every response helps calibrate your Tone of Voice for seamless integration into messaging channels.'
        },
        blind_spots: {
          a: 'Your main blind spot is delegation. You take on too much because you subconsciously fear others won\'t do it perfectly. Have you tried delegating tasks in the past month?',
          yes: 'Great! Delegation frees up your mental resources. Your Cloone clone is the ultimate way to delegate communication with thousands of followers without losing personal touch.',
          no: 'And that is why you feel overloaded. Cloone was created to handle routine communications for you. It is definitely worth a try.',
          default: 'Optimizing your time is the primary goal of our platform.'
        },
        advice: {
          a: 'Right now, you need to focus on a single key task and temporarily let go of controlling everything else. Your distraction is a signal of overload. Are you ready to try letting go right now?',
          yes: 'An excellent choice. Take a breath, pause, and delegate routing message replies to your AI twin in Cloone.',
          no: 'I understand, letting go of control can be scary. But that\'s exactly why digital twins are built—to give you back your freedom.',
          default: 'In any case, focusing on what is essential is a crucial skill to master with your digital twin.'
        },
        generic: {
          a: 'Interesting question. I am analyzing your patterns and see a reflection of something important to you. Would you like me to help you unpack this in the Cloone app?',
          yes: 'Awesome! Our waitlist is open at the bottom of the page. Leave your email, and you will get early access to the platform.',
          no: 'Understood. A personal AI is a deep topic that requires trust. You can continue chatting with me here whenever you are ready.',
          default: 'Our waitlist is at the bottom of the page—join us to start training your full clone.'
        }
      }
    },
    ru: {
      welcome: 'Привет! Я твой цифровой двойник, обученный на твоих личных дневниках и паттернах поведения. Задай мне любой вопрос о себе ниже или выбери одну из быстрых тем.',
      positive_words: ['да', 'yes', 'согласен', 'точно', 'думаю да', 'конечно', 'ага', 'da', 'дa', 'хочу', 'давай'],
      negative_words: ['нет', 'no', 'не ', 'не согласен', 'вряд ли', 'net', 'не хочу', 'не готов'],
      responses: {
        who_am_i: {
          a: 'Ты — человек с высоким аналитическим потенциалом. Твои сильные стороны проявляются в системном мышлении и способности видеть суть быстро. Как думаешь, это совпадает с твоим внутренним самоощущением?',
          yes: 'Отлично. Принятие своих качеств — первый шаг к осознанному масштабированию личности. Именно над этим мы детально работаем в приложении Cloone.',
          no: 'Понимаю. Твоё сопротивление — тоже паттерн. ИИ иногда вскрывает то, что мы сознательно прячем от себя. В приложении Cloone ты сможешь разобрать это глубже.',
          default: 'Интересный взгляд. Цифровой клон фиксирует твои реакции, чтобы уточнить модель твоей личности. Полная аналитика доступна в личном кабинете.'
        },
        strengths: {
          a: 'Я вижу три ключевые силы: прямота в коммуникации, глубина анализа и умение находить решения там, где другие видят тупик. Но они же могут отдалять тебя от людей. Замечал ли ты это за собой?',
          yes: 'Да, это частая дилемма аналитиков. Интеграция интеллекта и эмпатии — одна из главных функций обучения твоего клона в Cloone.',
          no: 'Хорошо, если тебе удается держать баланс. Клон поможет зафиксировать этот стиль общения и транслировать его аудитории 24/7.',
          default: 'Каждый ответ помогает откалибровать твой Tone of Voice для интеграции в мессенджеры.'
        },
        blind_spots: {
          a: 'Твоя главная слепая зона — делегирование. Ты берёшь слишком много на себя, потому что подсознательно боишься, что другие сделают неидеально. Пробовал ли ты делегировать задачи за последний месяц?',
          yes: 'Супер! Делегирование освобождает твой ресурс. Клон Cloone — это ультимативный способ делегировать общение с тысячами подписчиков без потери личного контакта.',
          no: 'Именно поэтому ты чувствуешь перегрузку. Cloone создан как раз для того, чтобы забрать рутину коммуникаций на себя. Стоит попробовать.',
          default: 'Оптимизация твоего времени — ключевая цель нашей платформы.'
        },
        advice: {
          a: 'Прямо сейчас тебе нужно сфокусироваться на одной ключевой задаче и временно отпустить контроль над остальным. Твоя рассеянность — это сигнал о перегрузке. Готов попробовать это прямо сейчас?',
          yes: 'Отличный выбор. Сделай паузу, выдохни, а рутинные ответы на входящие сообщения доверь своему ИИ-двойнику Cloone.',
          no: 'Понимаю, отпустить контроль бывает страшно. Но именно для этого и создаются цифровые ассистенты — чтобы дать тебе свободу.',
          default: 'В любом случае, фокус на важном — это то, чему стоит поучиться у твоего цифрового двойника.'
        },
        generic: {
          a: 'Интересный вопрос. Я анализирую твои паттерны и вижу в этом отражение чего-то важного для тебя. Хочешь, я помогу тебе распаковать это в приложении Cloone?',
          yes: 'Отлично! Наш лист ожидания открыт внизу страницы. Оставь email, и ты получишь ранний доступ к платформе одним из первых.',
          no: 'Понимаю. Персональный ИИ — глубокая тема, требующая доверия. Можешь продолжить диалог со мной здесь, когда будешь готов.',
          default: 'Наш лист ожидания находится внизу страницы — присоединяйся, чтобы начать полноценное обучение своего клона.'
        }
      }
    },
    zh: {
      welcome: '你好！我是你的数字分身，基于你的个人日记和行为模式训练而成。在下方问我任何关于你自己的问题，或选择一个快速主题。',
      positive_words: ['是的', '是', '对', '同意', '好', '可以', '确定', '想', '来吧', 'yes', 'da'],
      negative_words: ['不', '不是', '不对', '不同意', '不行', '不要', '不想', 'no', 'net'],
      responses: {
        who_am_i: {
          a: '你是一个具有高度分析潜能的人。你的优势在于系统性思维以及快速洞察事物本质的能力。你觉得这符合你的自我认知吗？',
          yes: '非常好。接受并认可自己的特质，是实现自我数字化延伸的第一步。这正是我们在 Cloone 应用中所深度专注的工作。',
          no: '我理解。不认同有时也是一种潜意识模式。人工智能有时能揭示我们刻意隐藏的一面。在 Cloone 应用中，你可以进行更深入的探索。',
          default: '一个有趣的视角。数字克隆体持续记录您的反馈，以优化个性模型。完整的数据分析可在控制面板中查看。'
        },
        strengths: {
          a: '我看到了你的三个核心优势：沟通直接高效、深度分析能力以及在他人面临绝境时找到出路。但这些特质有时也会让你与他人产生距离感。你注意到这一点了吗？',
          yes: '是的，这是理性思维者的常见困境。平衡智商与情商，是 Cloone 训练你数字分身的一大核心功能。',
          no: '很高兴你能保持这种健康的平衡。克隆体将帮助复制这种平衡的沟通风格，并 24/7 全天候对外传达。',
          default: '每一次互动都有助于校准你的 Tone of Voice，从而无缝接入各大社交渠道。'
        },
        blind_spots: {
          a: '你最主要的思维盲区是过度亲力亲为。因为潜意识里担心别人做不够完美，你承担了太多。过去一个月里你尝试过授权或分配任务吗？',
          yes: '太棒了！授权能释放你的核心精力。Cloone 分身是代你与成千上万订阅者沟通的终极方式，且不失个性化的温度。',
          no: '这也是你感到疲惫不堪的原因。Cloone 的诞生正是为了帮你接管日常的重复性沟通。非常值得一试。',
          default: '优化并释放你的时间是 Cloone 平台的核心目标。'
        },
        advice: {
          a: '此时此刻，你需要将注意力集中在最重要的单一任务上，并暂时放手其他事情。你的分心其实是精力超载的信号。你准备好从现在开始尝试放手了吗？',
          yes: '明智的选择。深呼吸，暂停一下，把繁琐的消息自动回复工作交给 Cloone 上的 AI 分身吧。',
          no: '我理解，失去掌控感往往会令人不安。但这正是构建数字分身的初衷——把自由还给你。',
          default: '无论如何，学会专注最核心的事务，是你可以与你的数字分身共同学习的重要技能。'
        },
        generic: {
          a: '一个有趣的问题。我正在分析你的行为模式，并从中看到了对你而言很重要的东西的折射。你想在 Cloone 应用中进一步拆解它吗？',
          yes: '太好了！我们的预约候补通道已在页面底部开放。留下你的邮箱，你将首批获得平台早期内测资格。',
          no: '理解。个人 AI 是个需要信任的深刻话题。当你准备好的时候, 可以随时在这里继续与我对话。',
          default: '我们的内测预约列表在页面底部——加入我们，开启对你专属克隆体的训练。'
        }
      }
    },
    es: {
      welcome: '¡Hola! Soy tu gemelo digital, entrenado en tus diarios personales y patrones de comportamiento. Hazme cualquier pregunta sobre ti abajo o elige un tema rápido.',
      positive_words: ['sí', 'si', 'claro', 'acuerdo', 'de acuerdo', 'ok', 'quiero', 'dale', 'yes'],
      negative_words: ['no', 'tampoco', 'desacuerdo', 'no quiero', 'nunca', 'para nada', 'nope'],
      responses: {
        who_am_i: {
          a: 'Eres una persona con un alto potencial analítico. Tus fortalezas residen en el pensamiento sistémico y la capacidad de captar la esencia rápidamente. ¿Sientes que esto coincide con tu autopercepción?',
          yes: 'Excelente. Aceptar tus rasgos es el primer paso para escalar tu personalidad. En esto es exactamente en lo que trabajamos en la aplicación Cloone.',
          no: 'Comprendo. La resistencia también es un patrón. La IA a veces revela cosas que conscientemente nos ocultamos. En la aplicación Cloone podrás explorar esto a fondo.',
          default: 'Una perspectiva interesante. El clon digital registra tus reacciones para perfeccionar tu modelo de personalidad. Los análisis completos están en el panel.'
        },
        strengths: {
          a: 'Veo tres fortalezas clave: franqueza en la comunicación, profundidad de análisis y encontrar soluciones donde otros ven un callejón sin salida. Sin embargo, esto a veces puede distanciarte de las personas. ¿Lo has notado?',
          yes: 'Sí, es un dilema común para las mentes analíticas. Integrar intelecto y empatía es una función principal al entrenar a tu clon en Cloone.',
          no: 'Es genial que mantengas un equilibrio saludable. El clon ayudará a replicar este estilo equilibrado y a atender a tu audiencia 24/7.',
          default: 'Cada respuesta ayuda a calibrar tu Tone of Voice para una integración perfecta en tus canales de mensajería.'
        },
        blind_spots: {
          a: 'Tu principal punto ciego es la delegación. Asumes demasiado porque inconscientemente temes que otros no lo hagan perfectamente. ¿Has intentado delegar tareas en el último mes?',
          yes: '¡Súper! Delegar libera tu valioso tiempo. Tu clon de Cloone es la forma definitiva de delegar la comunicación con miles de seguidores sin perder el toque personal.',
          no: 'Y es por eso que te sientes sobrecargado. Cloone fue creado para encargarse de las comunicaciones rutinarias por ti. Definitivamente vale la pena intentarlo.',
          default: 'Optimizar tu tiempo es el objetivo principal de nuestra plataforma.'
        },
        advice: {
          a: 'Ahora mismo, necesitas enfocarte en una sola tarea clave y dejar ir temporalmente el control sobre todo lo demás. Tu distracción es una señal de sobrecarga. ¿Estás listo para intentar dejarlo ir ahora mismo?',
          yes: 'Una excelente elección. Tómate un respiro, haz una pausa y delega las respuestas automáticas de tus mensajes a tu clon IA en Cloone.',
          no: 'Entiendo, soltar el control puede dar miedo. Pero para eso se construyen los asistentes digitales: para devolverte la libertad.',
          default: 'En cualquier caso, enfocarse en lo esencial es una habilidad importante que debes perfeccionar junto a tu gemelo digital.'
        },
        generic: {
          a: 'Pregunta interesante. Analizo tus patrones y veo un reflejo de algo importante para ti. ¿Te gustaría que te ayude a desglosarlo en la aplicación Cloone?',
          yes: '¡Buenísimo! Nuestra lista de espera está abierta al final de la página. Deja tu correo y tendrás acceso anticipado prioritario.',
          no: 'Entendido. Una IA personal es un tema profundo que requiere confianza. Puedes seguir chateando conmigo aquí cuando gustes.',
          default: 'Nuestra lista de espera está al final de la página; únete para comenzar a entrenar a tu clon completo.'
        }
      }
    },
    ar: {
      welcome: 'مرحباً! أنا نسختك الرقمية، تدربت على مذكراتك الشخصية وأنماط سلوكك. اسألني أي سؤال عن نفسك أدناه أو اختر أحد المواضيع السريعة.',
      positive_words: ['نعم', 'اجل', 'أجل', 'موافق', 'صح', 'صحيح', 'طبعا', 'طبعاً', 'اريد', 'yes', 'da'],
      negative_words: ['لا', 'كلا', 'ارفض', 'غير موافق', 'لا اريد', 'ليس', 'no', 'net'],
      responses: {
        who_am_i: {
          a: 'أنت شخص تتمتع بذكاء تحليلي عالٍ. تكمن نقاط قوتك في التفكير المنهجي والقدرة على فهم جوهر الأمور بسرعة. هل تشعر أن هذا يتطابق مع تصورك لذاتك؟',
          yes: 'ممتاز. قبول سماتك الذاتية هو الخطوة الأولى لتطوير وتوسيع شخصيتك. هذا هو بالضبط ما نعمل عليه في تطبيق Cloone.',
          no: 'تفهمت ذلك. قد يكون الرفض أحياناً نمطاً تحليلياً بحد ذاته. يكشف الذكاء الاصطناعي أحياناً عن أشياء نخفيها عن أنفسنا. في تطبيق Cloone، يمكنك استكشاف هذا بعمق أكبر.',
          default: 'وجهة نظر مثيرة للاهتمام. تسجل النسخة الرقمية ردود أفعالك لتدقيق نموذج شخصيتك. التحليلات الكاملة متاحة في لوحة التحكم.'
        },
        strengths: {
          a: 'أرى فيك ثلاث نقاط قوة رئيسية: الصراحة التامة في التواصل، عمق التحليل، والقدرة على ابتكار الحلول حيث يرى الآخرون طريقاً مسدوداً. لكن هذه السمات قد تبعدك أحياناً عن الناس. هل لاحظت ذلك؟',
          yes: 'نعم، هذه معضلة شائعة للعقول التحليلية. إن دمج الذكاء الفكري مع التعاطف الاجتماعي هو ميزة تدريب أساسية لنسختك في Cloone.',
          no: 'رائع جداً أنك تحافظ على توازن صحي. ستساعدك النسخة في الحفاظ على هذا الأسلوب المتزن والتفاعل مع جمهورك على مدار الساعة.',
          default: 'كل إجابة تساعدنا في ضبط نبرة صوتك (Tone of Voice) للاندماج بسلاسة في قنوات المراسلة الخاصة بك.'
        },
        blind_spots: {
          a: 'منطقتك العمياء الأساسية هي تفويض المهام. أنت تأخذ الكثير على عاتقك لأنك تخشى لا شعورياً ألا يقوم الآخرون بالعمل بشكل مثالي. هل حاولت تفويض المهام خلال الشهر الماضي؟',
          yes: 'عظيم! تفويض المهام يحرر طاقتك الإبداعية. نسخة Cloone هي الطريقة المثلى لتفويض التواصل مع آلاف المتابعين دون فقدان اللمسة الشخصية.',
          no: 'وهذا هو السبب الحقيقي وراء شعورك بالارهاق. تم تصميم Cloone لتولي مهام التواصل الروتينية نيابة عنك. الأمر يستحق التجربة بالتأكيد.',
          default: 'تحسين استغلال وقتك هو الهدف الأساسي لمنصتنا.'
        },
        advice: {
          a: 'في الوقت الحالي، تحتاج إلى التركيز على مهمة رئيسية واحدة والتخلي مؤقتاً عن محاولة السيطرة على كل شيء آخر. تشتتك هو إشارة واضحة على الحمل الزائد. هل أنت مستعد لتجربة التخلي عن السيطرة الآن؟',
          yes: 'اختيار ممتاز. خذ نفساً عميقاً، وتوقف قليلاً، واترك مهمة الردود التلقائية لنسختك الرقمية في Cloone.',
          no: 'أتفهم ذلك، التخلي عن السيطرة قد يكون مخيفاً في البداية. ولكن لهذا السبب بالذات تم تطوير المساعدين الرقميين - لإعادة الحرية إليك.',
          default: 'في كل الأحوال، التركيز على الأساسيات هو مهارة هامة يجدر بك صقلها بمساعدة نسختك الرقمية.'
        },
        generic: {
          a: 'سؤال مثير للاهتمام. أقوم بتحليل أنماطك وأرى انعكاساً لشيء يمثل أهمية كبيرة بالنسبة لك. هل تريد مني مساعدتك في استكشاف هذا وتفكيكه في تطبيق Cloone؟',
          yes: 'رائع! قائمة الانتظار مفتوحة في أسفل الصفحة. سجل بريدك الإلكتروني لتكون من أوائل الحاصلين على حق الوصول للمنصة.',
          no: 'مفهوم. الذكاء الاصطناعي الشخصي موضوع عميق يتطلب الثقة. يمكنك مواصلة الحوار معي هنا متى ما كنت مستعداً.',
          default: 'قائمة الانتظار في أسفل الصفحة — انضم إلينا لبدء تدريب نسختك الكاملة.'
        }
      }
    }
  };

  const curr = t[lang] || t.en;

  // Keyword mapping per language
  const keywordMap = {
    en: [
      { keys: ['who am i', 'who i am', 'myself', 'about me', 'who am'], topic: 'who_am_i' },
      { keys: ['strength', 'powers', 'strong', 'pros'], topic: 'strengths' },
      { keys: ['weakness', 'blind spot', 'errors', 'cons'], topic: 'blind_spots' },
      { keys: ['advice', 'recommendation', 'should i do'], topic: 'advice' }
    ],
    ru: [
      { keys: ['кто я', 'кто я?', 'я кто', 'личность', 'о себе'], topic: 'who_am_i' },
      { keys: ['сильные стороны', 'сила', 'strengths', 'плюсы'], topic: 'strengths' },
      { keys: ['слабость', 'слепые зоны', 'ошибки', 'минусы'], topic: 'blind_spots' },
      { keys: ['совет', 'что делать', 'advice', 'рекомендация'], topic: 'advice' }
    ],
    zh: [
      { keys: ['我是谁', '关于我', '我是'], topic: 'who_am_i' },
      { keys: ['优势', '强项', '优点', '我的优势'], topic: 'strengths' },
      { keys: ['盲点', '弱点', '缺点'], topic: 'blind_spots' },
      { keys: ['建议', '该做什么', '推荐'], topic: 'advice' }
    ],
    es: [
      { keys: ['quien soy', 'quién soy', 'sobre mi', 'sobre mí'], topic: 'who_am_i' },
      { keys: ['fortalezas', 'fuerza', 'puntos fuertes', 'ventajas'], topic: 'strengths' },
      { keys: ['debilidades', 'puntos ciegos', 'errores', 'desventajas'], topic: 'blind_spots' },
      { keys: ['consejo', 'que hacer', 'qué hacer', 'recomendación'], topic: 'advice' }
    ],
    ar: [
      { keys: ['من أنا', 'من انا', 'عني', 'نفسي'], topic: 'who_am_i' },
      { keys: ['نقاط القوة', 'قوتي', 'المميزات'], topic: 'strengths' },
      { keys: ['النقاط العمياء', 'نقاط الضعف', 'عيوبي'], topic: 'blind_spots' },
      { keys: ['نصيحة', 'ماذا أفعل', 'توصية'], topic: 'advice' }
    ]
  };

  const currKeywords = keywordMap[lang] || keywordMap.en;
  let isThinking = false;

  function findResponse(text) {
    const lower = text.toLowerCase();
    
    // If we are waiting for a reply to a follow-up question
    if (dialogueState === 'followup_waiting') {
      const isPositive = curr.positive_words.some(w => lower.includes(w));
      const isNegative = curr.negative_words.some(w => lower.includes(w));
      
      const topicData = curr.responses[lastTopic];
      dialogueState = 'idle';
      
      if (isPositive) return topicData.yes;
      if (isNegative) return topicData.no;
      return topicData.default;
    }

    // Normal keyword matching
    for (const item of currKeywords) {
      if (item.keys.some(k => lower.includes(k))) {
        dialogueState = 'followup_waiting';
        lastTopic = item.topic;
        return curr.responses[item.topic].a;
      }
    }

    // Default fallback
    dialogueState = 'followup_waiting';
    lastTopic = 'generic';
    return curr.responses.generic.a;
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

  async function handleAsk(customQ) {
    const q = (typeof customQ === 'string' ? customQ : input.value).trim();
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

  // Bind main UI actions
  btn.addEventListener('click', () => handleAsk());
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleAsk(); });

  // Bind quick suggest chips
  if (chipsContainer) {
    chipsContainer.querySelectorAll('.mirror-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const question = chip.getAttribute('data-q');
        if (question) handleAsk(question);
      });
    });
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  // Initial welcome message (simulated delay for natural feel)
  setTimeout(() => {
    addMessage(curr.welcome, 'clone');
  }, 600);

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
