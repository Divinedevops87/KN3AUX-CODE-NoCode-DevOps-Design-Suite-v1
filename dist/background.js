"use strict";
// 🎉 background.ts – NoCode DevOps + Design Suite b.v1.0 (Dark, Emoji-Packed) 🎉
chrome.runtime.onInstalled.addListener(() => {
    console.log("✅ NoCode DevOps + Design Suite b.v1.0 Installed by Divinedevops87!");
    chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icons/icon-128.png",
        title: "🌌 NoCode DevOps + Design Suite",
        message: "Extension successfully installed! 🚀"
    });
});
// Listen for popup messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "openTermux") {
        chrome.tabs.create({ url: "http://localhost:8020" }); // Termux server
        sendResponse({ status: "Termux server opened 🚀" });
    }
    if (msg.action === "runDevOps") {
        // Example: open a DevOps dashboard or run a script
        chrome.tabs.create({ url: "https://ci.divinedevops87.com" });
        sendResponse({ status: "DevOps script initiated ⚙️" });
    }
});
