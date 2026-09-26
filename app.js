document.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram?.WebApp;

    // --- State ---
    let activeModel = "logfare:deepseek-v3.2";
    let activeModelTitle = "DeepSeek V3.2";
    let activeStyle = "реализм";
    let isVoiceActive = false;

    // --- DOM Elements ---
    const userAvatarEl = document.getElementById("userAvatar");
    const userNameEl = document.getElementById("userName");
    const userSubEl = document.getElementById("userSub");
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

    const agentButtons = document.querySelectorAll(".agent-btn");
    const serviceBoxes = document.querySelectorAll(".service-box");
    const planButtons = document.querySelectorAll(".plan-btn");
    const helpItems = document.querySelectorAll(".help-item");
    const profileBtn = document.querySelector(".profile-btn");

    const promoKeyInput = document.getElementById("promoKeyInput");
    const activateKeyBtn = document.getElementById("activateKeyBtn");

    const navItems = document.querySelectorAll(".nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");

    const toastEl = document.getElementById("appToast");
    const toastTextEl = document.getElementById("appToastText");

    // Dynamic Models DOM Elements
    const dynamicModelListEl = document.getElementById("dynamicModelList");
    const modelsCountBadgeEl = document.getElementById("modelsCountBadge");
    const modelSearchInput = document.getElementById("modelSearchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const refreshModelsBtn = document.getElementById("refreshModelsBtn");
    const filterChips = document.querySelectorAll(".models-filter-chips .filter-chip");

    let allLoadedModels = [];
    let currentFilter = "all";
    let searchQuery = "";

    // Fallback models in case API request is unavailable
    const FALLBACK_MODELS = [
        { id: "deepseek-v3.2", display_name: "DeepSeek V3.2", endpoints: ["chat/completions"] },
        { id: "glm-5", display_name: "GLM 5", endpoints: ["chat/completions"] },
        { id: "kimi-k2.5", display_name: "Kimi K2.5", endpoints: ["chat/completions"] },
        { id: "grok-4.6", display_name: "Grok 4.6", endpoints: ["chat/completions"] },
        { id: "claude-opus-4.6", display_name: "Claude Opus 4.6", endpoints: ["chat/completions"] },
        { id: "moondream3.1", display_name: "Moondream 3.1 9B", endpoints: ["chat/completions"] },
        { id: "kimi-k3", display_name: "Kimi K3", endpoints: ["chat/completions"] },
        { id: "gpt-6-astra", display_name: "GPT 6 Astra", endpoints: ["chat/completions"] },
        { id: "gpt-5.6-sol", display_name: "GPT 5.6 Sol", endpoints: ["chat/completions"] },
        { id: "deepseek-v4.1-flash", display_name: "DeepSeek V4.1 Flash", endpoints: ["chat/completions"] },
        { id: "qwen-3.8-27b", display_name: "Qwen 3.8 27B", endpoints: ["chat/completions"] },
        { id: "flux-2-dev", display_name: "FLUX.2 Dev", endpoints: ["images/generations"] },
        { id: "flux-1-schnell", display_name: "FLUX.1 Schnell", endpoints: ["images/generations"] },
        { id: "sdxl-lightning", display_name: "SDXL Lightning", endpoints: ["images/generations"] },
        { id: "sora-2-pro", display_name: "Sora 2 Pro", endpoints: ["videos/generations"] }
    ];

    // --- 1. Initialize Telegram WebApp ---
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
        if (user) {
            const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Пользователь";
            const handle = user.username ? `@${user.username}` : `ID: ${user.id}`;
            const initial = fullName.charAt(0).toUpperCase() || "AI";

            if (userNameEl) userNameEl.textContent = fullName;
            if (userSubEl) userSubEl.textContent = handle;
            if (userAvatarEl) userAvatarEl.textContent = initial;

            if (profileFullNameEl) profileFullNameEl.textContent = fullName;
            if (profileUserIdEl) profileUserIdEl.textContent = handle;
            if (profileAvatarLargeEl) profileAvatarLargeEl.textContent = initial;
        }

        if (tg.BackButton) {
            tg.BackButton.onClick(() => {
                switchTab("tab-chat");
            });
        }
    } else {
        if (userNameEl) userNameEl.textContent = "Гость (Браузер)";
        if (userSubEl) userSubEl.textContent = "Web preview";
        if (profileFullNameEl) profileFullNameEl.textContent = "Гость (Браузер)";
        if (profileUserIdEl) profileUserIdEl.textContent = "Web Preview Mode";
    }

    // --- 2. Toast Notifications ---
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

    // --- 3. Tab Switching Logic ---
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

    // --- 4. Send Bot Action ---
    function sendAction(action, payload = {}) {
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred("medium");
        }

        const dataToSend = { action, ...payload };

        if (tg && typeof tg.sendData === "function") {
            try {
                tg.sendData(JSON.stringify(dataToSend));
                return;
            } catch (err) {
                console.error("tg.sendData error:", err);
            }
        }

        showToast(`Действие [${action}] отправлено`);
        console.log("Action sent:", dataToSend);
    }

    // --- 5. Chat Interface Logic ---
    function appendChatBubble(role, text) {
        if (!chatFeedEl) return;

        const welcomeEl = chatFeedEl.querySelector(".chat-welcome");
        if (welcomeEl) {
            welcomeEl.style.display = "none";
        }

        const bubble = document.createElement("div");
        bubble.className = `chat-bubble bubble-${role}`;

        const textDiv = document.createElement("div");
        textDiv.className = "bubble-text";
        textDiv.textContent = text;

        const timeDiv = document.createElement("div");
        timeDiv.className = "bubble-time";
        const now = new Date();
        timeDiv.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        bubble.appendChild(textDiv);
        bubble.appendChild(timeDiv);

        chatFeedEl.appendChild(bubble);
        chatFeedEl.scrollTop = chatFeedEl.scrollHeight;
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
        chatFormEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = chatInputEl.value.trim();
            if (!text) return;

            appendChatBubble("user", text);
            chatInputEl.value = "";
            chatInputEl.style.height = "auto";

            sendAction("ai:ask", {
                prompt: text,
                model: activeModel,
                voice: isVoiceActive
            });

            if (!tg || !tg.sendData) {
                setTimeout(() => {
                    appendChatBubble("ai", `Ответ нейросети (${activeModelTitle}): Привет! Я получил твой запрос "${text}". Для полноценного общения открой Mini App прямо в Telegram!`);
                }, 600);
            }
        });
    }

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

    if (clearChatBtn && chatFeedEl) {
        clearChatBtn.addEventListener("click", () => {
            const welcomeEl = chatFeedEl.querySelector(".chat-welcome");
            chatFeedEl.innerHTML = "";
            if (welcomeEl) {
                welcomeEl.style.display = "flex";
                chatFeedEl.appendChild(welcomeEl);
            }
            showToast("Чат очищен");
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred("warning");
            }
        });
    }

    if (voiceToggleBtn) {
        voiceToggleBtn.addEventListener("click", () => {
            isVoiceActive = !isVoiceActive;
            if (isVoiceActive) {
                voiceToggleBtn.textContent = "🔊 Озвучка: ВКЛ";
                voiceToggleBtn.style.color = "var(--accent)";
                showToast("Голосовая озвучка включена");
            } else {
                voiceToggleBtn.textContent = "🔇 Озвучка: ВЫКЛ";
                voiceToggleBtn.style.color = "inherit";
                showToast("Озвучка выключена");
            }
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.impactOccurred("light");
            }
        });
    }

    // --- 6. Image Generator Logic ---
    stylePills.forEach(pill => {
        pill.addEventListener("click", () => {
            stylePills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            activeStyle = pill.getAttribute("data-style") || "реализм";
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.selectionChanged();
            }
        });
    });

    ideaItems.forEach(idea => {
        idea.addEventListener("click", () => {
            const prompt = idea.getAttribute("data-prompt");
            if (prompt && imagePromptInput) {
                imagePromptInput.value = prompt;
                showToast("Идея добавлена в поле ввода");
                if (tg?.HapticFeedback) {
                    tg.HapticFeedback.impactOccurred("light");
                }
            }
        });
    });

    if (generateImageBtn && imagePromptInput) {
        generateImageBtn.addEventListener("click", () => {
            const prompt = imagePromptInput.value.trim();
            if (!prompt) {
                showToast("Введите описание для генерации!");
                if (tg?.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred("error");
                }
                return;
            }

            const fullPrompt = `${prompt} (стиль: ${activeStyle})`;
            showToast("Генерирую изображение...");
            sendAction("image:generate", { prompt: fullPrompt });
        });
    }

    // --- 7. Dynamic Models from API (Logfare.ai) ---
    function getModelMetadata(m) {
        const id = (m.id || "").toLowerCase();
        const endpoints = m.endpoints || [];
        const epStr = endpoints.join(" ");

        let icon = "🤖";
        let gradient = "linear-gradient(135deg, #3b82f6, #1d4ed8)";
        let category = "chat";
        let badge = "ИИ";
        let desc = "Универсальная нейросеть для общения";

        if (id.includes("deepseek")) {
            icon = "🧠";
            gradient = "linear-gradient(135deg, #10b981, #047857)";
            badge = "DeepSeek";
            desc = "Глубокая логика, безупречный код и рассуждения";
        } else if (id.includes("claude")) {
            icon = "🖋️";
            gradient = "linear-gradient(135deg, #d97706, #b45309)";
            badge = "Anthropic";
            desc = "Идеальный литературный язык, статьи и анализ";
        } else if (id.includes("gpt")) {
            icon = "✨";
            gradient = "linear-gradient(135deg, #3b82f6, #1d4ed8)";
            badge = "OpenAI";
            desc = "Флагман OpenAI: универсальные ответы и рассуждения";
        } else if (id.includes("glm")) {
            icon = "⚡";
            gradient = "linear-gradient(135deg, #8b5cf6, #6d28d9)";
            badge = "Zhipu AI";
            desc = "Сверхбыстрая интеллектуальная модель";
        } else if (id.includes("grok")) {
            icon = "🚀";
            gradient = "linear-gradient(135deg, #f97316, #ea580c)";
            badge = "xAI";
            desc = "Остроумная и мощная модель от xAI";
        } else if (id.includes("kimi")) {
            icon = "🌙";
            gradient = "linear-gradient(135deg, #06b6d4, #0891b2)";
            badge = "Moonshot";
            desc = "Огромное окно контекста и работа с документами";
        } else if (id.includes("gemini")) {
            icon = "💎";
            gradient = "linear-gradient(135deg, #4f46e5, #4338ca)";
            badge = "Google";
            desc = "Google модель нового поколения";
        } else if (id.includes("qwen") || id.includes("code") || id.includes("coder")) {
            icon = "💻";
            gradient = "linear-gradient(135deg, #059669, #047857)";
            category = "code";
            badge = "Кодинг";
            desc = "Специализированная модель для разработки";
        } else if (id.includes("flux") || id.includes("sdxl") || id.includes("image") || epStr.includes("image")) {
            icon = "🎨";
            gradient = "linear-gradient(135deg, #ec4899, #be185d)";
            category = "image";
            badge = "Генерация фото";
            desc = "Генерация картинок и визуального контента";
        } else if (id.includes("sora") || id.includes("veo") || id.includes("kling") || id.includes("video") || epStr.includes("video")) {
            icon = "🎬";
            gradient = "linear-gradient(135deg, #7c3aed, #5b21b6)";
            category = "video";
            badge = "Видеогенерация";
            desc = "Создание видеороликов через ИИ";
        } else if (id.includes("whisper") || id.includes("tts") || epStr.includes("audio")) {
            icon = "🎙️";
            gradient = "linear-gradient(135deg, #0284c7, #0369a1)";
            category = "audio";
            badge = "Аудио";
            desc = "Распознавание речи и озвучка";
        }

        const isFlagship = (
            id.includes("deepseek-v") ||
            id.includes("claude-opus") ||
            id.includes("gpt-6") ||
            id.includes("glm-5") ||
            id.includes("kimi-k3") ||
            id.includes("grok-4.6")
        );

        return { icon, gradient, category, badge, desc, isFlagship };
    }

    function renderModelsList() {
        if (!dynamicModelListEl) return;

        let filtered = allLoadedModels.filter(m => {
            const id = (m.id || "").toLowerCase();
            const name = (m.display_name || m.id || "").toLowerCase();
            const meta = getModelMetadata(m);

            if (currentFilter === "chat" && meta.category !== "chat" && meta.category !== "code") return false;
            if (currentFilter === "flagship" && !meta.isFlagship) return false;
            if (currentFilter === "code" && meta.category !== "code" && !id.includes("code") && !id.includes("qwen")) return false;
            if (currentFilter === "image" && meta.category !== "image") return false;
            if (currentFilter === "video" && meta.category !== "video") return false;

            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return id.includes(q) || name.includes(q);
            }

            return true;
        });

        if (modelsCountBadgeEl) {
            modelsCountBadgeEl.textContent = `${allLoadedModels.length} моделей`;
        }

        if (filtered.length === 0) {
            dynamicModelListEl.innerHTML = `
                <div class="models-loading-state">
                    <span style="font-size: 28px;">🔍</span>
                    <span>Модели по запросу «${searchQuery}» не найдены</span>
                </div>
            `;
            return;
        }

        dynamicModelListEl.innerHTML = "";
        filtered.forEach(m => {
            const meta = getModelMetadata(m);
            const modelTargetId = `logfare:${m.id}`;
            const isActive = activeModel === modelTargetId || activeModel === m.id;

            const card = document.createElement("div");
            card.className = `model-item ${isActive ? "active" : ""}`;
            card.setAttribute("data-model", modelTargetId);

            card.innerHTML = `
                <div class="model-icon" style="background: ${meta.gradient};">${meta.icon}</div>
                <div class="model-info">
                    <div class="model-name-row">
                        <span class="model-title">${m.display_name || m.id}</span>
                        <span class="badge ${meta.isFlagship ? 'badge-popular' : ''}">${meta.badge}</span>
                    </div>
                    <div class="model-id-tag">${m.id}</div>
                    <p class="model-desc">${meta.desc}</p>
                </div>
                <div class="model-radio">${isActive ? "✓" : ""}</div>
            `;

            card.addEventListener("click", () => {
                selectModel(modelTargetId, m.display_name || m.id);
            });

            dynamicModelListEl.appendChild(card);
        });
    }

    function selectModel(modelId, title) {
        activeModel = modelId;
        activeModelTitle = title;

        localStorage.setItem("user_selected_model", modelId);
        localStorage.setItem("user_selected_model_title", title);

        if (chatActiveModelNameEl) {
            chatActiveModelNameEl.textContent = title;
        }

        const allCards = dynamicModelListEl?.querySelectorAll(".model-item");
        allCards?.forEach(c => {
            if (c.getAttribute("data-model") === modelId) {
                c.classList.add("active");
                const radio = c.querySelector(".model-radio");
                if (radio) radio.textContent = "✓";
            } else {
                c.classList.remove("active");
                const radio = c.querySelector(".model-radio");
                if (radio) radio.textContent = "";
            }
        });

        if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred("success");
        }

        showToast(`Выбрана модель: ${title}`);
        sendAction("model:set", { model: modelId });
    }

    async function fetchModelsFromAPI(isManual = false) {
        if (refreshModelsBtn) {
            refreshModelsBtn.classList.add("spinning");
        }

        try {
            // Direct call to Logfare API (enabled CORS & live models list)
            const resp = await fetch("https://logfare.ai/v1/models", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!resp.ok) {
                throw new Error(`HTTP error ${resp.status}`);
            }

            const data = await resp.json();
            const models = data.data || [];

            if (Array.isArray(models) && models.length > 0) {
                allLoadedModels = models;
                localStorage.setItem("cached_logfare_models", JSON.stringify(models));
                localStorage.setItem("cached_models_time", Date.now().toString());
                renderModelsList();
                if (isManual) {
                    showToast(`Синхронизировано: ${models.length} моделей онлайн!`);
                }
            } else {
                throw new Error("Empty models list");
            }
        } catch (err) {
            console.warn("API fetch error, using cache/fallback:", err);
            const cached = localStorage.getItem("cached_logfare_models");
            if (cached) {
                try {
                    allLoadedModels = JSON.parse(cached);
                    renderModelsList();
                } catch(e) {
                    allLoadedModels = FALLBACK_MODELS;
                    renderModelsList();
                }
            } else {
                allLoadedModels = FALLBACK_MODELS;
                renderModelsList();
            }
            if (isManual) {
                showToast("Используется сохраненный список моделей");
            }
        } finally {
            if (refreshModelsBtn) {
                refreshModelsBtn.classList.remove("spinning");
            }
        }
    }

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

    filterChips.forEach(chip => {
        chip.addEventListener("click", () => {
            filterChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            currentFilter = chip.getAttribute("data-filter") || "all";
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.selectionChanged();
            }
            renderModelsList();
        });
    });

    if (refreshModelsBtn) {
        refreshModelsBtn.addEventListener("click", () => {
            fetchModelsFromAPI(true);
        });
    }

    const savedModel = localStorage.getItem("user_selected_model");
    const savedModelTitle = localStorage.getItem("user_selected_model_title");
    if (savedModel && savedModelTitle) {
        activeModel = savedModel;
        activeModelTitle = savedModelTitle;
        if (chatActiveModelNameEl) {
            chatActiveModelNameEl.textContent = savedModelTitle;
        }
    }

    const cached = localStorage.getItem("cached_logfare_models");
    if (cached) {
        try {
            allLoadedModels = JSON.parse(cached);
            renderModelsList();
        } catch(e) {
            allLoadedModels = FALLBACK_MODELS;
            renderModelsList();
        }
    } else {
        allLoadedModels = FALLBACK_MODELS;
        renderModelsList();
    }
    fetchModelsFromAPI(false);

    // --- 8. Agent Actions ---
    agentButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.getAttribute("data-action");
            if (action) {
                showToast("Открываю сервис...");
                sendAction(action);
            }
        });
    });

    // --- 9. More Services & Tariffs ---
    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            const action = profileBtn.getAttribute("data-action") || "menu:profile";
            sendAction(action);
        });
    }

    serviceBoxes.forEach(box => {
        box.addEventListener("click", () => {
            const action = box.getAttribute("data-action");
            const name = box.querySelector(".service-name")?.textContent || "Сервис";
            if (action) {
                showToast(`Открываю: ${name}...`);
                sendAction(action);
            }
        });
    });

    planButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.getAttribute("data-action") || "menu:tariffs";
            showToast("Переход к тарифам...");
            sendAction(action);
        });
    });

    helpItems.forEach(item => {
        item.addEventListener("click", () => {
            const action = item.getAttribute("data-action");
            if (action) {
                sendAction(action);
            }
        });
    });

    // Key Activation
    function submitPromoKey() {
        if (!promoKeyInput) return;
        const key = promoKeyInput.value.trim();
        if (!key) {
            showToast("Введите ключ доступа!");
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred("error");
            }
            return;
        }

        showToast("Проверка ключа...");
        sendAction("key:activate", { key });
        promoKeyInput.value = "";
    }

    if (activateKeyBtn) {
        activateKeyBtn.addEventListener("click", submitPromoKey);
    }

    if (promoKeyInput) {
        promoKeyInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                submitPromoKey();
            }
        });
    }
});
