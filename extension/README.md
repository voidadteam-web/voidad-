# VoidAd Chrome Extension

Blocks ads, trackers, and **YouTube ads** automatically. Syncs with your VoidAd account when you sign in.

## What it blocks

- 95+ ad and tracker domains (network-level via Manifest V3)
- YouTube pre-roll and overlay ads (content script)
- Sidebar and in-feed ads on YouTube
- Third-party trackers (Google Analytics, Facebook Pixel, etc.)

Protection starts **immediately on install** — no configuration needed.

## Install (Development)

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this folder: `voidad/extension`
5. Visit [http://localhost:3000/dashboard](http://localhost:3000/dashboard) while signed in

The dashboard will show **"VoidAd Protection Active"** when the extension is detected and synced.

## How account sync works

```
Sign up / Sign in on voidad.com
        ↓
Extension bridge receives user info
        ↓
Protection stays active + account linked
```

No extra clicks after install — login on the website auto-syncs the extension.

## Files

```
extension/
├── manifest.json           # MV3 config
├── background/
│   └── service-worker.js   # State, badge, account sync
├── content/
│   ├── youtube.js          # Skip YouTube ads
│   ├── cosmetic.css        # Hide ad elements
│   └── voidad-bridge.js    # Website ↔ extension bridge
├── rules/
│   ├── blocked-domains.json
│   └── block-rules.json    # Generated DNR rules
├── popup/                  # Extension popup UI
└── icons/
```

## Regenerate block rules

After editing `rules/blocked-domains.json`:

```bash
node extension/scripts/generate-rules.mjs
```

## Arabic — التثبيت

1. افتح `chrome://extensions`
2. فعّل **Developer mode**
3. **Load unpacked** → اختر مجلد `extension`
4. سجّل دخول في voidad.com → الحماية تشتغل تلقائياً

## Notes

- Works on Chrome and Edge (Chromium)
- For production: publish to Chrome Web Store
- DNS proxy (`dev/dns-proxy/`) protects the whole network; this extension protects the browser including YouTube
