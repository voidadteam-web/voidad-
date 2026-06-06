/** Popup UI + install landing when opened from the extension folder */

const DASHBOARD_URL = "https://voidad.com/en/dashboard";

function hasExtensionApis() {
  return typeof chrome !== "undefined" && Boolean(chrome.runtime?.sendMessage);
}

function isFileMode() {
  return window.location.protocol === "file:";
}

function showInstallGuide() {
  const guide = document.getElementById("install-guide");
  const panel = document.getElementById("extension-ui");
  if (guide) guide.hidden = false;
  if (panel) panel.hidden = true;
  document.body.classList.add("install-mode");
}

function showExtensionUi() {
  const guide = document.getElementById("install-guide");
  const panel = document.getElementById("extension-ui");
  if (guide) guide.hidden = true;
  if (panel) panel.hidden = false;
  document.body.classList.remove("install-mode");
}

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    if (!hasExtensionApis()) {
      reject(new Error("NOT_INSTALLED"));
      return;
    }

    const timer = window.setTimeout(() => {
      reject(new Error("TIMEOUT"));
    }, 5000);

    try {
      chrome.runtime.sendMessage(message, (response) => {
        window.clearTimeout(timer);
        const err = chrome.runtime.lastError;
        if (err) {
          reject(new Error(err.message || "RUNTIME_ERROR"));
          return;
        }
        resolve(response ?? {});
      });
    } catch (error) {
      window.clearTimeout(timer);
      reject(error instanceof Error ? error : new Error("SEND_FAILED"));
    }
  });
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    if (button) {
      const prev = button.textContent;
      button.textContent = button.dataset.copied ?? "Copied!";
      window.setTimeout(() => {
        button.textContent = prev;
      }, 2000);
    }
  } catch {
    window.prompt("Copy:", text);
  }
}

function wireInstallGuide() {
  const copyExt = document.getElementById("copy-extensions-url");
  const copyFolder = document.getElementById("copy-folder-hint");

  copyExt?.addEventListener("click", () => {
    void copyText("chrome://extensions", copyExt);
  });

  copyFolder?.addEventListener("click", () => {
    const folder = window.location.pathname.replace(/\/popup\.html$/, "").replace(/\/+$/, "");
    void copyText(folder || "voidad-extension", copyFolder);
  });
}

async function loadExtensionState() {
  const protectionEl = document.getElementById("protection");
  const statsEl = document.getElementById("stats");
  const toggleBtn = document.getElementById("toggle");
  const dashboardLink = document.getElementById("dashboard");

  if (dashboardLink) {
    dashboardLink.href = DASHBOARD_URL;
  }

  if (!protectionEl || !statsEl || !toggleBtn) return;

  if (!hasExtensionApis()) {
    showInstallGuide();
    return;
  }

  showExtensionUi();
  protectionEl.textContent = "Loading…";
  toggleBtn.disabled = true;

  try {
    const state = await sendMessage({ type: "GET_STATE" });
    const enabled = state?.protectionEnabled !== false;

    protectionEl.innerHTML = enabled
      ? '<span class="on">● Protection Active</span>'
      : '<span class="off">● Protection Off</span>';

    const blocked = state?.blockedCount ?? 0;
    const dns = state?.dnsProxyOnline ? "DNS proxy online" : "DNS proxy offline";

    if (state?.email) {
      statsEl.textContent = `${state.email} · ${blocked} blocked · ${dns}`;
    } else {
      statsEl.textContent = `${blocked} blocked · Sign in at voidad.com · ${dns}`;
    }

    toggleBtn.disabled = false;
    toggleBtn.textContent = enabled ? "Turn Off Protection" : "Turn On Protection";
    toggleBtn.onclick = async () => {
      toggleBtn.disabled = true;
      try {
        await sendMessage({ type: "SET_PROTECTION", enabled: !enabled });
        await loadExtensionState();
      } catch {
        protectionEl.innerHTML = '<span class="off">● Worker error</span>';
        statsEl.textContent = "Reload at chrome://extensions";
        toggleBtn.disabled = true;
      }
    };
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    if (code === "NOT_INSTALLED") {
      showInstallGuide();
      return;
    }

    protectionEl.innerHTML = '<span class="off">● Extension not responding</span>';
    statsEl.textContent =
      code === "TIMEOUT"
        ? "Reload VoidAd at chrome://extensions"
        : "Open chrome://extensions → Reload VoidAd";
    toggleBtn.disabled = true;
    toggleBtn.textContent = "Open extensions";
    toggleBtn.onclick = () => {
      if (hasExtensionApis()) {
        chrome.tabs?.create({ url: "chrome://extensions" });
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  wireInstallGuide();
  if (isFileMode() || !hasExtensionApis()) {
    showInstallGuide();
  }
  void loadExtensionState();
});
