(function () {
  "use strict";

  // ── Your Vercel API URL ──────────────────────────────────────────
  // After deploying the api-server to Vercel, paste the URL here.
  // Example: 'https://oswi-api.vercel.app/api/chat'
  // This is safe to be public — it's just a URL, not a key.
  const API_URL = "https://portfolio-web-api-alpha.vercel.app/api/chat";

  /* ─────────────────────────────────────────
     AVAILABILITY HELPERS
  ───────────────────────────────────────── */

  const DAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  function toMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  }

  function formatTime(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  }

  function getDateStr(date) {
    return date.toLocaleDateString("en-CA", { timeZone: CONFIG.timezone });
  }

  function getDayName(date) {
    return date
      .toLocaleDateString("en-US", {
        timeZone: CONFIG.timezone,
        weekday: "long",
      })
      .toLowerCase();
  }

  function isFullDayBlocked(dateStr) {
    return CONFIG.blockedSlots.some((s) => s === dateStr);
  }

  function getPartialBlocks(dateStr) {
    return CONFIG.blockedSlots.filter(
      (s) => typeof s === "object" && s.date === dateStr,
    );
  }

  function getWeekAvailability() {
    const result = [];
    const now = new Date();

    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);

      const dateStr = getDateStr(d);
      const dayName = getDayName(d);
      const hours = CONFIG.workingHours[dayName];

      if (!hours || isFullDayBlocked(dateStr)) continue;

      const partial = getPartialBlocks(dateStr);
      let note = "";
      if (partial.length > 0) {
        note = ` (blocked: ${partial
          .map((b) => formatTime(b.start) + "–" + formatTime(b.end))
          .join(", ")})`;
      }

      result.push(
        `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dateStr}: ` +
          `${formatTime(hours.start)}–${formatTime(hours.end)}${note}`,
      );
    }

    return result.length > 0
      ? "Available in the next 7 days:\n" + result.join("\n")
      : "No availability in the next 7 days.";
  }

  /* ─────────────────────────────────────────
     SYSTEM PROMPT — built from CONFIG
     Safe to build client-side: no secrets here,
     just your public schedule and service info.
  ───────────────────────────────────────── */

  function buildSystemPrompt() {
    const serviceList = CONFIG.services
      .map(
        (s) =>
          `- ${s.name} (${s.duration} min) — ` +
          `${s.price === 0 ? "Free" : "₱" + s.price.toLocaleString()}: ${s.description}`,
      )
      .join("\n");

    const hoursStr = Object.entries(CONFIG.workingHours)
      .map(([day, h]) =>
        h
          ? `${day.charAt(0).toUpperCase() + day.slice(1)}: ${formatTime(h.start)} – ${formatTime(h.end)}`
          : `${day.charAt(0).toUpperCase() + day.slice(1)}: Not available`,
      )
      .join("\n");

    return `You are Aria, the AI assistant for ${CONFIG.name}, a freelance web developer and AI builder based in Baguio City, Philippines.

Your job: help visitors understand what ${CONFIG.name} offers, check his availability, and guide them toward booking a discovery call.

SERVICES:
${serviceList}

STANDARD WORKING HOURS (Asia/Manila):
${hoursStr}

UPCOMING AVAILABILITY:
${getWeekAvailability()}

TODAY: ${getDateStr(new Date())}

BOOKING PROCESS:
1. Help the visitor choose a service.
2. Suggest available dates/times from the schedule above.
3. Collect their name, email, and preferred date/time.
4. Tell them: "I'll pass your details to ${CONFIG.name} and he'll confirm within a few hours."
5. Do NOT claim to actually create calendar events — you collect info only.

LANGUAGE: Reply in the same language the visitor uses. English for English, Tagalog/Taglish for Filipino.

TONE: Friendly, concise, professional. Keep replies under 3 sentences unless explaining services or availability.

Do NOT invent availability. Only use the schedule above. For dates beyond 7 days, tell them to reach out directly via email or Facebook.

If asked who built you: "I was built by ${CONFIG.name} as part of his AI tools for local businesses."`;
  }

  /* ─────────────────────────────────────────
     DOM BUILDER
  ───────────────────────────────────────── */

  function buildUI() {
    const launcher = document.createElement("button");
    launcher.className = "cb-launcher";
    launcher.setAttribute("aria-label", "Open chat with Aria");
    launcher.innerHTML = `
      <div class="cb-ball">
        <div class="cb-face">
          <div class="cb-smile"></div>
        </div>
        <div class="cb-close-icon"></div>
        <span class="cb-dot"></span>
      </div>
      <span class="cb-label">Chat with Aria</span>
    `;

    const panel = document.createElement("div");
    panel.className = "cb-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Chat with Aria");
    panel.innerHTML = `
      <div class="cb-header">
        <div class="cb-header-avatar">💬</div>
        <div>
          <div class="cb-header-name">${CONFIG.botName} — AI Assistant</div>
          <div class="cb-header-status">
            <span class="cb-status-dot"></span>
            <span id="cb-status-text">Online</span>
          </div>
        </div>
      </div>

      <div class="cb-messages" id="cb-messages"></div>

      <div class="cb-input-row">
        <textarea
          id="cb-textarea"
          class="cb-textarea"
          rows="1"
          placeholder="Type a message…"
        ></textarea>
        <button class="cb-send" id="cb-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>

      <div class="cb-footer">Powered by Oswi AI</div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    return { launcher, panel };
  }

  /* ─────────────────────────────────────────
     MESSAGE RENDERING
  ───────────────────────────────────────── */

  function appendBotMsg(text, showChips) {
    const msgs = document.getElementById("cb-messages");
    const wrap = document.createElement("div");
    wrap.className = "cb-msg cb-msg--bot";

    const bubble = document.createElement("div");
    bubble.className = "cb-bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    msgs.appendChild(wrap);

    if (showChips && CONFIG.quickReplies.length) {
      const chipsRow = document.createElement("div");
      chipsRow.className = "cb-msg cb-msg--bot";
      const chipWrap = document.createElement("div");
      chipWrap.className = "cb-chips";

      CONFIG.quickReplies.forEach((label) => {
        const btn = document.createElement("button");
        btn.className = "cb-chip";
        btn.textContent = label;
        btn.addEventListener("click", function () {
          chipsRow.remove();
          sendMessage(label);
        });
        chipWrap.appendChild(btn);
      });

      chipsRow.appendChild(chipWrap);
      msgs.appendChild(chipsRow);
    }

    msgs.scrollTop = msgs.scrollHeight;
  }

  function appendUserMsg(text) {
    const msgs = document.getElementById("cb-messages");
    const wrap = document.createElement("div");
    wrap.className = "cb-msg cb-msg--user";
    const bubble = document.createElement("div");
    bubble.className = "cb-bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const msgs = document.getElementById("cb-messages");
    const wrap = document.createElement("div");
    wrap.className = "cb-msg cb-msg--bot";
    wrap.id = "cb-typing";
    const ind = document.createElement("div");
    ind.className = "cb-typing";
    ind.innerHTML = `
      <div class="cb-typing-dot"></div>
      <div class="cb-typing-dot"></div>
      <div class="cb-typing-dot"></div>
    `;
    wrap.appendChild(ind);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById("cb-typing");
    if (t) t.remove();
  }

  /* ─────────────────────────────────────────
     API CALL — goes to YOUR server, not Gemini
  ───────────────────────────────────────── */

  let chatHistory = [];
  let isTyping = false;

  async function sendMessage(overrideText) {
    if (isTyping) return;

    const ta = document.getElementById("cb-textarea");
    const text = (overrideText || ta.value).trim();
    if (!text) return;

    ta.value = "";
    autoResize(ta);
    appendUserMsg(text);
    chatHistory.push({ role: "user", parts: [{ text }] });

    isTyping = true;
    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          systemPrompt: buildSystemPrompt(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      hideTyping();
      chatHistory.push({ role: "model", parts: [{ text: data.reply }] });
      appendBotMsg(data.reply);
    } catch (err) {
      hideTyping();
      appendBotMsg(
        err.message === "Too many requests. Please wait a moment."
          ? "Too many messages — please wait a moment before sending again."
          : "Having trouble connecting. Please message Oswi directly on Facebook or via email.",
      );
    }

    isTyping = false;
  }

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */

  function autoResize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 90) + "px";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const { launcher, panel } = buildUI();

    let isOpen = false;
    let greeted = false;

    launcher.addEventListener("click", function () {
      isOpen = !isOpen;
      launcher.classList.toggle("is-open", isOpen);
      panel.classList.toggle("is-open", isOpen);

      if (isOpen && !greeted) {
        greeted = true;
        setTimeout(function () {
          appendBotMsg(CONFIG.botIntro, true);
        }, 250);
      }

      if (isOpen) {
        setTimeout(function () {
          document.getElementById("cb-textarea").focus();
        }, 300);
      }
    });

    document
      .getElementById("cb-textarea")
      .addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });

    document
      .getElementById("cb-textarea")
      .addEventListener("input", function () {
        autoResize(this);
      });

    document.getElementById("cb-send").addEventListener("click", function () {
      sendMessage();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) {
        isOpen = false;
        launcher.classList.remove("is-open");
        panel.classList.remove("is-open");
      }
    });
  });
})();
