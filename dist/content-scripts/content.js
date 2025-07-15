"use strict";
// content.ts – Inject dark banner on every page 🌈
const banner = document.createElement("div");
banner.className = "injected-banner";
banner.innerHTML = `<img src="../assets/icons/icon-128.png" alt="Logo"> NoCodeDevOpsDesignSuite Active 🚀`;
document.body.appendChild(banner);
// Remove banner after 5 seconds
setTimeout(() => {
    banner.remove();
}, 5000);
