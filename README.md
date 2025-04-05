# Share Link via WhatsApp (Chrome Extension)

A simple Chrome extension to quickly share the current webpage or a specific link via WhatsApp.

## Features

*   **Toolbar Button:** Click the extension icon in your Chrome toolbar to share the URL of the currently active tab.
*   **Context Menu (Link):** Right-click on any hyperlink on a webpage and select "Share Link via WhatsApp" to share that specific link.
*   **Context Menu (Highlight):** Select text on a webpage, right-click, and select "Share Highlight via WhatsApp" to share a link that directly points to the selected text.

## How It Works

The extension uses a background service worker (`background.js`) to listen for three types of events:
1.  Clicks on the extension's toolbar icon (`chrome.action.onClicked`).
2.  Clicks on the custom context menu item added for links (`chrome.contextMenus.onClicked` with `menuItemId: 'shareLinkViaWhatsApp'`).
3.  Clicks on the custom context menu item added for selections (`chrome.contextMenus.onClicked` with `menuItemId: 'shareHighlightViaWhatsApp'`).

When the toolbar icon or the "Share Link" menu item is clicked, the script retrieves the relevant URL (current tab or clicked link). When the "Share Highlight" item is clicked, it retrieves the selected text (`info.selectionText`) and the page URL (`info.pageUrl`), constructs a Text Fragment URL (`pageUrl#:~:text=ENCODED_TEXT`), and opens that.

No user data (like phone numbers or contacts) is stored or handled by the extension itself.

## Project Structure

```
whatsapp-sharer/
├── manifest.json       # Extension configuration
├── background.js       # Core logic (event listeners, URL sharing)
├── create_icons.py     # Python script to generate placeholder icons
├── icons/              # Folder containing extension icons
│   ├── icon16.png      # (Generated by create_icons.py)
│   ├── icon48.png      # (Generated by create_icons.py)
│   └── icon128.png     # (Generated by create_icons.py)
└── README.md           # This file
```

## Building the Extension

### 1. Manifest (`manifest.json`)

This file defines the extension's properties:
*   `manifest_version`: Specifies Manifest V3.
*   `name`, `version`, `description`: Basic identification details.
*   `permissions`: Requests access to `contextMenus` (to add the right-click options), `tabs` (to get the current tab URL and open new tabs), and `scripting` (to access selected text on the page).
*   `background`: Declares the service worker script (`background.js`).
*   `action`: Defines the toolbar button, linking it to the icons.
*   `icons`: Specifies the different icon sizes used by Chrome.

### 2. Background Script (`background.js`)

This script runs in the background.
*   It defines the `shareUrlViaWhatsApp(url)` function, which takes a URL, encodes it, constructs the `wa.me` link, and opens it. It includes basic validation for the URL.
*   It sets up listeners:
    *   `chrome.runtime.onInstalled`: Creates *two* context menu items only once when the extension is first installed or updated: one for links (`contexts: ['link']`) and one for selected text (`contexts: ['selection']`).
    *   `chrome.contextMenus.onClicked`: Handles clicks on *both* context menu items. If the "Share Link" item is clicked, it shares `info.linkUrl`. If the "Share Highlight" item is clicked, it shares a Text Fragment URL constructed from `info.pageUrl` and `info.selectionText`.
    *   `chrome.action.onClicked`: Handles clicks on the toolbar icon, calling `shareUrlViaWhatsApp` with the current tab's URL (`tab.url`). Includes a fallback query if the URL isn't immediately available.

### 3. Icon Generation (`create_icons.py`)

Since Chrome requires specific PNG icon files (`16x16`, `48x48`, `128x128`), this Python script provides a way to automatically generate simple placeholder icons.
*   **Requires:** Python 3 and the Pillow library (`pip install Pillow`).
*   **Functionality:**
    *   Creates the `icons/` directory if it doesn't exist.
    *   Defines the required sizes and filenames.
    *   Sets a background color (WhatsApp green) and text color (white).
    *   Iterates through the required sizes:
        *   Creates a new image with the specified size and background color.
        *   Attempts to draw a white "W" character in the center using a common system font (DejaVu Sans Bold or Liberation Sans Bold). It includes fallbacks if these fonts aren't found, potentially using a basic default font or just leaving the icon as a solid color square.
        *   Saves the generated image as a PNG file in the `icons/` directory.
*   **Usage:** Run `python3 create_icons.py` in the terminal from the project's root directory.

## Installation (from source)

1.  Clone or download this repository.
2.  **Generate Icons (First time):** Make sure you have Python 3 and Pillow installed. Run `python3 create_icons.py` in the project directory. This will create the necessary files in the `icons/` folder.
3.  **Load in Chrome:**
    *   Open Chrome and navigate to `chrome://extensions/`.
    *   Enable "Developer mode" using the toggle switch in the top-right corner.
    *   Click the "Load unpacked" button.
    *   Select the `whatsapp-sharer` folder (the one containing `manifest.json`).
    *   The extension icon should appear in your toolbar.
