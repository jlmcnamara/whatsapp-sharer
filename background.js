// background.js

// Function to open WhatsApp for sharing a URL
function shareUrlViaWhatsApp(url) {
  if (!url || (!url.startsWith('http:') && !url.startsWith('https:'))) {
     console.error("Invalid or missing URL provided for sharing:", url);
     // Optional: Notify user about invalid URL if needed
     chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Cannot Share URL',
        message: 'The link selected or current page URL is not valid for sharing.',
        priority: 1
    });
     return;
  }
  // Encode the URL to be shared
  const encodedUrl = encodeURIComponent(url);
  // Use the wa.me link which prompts the user to choose a contact in WhatsApp Web/Desktop
  const whatsappShareUrl = `https://wa.me/?text=${encodedUrl}`;

  console.log("Opening WhatsApp share URL:", whatsappShareUrl);
  // Open the WhatsApp sharing link in a new tab
  chrome.tabs.create({ url: whatsappShareUrl });
}

// --- Setup and Listeners ---

// 1. Create context menu items on installation
chrome.runtime.onInstalled.addListener(() => {
  // Context menu for Links
  chrome.contextMenus.create({
    id: "shareLinkViaWhatsApp",
    title: "Share Link via WhatsApp",
    contexts: ["link"]
  });

  // Context menu for Selected Text
  chrome.contextMenus.create({
    id: "shareHighlightViaWhatsApp",
    title: "Share Highlight via WhatsApp",
    contexts: ["selection"]
  });

  console.log("WhatsApp sharing context menus created.");
});

// 2. Listener for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Handle sharing a specific Link
  if (info.menuItemId === "shareLinkViaWhatsApp" && info.linkUrl) {
    console.log("Context menu clicked (Link). Sharing link URL:", info.linkUrl);
    shareUrlViaWhatsApp(info.linkUrl);
  }
  // Handle sharing highlighted Text
  else if (info.menuItemId === "shareHighlightViaWhatsApp" && info.selectionText) {
    console.log("Context menu clicked (Highlight). Sharing highlight from URL:", info.pageUrl);
    // Construct the Text Fragment URL
    // Basic encoding for the text fragment
    const fragment = encodeURIComponent(info.selectionText.trim());
    const highlightUrl = `${info.pageUrl}#:~:text=${fragment}`;
    console.log("Constructed highlight URL:", highlightUrl);
    shareUrlViaWhatsApp(highlightUrl);

  }
});

// 3. Listener for the toolbar icon click (Browser Action)
chrome.action.onClicked.addListener((tab) => {
  // 'tab' parameter contains information about the tab where the icon was clicked
  if (tab && tab.url) {
    console.log("Toolbar icon clicked. Sharing current page URL:", tab.url);
    shareUrlViaWhatsApp(tab.url);
  } else {
    // Fallback if the tab URL isn't readily available (e.g., on chrome:// pages)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
       if (chrome.runtime.lastError) {
           console.error("Error querying tabs:", chrome.runtime.lastError.message);
           return;
       }
      if (tabs && tabs.length > 0 && tabs[0].url) {
         console.log("Toolbar icon clicked (fallback query). Sharing current page URL:", tabs[0].url);
        shareUrlViaWhatsApp(tabs[0].url);
      } else {
        console.error("Could not get current tab URL via query.");
         // Notify user if URL can't be determined
         chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Cannot Get URL',
            message: 'Could not determine the URL of the current page to share.',
            priority: 1
        });
      }
    });
  }
});
