/** Skip YouTube video ads, sidebar ads, and sponsored content */
(function () {
  "use strict";

  const SKIP_SELECTORS = [
    ".ytp-ad-skip-button",
    ".ytp-skip-ad-button",
    ".ytp-ad-skip-button-modern",
    ".videoAdUiSkipButton",
    ".ytp-ad-skip-button-container button",
    ".ytp-ad-skip-button-slot button",
    ".ytp-ad-skip-button-modern.ytp-button",
    "button.ytp-ad-skip-button-modern",
  ];

  const HIDE_SELECTORS = [
    "ytd-display-ad-renderer",
    "ytd-ad-slot-renderer",
    "ytd-in-feed-ad-layout-renderer",
    "ytd-banner-promo-renderer",
    "ytd-promoted-sparkles-web-renderer",
    "ytd-promoted-video-renderer",
    "ytd-compact-promoted-video-renderer",
    "ytd-action-companion-ad-renderer",
    "ytd-movie-offer-module-renderer",
    "ytd-video-matched-ad-renderer",
    "ytd-search-pyv-renderer",
    "ytd-watch-next-secondary-results-ad-renderer",
    "ytd-companion-slot-renderer",
    "yt-ad-metadata-view-model",
    "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads']",
    "#masthead-ad",
    "#player-ads",
    ".ytp-ad-module",
    ".ytp-ad-overlay-slot",
    ".ytp-ad-overlay-container",
    ".video-ads",
    ".ytp-ad-player-overlay",
    ".ytp-ad-image-overlay",
    ".ytp-ad-preview-container",
    ".ytp-ad-text-overlay",
    ".ytp-ad-duration-remaining",
    ".ytp-ad-progress",
  ];

  function isAdPlayer(player) {
    if (!(player instanceof HTMLElement)) return false;
    return (
      player.classList.contains("ad-showing") ||
      player.classList.contains("ad-interrupting") ||
      player.querySelector(".ytp-ad-player-overlay") ||
      player.querySelector(".ytp-ad-text")
    );
  }

  function clickSkipButtons(root = document) {
    for (const selector of SKIP_SELECTORS) {
      root.querySelectorAll(selector).forEach((btn) => {
        if (btn instanceof HTMLElement && btn.offsetParent !== null) {
          btn.click();
        }
      });
    }
  }

  function skipAdVideo(root = document) {
    root.querySelectorAll(".html5-video-player").forEach((player) => {
      if (!isAdPlayer(player)) return;

      const video = player.querySelector("video");
      if (video) {
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = Math.max(0, video.duration - 0.05);
        }
        video.playbackRate = 16;
        video.muted = true;
        video.dispatchEvent(new Event("ended"));
      }

      clickSkipButtons(player);
    });

    clickSkipButtons(root);
  }

  function hideAds(root = document) {
    for (const selector of HIDE_SELECTORS) {
      root.querySelectorAll(selector).forEach((el) => {
        if (el instanceof HTMLElement) el.remove();
      });
    }

    root.querySelectorAll("ytd-rich-item-renderer").forEach((el) => {
      if (el.querySelector("yt-ad-metadata-view-model, ytd-display-ad-renderer")) {
        el.remove();
      }
    });
  }

  function tick() {
    skipAdVideo();
    hideAds();
  }

  tick();
  setInterval(tick, 40);

  const observer = new MutationObserver(tick);
  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "hidden"],
    });
  }
})();
