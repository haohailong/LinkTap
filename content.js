(() => {
  "use strict";

  if (window.__linkCopyShortcutLoaded) return;
  Object.defineProperty(window, "__linkCopyShortcutLoaded", {
    value: true,
    configurable: false,
    enumerable: false
  });

  const DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    modifiers: ["ctrl", "shift"]
  });

  const modifierProperties = Object.freeze({
    ctrl: "ctrlKey",
    alt: "altKey",
    shift: "shiftKey",
    meta: "metaKey"
  });

  const keyToModifier = Object.freeze({
    Control: "ctrl",
    Alt: "alt",
    Shift: "shift",
    Meta: "meta"
  });

  let settings = { ...DEFAULT_SETTINGS };
  const pressedModifiers = new Set();
  let lastHandled = { url: "", time: Number.NEGATIVE_INFINITY };

  function normalizeSettings(value) {
    const modifiers = Array.isArray(value?.modifiers)
      ? value.modifiers.filter((key) => key in modifierProperties)
      : DEFAULT_SETTINGS.modifiers;

    return {
      enabled: value?.enabled !== false,
      modifiers: modifiers.length > 0 ? [...new Set(modifiers)] : DEFAULT_SETTINGS.modifiers
    };
  }

  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    settings = normalizeSettings(stored);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync") return;

    const nextSettings = {
      enabled: changes.enabled?.newValue ?? settings.enabled,
      modifiers: changes.modifiers?.newValue ?? settings.modifiers
    };
    settings = normalizeSettings(nextSettings);
  });

  function hasExactModifierCombination(event, includePressedKeys = false) {
    const selected = new Set(settings.modifiers);
    return Object.entries(modifierProperties).every(
      ([modifier, property]) =>
        (Boolean(event[property]) || (includePressedKeys && pressedModifiers.has(modifier))) ===
        selected.has(modifier)
    );
  }

  function updatePressedModifier(event, isPressed) {
    const modifier = keyToModifier[event.key];
    if (!modifier) return;

    if (isPressed) {
      pressedModifiers.add(modifier);
    } else {
      pressedModifiers.delete(modifier);
    }
  }

  document.addEventListener("keydown", (event) => updatePressedModifier(event, true), true);
  document.addEventListener("keyup", (event) => updatePressedModifier(event, false), true);
  window.addEventListener("blur", () => pressedModifiers.clear(), true);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pressedModifiers.clear();
  });

  function findLink(event) {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [event.target];
    let link = null;

    for (const node of path) {
      if (!(node instanceof Element)) continue;
      if (node.matches("a[href], area[href]")) {
        link = node;
        break;
      }

      const closest = node.closest("a[href], area[href]");
      if (closest) {
        link = closest;
        break;
      }
    }

    if (!link) return null;

    const url = link.href;
    return url && !url.toLowerCase().startsWith("javascript:") ? { link, url } : null;
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // 部分页面会限制 Clipboard API，继续使用兼容方案。
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.cssText = [
      "position:fixed",
      "left:-9999px",
      "top:0",
      "opacity:0",
      "pointer-events:none"
    ].join(";");
    (document.body || document.documentElement).appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } finally {
      textarea.remove();
    }
    return copied;
  }

  function showToast(message, type = "success") {
    const oldToast = document.documentElement.querySelector("link-copy-shortcut-toast");
    oldToast?.remove();

    const host = document.createElement("link-copy-shortcut-toast");
    const shadow = host.attachShadow({ mode: "closed" });
    const toast = document.createElement("div");
    toast.setAttribute("role", "status");
    toast.textContent = message;
    toast.style.cssText = `
      all: initial;
      position: fixed;
      z-index: 2147483647;
      right: 22px;
      bottom: 22px;
      max-width: min(420px, calc(100vw - 44px));
      box-sizing: border-box;
      padding: 11px 15px;
      border: 1px solid ${type === "success" ? "#c9e7d1" : "#f2c3c3"};
      border-radius: 10px;
      background: ${type === "success" ? "#f1fbf4" : "#fff3f3"};
      color: ${type === "success" ? "#176b35" : "#a12626"};
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.16);
      font: 500 13px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      overflow-wrap: anywhere;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 150ms ease, transform 150ms ease;
    `;
    shadow.appendChild(toast);
    document.documentElement.appendChild(host);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(() => host.remove(), 180);
    }, 1800);
  }

  async function handleShortcutEvent(event, options = {}) {
    const { allowSecondaryButton = false, includePressedKeys = false } = options;

    if (!settings.enabled) return false;
    if (!allowSecondaryButton && event.button !== 0) return false;
    if (!hasExactModifierCombination(event, includePressedKeys)) return false;

    const linkInfo = findLink(event);
    if (!linkInfo) return false;

    event.preventDefault();
    event.stopImmediatePropagation();

    const now = performance.now();
    if (linkInfo.url === lastHandled.url && now - lastHandled.time < 700) {
      return true;
    }
    lastHandled = { url: linkInfo.url, time: now };

    const copied = await copyText(linkInfo.url);
    showToast(
      chrome.i18n.getMessage(copied ? "copySuccess" : "copyFailed"),
      copied ? "success" : "error"
    );
    return true;
  }

  // 在 mousedown 阶段处理，可抢在浏览器的 Option+点击下载等默认行为之前执行。
  document.addEventListener(
    "mousedown",
    (event) => {
      handleShortcutEvent(event, { includePressedKeys: true });
    },
    true
  );

  document.addEventListener(
    "click",
    (event) => {
      handleShortcutEvent(event);
    },
    true
  );

  // macOS 会把 Control+左键点击转换为 contextmenu，普通 click 事件不会触发。
  document.addEventListener(
    "contextmenu",
    (event) => {
      if (!settings.modifiers.includes("ctrl")) return;
      handleShortcutEvent(event, {
        allowSecondaryButton: true,
        includePressedKeys: true
      });
    },
    true
  );
})();
