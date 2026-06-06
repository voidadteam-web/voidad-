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
    "#masthead-ad",
    "#player-ads",
    ".ytp-ad-module",
    ".ytp-ad-overlay-slot",
    ".ytp-ad-overlay-container",
    ".video-ads",
    ".ytp-ad-player-overlay",
    ".ytp-ad-image-overlay",
  ];

  function clickSkipButtons(root = document) {
    for (const selector of SKIP_SELECTORS) {
      root.querySelectorAll(selector).forEach((btn) => {
        if (btn instanceof HTMLElement) btn.click();
      });
    }
  }

  function skipAdVideo(root = document) {
    root.querySelectorAll(".html5-video-player.ad-showing, .html5-video-player.ad-interrupting").forEach((player) => {
      const video = player.querySelector("video");
      if (!video) return;
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration;
      }
      video.playbackRate = 16;
      video.muted = true;
    });
    clickSkipButtons(root);
  }

  function hideAds(root = document) {
    for (const selector of HIDE_SELECTORS) {
      root.querySelectorAll(selector).forEach((el) => {
        if (el instanceof HTMLElement) el.remove();
      });
    }
  }

  function tick() {
    skipAdVideo();
    hideAds();
  }

  tick();
  setInterval(tick, 50);

  const observer = new MutationObserver(tick);
  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  }
})();
