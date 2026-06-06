async function load() {
  const state = await chrome.runtime.sendMessage({ type: "GET_STATE" });
  const protectionEl = document.getElementById("protection");
  const statsEl = document.getElementById("stats");
  const toggleBtn = document.getElementById("toggle");

  const enabled = state?.protectionEnabled !== false;
  protectionEl.innerHTML = enabled
    ? '<span class="on">● Protection Active</span>'
    : '<span class="off">● Protection Off</span>';

  if (state?.email) {
    statsEl.textContent = `Signed in as ${state.email} · ${state.blockedCount ?? 0} blocked`;
  } else {
    statsEl.textContent = `${state?.blockedCount ?? 0} requests blocked · Sign in at voidad.com to sync`;
  }

  toggleBtn.textContent = enabled ? "Turn Off Protection" : "Turn On Protection";
  toggleBtn.onclick = async () => {
    await chrome.runtime.sendMessage({ type: "SET_PROTECTION", enabled: !enabled });
    load();
  };
}

load();
