(() => {
  "use strict";

  const body = document.body;
  const languageButtons = [...document.querySelectorAll("[data-set-language]")];
  const copyButton = document.querySelector("[data-copy-checksum]");
  const checksum = document.querySelector("#checksum-value");
  const copyStatus = document.querySelector(".copy-status");

  const translations = {
    zh: {
      title: "LinkTap — Chrome 浏览器扩展",
      description: "按住自定义修饰键，点击链接即可复制 URL。快速、私密、支持多语言。",
      copied: "已复制 SHA-256",
      copyFailed: "复制失败，请手动选择校验值",
    },
    en: {
      title: "LinkTap — Chrome Extension",
      description: "Copy any link URL with a customizable modifier-key click. Fast, private, and multilingual.",
      copied: "SHA-256 copied",
      copyFailed: "Could not copy; select the checksum manually",
    },
  };

  function setLanguage(language, remember = true) {
    const nextLanguage = language === "zh" ? "zh" : "en";
    const copy = translations[nextLanguage];

    body.dataset.language = nextLanguage;
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";
    document.title = copy.title;
    document.querySelector('meta[name="description"]').content = copy.description;

    for (const button of languageButtons) {
      button.setAttribute("aria-pressed", String(button.dataset.setLanguage === nextLanguage));
    }

    if (remember) {
      localStorage.setItem("linktap-site-language", nextLanguage);
    }
  }

  for (const button of languageButtons) {
    button.addEventListener("click", () => setLanguage(button.dataset.setLanguage));
  }

  copyButton?.addEventListener("click", async () => {
    const language = body.dataset.language;
    try {
      await navigator.clipboard.writeText(checksum.textContent.trim());
      copyStatus.textContent = translations[language].copied;
    } catch {
      copyStatus.textContent = translations[language].copyFailed;
    }
    window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 2400);
  });

  const savedLanguage = localStorage.getItem("linktap-site-language");
  const browserLanguage = navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  setLanguage(savedLanguage || browserLanguage, false);
})();
