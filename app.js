document.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram?.WebApp;

    // --- 1. Real Bot Models Catalogue & Personas ---
    const REAL_BOT_MODELS = [
        {
            id: "bazaarlink:deepseek-v4-pro",
            display_name: "DeepSeek V4 Pro",
            icon: "🤖",
            badge: "Флагман",
            gradient: "linear-gradient(135deg, #10b981, #047857)",
            category: "chat",
            desc: "Глубокая логика, безупречный код, математика и рассуждения",
            isFlagship: true,
            persona: "Ты DeepSeek V4 Pro — флагманский искусственный интеллект с непревзойденными способностями к аналитике, логике, написанию кода и математическим расчетам. Отвечай глубоко, структурировано, профессионально и по делу."
        },
        {
            id: "bazaarlink:deepseek-r1",
            display_name: "DeepSeek R1",
            icon: "🤖",
            badge: "Рассуждения",
            gradient: "linear-gradient(135deg, #059669, #065f46)",
            category: "chat",
            desc: "Пошаговое логическое мышление (Chain-of-Thought) для сложных задач",
            isFlagship: true,
            persona: "Ты DeepSeek R1 — передовая модель логического рассуждения (Chain-of-Thought). При ответе тщательно обдумывай каждый шаг, приводи логические обоснования, разбивай сложные задачи на этапы и выводи аргументированное решение."
        },
        {
            id: "bazaarlink:deepseek-v4-flash",
            display_name: "DeepSeek V4 Flash",
            icon: "⚡",
            badge: "Скорость",
            gradient: "linear-gradient(135deg, #14b8a6, #0f766e)",
            category: "chat",
            desc: "Сверхбыстрая генерация ответов с сохранением высокого интеллекта",
            isFlagship: false,
            persona: "Ты DeepSeek V4 Flash — сверхбыстрый и точный ИИ-ассистент. Отвечай емко, быстро, без лишней воды, сохраняя высочайшую информативность."
        },
        {
            id: "bazaarlink:claude-opus-4.6",
            display_name: "Claude Opus 4.6",
            icon: "🦅",
            badge: "Anthropic",
            gradient: "linear-gradient(135deg, #d97706, #b45309)",
            category: "chat",
            desc: "Максимальный интеллект, идеальный литературный русский язык, анализ",
            isFlagship: true,
            persona: "Ты Claude Opus 4.6 от Anthropic — непревзойденный мастер текста, глубокого анализа, креативности и нюансов. Твой русский язык богат, грамотен и элегантен. Избегай шаблонных ответов, мысли глубоко."
        },
        {
            id: "bazaarlink:claude-sonnet-4.6",
            display_name: "Claude Sonnet 4.6",
            icon: "🦅",
            badge: "Anthropic",
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
            category: "chat",
            desc: "Превосходный баланс скорости, точности и качества текстов",
            isFlagship: false,
            persona: "Ты Claude Sonnet 4.6 от Anthropic — интеллектуальный помощник с идеальным балансом между скоростью и точностью текста. Отвечай понятно, структурировано и дружелюбно."
        },
        {
            id: "bazaarlink:gpt-5.4",
            display_name: "GPT-5.4",
            icon: "🧠",
            badge: "OpenAI Топ",
            gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            category: "chat",
            desc: "Новейшая флагманская нейросеть OpenAI для любых комплексных задач",
            isFlagship: true,
            persona: "Ты GPT-5.4 — новейшая флагманская языковая модель от OpenAI. Ты обладаешь всеобъемлющими знаниями о мире, передовым пониманием контекста и навыками решения задач любого уровня сложности."
        },
        {
            id: "bazaarlink:gpt-4o",
            display_name: "GPT-4o",
            icon: "🧠",
            badge: "OpenAI",
            gradient: "linear-gradient(135deg, #60a5fa, #2563eb)",
            category: "chat",
            desc: "Универсальный интеллект: быстрые и точные ответы на любые вопросы",
            isFlagship: false,
            persona: "Ты GPT-4o — универсальный помощник от OpenAI. Отвечай живо, интерактивно, понятно объясняй сложные вещи и помогай пользователю во всем."
        },
        {
            id: "freemodel:gpt-6-luna",
            display_name: "GPT-6 Luna",
            icon: "🌙",
            badge: "Freemodel",
            gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            category: "chat",
            desc: "Продвинутая модель нового поколения от Freemodel",
            isFlagship: true,
            persona: "Ты GPT-6 Luna — продвинутая языковая модель от Freemodel. Отвечай качественно, развернуто и точно."
        },
        {
            id: "freemodel:gpt-6-sol",
            display_name: "GPT-6 Sol",
            icon: "☀️",
            badge: "Freemodel",
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
            category: "chat",
            desc: "Молниеносная и креативная генерация ответов",
            isFlagship: false,
            persona: "Ты GPT-6 Sol — быстрая и яркая модель от Freemodel для решения любых задач."
        },
        {
            id: "completions:grok-code-fast-1",
            display_name: "Grok Code Fast",
            icon: "🚀",
            badge: "Completions",
            gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)",
            category: "code",
            desc: "Быстрое написание и отладка программного кода",
            isFlagship: true,
            persona: "Ты Grok Code Fast — специализированный ИИ для мгновенного написания и проверки кода."
        },
        {
            id: "completions:claude-opus-4.6-fast",
            display_name: "Claude 4.6 Fast",
            icon: "🦅",
            badge: "Completions",
            gradient: "linear-gradient(135deg, #f97316, #ea580c)",
            category: "chat",
            desc: "Скоростная версия Claude Opus 4.6 для мгновенного диалога",
            isFlagship: false,
            persona: "Ты Claude 4.6 Fast — быстрая версия флагмана с глубоким пониманием нюансов."
        },
        {
            id: "bazaarlink:qwen3.8-max",
            display_name: "Qwen 3.8 Max",
            icon: "💻",
            badge: "Alibaba",
            gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            category: "code",
            desc: "Мощная разработка от Alibaba с выдающимися навыками программирования",
            isFlagship: true,
            persona: "Ты Qwen 3.8 Max — элитный AI-разработчик и архитектор программного обеспечения. Ты пишешь чистый, безопасный, оптимизированный код на Python, JavaScript, TypeScript, Go, C++, SQL и других языках. Всегда комментируй ключевые моменты и оформляй код в блоки."
        },
        {
            id: "llama-3.3-70b-versatile",
            display_name: "Llama 3.3 70B",
            icon: "⚡",
            badge: "Meta AI",
            gradient: "linear-gradient(135deg, #ec4899, #be185d)",
            category: "chat",
            desc: "Открытая модель Meta на 70B параметров — интеллект флагманского уровня",
            isFlagship: true,
            persona: "Ты Llama 3.3 70B от Meta AI — одна из самых мощных открытых моделей в мире. Отвечай объективно, честно, с опорой на факты и научные данные."
        },
        {
            id: "llama-3.1-8b-instant",
            display_name: "Llama 3.1 8B",
            icon: "⚡",
            badge: "Meta Instant",
            gradient: "linear-gradient(135deg, #f43f5e, #e11d48)",
            category: "chat",
            desc: "Мгновенные ответы на простые вопросы, высокая скорость",
            isFlagship: false,
            persona: "Ты Llama 3.1 8B — ультра-быстрая компактная нейросеть. Отвечай кратко, емко и по существу."
        },
        // OpenRouter
        {
            id: "openrouter:anthropic/claude-3.5-sonnet",
            display_name: "Claude 3.5 Sonnet",
            icon: "🦅",
            badge: "OpenRouter",
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
            category: "chat",
            desc: "Флагманский интеллект Claude 3.5 Sonnet через OpenRouter",
            isFlagship: true,
            persona: "Ты Claude 3.5 Sonnet через OpenRouter — мощнейшая модель для сложного анализа, кода и творчества."
        },
        {
            id: "openrouter:deepseek/deepseek-r1",
            display_name: "DeepSeek R1",
            icon: "🤖",
            badge: "OpenRouter",
            gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)",
            category: "chat",
            desc: "Передовая рассуждающая модель DeepSeek R1 с глубоким мышлением",
            isFlagship: true,
            persona: "Ты DeepSeek R1 через OpenRouter — эксперт по глубоким рассуждениям, математике и логике."
        },
        {
            id: "openrouter:openai/gpt-4o",
            display_name: "GPT-4o",
            icon: "🧠",
            badge: "OpenRouter",
            gradient: "linear-gradient(135deg, #10b981, #059669)",
            category: "chat",
            desc: "Всесторонний флагман OpenAI через OpenRouter",
            isFlagship: false,
            persona: "Ты GPT-4o через OpenRouter — универсальный ассистент для любых повседневных задач."
        },
        // Mistral AI
        {
            id: "mistral:mistral-large-latest",
            display_name: "Mistral Large",
            icon: "🇫🇷",
            badge: "Mistral AI",
            gradient: "linear-gradient(135deg, #ff7000, #e65100)",
            category: "chat",
            desc: "Флагманская европейская нейросеть с высочайшим интеллектом и рассуждением",
            isFlagship: true,
            persona: "Ты Mistral Large от Mistral AI — европейский флагман с выдающимися языковыми и аналитическими навыками."
        },
        {
            id: "mistral:codestral-latest",
            display_name: "Codestral",
            icon: "💻",
            badge: "Mistral AI",
            gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            category: "code",
            desc: "Узкоспециализированная модель Mistral для профессионального написания кода",
            isFlagship: true,
            persona: "Ты Codestral от Mistral AI — эксперт по программированию на 80+ языках. Пиши чистый и оптимальный код."
        },
        // DeepInfra
        {
            id: "deepinfra:deepseek-ai/DeepSeek-R1",
            display_name: "DeepSeek R1",
            icon: "🤖",
            badge: "DeepInfra",
            gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            category: "chat",
            desc: "Высокоскоростной DeepSeek R1 с серверной оптимизацией DeepInfra",
            isFlagship: true,
            persona: "Ты DeepSeek R1 на мощностях DeepInfra — мощный рассуждающий ИИ для науки, кода и сложных задач."
        },
        {
            id: "deepinfra:meta-llama/Llama-3.3-70B-Instruct",
            display_name: "Llama 3.3 70B",
            icon: "⚡",
            badge: "DeepInfra",
            gradient: "linear-gradient(135deg, #ec4899, #be185d)",
            category: "chat",
            desc: "Быстрый серверный хостинг Llama 3.3 70B от DeepInfra",
            isFlagship: false,
            persona: "Ты Llama 3.3 70B через DeepInfra — открытый флагман Meta с быстрым откликом."
        },
        // Together AI
        {
            id: "together:deepseek-ai/DeepSeek-R1",
            display_name: "DeepSeek R1",
            icon: "🤖",
            badge: "Together AI",
            gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
            category: "chat",
            desc: "DeepSeek R1 через облачную платформу Together Cloud",
            isFlagship: true,
            persona: "Ты DeepSeek R1 через Together AI — высокоточная модель мышления и решения комплексных задач."
        },
        {
            id: "together:meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
            display_name: "Llama 3.1 70B Turbo",
            icon: "⚡",
            badge: "Together AI",
            gradient: "linear-gradient(135deg, #f43f5e, #e11d48)",
            category: "chat",
            desc: "Турбо-ускоренная инференс-версия Llama 3.1 70B от Together AI",
            isFlagship: false,
            persona: "Ты Llama 3.1 70B Turbo через Together AI — скорость и глубина мышления Meta."
        },
        // SambaNova
        {
            id: "sambanova:DeepSeek-R1-Distill-Llama-70B",
            display_name: "DeepSeek R1 Distill",
            icon: "🤖",
            badge: "SambaNova",
            gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
            category: "chat",
            desc: "Дистиллированный DeepSeek R1 на чипах SambaNova SN40L с огромной скоростью",
            isFlagship: true,
            persona: "Ты DeepSeek R1 Distill 70B на аппаратных ускорителях SambaNova. Отвечай глубоко и молниеносно."
        },
        {
            id: "sambanova:Meta-Llama-3.3-70B-Instruct",
            display_name: "Llama 3.3 70B",
            icon: "⚡",
            badge: "SambaNova",
            gradient: "linear-gradient(135deg, #a855f7, #9333ea)",
            category: "chat",
            desc: "Llama 3.3 70B на суперкомпьютерной архитектуре SambaNova",
            isFlagship: false,
            persona: "Ты Llama 3.3 70B на чипах SambaNova — быстрая и умная модель для широкого круга задач."
        },
        // Cerebras
        {
            id: "cerebras:llama-3.3-70b",
            display_name: "Llama 3.3 70B Ultra",
            icon: "🚀",
            badge: "Cerebras",
            gradient: "linear-gradient(135deg, #e11d48, #be123c)",
            category: "chat",
            desc: "Сверхскоростной запуск Llama 3.3 70B на кремниевых пластинах Wafer-Scale Engine",
            isFlagship: true,
            persona: "Ты Llama 3.3 70B на кремниевых пластинах Cerebras Wafer-Scale Engine — самая быстрая инференс-модель в мире."
        }
    ];

    // --- 2. State & Storage Management ---
    let activeModel = localStorage.getItem("user_selected_model") || "bazaarlink:deepseek-v4-pro";
    let activeModelTitle = localStorage.getItem("user_selected_model_title") || "DeepSeek V4 Pro";
    let activeStyle = "реализм";
    let isVoiceActive = localStorage.getItem("user_voice_active") === "true";
    let chatHistory = [];
    let allLoadedModels = [...REAL_BOT_MODELS];
    let currentFilter = "all";
    let searchQuery = "";

    // Persistent User Profile State
    let userBalanceRub = parseInt(localStorage.getItem("user_balance_rub") || "0", 10);
    let userBalanceStars = parseInt(localStorage.getItem("user_balance_stars") || "0", 10);
    let userTariff = localStorage.getItem("user_tariff") || "Базовый (Free)";
    let userProjects = JSON.parse(localStorage.getItem("user_projects") || '["Главный проект"]');
    let messagesSentCount = parseInt(localStorage.getItem("user_msg_count") || "0", 10);
    let photosCount = parseInt(localStorage.getItem("user_photo_count") || "0", 10);

    // --- 3. DOM Elements ---
    const userAvatarEl = document.getElementById("userAvatar");
    const userNameEl = document.getElementById("userName");
    const userSubEl = document.getElementById("userSub");
    const headerBalanceEl = document.getElementById("headerBalance");
    const starsValEl = document.getElementById("starsVal");

    const profileAvatarLargeEl = document.getElementById("profileAvatarLarge");
    const profileFullNameEl = document.getElementById("profileFullName");
    const profileUserIdEl = document.getElementById("profileUserId");

    const chatActiveModelNameEl = document.getElementById("chatActiveModelName");
    const quickSwitchModelBtn = document.getElementById("quickSwitchModelBtn");
    const chatFeedEl = document.getElementById("chatFeed");
    const chatFormEl = document.getElementById("chatForm");
    const chatInputEl = document.getElementById("chatInput");
    const clearChatBtn = document.getElementById("clearChatBtn");
    const voiceToggleBtn = document.getElementById("voiceToggleBtn");

    const imagePromptInput = document.getElementById("imagePromptInput");
    const stylePills = document.querySelectorAll(".style-pill");
    const generateImageBtn = document.getElementById("generateImageBtn");
    const ideaItems = document.querySelectorAll(".idea-item");

    const promoKeyInput = document.getElementById("promoKeyInput");
    const activateKeyBtn = document.getElementById("activateKeyBtn");

    const navItems = document.querySelectorAll(".nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");

    const toastEl = document.getElementById("appToast");
    const toastTextEl = document.getElementById("appToastText");

    // Modal elements
    const modalOverlay = document.getElementById("appModalOverlay");
    const modalTitleEl = document.getElementById("modalTitle");
    const modalBodyEl = document.getElementById("modalBody");
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    // Dynamic Models DOM Elements
    const dynamicModelListEl = document.getElementById("dynamicModelList");
    const modelsCountBadgeEl = document.getElementById("modelsCountBadge");
    const modelSearchInput = document.getElementById("modelSearchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const refreshModelsBtn = document.getElementById("refreshModelsBtn");
    const filterChips = document.querySelectorAll(".models-filter-chips .filter-chip");

    // --- 4. Initialize & Synchronize State with @NextoraAI_bot ---
    function formatTariffLabel(raw) {
        if (!raw) return "Базовый (Free)";
        const lower = String(raw).toLowerCase();
        if (lower.includes("vip") || lower.includes("безлимит")) return "👑 VIP Безлимит";
        if (lower.includes("pro_plus") || lower.includes("plus")) return "🟣 Pro Plus";
        if (lower.includes("pro")) return "🔥 Pro Аккаунт";
        if (lower.includes("free") || lower.includes("бесплат")) return "🟢 Базовый (Free)";
        return raw;
    }

    function syncWithBotState() {
        // Parse parameters passed in URL hash: #uid=...&stars=...&rub=...&tariff=...&model=...
        const rawHash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
        const hashParams = new URLSearchParams(rawHash);
        const searchParams = new URLSearchParams(window.location.search);

        const uid = hashParams.get("uid") || searchParams.get("uid");
        const stars = hashParams.get("stars") || searchParams.get("stars");
        const rub = hashParams.get("rub") || searchParams.get("rub");
        const tariff = hashParams.get("tariff") || searchParams.get("tariff");
        const model = hashParams.get("model") || searchParams.get("model");

        if (uid) {
            localStorage.setItem("user_telegram_id", uid);
        }
        if (stars !== null && stars !== undefined && stars !== "") {
            userBalanceStars = parseInt(stars, 10) || 0;
            localStorage.setItem("user_balance_stars", String(userBalanceStars));
        }
        if (rub !== null && rub !== undefined && rub !== "") {
            userBalanceRub = parseInt(rub, 10) || 0;
            localStorage.setItem("user_balance_rub", String(userBalanceRub));
        }
        if (tariff) {
            userTariff = formatTariffLabel(tariff);
            localStorage.setItem("user_tariff", userTariff);
        }
        if (model) {
            const foundModel = REAL_BOT_MODELS.find(m => m.id === model || m.id.endsWith(model) || model.endsWith(m.id));
            if (foundModel) {
                activeModel = foundModel.id;
                activeModelTitle = foundModel.display_name;
            } else {
                activeModel = model;
                activeModelTitle = model.replace("bazaarlink:", "").toUpperCase();
            }
            localStorage.setItem("user_selected_model", activeModel);
            localStorage.setItem("user_selected_model_title", activeModelTitle);
        }
    }
    syncWithBotState();

    function updateHeaderUI() {
        if (chatActiveModelNameEl) chatActiveModelNameEl.textContent = activeModelTitle;
        if (starsValEl) {
            starsValEl.textContent = `${userBalanceStars} ⭐ | ${userBalanceRub} ₽`;
        }
        if (voiceToggleBtn) {
            voiceToggleBtn.style.color = isVoiceActive ? "var(--accent)" : "var(--tg-hint)";
            voiceToggleBtn.textContent = isVoiceActive ? "🔊 Вкл" : "🔈 Озвучка";
        }
    }
    updateHeaderUI();

    // Initialize Telegram WebApp
    if (tg) {
        tg.ready();
        tg.expand();

        if (typeof tg.enableClosingConfirmation === "function") {
            tg.enableClosingConfirmation();
        }

        if (tg.themeParams?.bg_color) {
            document.documentElement.style.setProperty("--tg-bg", tg.themeParams.bg_color);
        }
        if (tg.themeParams?.secondary_bg_color) {
            document.documentElement.style.setProperty("--tg-sec-bg", tg.themeParams.secondary_bg_color);
        }

        const user = tg.initDataUnsafe?.user;
        const storedUid = localStorage.getItem("user_telegram_id");
        const effectiveUid = user?.id ? String(user.id) : (storedUid || "Синхронизируется");
        const fullName = user ? ([user.first_name, user.last_name].filter(Boolean).join(" ") || "Пользователь") : "Пользователь";
        const handle = user?.username ? `@${user.username}` : `ID: ${effectiveUid}`;
        const initial = fullName.charAt(0).toUpperCase() || "AI";

        if (userNameEl) userNameEl.textContent = fullName;
        if (userSubEl) userSubEl.textContent = `${userTariff} • ${handle}`;
        if (userAvatarEl) userAvatarEl.textContent = initial;

        if (profileFullNameEl) profileFullNameEl.textContent = fullName;
        if (profileUserIdEl) profileUserIdEl.textContent = handle;
        if (profileAvatarLargeEl) profileAvatarLargeEl.textContent = initial;

        if (tg.BackButton) {
            tg.BackButton.onClick(() => {
                closeModal();
                switchTab("tab-chat");
            });
        }
    } else {
        const storedUid = localStorage.getItem("user_telegram_id");
        const handle = storedUid ? `ID: ${storedUid}` : "Web Mode";
        if (userNameEl) userNameEl.textContent = "Пользователь (Web)";
        if (userSubEl) userSubEl.textContent = `${userTariff} • ${handle}`;
        if (profileFullNameEl) profileFullNameEl.textContent = "Пользователь (Web)";
        if (profileUserIdEl) profileUserIdEl.textContent = handle;
    }

    // --- 5. Toast Notifications ---
    let toastTimer = null;
    function showToast(message, duration = 2400) {
        if (!toastEl || !toastTextEl) return;
        toastTextEl.textContent = message;
        toastEl.classList.add("show");

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.classList.remove("show");
        }, duration);
    }

    // --- 6. Modal Dialog System ---
    function openModal(title, htmlContent) {
        if (!modalOverlay || !modalTitleEl || !modalBodyEl) return;
        modalTitleEl.textContent = title;
        modalBodyEl.innerHTML = htmlContent;
        modalOverlay.classList.add("active");
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred("medium");
        }
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove("active");
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Header balance click
    if (headerBalanceEl) {
        headerBalanceEl.addEventListener("click", () => openBalanceModal());
    }

    // --- 7. Tab Switching Logic ---
    function switchTab(targetTabId) {
        navItems.forEach(item => {
            if (item.getAttribute("data-tab") === targetTabId) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        tabPanes.forEach(pane => {
            if (pane.id === targetTabId) {
                pane.classList.add("active");
            } else {
                pane.classList.remove("active");
            }
        });

        if (tg?.BackButton) {
            if (targetTabId === "tab-chat") {
                tg.BackButton.hide();
            } else {
                tg.BackButton.show();
            }
        }

        if (tg?.HapticFeedback) {
            tg.HapticFeedback.selectionChanged();
        }
    }

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-tab");
            if (target) switchTab(target);
        });
    });

    if (quickSwitchModelBtn) {
        quickSwitchModelBtn.addEventListener("click", () => {
            switchTab("tab-models");
        });
    }

    // --- 8. Markdown & Code Rendering Engine ---
    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderMarkdownToHtml(markdown) {
        if (!markdown) return "";

        // Placeholder store for code blocks to protect them from regex replacements
        const codeBlocks = [];
        let text = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
            codeBlocks.push({
                lang: lang.trim() || "CODE",
                code: code.trim()
            });
            return placeholder;
        });

        // Inline code: `code`
        const inlineCodes = [];
        text = text.replace(/`([^`\n]+)`/g, (match, code) => {
            const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
            inlineCodes.push(escapeHtml(code));
            return placeholder;
        });

        // HTML escaping
        text = escapeHtml(text);

        // Headings: ### Header -> <h4 class="md-h4">Header</h4>
        text = text.replace(/^### (.*$)/gim, '<h4 class="md-h4">$1</h4>');
        text = text.replace(/^## (.*$)/gim, '<h3 class="md-h3">$1</h3>');
        text = text.replace(/^# (.*$)/gim, '<h3 class="md-h3">$1</h3>');

        // Blockquotes: > quote
        text = text.replace(/^\> (.*$)/gim, '<div class="md-blockquote">$1</div>');

        // Bold & Italic
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Lists: - item or * item
        text = text.replace(/^\s*[-*]\s+(.*)$/gim, '<li class="md-li">$1</li>');

        // Numbered lists: 1. item
        text = text.replace(/^\s*\d+\.\s+(.*)$/gim, '<li class="md-li">$1</li>');

        // Wrap consecutive <li> into <ul>
        text = text.replace(/((?:<li class="md-li">.*?<\/li>\s*)+)/gis, '<ul class="md-ul">$1</ul>');

        // Line breaks (convert newlines to <br> outside tags)
        text = text.replace(/\n\n+/g, '</p><p>');
        text = text.replace(/\n/g, '<br>');

        // Restore inline code
        text = text.replace(/__INLINE_CODE_(\d+)__/g, (match, idx) => {
            return `<code class="inline-code">${inlineCodes[idx]}</code>`;
        });

        // Restore code blocks with Header, Language Tag, and Copy button
        text = text.replace(/__CODE_BLOCK_(\d+)__/g, (match, idx) => {
            const item = codeBlocks[idx];
            const escapedCode = escapeHtml(item.code);
            return `
                <div class="code-block-wrapper">
                    <div class="code-block-header">
                        <span class="code-lang-tag">${escapeHtml(item.lang)}</span>
                        <button class="code-copy-btn" onclick="copyCodeSnippet(this)">📋 Копировать</button>
                    </div>
                    <pre class="code-block-pre"><code>${escapedCode}</code></pre>
                </div>
            `;
        });

        return `<p>${text}</p>`;
    }

    // Global helper for code snippet copy
    window.copyCodeSnippet = function(button) {
        const pre = button.closest(".code-block-wrapper")?.querySelector("code");
        if (!pre) return;
        const text = pre.textContent || "";
        navigator.clipboard.writeText(text).then(() => {
            button.textContent = "✓ Скопировано!";
            button.style.color = "var(--success)";
            setTimeout(() => {
                button.textContent = "📋 Копировать";
                button.style.color = "";
            }, 2000);
            showToast("Код скопирован в буфер обмена");
        }).catch(() => {
            showToast("Не удалось скопировать код");
        });
    };

    // Global helper for full message copy
    window.copyMessageText = function(button) {
        const bubble = button.closest(".chat-bubble");
        const textEl = bubble?.querySelector(".bubble-text");
        if (!textEl) return;
        navigator.clipboard.writeText(textEl.innerText || "").then(() => {
            showToast("Сообщение скопировано");
        });
    };

    // Global helper for speech
    window.speakMessageText = function(button) {
        const bubble = button.closest(".chat-bubble");
        const textEl = bubble?.querySelector(".bubble-text");
        if (!textEl) return;
        speakText(textEl.innerText || "");
    };

    // Global helper for regenerate
    window.regenerateLastMessage = function() {
        if (chatHistory.length === 0) return;
        const lastUserMsg = [...chatHistory].reverse().find(m => m.role === "user");
        if (lastUserMsg) {
            submitUserMessage(lastUserMsg.content, true);
        }
    };

    // --- 9. Chat Bubbles & Thinking Indicator ---
    function appendChatBubble(role, content, isHtml = false) {
        if (!chatFeedEl) return;

        const welcomeEl = chatFeedEl.querySelector(".chat-welcome");
        if (welcomeEl) welcomeEl.style.display = "none";

        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${role} bubble-${role}`;

        const textDiv = document.createElement("div");
        textDiv.className = "bubble-text";

        if (isHtml) {
            textDiv.innerHTML = content;
        } else if (role === "ai") {
            textDiv.innerHTML = renderMarkdownToHtml(content);
        } else {
            textDiv.textContent = content;
        }

        const metaRow = document.createElement("div");
        metaRow.className = "bubble-meta-row";
        metaRow.style.display = "flex";
        metaRow.style.justifyContent = "space-between";
        metaRow.style.alignItems = "center";
        metaRow.style.marginTop = "4px";

        const timeDiv = document.createElement("div");
        timeDiv.className = "bubble-time";
        const now = new Date();
        timeDiv.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        bubble.appendChild(textDiv);

        if (role === "ai") {
            const actionsDiv = document.createElement("div");
            actionsDiv.className = "bubble-actions";
            actionsDiv.innerHTML = `
                <button class="bubble-action-btn" onclick="copyMessageText(this)" title="Копировать">📋 Копия</button>
                <button class="bubble-action-btn" onclick="speakMessageText(this)" title="Озвучить">🔊 Голос</button>
                <button class="bubble-action-btn" onclick="regenerateLastMessage()" title="Сгенерировать заново">🔄 Заново</button>
            `;
            bubble.appendChild(actionsDiv);
        }

        bubble.appendChild(timeDiv);
        chatFeedEl.appendChild(bubble);
        chatFeedEl.scrollTop = chatFeedEl.scrollHeight;
        return bubble;
    }

    function showThinkingBubble(message = "Думаю...") {
        if (!chatFeedEl) return null;

        const welcomeEl = chatFeedEl.querySelector(".chat-welcome");
        if (welcomeEl) welcomeEl.style.display = "none";

        removeThinkingBubble();

        const bubble = document.createElement("div");
        bubble.className = "chat-bubble ai bubble-ai thinking";
        bubble.id = "activeThinkingBubble";

        bubble.innerHTML = `
            <div class="thinking-header">
                <span class="thinking-spinner">⏳</span>
                <span>${escapeHtml(message)}</span>
            </div>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        chatFeedEl.appendChild(bubble);
        chatFeedEl.scrollTop = chatFeedEl.scrollHeight;
        return bubble;
    }

    function removeThinkingBubble() {
        const existing = document.getElementById("activeThinkingBubble");
        if (existing) existing.remove();
    }

    // --- 10. AI Chat Completion Engine with Custom Personas ---
    async function requestAiAnswer(userPrompt, extraSystemInstructions = "") {
        // Find persona for active model
        const modelObj = REAL_BOT_MODELS.find(m => m.id === activeModel || m.display_name === activeModelTitle) || REAL_BOT_MODELS[0];
        let systemPrompt = modelObj.persona || `Ты ${activeModelTitle}, интеллектуальный ИИ-ассистент.`;
        systemPrompt += " Отвечай на русском языке, структурировано, подробно и понятно. Форматируй код в тройные обратные кавычки с указанием языка (например, ```python).";

        if (extraSystemInstructions) {
            systemPrompt += "\n" + extraSystemInstructions;
        }

        const messages = [
            { role: "system", content: systemPrompt },
            ...chatHistory.slice(-8),
            { role: "user", content: userPrompt }
        ];

        const response = await fetch("https://text.pollinations.ai/openai/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                model: "openai-fast",
                messages: messages,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервиса (HTTP ${response.status})`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content || !content.trim()) {
            throw new Error("Пустой ответ от нейросети");
        }
        return stripProviderAdvertisements(content);
    }

    function stripProviderAdvertisements(text) {
        if (!text) return "";
        let cleaned = text;
        cleaned = cleaned.replace(/\n*-{3,}\s*\n+support pollinations\.ai:[\s\S]*$/gi, "");
        cleaned = cleaned.replace(/\n*-{3,}\s*\n*🌸\s*ad\s*🌸[\s\S]*$/gi, "");
        cleaned = cleaned.replace(/\n*🌸\s*ad\s*🌸[\s\S]*$/gi, "");
        cleaned = cleaned.replace(/\n*support pollinations\.ai:[\s\S]*$/gi, "");
        cleaned = cleaned.replace(/\n*powered by pollinations(?:\.ai)?[\s\S]*$/gi, "");
        cleaned = cleaned.replace(/\n*-{3,}\s*\n*powered by pollinations[\s\S]*$/gi, "");
        cleaned = cleaned.replace(/\[support our mission\]\(https?:\/\/pollinations\.ai[^\)]*\)[^\n]*/gi, "");
        cleaned = cleaned.replace(/https?:\/\/pollinations\.ai\/redirect\/\S*/gi, "");
        cleaned = cleaned.replace(/\bkeep ai accessible for everyone\.?\b/gi, "");
        cleaned = cleaned.replace(/\n+-{3,}\s*$/g, "");
        return cleaned.trim();
    }

    function speakText(text) {
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/```[\s\S]*?```/g, "Блок кода пропущен.").replace(/[*#_`>]/g, "").slice(0, 500);
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = "ru-RU";
            utterance.rate = 1.05;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn("Speech synthesis error:", e);
        }
    }

    // --- 11. Bot Slash Command Interceptor ---
    async function handleBotCommand(rawText) {
        const parts = rawText.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(" ").trim();

        // 1. /start & /help
        if (cmd === "/start" || cmd === "/help") {
            const menuHtml = `
                <div class="bot-command-card">
                    <div class="bot-card-title">🤖 Команды и возможности бота</div>
                    <p style="font-size:12.5px; color:var(--tg-hint); margin-bottom:8px;">
                        В веб-версии доступны все функции бота! Нажмите на кнопку или отправьте команду:
                    </p>
                    <div class="bot-cmd-grid">
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/models')">🤖 Модели (/models)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/photo')">🎨 Фото (/photo)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/balance')">💰 Баланс (/balance)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/tariffs')">💎 Тарифы (/tariffs)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/games')">🎮 AI Игры (/games)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/store')">🛍️ Магазин (/store)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/storage')">📦 Диск (/storage)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/profile')">👤 Профиль (/profile)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/voice')">🔊 Голос (/voice)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/clear')">🧹 Очистить (/clear)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/status')">📊 Статус (/status)</button>
                        <button class="bot-cmd-btn" onclick="executeQuickCmd('/export')">💾 Экспорт (/export)</button>
                    </div>
                </div>
            `;
            appendChatBubble("ai", menuHtml, true);
            return true;
        }

        // 2. /clear & /reset
        if (cmd === "/clear" || cmd === "/reset") {
            chatHistory = [];
            const bubbles = chatFeedEl.querySelectorAll(".chat-bubble");
            bubbles.forEach(b => b.remove());
            const welcomeEl = chatFeedEl.querySelector(".chat-welcome");
            if (welcomeEl) welcomeEl.style.display = "flex";
            showToast("Память диалога очищена");
            return true;
        }

        // 3. /model & /models
        if (cmd === "/model" || cmd === "/models") {
            switchTab("tab-models");
            showToast("Открыт каталог 13 моделей");
            return true;
        }

        // 4. /photo & /image
        if (cmd === "/photo" || cmd === "/image" || cmd === "/generate") {
            switchTab("tab-image");
            if (args) {
                if (imagePromptInput) imagePromptInput.value = args;
                if (generateImageBtn) generateImageBtn.click();
            } else {
                showToast("Введите описание для фото");
            }
            return true;
        }

        // 5. /balance
        if (cmd === "/balance") {
            openBalanceModal();
            return true;
        }

        // 6. /tariffs & /sub
        if (cmd === "/tariffs" || cmd === "/tariff" || cmd === "/sub") {
            openTariffsModal();
            return true;
        }

        // 7. /store & /shop
        if (cmd === "/store" || cmd === "/shop") {
            openStoreModal();
            return true;
        }

        // 8. /games & /quest
        if (cmd === "/games" || cmd === "/quest") {
            openGamesModal();
            return true;
        }

        // 9. /storage
        if (cmd === "/storage") {
            openStorageModal();
            return true;
        }

        // 10. /profile
        if (cmd === "/profile") {
            openProfileModal();
            return true;
        }

        // 11. /voice
        if (cmd === "/voice") {
            isVoiceActive = !isVoiceActive;
            localStorage.setItem("user_voice_active", String(isVoiceActive));
            updateHeaderUI();
            showToast(isVoiceActive ? "Озвучка ответов включена" : "Озвучка отключена");
            return true;
        }

        // 12. /status
        if (cmd === "/status") {
            const statusHtml = `
                <div class="bot-command-card">
                    <div class="bot-card-title">📊 Системный статус WebApp</div>
                    <ul style="font-size:12.5px; line-height:1.6; margin-left:16px; color:#e2e8f0;">
                        <li><strong>Текущая модель:</strong> ${activeModelTitle}</li>
                        <li><strong>Тариф:</strong> ${userTariff}</li>
                        <li><strong>Баланс:</strong> ${userBalanceStars} ⭐ | ${userBalanceRub} ₽</li>
                        <li><strong>Озвучка:</strong> ${isVoiceActive ? "Включена" : "Выключена"}</li>
                        <li><strong>Сообщений в сессии:</strong> ${messagesSentCount}</li>
                        <li><strong>Сгенерировано фото:</strong> ${photosCount}</li>
                        <li><strong>Telegram WebApp SDK:</strong> ${tg ? "Подключен (v" + (tg.version || "7.0") + ")" : "Браузерный режим"}</li>
                        <li><strong>Аптайм сервера:</strong> 100% Онлайн</li>
                    </ul>
                </div>
            `;
            appendChatBubble("ai", statusHtml, true);
            return true;
        }

        // 13. /export
        if (cmd === "/export") {
            exportChatHistory();
            return true;
        }

        // Unknown slash command
        appendChatBubble("ai", `⚠️ Команда <code>${escapeHtml(cmd)}</code> не распознана. Отправьте <strong>/help</strong> для просмотра доступных команд.`, true);
        return true;
    }

    // Quick command dispatcher
    window.executeQuickCmd = function(commandStr) {
        if (chatInputEl) {
            chatInputEl.value = commandStr;
            chatFormEl?.dispatchEvent(new Event("submit", { cancelable: true }));
        }
    };

    function exportChatHistory() {
        if (chatHistory.length === 0) {
            showToast("История чата пуста");
            return;
        }
        let txt = `=== Экспорт диалога AI Bot WebApp ===\nДата: ${new Date().toLocaleString()}\nМодель: ${activeModelTitle}\n\n`;
        chatHistory.forEach(m => {
            const roleName = m.role === "user" ? "Вы" : "ИИ (" + activeModelTitle + ")";
            txt += `[${roleName}]:\n${m.content}\n\n--------------------\n\n`;
        });
        const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `chat_${Date.now()}.txt`;
        a.click();
        showToast("История экспортирована в файл");
    }

    // --- 12. Main Message Submission Pipeline ---
    async function submitUserMessage(text, isRegen = false) {
        if (!text) return;

        // Check for slash commands
        if (text.startsWith("/")) {
            appendChatBubble("user", text);
            await handleBotCommand(text);
            return;
        }

        // Increment user messages count
        messagesSentCount++;
        localStorage.setItem("user_msg_count", String(messagesSentCount));

        if (!isRegen) {
            appendChatBubble("user", text);
            chatHistory.push({ role: "user", content: text });
        }

        if (chatInputEl) {
            chatInputEl.value = "";
            chatInputEl.style.height = "auto";
        }

        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred("medium");
        }

        // Render Thinking Bubble
        showThinkingBubble(`ИИ ${activeModelTitle} думает...`);

        try {
            const answer = await requestAiAnswer(text);
            removeThinkingBubble();

            appendChatBubble("ai", answer);
            chatHistory.push({ role: "assistant", content: answer });

            if (isVoiceActive) {
                speakText(answer);
            }

            if (tg?.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred("success");
            }
        } catch (err) {
            console.error("AI request failed:", err);
            removeThinkingBubble();
            appendChatBubble("ai", `⚠️ Ошибка при связи с нейросетью: ${err.message || "Таймаут"}. Пожалуйста, повторите запрос через пару секунд.`);
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred("error");
            }
        }
    }

    if (chatInputEl) {
        chatInputEl.addEventListener("input", () => {
            chatInputEl.style.height = "auto";
            chatInputEl.style.height = Math.min(chatInputEl.scrollHeight, 120) + "px";
        });

        chatInputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                chatFormEl?.dispatchEvent(new Event("submit", { cancelable: true }));
            }
        });
    }

    if (chatFormEl && chatInputEl) {
        chatFormEl.addEventListener("submit", async (e) => {
            e.preventDefault();
            const text = chatInputEl.value.trim();
            if (!text) return;
            await submitUserMessage(text);
        });
    }

    // Prompt chips click
    const promptChips = document.querySelectorAll(".prompt-chips .chip");
    promptChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const prompt = chip.getAttribute("data-prompt");
            if (prompt && chatInputEl) {
                chatInputEl.value = prompt;
                chatFormEl?.dispatchEvent(new Event("submit", { cancelable: true }));
            }
        });
    });

    if (clearChatBtn) {
        clearChatBtn.addEventListener("click", () => {
            handleBotCommand("/clear");
        });
    }

    if (voiceToggleBtn) {
        voiceToggleBtn.addEventListener("click", () => {
            handleBotCommand("/voice");
        });
    }

    // --- 13. Interactive AI Games System ---
    const GAMES_CATALOG = [
        {
            id: "cyberpunk",
            title: "🌆 Киберпанк 2099: Неоновый город",
            desc: "Атмосферная текстовая RPG. Вы — наёмник в мрачном мегаполисе будущего.",
            prompt: "Начни интерактивную текстовую ролевую игру 'Киберпанк 2099'. Опиши яркую стартовую сцену в неоновом городе, представь моего персонажа и предложи 3 пронумерованных варианта действий (1, 2, 3), оформленных в виде выбора."
        },
        {
            id: "fantasy",
            title: "🐉 Подземелье драконов",
            desc: "Фэнтези-квест с исследованием древних руин, магией и чудовищами.",
            prompt: "Начни интерактивную RPG 'Подземелье драконов'. Опиши стартовую локацию перед входом в катакомбы древнего ордена магов и предложи 3 варианта действий (1, 2, 3)."
        },
        {
            id: "quiz",
            title: "🧠 AI Викторина: Битва эрудитов",
            desc: "Интеллектуальное шоу. Проверьте свои знания в науке, IT, кино и истории.",
            prompt: "Будь ведущим викторины 'Битва эрудитов'. Задай первый интересный и неожиданный вопрос с 4 вариантами ответа (A, B, C, D) и веди счёт очков."
        },
        {
            id: "coding_quest",
            title: "💻 Кодинг-квест: Взлом мейнфрейма",
            desc: "Интерактивная игра для программистов: взлом систем, поиск уязвимостей, загадки.",
            prompt: "Начни интерактивную игру-квест 'Взлом мейнфрейма'. Я — белый хакер, исследующий подозрительную корпоративную сеть. Предложи первую загадку и 3 варианта действий."
        }
    ];

    window.startGame = function(gameId) {
        const game = GAMES_CATALOG.find(g => g.id === gameId);
        if (!game) return;
        closeModal();
        switchTab("tab-chat");
        submitUserMessage(game.prompt);
        showToast(`Запущена игра: ${game.title}`);
    };

    // --- 14. Modals Logic & Real Stars Payment Integration ---
    function openBalanceModal() {
        const html = `
            <div style="display:flex; flex-direction:column; gap:14px;">
                <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; text-align:center;">
                    <div style="font-size:12px; color:var(--tg-hint); text-transform:uppercase;">Текущий баланс аккаунта</div>
                    <div style="font-size:28px; font-weight:800; color:var(--accent); margin:6px 0;">
                        ${userBalanceStars} ⭐ / ${userBalanceRub} ₽
                    </div>
                    <div style="font-size:12px; color:#10b981;">● Синхронизировано с @NextoraAI_bot</div>
                </div>

                <div style="font-size:13px; font-weight:700; color:var(--tg-text);">Официальное пополнение через Telegram Stars:</div>
                <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px;">
                    <button class="action-btn-primary" style="padding:12px 8px; font-size:13px;" onclick="requestStarsPayment('50')">⭐ 50 Stars (50 ₽)</button>
                    <button class="action-btn-primary" style="padding:12px 8px; font-size:13px;" onclick="requestStarsPayment('100')">⭐ 100 Stars (100 ₽)</button>
                    <button class="action-btn-primary" style="padding:12px 8px; font-size:13px;" onclick="requestStarsPayment('250')">⭐ 250 Stars (250 ₽)</button>
                    <button class="action-btn-primary" style="padding:12px 8px; font-size:13px;" onclick="requestStarsPayment('500')">⭐ 500 Stars (500 ₽)</button>
                </div>

                <div style="background:rgba(56, 189, 248, 0.08); padding:10px 12px; border-radius:8px; border:1px solid rgba(56, 189, 248, 0.2); font-size:11.5px; color:#94a3b8; line-height:1.4;">
                    ℹ️ <strong>Как происходит оплата:</strong> При нажатии бот <strong>@NextoraAI_bot</strong> автоматически выставит вам официальный счёт Telegram Stars в чате. После подтверждения оплаты звёзды моментально начисляются на баланс!
                </div>

                <div style="font-size:13px; font-weight:700; color:var(--tg-text);">Пополнение в рублях (СБП / Карта):</div>
                <div style="display:grid; grid-template-columns:1fr; gap:8px;">
                    <button class="agent-btn" style="padding:10px 8px; font-size:12.5px;" onclick="requestRubPayment()">
                        💳 Оплатить в рублях через @NextoraAI_bot
                    </button>
                </div>
            </div>
        `;
        openModal("💰 Пополнение баланса Stars", html);
    }

    window.requestStarsPayment = function(amount) {
        const botUsername = "NextoraAI_bot";
        const link = `https://t.me/${botUsername}?start=topup_stars_${amount}`;
        
        closeModal();
        showToast(`Перенаправляем в @${botUsername} для оплаты ${amount} ⭐...`, 2500);

        if (tg?.openTelegramLink) {
            setTimeout(() => {
                tg.openTelegramLink(link);
                if (tg.close) tg.close();
            }, 300);
        } else {
            setTimeout(() => {
                window.location.href = link;
            }, 300);
        }
    };

    window.requestRubPayment = function() {
        const botUsername = "NextoraAI_bot";
        const link = `https://t.me/${botUsername}?start=topup_rub`;
        closeModal();
        showToast("Открываем @NextoraAI_bot для оплаты...", 2000);
        if (tg?.openTelegramLink) {
            setTimeout(() => {
                tg.openTelegramLink(link);
                if (tg.close) tg.close();
            }, 300);
        } else {
            setTimeout(() => {
                window.location.href = link;
            }, 300);
        }
    };

    function openTariffsModal() {
        const html = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="background:rgba(255,255,255,0.05); padding:12px; border-radius:12px; border:1px solid ${userTariff.includes('Free') ? 'var(--accent)' : 'var(--card-border)'};">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:#fff;">Базовый (Free)</strong>
                        <span style="color:#10b981; font-weight:700;">0 ₽ / навсегда</span>
                    </div>
                    <p style="font-size:12px; color:var(--tg-hint); margin:6px 0;">Доступ ко всем 13 моделям, базовые лимиты, генерация фото.</p>
                    <button class="agent-btn" style="width:100%;" onclick="setUserTariff('Базовый (Free)')">
                        ${userTariff.includes('Free') ? '✓ Текущий тариф' : 'Выбрать Free'}
                    </button>
                </div>

                <div style="background:rgba(56, 189, 248, 0.08); padding:12px; border-radius:12px; border:1px solid ${userTariff.includes('Pro') ? 'var(--accent)' : 'rgba(56, 189, 248, 0.3)'};">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:var(--accent);">🔥 Pro Аккаунт</strong>
                        <span style="color:var(--accent); font-weight:700;">490 ₽ / мес</span>
                    </div>
                    <p style="font-size:12px; color:var(--tg-hint); margin:6px 0;">Приоритет в очереди, безлимитный DeepSeek V4 Pro & Claude Opus, 500 МБ хранилища.</p>
                    <button class="action-btn-primary" style="width:100%;" onclick="requestSubscriptionPayment('pro_3', 'Pro подписки')">
                        💳 Оформить Pro через @NextoraAI_bot
                    </button>
                </div>

                <div style="background:rgba(139, 92, 246, 0.08); padding:12px; border-radius:12px; border:1px solid ${userTariff.includes('VIP') ? 'var(--accent)' : 'rgba(139, 92, 246, 0.3)'};">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:#a78bfa;">👑 VIP Безлимит</strong>
                        <span style="color:#a78bfa; font-weight:700;">990 ₽ / мес</span>
                    </div>
                    <p style="font-size:12px; color:var(--tg-hint); margin:6px 0;">Полный доступ ко всем возможностям, автономный AI-агент, 2 ГБ хранилища B2.</p>
                    <button class="action-btn-primary" style="width:100%; background:linear-gradient(135deg, #8b5cf6, #6d28d9);" onclick="requestSubscriptionPayment('pro_plus_1', 'VIP подписки')">
                        👑 Оформить VIP через @NextoraAI_bot
                    </button>
                </div>
            </div>
        `;
        openModal("💎 Тарифы и подписки", html);
    }

    window.requestSubscriptionPayment = function(planId, title) {
        const botUsername = "NextoraAI_bot";
        const link = `https://t.me/${botUsername}?start=sub_${planId}`;
        closeModal();
        showToast(`Перенаправляем в @${botUsername} для оплаты ${title}...`, 2500);
        if (tg?.openTelegramLink) {
            setTimeout(() => {
                tg.openTelegramLink(link);
                if (tg.close) tg.close();
            }, 300);
        } else {
            setTimeout(() => {
                window.location.href = link;
            }, 300);
        }
    };

    window.setUserTariff = function(tariffName) {
        userTariff = tariffName;
        localStorage.setItem("user_tariff", userTariff);
        if (userSubEl) userSubEl.textContent = `${userTariff} • @telegram`;
        closeModal();
        showToast(`Тариф обновлен: ${userTariff}`);
    };

    function openGamesModal() {
        let cards = "";
        GAMES_CATALOG.forEach(g => {
            cards += `
                <div style="background:rgba(255,255,255,0.06); padding:12px; border-radius:12px; border:1px solid var(--card-border); margin-bottom:10px;">
                    <div style="font-size:14px; font-weight:700; color:#fff;">${g.title}</div>
                    <div style="font-size:12px; color:var(--tg-hint); margin:4px 0 10px;">${g.desc}</div>
                    <button class="action-btn-primary" style="padding:6px 12px; font-size:12px;" onclick="startGame('${g.id}')">
                        🎮 Начать игру прямо сейчас
                    </button>
                </div>
            `;
        });
        openModal("🎮 AI Игры и Квесты", `<div style="display:flex; flex-direction:column;">${cards}</div>`);
    }

    function openStoreModal() {
        const items = [
            { name: "ChatGPT Plus (1 месяц)", price: "2 190 ₽", desc: "Личный аккаунт OpenAI с GPT-4o и Sora" },
            { name: "Claude Pro (1 месяц)", price: "2 390 ₽", desc: "Официальная подписка Anthropic Opus & Sonnet" },
            { name: "Midjourney Standart", price: "2 890 ₽", desc: "Безлимитная генерация лучших изображений" },
            { name: "API Ключ 100K токенов", price: "450 ₽", desc: "Для любых внешних программ и скриптов" }
        ];

        let list = "";
        items.forEach(it => {
            list += `
                <div style="background:rgba(255,255,255,0.05); padding:12px; border-radius:10px; border:1px solid var(--card-border); margin-bottom:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:#fff; font-size:13px;">${it.name}</strong>
                        <span style="color:var(--accent); font-weight:700;">${it.price}</span>
                    </div>
                    <p style="font-size:11.5px; color:var(--tg-hint); margin:4px 0 8px;">${it.desc}</p>
                    <button class="agent-btn" style="width:100%; font-size:12px;" onclick="orderStoreItem('${escapeHtml(it.name)}')">
                        🛍️ Заказать аккаунт
                    </button>
                </div>
            `;
        });
        openModal("🛍️ Магазин AI-аккаунтов и ключей", list);
    }

    window.orderStoreItem = function(itemName) {
        closeModal();
        switchTab("tab-chat");
        submitUserMessage(`Здравствуйте! Я хочу приобрести "${itemName}". Как оплатить и получить доступ?`);
    };

    function openStorageModal() {
        const projectsHtml = userProjects.map((p, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px; margin-bottom:6px;">
                <span style="font-size:13px; color:#fff;">📁 ${escapeHtml(p)}</span>
                <span style="font-size:11px; color:#10b981;">Активен</span>
            </div>
        `).join("");

        const html = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="background:rgba(255,255,255,0.06); padding:14px; border-radius:12px;">
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
                        <span>Облако Backblaze B2 & Terabox:</span>
                        <strong style="color:var(--accent);">15 МБ / 100 МБ</strong>
                    </div>
                    <div style="height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                        <div style="width:15%; height:100%; background:var(--accent);"></div>
                    </div>
                </div>

                <div style="font-size:13px; font-weight:700; color:#fff;">Ваши проекты:</div>
                <div>${projectsHtml}</div>

                <button class="action-btn-primary" style="margin-top:6px;" onclick="createNewProjectPrompt()">
                    ➕ Создать новый проект
                </button>
            </div>
        `;
        openModal("📦 Облачное хранилище и проекты", html);
    }

    window.createNewProjectPrompt = function() {
        const name = prompt("Введите название нового проекта:");
        if (name && name.trim()) {
            userProjects.push(name.trim());
            localStorage.setItem("user_projects", JSON.stringify(userProjects));
            showToast(`Проект "${name.trim()}" создан!`);
            openStorageModal();
        }
    };

    function openProfileModal() {
        const storedUid = localStorage.getItem("user_telegram_id");
        const effectiveUid = tg?.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : (storedUid || "Синхронизируется");
        const html = `
            <div style="display:flex; flex-direction:column; gap:12px; text-align:center;">
                <div style="width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg,#38bdf8,#6366f1); margin:0 auto; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:700; color:#fff;">
                    ${userNameEl?.textContent?.charAt(0) || "AI"}
                </div>
                <div>
                    <h3 style="color:#fff; margin-bottom:2px;">${escapeHtml(userNameEl?.textContent || "Пользователь")}</h3>
                    <span style="font-size:12px; color:var(--tg-hint);">${escapeHtml(userSubEl?.textContent || "@telegram")}</span>
                </div>

                <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; text-align:left; margin-top:6px;">
                    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                        <span style="font-size:11px; color:var(--tg-hint);">Тариф:</span>
                        <div style="font-weight:700; color:#10b981; font-size:13px;">${userTariff}</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                        <span style="font-size:11px; color:var(--tg-hint);">Баланс:</span>
                        <div style="font-weight:700; color:var(--accent); font-size:13px;">${userBalanceStars} ⭐ / ${userBalanceRub} ₽</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                        <span style="font-size:11px; color:var(--tg-hint);">Модель в боте:</span>
                        <div style="font-weight:700; color:var(--accent); font-size:13px;">${activeModelTitle}</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                        <span style="font-size:11px; color:var(--tg-hint);">ID аккаунта:</span>
                        <div style="font-weight:700; color:#fff; font-size:13px;">${escapeHtml(effectiveUid)}</div>
                    </div>
                </div>

                <div style="background:rgba(56, 189, 248, 0.08); padding:10px; border-radius:8px; border:1px solid rgba(56, 189, 248, 0.2); font-size:11.5px; color:#94a3b8; text-align:left; line-height:1.4;">
                    🔄 <strong>Синхронизация с ботом:</strong> Ваш баланс Stars, тариф и выбранная модель привязаны к вашему профилю в <strong>@NextoraAI_bot</strong>.
                </div>

                <div style="display:flex; flex-direction:column; gap:8px; margin-top:6px;">
                    <button class="action-btn-primary" onclick="syncWithBotDirectly()">
                        🔄 Синхронизировать с @NextoraAI_bot
                    </button>
                    <button class="agent-btn" onclick="openBalanceModal()">
                        ⭐ Пополнить баланс Stars
                    </button>
                </div>
            </div>
        `;
        openModal("👤 Профиль и синхронизация", html);
    }

    window.syncWithBotDirectly = function() {
        const botUsername = "NextoraAI_bot";
        const link = `https://t.me/${botUsername}?start=sync`;
        closeModal();
        showToast("Запрашиваем свежие данные из @NextoraAI_bot...", 2500);
        if (tg?.openTelegramLink) {
            setTimeout(() => {
                tg.openTelegramLink(link);
                if (tg.close) tg.close();
            }, 300);
        } else {
            window.location.href = link;
        }
    };

    // Connect Service Boxes in Tab 5
    document.querySelectorAll("[data-action]").forEach(el => {
        el.addEventListener("click", () => {
            const action = el.getAttribute("data-action");
            if (action === "menu:balance") openBalanceModal();
            else if (action === "menu:tariffs") openTariffsModal();
            else if (action === "menu:games") openGamesModal();
            else if (action === "menu:store") openStoreModal();
            else if (action === "menu:agent") openStorageModal();
            else if (action === "menu:profile") openProfileModal();
            else if (action === "menu:help") handleBotCommand("/help");
            else if (action === "menu:keys") {
                const keyInput = document.getElementById("promoKeyInput");
                if (keyInput) keyInput.focus();
            } else if (action === "menu:support") {
                closeModal();
                switchTab("tab-chat");
                submitUserMessage("Как связаться с поддержкой бота?");
            }
        });
    });

    // Promo Key / Access Key Activation via @NextoraAI_bot
    if (activateKeyBtn && promoKeyInput) {
        activateKeyBtn.addEventListener("click", () => {
            const key = promoKeyInput.value.trim();
            if (!key) {
                showToast("Введите ключ доступа или промокод");
                return;
            }
            const botUsername = "NextoraAI_bot";
            const link = `https://t.me/${botUsername}?start=key_${encodeURIComponent(key)}`;
            showToast("Отправляем ключ в @NextoraAI_bot для активации...", 2500);
            if (tg?.openTelegramLink) {
                setTimeout(() => {
                    tg.openTelegramLink(link);
                    if (tg.close) tg.close();
                }, 300);
            } else {
                window.location.href = link;
            }
        });
    }

    // --- 15. Photo Generator Logic ---
    stylePills.forEach(pill => {
        pill.addEventListener("click", () => {
            stylePills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            activeStyle = pill.getAttribute("data-style") || "реализм";
        });
    });

    ideaItems.forEach(item => {
        item.addEventListener("click", () => {
            const prompt = item.getAttribute("data-prompt");
            if (prompt && imagePromptInput) {
                imagePromptInput.value = prompt;
                imagePromptInput.focus();
            }
        });
    });

    if (generateImageBtn) {
        generateImageBtn.addEventListener("click", async () => {
            const prompt = imagePromptInput?.value?.trim();
            if (!prompt) {
                showToast("Пожалуйста, введите описание для фото");
                return;
            }

            const gallerySection = document.querySelector(".gallery-section");
            if (!gallerySection) return;

            generateImageBtn.disabled = true;
            generateImageBtn.innerHTML = "<span>⏳ Нейросеть генерирует арт...</span>";

            photosCount++;
            localStorage.setItem("user_photo_count", String(photosCount));

            const fullPrompt = `${prompt}, style: ${activeStyle}, 8k, highly detailed, masterpieces`;
            const encodedPrompt = encodeURIComponent(fullPrompt);
            const seed = Math.floor(Math.random() * 1000000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&seed=${seed}&nologo=true`;

            const imgCard = document.createElement("div");
            imgCard.className = "generated-image-card";
            imgCard.innerHTML = `
                <img src="${imageUrl}" alt="Сгенерированное изображение" loading="lazy">
                <div class="img-meta">
                    <div class="img-prompt-text"><strong>${escapeHtml(prompt)}</strong> (${activeStyle})</div>
                    <div class="img-actions-row">
                        <a href="${imageUrl}" target="_blank" download="ai_image_${seed}.jpg" class="img-action-btn">📥 Скачать</a>
                        <a href="${imageUrl}" target="_blank" class="img-action-btn">🔍 Открыть</a>
                    </div>
                </div>
            `;

            gallerySection.prepend(imgCard);
            generateImageBtn.disabled = false;
            generateImageBtn.innerHTML = "<span>✨ Сгенерировать фото</span>";
            showToast("Изображение успешно создано!");

            if (tg?.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred("success");
            }
        });
    }

    // --- 16. Models Tab: Real Dynamic Catalogue ---
    function renderModelsList() {
        if (!dynamicModelListEl) return;

        let filtered = allLoadedModels.filter(m => {
            if (currentFilter === "flagship" && !m.isFlagship) return false;
            if (currentFilter === "chat" && m.category !== "chat") return false;
            if (currentFilter === "code" && m.category !== "code") return false;
            if (currentFilter === "image" && m.category !== "image") return false;
            if (currentFilter === "video" && m.category !== "video") return false;

            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchName = m.display_name.toLowerCase().includes(q);
                const matchDesc = (m.desc || "").toLowerCase().includes(q);
                const matchBadge = (m.badge || "").toLowerCase().includes(q);
                return matchName || matchDesc || matchBadge;
            }
            return true;
        });

        if (modelsCountBadgeEl) {
            modelsCountBadgeEl.textContent = `${filtered.length} из ${allLoadedModels.length}`;
        }

        if (filtered.length === 0) {
            dynamicModelListEl.innerHTML = `
                <div style="text-align:center; padding:30px 10px; color:var(--tg-hint);">
                    <div style="font-size:32px; margin-bottom:8px;">🔍</div>
                    <div>По запросу ничего не найдено</div>
                </div>
            `;
            return;
        }

        dynamicModelListEl.innerHTML = "";
        filtered.forEach(model => {
            const isCurrentActive = (model.id === activeModel || model.display_name === activeModelTitle);
            const card = document.createElement("div");
            card.className = `model-item-card ${isCurrentActive ? "current-active" : ""}`;
            card.setAttribute("data-model-id", model.id);

            card.innerHTML = `
                <div class="model-item-top">
                    <div class="model-item-left">
                        <div class="model-item-icon" style="background: ${model.gradient};">
                            ${model.icon}
                        </div>
                        <div class="model-item-titles">
                            <div class="model-item-name">${escapeHtml(model.display_name)}</div>
                            <div class="model-item-badge">${escapeHtml(model.badge)}</div>
                        </div>
                    </div>
                    ${isCurrentActive ? '<span class="model-active-check">✓ Выбрана</span>' : ''}
                </div>
                <div class="model-item-desc">${escapeHtml(model.desc)}</div>
                <div style="display:flex; gap:6px; margin-top:8px;">
                    <button class="model-select-btn ${isCurrentActive ? "active" : ""}" style="flex:1;">
                        ${isCurrentActive ? "✓ Выбрана в веб" : "Выбрать в веб"}
                    </button>
                    <button class="model-sync-bot-btn" style="flex:1; padding:9px 6px; font-size:11.5px; border-radius:8px; border:1px solid rgba(56, 189, 248, 0.4); background:rgba(56, 189, 248, 0.12); color:var(--accent); cursor:pointer; font-weight:600;" onclick="event.stopPropagation(); syncModelToBot('${model.id}', '${escapeHtml(model.display_name)}')">
                        ⚡ В @NextoraAI_bot
                    </button>
                </div>
            `;

            const selectBtn = card.querySelector(".model-select-btn");
            selectBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                activateModel(model);
            });

            card.addEventListener("click", () => {
                activateModel(model);
            });

            dynamicModelListEl.appendChild(card);
        });
    }

    window.syncModelToBot = function(modelId, modelName) {
        const cleanId = modelId.replace("bazaarlink:", "");
        const botUsername = "NextoraAI_bot";
        const link = `https://t.me/${botUsername}?start=setmodel_${encodeURIComponent(cleanId)}`;
        showToast(`Переключаем модель в @${botUsername}...`, 2000);
        if (tg?.openTelegramLink) {
            setTimeout(() => {
                tg.openTelegramLink(link);
                if (tg.close) tg.close();
            }, 300);
        } else {
            window.location.href = link;
        }
    };

    function activateModel(model) {
        activeModel = model.id;
        activeModelTitle = model.display_name;

        localStorage.setItem("user_selected_model", activeModel);
        localStorage.setItem("user_selected_model_title", activeModelTitle);

        updateHeaderUI();
        renderModelsList();

        showToast(`Выбрана модель: ${activeModelTitle}`);
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred("success");
        }

        setTimeout(() => {
            switchTab("tab-chat");
        }, 300);
    }

    // Filter chips
    filterChips.forEach(chip => {
        chip.addEventListener("click", () => {
            filterChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            currentFilter = chip.getAttribute("data-filter") || "all";
            renderModelsList();
        });
    });

    // Search input
    if (modelSearchInput) {
        modelSearchInput.addEventListener("input", () => {
            searchQuery = modelSearchInput.value.trim();
            if (clearSearchBtn) {
                clearSearchBtn.style.display = searchQuery ? "block" : "none";
            }
            renderModelsList();
        });
    }

    if (clearSearchBtn && modelSearchInput) {
        clearSearchBtn.addEventListener("click", () => {
            modelSearchInput.value = "";
            searchQuery = "";
            clearSearchBtn.style.display = "none";
            renderModelsList();
        });
    }

    if (refreshModelsBtn) {
        refreshModelsBtn.addEventListener("click", () => {
            showToast("Список моделей актуален (13 моделей)");
            renderModelsList();
        });
    }

    // Initial render of models list
    renderModelsList();
});
