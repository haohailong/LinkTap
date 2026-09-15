"use strict";

const DEFAULT_SETTINGS = Object.freeze({
  enabled: true,
  modifiers: ["ctrl", "shift"]
});

async function initializeSettings() {
  const stored = await chrome.storage.sync.get(["enabled", "modifiers"]);
  const updates = {};

  if (typeof stored.enabled !== "boolean") {
    updates.enabled = DEFAULT_SETTINGS.enabled;
  }
  if (!Array.isArray(stored.modifiers) || stored.modifiers.length === 0) {
    updates.modifiers = DEFAULT_SETTINGS.modifiers;
  }

  if (Object.keys(updates).length > 0) {
    await chrome.storage.sync.set(updates);
  }
}

async function injectIntoExistingTabs() {
  const tabs = await chrome.tabs.query({});

  await Promise.allSettled(
    tabs
      .filter((tab) => Number.isInteger(tab.id))
      .map((tab) =>
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          files: ["content.js"]
        })
      )
  );
}

async function prepareExtension() {
  await initializeSettings();
  await injectIntoExistingTabs();
}

chrome.runtime.onInstalled.addListener(() => {
  prepareExtension().catch(() => {});
});

chrome.runtime.onStartup.addListener(() => {
  prepareExtension().catch(() => {});
});
