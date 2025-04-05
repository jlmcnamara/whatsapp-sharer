# Share Link via WhatsApp (Chrome Extension)

A simple Chrome extension to quickly share the current webpage or a specific link via WhatsApp.

## Features

*   **Toolbar Button:** Click the extension icon in your Chrome toolbar to share the URL of the currently active tab.
*   **Context Menu:** Right-click on any hyperlink on a webpage and select "Share Link via WhatsApp" to share that specific link.

## How It Works

The extension opens a WhatsApp Web (`wa.me`) link in a new tab, pre-filled with the URL you want to share. WhatsApp will then prompt you to select the contact(s) or group(s) you wish to send the link to.

## Installation (from source)

1.  Clone or download this repository.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable "Developer mode" using the toggle switch in the top-right corner.
4.  Click the "Load unpacked" button.
5.  Select the `whatsapp-sharer` folder (the one containing `manifest.json`).
6.  The extension icon should appear in your toolbar.

*(Note: Remember to add the required `icon16.png`, `icon48.png`, and `icon128.png` files to the `icons` folder for the extension to load correctly with icons).*
