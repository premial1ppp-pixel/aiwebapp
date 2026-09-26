document.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram?.WebApp;

    // --- State ---
    let activeModel = "logfare:deepseek-v4-pro";
    let activeModelTitle = "DeepSeek V4 Pro";
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

    const modelItems = document.querySelectorAll(".model-item");
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

    // --- 1. Initialize Telegram WebApp ---
    if (tg) {
        tg.ready();
        tg.expand();

        // Enable closing confirmation to avoid accidental close
        if (typeof tg.enableClosingConfirmation === "function") {
            tg.enableClosingConfirmation();
        }

        // Set Header & Background colors to match theme
        if (tg.themeParams?.bg_color) {
            document.documentElement.style.setProperty("--tg-bg", tg.themeParams.bg_color);
        }
        if (tg.themeParams?.secondary_bg_color) {
            document.documentElement.style.setProperty("--tg-sec-bg", tg.themeParams.secondary_bg_color);
        }

        // Extract Telegram user info
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

        // Back Button handling
        if (tg.BackButton) {
            tg.BackButton.onClick(() => {
                switchTab("tab-chat");
            });
        }
    } else {
        // Fallback for standalone browser testing
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

        // Telegram BackButton management
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

        // Browser Fallback Feedback
        showToast(`Действие [${action}] отправлено`);
        console.log("Action sent:", dataToSend);
    }

    // --- 5. Chat Interface Logic ---
    function appendChatBubble(role, text) {
        if (!chatFeedEl) return;

        // Hide welcome banner once chat starts
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

    // Auto-resizing textarea
    if (chatInputEl) {
        chatInputEl.addEventListener("input", () => {
            chatInputEl.style.height = "auto";
            chatInputEl.style.height = Math.min(chatInputEl.scrollHeight, 120) + "px";
        });

        // Submit on Enter without shift
        chatInputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                chatFormEl?.dispatchEvent(new Event("submit", { cancelable: true }));
            }
        });
    }

    // Send chat prompt
    if (chatFormEl && chatInputEl) {
        chatFormEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = chatInputEl.value.trim();
            if (!text) return;

            appendChatBubble("user", text);
            chatInputEl.value = "";
            chatInputEl.style.height = "auto";

            // If inside Telegram WebApp, send data directly to chat
            sendAction("ai:ask", {
                prompt: text,
                model: activeModel,
                voice: isVoiceActive
            });

            // Browser simulation for testing
            if (!tg || !tg.sendData) {
                setTimeout(() => {
                    appendChatBubble("ai", `Ответ нейросети (${activeModelTitle}): Привет! Я получил твой запрос "${text}". Для полноценного ответа от реальных серверов запусти Mini App внутри Telegram!`);
                }, 600);
            }
        });
    }

    // Prompt Chips Click
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

    // Clear Chat
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

    // Voice Toggle
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

    // --- 7. Model Selection Logic ---
    modelItems.forEach(item => {
        item.addEventListener("click", () => {
            const model = item.getAttribute("data-model");
            const title = item.querySelector(".model-title")?.textContent || model;

            modelItems.forEach(m => m.classList.remove("active"));
            item.classList.add("active");

            activeModel = model;
            activeModelTitle = title;

            if (chatActiveModelNameEl) {
                chatActiveModelNameEl.textContent = title;
            }

            if (tg?.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred("success");
            }

            showToast(`Выбрана модель: ${title}`);
            sendAction("model:set", { model });
        });
    });

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
