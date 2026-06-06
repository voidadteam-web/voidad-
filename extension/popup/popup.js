/** Popup UI — must run inside the installed extension, not as a file:// page */

const DASHBOARD_URL = "https://voidad.com/en/dashboard";

function hasExtensionApis() {
  return typeof chrome !== "undefined" && Boolean(chrome.runtime?.sendMessage);
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

function setInstallHelp(protectionEl, statsEl, toggleBtn) {
  protectionEl.innerHTML = '<span class="off">● Not installed</span>';
  statsEl.innerHTML =
    "Do <strong>not</strong> open popup.html directly.<br><br>" +
    "1. Open <code>chrome://extensions</code> (or <code>edge://extensions</code>)<br>" +
    "2. Developer mode ON → Load unpacked<br>" +
    "3. Select the unzipped <code>voidad-extension</code> folder";
  toggleBtn.disabled = true;
  toggleBtn.textContent = "Install extension first";
}

async function load() {
  const protectionEl = document.getElementById("protection");
  const statsEl = document.getElementById("stats");
  const toggleBtn = document.getElementById("toggle");
  const dashboardLink = document.getElementById("dashboard");

  if (dashboardLink) {
    dashboardLink.href = DASHBOARD_URL;
  }

  if (!hasExtensionApis()) {
    setInstallHelp(protectionEl, statsEl, toggleBtn);
    return;
  }

  protectionEl.textContent = "Loading…";
  toggleBtn.disabled = true;

  try {
    const state = await sendMessage({ type: "GET_STATE" });
    const enabled = state?.protectionEnabled !== false;

    protectionEl.innerHTML = enabled
      ? '<span class="on">● Protection Active</span>'
      : '<span class="off">● Protection Off</span>';

    const blocked = state?.blockedCount ?? 0;
    const dns = state?.dnsProxyOnline ? "DNS proxy online" : "DNS proxy offline (Layer 1 optional)";

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
        await load();
      } catch {
        protectionEl.innerHTML = '<span class="off">● Worker error</span>';
        statsEl.textContent = "Reload the extension at chrome://extensions";
        toggleBtn.disabled = true;
      }
    };
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    if (code === "NOT_INSTALLED") {
      setInstallHelp(protectionEl, statsEl, toggleBtn);
      return;
    }

    protectionEl.innerHTML = '<span class="off">● Extension not responding</span>';
    statsEl.textContent =
      code === "TIMEOUT"
        ? "Background worker timed out — go to chrome://extensions and click Reload on VoidAd."
        : "Open chrome://extensions → Reload VoidAd, then try again.";
    toggleBtn.disabled = true;
    toggleBtn.textContent = "Reload extension";
    toggleBtn.onclick = () => {
      if (hasExtensionApis() && chrome.runtime?.openOptionsPage) {
        chrome.tabs?.create({ url: "chrome://extensions" });
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  void load();
});
