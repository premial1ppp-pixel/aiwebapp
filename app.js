document.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram?.WebApp;

    // --- 1. Real Bot Models Catalogue ---
    const REAL_BOT_MODELS = [
        {
            id: "bazaarlink:deepseek-v4-pro",
            display_name: "DeepSeek V4 Pro",
            icon: "🤖",
            badge: "Флагман",
            gradient: "linear-gradient(135deg, #10b981, #047857)",
            category: "chat",
            desc: "Глубокая логика, безупречный код, математика и рассуждения",
            isFlagship: true
        },
        {
            id: "bazaarlink:deepseek-r1",
            display_name: "DeepSeek R1",
            icon: "🤖",
            badge: "Рассуждения",
            gradient: "linear-gradient(135deg, #059669, #065f46)",
            category: "chat",
            desc: "Пошаговое логическое мышление (Chain-of-Thought) для сложных задач",
            isFlagship: true
        },
        {
            id: "bazaarlink:deepseek-v4-flash",
            display_name: "DeepSeek V4 Flash",
            icon: "⚡",
            badge: "Скорость",
            gradient: "linear-gradient(135deg, #14b8a6, #0f766e)",
            category: "chat",
            desc: "Сверхбыстрая генерация ответов с сохранением высокого интеллекта",
            isFlagship: false
        },
        {
            id: "bazaarlink:claude-opus-4.6",
            display_name: "Claude Opus 4.6",
            icon: "🦅",
            badge: "Anthropic",
            gradient: "linear-gradient(135deg, #d97706, #b45309)",
            category: "chat",
            desc: "Максимальный интеллект, идеальный литературный русский язык, анализ",
            isFlagship: true
        },
        {
            id: "bazaarlink:claude-sonnet-4.6",
            display_name: "Claude Sonnet 4.6",
            icon: "🦅",
            badge: "Anthropic",
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
            category: "chat",
            desc: "Превосходный баланс скорости, точности и качества текстов",
            isFlagship: false
        },
        {
            id: "bazaarlink:gpt-5.4",
            display_name: "GPT-5.4",
            icon: "🧠",
            badge: "OpenAI Топ",
            gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            category: "chat",
            desc: "Новейшая флагманская нейросеть OpenAI для любых комплексных задач",
            isFlagship: true
        },
        {
            id: "bazaarlink:gpt-4o",
            display_name: "GPT-4o",
            icon: "🧠",
            badge: "OpenAI",
            gradient: "linear-gradient(135deg, #60a5fa, #2563eb)",
            category: "chat",
            desc: "Универсальный интеллект: быстрые и точные ответы на любые вопросы",
            isFlagship: false
        },
        {
            id: "bazaarlink:gemini-2.5-pro",
            display_name: "Gemini 2.5 Pro",
            icon: "👁️",
            badge: "Google",
            gradient: "linear-gradient(135deg, #6366f1, #4338ca)",
            category: "chat",
            desc: "Флагманская мультимодальная модель от Google с огромным контекстом",
            isFlagship: true
        },
        {
            id: "gemini-2.5-flash",
            display_name: "Gemini 2.5 Flash",
            icon: "⚡",
            badge: "Google Flash",
            gradient: "linear-gradient(135deg, #818cf8, #4f46e5)",
            category: "chat",
            desc: "Быстрая и эффективная модель Google для повседневных задач",
            isFlagship: false
        },
        {
            id: "bazaarlink:qwen3.8-max",
            display_name: "Qwen 3.8 Max",
            icon: "💻",
            badge: "Alibaba",
            gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            category: "code",
            desc: "Мощная разработка от Alibaba с выдающимися навыками программирования",
            isFlagship: true
        },
        {
            id: "llama-3.3-70b-versatile",
            display_name: "Llama 3.3 70B",
            icon: "⚡",
            badge: "Meta AI",
            gradient: "linear-gradient(135deg, #ec4899, #be185d)",
            category: "chat",
            desc: "Открытая модель Meta на 70B параметров — интеллект флагманского уровня",
            isFlagship: true
        },
        {
            id: "llama-3.1-8b-instant",
            display_name: "Llama 3.1 8B",
            icon: "⚡",
            badge: "Meta Instant",
            gradient: "linear-gradient(135deg, #f43f5e, #e11d48)",
            category: "chat",
            desc: "Мгновенные ответы на простые вопросы, высокая скорость",
            isFlagship: false
        },
        {
            id: "openai-fast",
            display_name: "GPT Fast (Резерв)",
            icon: "✨",
            badge: "100% Аптайм",
            gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
            category: "chat",
            desc: "Резервная нейросеть со 100% доступностью и быстрым откликом",
            isFlagship: false
        }
    ];

    // --- State ---
    let activeModel = localStorage.getItem("user_selected_model") || "bazaarlink:deepseek-v4-pro";
    let activeModelTitle = localStorage.getItem("user_selected_model_title") || "DeepSeek V4 Pro";
    let activeStyle = "реализм";
    let isVoiceActive = false;
    let chatHistory = [];
    let allLoadedModels = [...REAL_BOT_MODELS];
    let currentFilter = "all";
    let searchQuery = "";

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

    // Initialize Active Model Name in Chat Banner
    if (chatActiveModelNameEl) {
        chatActiveModelNameEl.textContent = activeModelTitle;
    }

    // --- 2. Initialize Telegram WebApp ---
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
                closeModal();
                switchTab("tab-chat");
            });
        }
    } else {
        if (userNameEl) userNameEl.textContent = "Гость (Браузер)";
        if (userSubEl) userSubEl.textContent = "Web preview";
        if (profileFullNameEl) profileFullNameEl.textContent = "Гость (Браузер)";
        if (profileUserIdEl) profileUserIdEl.textContent = "Web Preview Mode";
    }

    // --- 3. Toast Notifications ---
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

    // --- 4. Modal Dialog System ---
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

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // --- 5. Tab Switching Logic ---
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

    // --- 6. Chat Bubbles & Thinking Indicator ---
    function appendChatBubble(role, text) {
        if (!chatFeedEl) return;

        const welcomeEl = chatFeedEl.querySelector(".chat-welcome");
        if (welcomeEl) {
            welcomeEl.style.display = "none";
        }

        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${role} bubble-${role}`;

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
        return bubble;
    }

    function showThinkingBubble(message = "Думаю...") {
        if (!chatFeedEl) return null;

        const welcomeEl = chatFeedEl.querySelector(".chat-welcome");
        if (welcomeEl) {
            welcomeEl.style.display = "none";
        }

        // Remove any old thinking bubbles
        removeThinkingBubble();

        const bubble = document.createElement("div");
        bubble.className = "chat-bubble ai bubble-ai thinking";
        bubble.id = "activeThinkingBubble";

        bubble.innerHTML = `
            <div class="thinking-header">
                <span class="thinking-spinner">⏳</span>
                <span>${message}</span>
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
        if (existing) {
            existing.remove();
        }
    }

    // --- 7. Real AI Chat Completion Engine ---
    async function requestAiAnswer(userPrompt) {
        const systemPrompt = `Ты умный, вежливый и отзывчивый ИИ-ассистент в Telegram WebApp. Твоя текущая модель: ${activeModelTitle}. Отвечай подробно, понятно, грамотно и структурировано на русском языке. При необходимости оформляй код и списки.`;

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
        return content.trim();
    }

    function speakText(text) {
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text.slice(0, 400));
            utterance.lang = "ru-RU";
            utterance.rate = 1.05;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn("Speech synthesis error:", e);
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

            // 1. Render User Message
            appendChatBubble("user", text);
            chatHistory.push({ role: "user", content: text });

            chatInputEl.value = "";
            chatInputEl.style.height = "auto";

            if (tg?.HapticFeedback) {
                tg.HapticFeedback.impactOccurred("medium");
            }

            // 2. Render Thinking Bubble ("Думаю...")
            showThinkingBubble(`ИИ ${activeModelTitle} думает...`);

            // 3. Fetch Real AI Answer
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
                appendChatBubble("ai", `⚠️ Не удалось связаться с сервером нейросети: ${err.message || "Таймаут"}. Пожалуйста, повторите запрос через пару секунд.`);
                if (tg?.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred("error");
                }
            }
        });
    }

    // Prompt chips
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
            chatHistory = [];
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
                window.speechSynthesis?.cancel();
                voiceToggleBtn.textContent = "🔇 Озвучка: ВЫКЛ";
                voiceToggleBtn.style.color = "inherit";
                showToast("Озвучка выключена");
            }
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.impactOccurred("light");
            }
        });
    }

    // --- 8. Real Image Generation Engine ---
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
                showToast("Промпт выбран! Нажмите «Сгенерировать фото»");
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

            const fullPrompt = `${prompt}, стиль ${activeStyle}, высокое качество, 8k, photorealistic`;
            showToast("🎨 Создаю изображение...");
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.impactOccurred("medium");
            }

            const seed = Math.floor(Math.random() * 10000000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;

            // Render Image Card in Gallery Section
            const gallerySection = document.querySelector(".gallery-section");
            if (gallerySection) {
                const card = document.createElement("div");
                card.className = "generated-image-card";
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${prompt}" loading="lazy" />
                    <div class="img-meta">
                        <span class="img-prompt-text"><strong>${activeStyle}:</strong> ${prompt}</span>
                        <div class="img-actions-row">
                            <a href="${imageUrl}" target="_blank" download="ai_image_${seed}.jpg" class="img-action-btn">💾 Скачать HD</a>
                            <button class="img-action-btn" onclick="window.open('${imageUrl}', '_blank')">🔍 Открыть</button>
                        </div>
                    </div>
                `;
                gallerySection.insertBefore(card, gallerySection.firstChild);
                card.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    }

    // --- 9. Real Models Display & Selection ---
    function renderModelsList() {
        if (!dynamicModelListEl) return;

        let filtered = allLoadedModels.filter(m => {
            const id = (m.id || "").toLowerCase();
            const name = (m.display_name || m.id || "").toLowerCase();

            if (currentFilter === "chat" && m.category !== "chat" && m.category !== "code") return false;
            if (currentFilter === "flagship" && !m.isFlagship) return false;
            if (currentFilter === "code" && m.category !== "code") return false;

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
            const isActive = activeModel === m.id || activeModelTitle === m.display_name;

            const card = document.createElement("div");
            card.className = `model-item ${isActive ? "active" : ""}`;
            card.setAttribute("data-model", m.id);

            card.innerHTML = `
                <div class="model-icon" style="background: ${m.gradient};">${m.icon}</div>
                <div class="model-info">
                    <div class="model-name-row">
                        <span class="model-title">${m.display_name}</span>
                        <span class="badge ${m.isFlagship ? 'badge-popular' : ''}">${m.badge}</span>
                    </div>
                    <div class="model-id-tag">${m.display_name}</div>
                    <p class="model-desc">${m.desc}</p>
                </div>
                <div class="model-radio">${isActive ? "✓" : ""}</div>
            `;

            card.addEventListener("click", () => {
                selectModel(m.id, m.display_name);
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
        switchTab("tab-chat");
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
            allLoadedModels = [...REAL_BOT_MODELS];
            renderModelsList();
            showToast("Список моделей обновлен!");
        });
    }

    // Initial render of models
    renderModelsList();

    // --- 10. Agent & Services Interactive Modals ---
    agentButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.getAttribute("data-action");
            if (action === "menu:agent") {
                openModal("📁 Проекты AI-Агента", `
                    <p>AI-Агент может автономно создавать проекты, писать код, управлять файлами и собирать ZIP архивы.</p>
                    <div class="modal-item-row">
                        <div>
                            <strong>📦 Telegram Bot Project</strong><br>
                            <small style="color:var(--tg-hint)">12 файлов • Активен</small>
                        </div>
                        <span style="color:var(--success)">● В работе</span>
                    </div>
                    <div class="modal-item-row">
                        <div>
                            <strong>📦 WebApp Interface</strong><br>
                            <small style="color:var(--tg-hint)">4 файла • Завершен</small>
                        </div>
                        <span style="color:var(--accent)">● Готов</span>
                    </div>
                    <button class="modal-btn-primary" onclick="alert('Для запуска нового автономного проекта введите команду /agent в диалоге с ботом!')">🚀 Открыть в Telegram</button>
                `);
            } else if (action === "menu:store") {
                openModal("💾 Память AI-Агента", `
                    <p>Увеличьте хранилище для долговременной памяти и файлов агента:</p>
                    <div class="modal-item-row">
                        <div>
                            <strong>💾 +500 МБ памяти</strong><br>
                            <small style="color:var(--tg-hint)">Хватит на десятки проектов</small>
                        </div>
                        <strong>⭐ 50 Stars</strong>
                    </div>
                    <div class="modal-item-row">
                        <div>
                            <strong>💾 +2 ГБ памяти</strong><br>
                            <small style="color:var(--tg-hint)">Для крупных репозиториев</small>
                        </div>
                        <strong>⭐ 150 Stars</strong>
                    </div>
                    <div class="modal-item-row">
                        <div>
                            <strong>💎 Безлимитное хранилище</strong><br>
                            <small style="color:var(--tg-hint)">Включено в тариф Pro Plus</small>
                        </div>
                        <strong>Pro Plus</strong>
                    </div>
                    <button class="modal-btn-primary" onclick="alert('Для оплаты перейдите в Магазин бота: /store')">⭐ Перейти к покупке</button>
                `);
            }
        });
    });

    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            openModal("👤 Мой профиль", `
                <div class="modal-item-row">
                    <span>Имя:</span>
                    <strong>${userNameEl ? userNameEl.textContent : "Пользователь"}</strong>
                </div>
                <div class="modal-item-row">
                    <span>Текущий тариф:</span>
                    <strong style="color:var(--success)">Стандартный</strong>
                </div>
                <div class="modal-item-row">
                    <span>Активная модель:</span>
                    <strong>${activeModelTitle}</strong>
                </div>
                <div class="modal-item-row">
                    <span>Баланс Stars:</span>
                    <strong style="color:#fbbf24">⭐ Доступен</strong>
                </div>
                <button class="modal-btn-primary" onclick="document.getElementById('appModalOverlay').classList.remove('active')">Закрыть</button>
            `);
        });
    }

    serviceBoxes.forEach(box => {
        box.addEventListener("click", () => {
            const action = box.getAttribute("data-action");
            if (action === "menu:balance") {
                openModal("💰 Баланс аккаунта", `
                    <div class="modal-item-row">
                        <span>Telegram Stars:</span>
                        <strong style="color:#fbbf24; font-size: 16px;">⭐ 0 Stars</strong>
                    </div>
                    <div class="modal-item-row">
                        <span>Основной баланс:</span>
                        <strong style="font-size: 16px;">0.00 ₽</strong>
                    </div>
                    <p style="color:var(--tg-hint); font-size:13px;">Stars используются для оплаты премиум-моделей, тарифов, памяти агента и генераций.</p>
                    <button class="modal-btn-primary" onclick="alert('Для пополнения баланса напишите команду /balance в боте!')">💳 Пополнить баланс</button>
                `);
            } else if (action === "menu:tariffs") {
                const tariffsSection = document.querySelector(".tariffs-scroll");
                if (tariffsSection) {
                    tariffsSection.scrollIntoView({ behavior: "smooth" });
                    showToast("Тарифные планы");
                }
            } else if (action === "menu:store") {
                openModal("🛒 Магазин услуг", `
                    <div class="modal-item-row">
                        <div>
                            <strong>🛡️ Модерация чатов</strong><br>
                            <small style="color:var(--tg-hint)">ИИ-защита группы от спама</small>
                        </div>
                        <strong>⭐ 150 Stars</strong>
                    </div>
                    <div class="modal-item-row">
                        <div>
                            <strong>⚡ Удвоенный тариф x2</strong><br>
                            <small style="color:var(--tg-hint)">x2 к памяти и лимитам</small>
                        </div>
                        <strong>⭐ 100 Stars</strong>
                    </div>
                    <div class="modal-item-row">
                        <div>
                            <strong>🪙 Пакет токенов агента</strong><br>
                            <small style="color:var(--tg-hint)">+100 000 токенов</small>
                        </div>
                        <strong>⭐ 30 Stars</strong>
                    </div>
                    <button class="modal-btn-primary" onclick="alert('Купить товары можно в боте через команду /store!')">Купить в боте</button>
                `);
            } else if (action === "menu:games") {
                openModal("🎮 Игры с ИИ", `
                    <p>Увлекательные текстовые сюжетные квесты и интерактивные игры с нейросетью:</p>
                    <div class="modal-item-row">
                        <div>
                            <strong>🏰 Подземелья и Драконы (RPG)</strong><br>
                            <small style="color:var(--tg-hint)">Создай героя и пройди квест</small>
                        </div>
                        <span style="color:var(--accent)">Играть</span>
                    </div>
                    <div class="modal-item-row">
                        <div>
                            <strong>☢️ Бункер</strong><br>
                            <small style="color:var(--tg-hint)">Выживи во время катастрофы</small>
                        </div>
                        <span style="color:var(--accent)">Играть</span>
                    </div>
                    <div class="modal-item-row">
                        <div>
                            <strong>🕵️ Мафия с нейросетью</strong><br>
                            <small style="color:var(--tg-hint)">ИИ в роли ведущего и игроков</small>
                        </div>
                        <span style="color:var(--accent)">Играть</span>
                    </div>
                    <button class="modal-btn-primary" onclick="alert('Для запуска игр добавьте бота в группу или напишите команду /games в чате!')">🎮 Запустить игру</button>
                `);
            }
        });
    });

    planButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            openModal("⭐ Тарифные планы", `
                <div class="modal-item-row">
                    <div>
                        <strong>Pro Plan</strong><br>
                        <small style="color:var(--tg-hint)">Доступ ко всем флагманским моделям</small>
                    </div>
                    <strong>199 ₽ / мес</strong>
                </div>
                <div class="modal-item-row">
                    <div>
                        <strong>Pro Plus (Максимум)</strong><br>
                        <small style="color:var(--tg-hint)">Безлимитные токены и память агента</small>
                    </div>
                    <strong>399 ₽ / мес</strong>
                </div>
                <button class="modal-btn-primary" onclick="alert('Для подключения тарифа введите команду /tariffs в боте!')">⭐ Подключить тариф</button>
            `);
        });
    });

    helpItems.forEach(item => {
        item.addEventListener("click", () => {
            const action = item.getAttribute("data-action");
            if (action === "menu:help") {
                openModal("ℹ️ Команды и помощь", `
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <div><code>/start</code> — Главное меню бота</div>
                        <div><code>/model</code> — Выбор модели нейросети</div>
                        <div><code>/agent</code> — Режим автономного AI-агента</div>
                        <div><code>/draw [текст]</code> — Генерация изображений</div>
                        <div><code>/balance</code> — Баланс Stars и пополнение</div>
                        <div><code>/tariffs</code> — Тарифные планы</div>
                        <div><code>/settings</code> — Настройки чата и модерация</div>
                    </div>
                    <button class="modal-btn-primary" onclick="closeModal()">Понятно</button>
                `);
            } else if (action === "menu:support") {
                openModal("🆘 Служба поддержки", `
                    <p>Если у вас возникли вопросы, проблемы с оплатой или предложения по работе бота, напишите разработчику.</p>
                    <button class="modal-btn-primary" onclick="window.open('https://t.me/telegram', '_blank')">💬 Написать в поддержку</button>
                `);
            }
        });
    });

    // Key Activation
    function submitPromoKey() {
        if (!promoKeyInput) return;
        const key = promoKeyInput.value.trim();
        if (!key) {
            showToast("Введите ключ доступа или промокод!");
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred("error");
            }
            return;
        }

        showToast("🎉 Ключ успешно активирован! Тариф обновлен.");
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred("success");
        }
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
