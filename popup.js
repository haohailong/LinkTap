(() => {
  "use strict";

  const DEFAULT_SETTINGS = {
    enabled: true,
    modifiers: ["ctrl", "shift"]
  };
  const order = ["ctrl", "alt", "shift", "meta"];
  const message = (name, fallback = "") => chrome.i18n.getMessage(name) || fallback;
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  const isMac = /Mac|iPhone|iPad/i.test(platform);
  const labels = {
    ctrl: isMac ? message("modifierControl", "Control") : message("modifierCtrl", "Ctrl"),
    alt: isMac ? message("modifierOption", "Option") : message("modifierAlt", "Alt"),
    shift: message("modifierShift", "Shift"),
    meta: isMac ? message("modifierCommand", "Command") : message("modifierMeta", "Meta")
  };

  const enabledInput = document.querySelector("#enabled");
  const fieldset = document.querySelector("#modifier-fieldset");
  const modifierInputs = [...document.querySelectorAll('input[name="modifier"]')];
  const shortcutOutput = document.querySelector("#shortcut");
  const statusOutput = document.querySelector("#status");
  const statusDot = document.querySelector("#status-dot");
  const stateText = document.querySelector("#state-text");
  let statusTimer;
  let saveQueue = Promise.resolve();

  function localizeDocument() {
    document.documentElement.lang = chrome.i18n.getUILanguage().replace("_", "-");
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const translated = message(element.dataset.i18n);
      if (translated) element.textContent = translated;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const translated = message(element.dataset.i18nAria);
      if (translated) element.setAttribute("aria-label", translated);
    });
  }

  localizeDocument();
  document.querySelector("#ctrl-label").textContent = labels.ctrl;
  document.querySelector("#alt-label").textContent = labels.alt;
  document.querySelector("#shift-label").textContent = labels.shift;
  document.querySelector("#meta-label").textContent = labels.meta;

  function selectedModifiers() {
    return modifierInputs.filter((input) => input.checked).map((input) => input.value);
  }

  function renderGesture(selected) {
    shortcutOutput.replaceChildren();
    const parts = selected.map((key) => labels[key]).concat(message("clickAction", "Click"));
    shortcutOutput.setAttribute("aria-label", parts.join(" + "));

    selected.forEach((key, index) => {
      if (index > 0) {
        const plus = document.createElement("span");
        plus.className = "plus";
        plus.textContent = "+";
        shortcutOutput.appendChild(plus);
      }
      const keycap = document.createElement("kbd");
      keycap.textContent = labels[key];
      shortcutOutput.appendChild(keycap);
    });

    if (selected.length > 0) {
      const plus = document.createElement("span");
      plus.className = "plus";
      plus.textContent = "+";
      shortcutOutput.appendChild(plus);
    }
    const click = document.createElement("span");
    click.className = "click-action";
    click.textContent = `↖ ${message("clickAction", "Click")}`;
    shortcutOutput.appendChild(click);
  }

  function updateView() {
    const enabled = enabledInput.checked;
    const selected = selectedModifiers();
    fieldset.disabled = !enabled;
    statusDot.classList.toggle("off", !enabled);
    stateText.textContent = message(enabled ? "activeStatus" : "inactiveStatus");
    renderGesture(selected);
  }

  function showStatus(messageName, duration = 1400) {
    clearTimeout(statusTimer);
    statusOutput.textContent = message(messageName);
    statusTimer = setTimeout(() => {
      statusOutput.textContent = "";
    }, duration);
  }

  async function ensureActivePageIsReady() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return false;

      await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ["content.js"]
      });
      return true;
    } catch {
      return false;
    }
  }

  function saveSettings() {
    const modifiers = selectedModifiers();
    if (modifiers.length === 0) return;

    const snapshot = {
      enabled: enabledInput.checked,
      modifiers: order.filter((key) => modifiers.includes(key))
    };

    saveQueue = saveQueue
      .then(() => chrome.storage.sync.set(snapshot))
      .then(async () => {
        await ensureActivePageIsReady();
        showStatus("settingsSaved");
      })
      .catch(() => showStatus("settingsSaveFailed", 2000));
    updateView();
  }

  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    enabledInput.checked = settings.enabled !== false;
    const storedModifiers = Array.isArray(settings.modifiers) && settings.modifiers.length
      ? settings.modifiers
      : DEFAULT_SETTINGS.modifiers;

    modifierInputs.forEach((input) => {
      input.checked = storedModifiers.includes(input.value);
    });
    updateView();
    ensureActivePageIsReady();
  });

  enabledInput.addEventListener("change", saveSettings);
  modifierInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (selectedModifiers().length === 0) {
        input.checked = true;
        showStatus("selectOneModifier", 2000);
        return;
      }
      saveSettings();
    });
  });
})();
