# 🌌 NoCode DevOps + Design Suite b.v1.0 🌌

> **📦 Repo**: NoCodeDevOpsDesignSuite-bv1.0  
> **🔥 Tagline**: Dark Mode, Emoji-Packed, TypeScript Chromium Extension

---

## 🚀 Overview

**NoCode DevOps + Design Suite b.v1.0** is a full-featured Chrome/Brave/Edge extension bringing all your DevOps & design utilities into one dark, emoji-rich package—ready for mobile and offline use. Everything is built in **TypeScript** 🧩, **CSS** 🎨, and **HTML** 📄, and runs entirely offline. Just load it as an unpacked extension and you’re set!

**Key Features:**  
- 🌑 True Dark Mode UI with vivid emojis  
- 🖥️ One-click Termux Server Launch  
- ⚙️ Run DevOps & CI/CD Scripts instantly  
- 🌈 Translucent Rainbow-Glow Logo  
- 📱 Mobile-Ready Popup & Responsive Design  
- 💾 Fully Offline: All assets bundled (no CDN)  
- 🧩 TypeScript-powered for type safety & maintainability  
- 📢 Automatic page injection banner that says **“NoCodeDevOpsDesignSuite Active 🚀”**  

---

## 📂 Repository Structure

```
NoCodeDevOpsDesignSuite-bv1.0/
├── .github/                          
│   └── workflows/                         
│       └── build-and-deploy.yml        
├── assets/                          
│   ├── icons/                       
│   ├── logo/                        
│   └── social/                      
├── docs/                           
│   ├── index.html                  
│   └── styles.css                  
├── ext/                            
│   ├── manifest.json               
│   ├── background.ts               
│   ├── popup/                      
│   │   ├── popup.html              
│   │   ├── popup.ts                
│   │   └── popup.css               
│   └── content-scripts/            
│       ├── content.ts              
│       └── styles.css              
├── tsconfig.json                   
├── package.json                    
├── netlify.toml                    
├── README.md                       
├── LICENSE                         
└── .gitignore                      
```

---

## 🖼️ Live Demo & One-Click Deploy

**Preview Site**: [NoCode DevOps on Netlify](https://nocodedevopsdesignsuite-bv1-0.netlify.app)  

**One-Click Deploy Buttons**:

<p align="center">
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/Divinedevops87/NoCodeDevOpsDesignSuite-bv1.0">
    <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />
  </a>
  <a href="https://glitch.com/edit/#!/import/github/Divinedevops87/NoCodeDevOpsDesignSuite-bv1.0">
    <img src="https://img.shields.io/badge/Remix%20on-Glitch-blueviolet" alt="Remix on Glitch" />
  </a>
  <a href="https://vercel.com/new/git/external?repository-url=https://github.com/Divinedevops87/NoCodeDevOpsDesignSuite-bv1.0&project-name=NoCodeDevOpsDesignSuite-bv1-0">
    <img src="https://vercel.com/button" alt="Deploy to Vercel" />
  </a>
  <a href="https://heroku.com/deploy?template=https://github.com/Divinedevops87/NoCodeDevOpsDesignSuite-bv1.0">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy to Heroku" />
  </a>
</p>

---

## ⚙️ Install & Load (Offline & Mobile-Ready)

1. **Clone the repo:**  
   ```bash
   git clone https://github.com/Divinedevops87/NoCodeDevOpsDesignSuite-bv1.0.git
   cd NoCodeDevOpsDesignSuite-bv1.0
   ```

2. **Install dependencies & build:**  
   ```bash
   npm ci
   npm run build
   ```
   - This compiles all `.ts` → `.js` into `dist/` and copies over `manifest.json`, `popup/`, and `content-scripts/`.

3. **Load as unpacked extension:**  
   - Open Chrome/Brave/Edge.  
   - Go to `chrome://extensions` (or `edge://extensions`).  
   - Toggle **Developer mode** ON.  
   - Click **Load unpacked** and select the `dist/` folder.

4. **Enjoy!**  
   - Click the NoCode DevOps icon to open the dark-mode popup.  
   - Navigate to any site to see the injected banner “NoCodeDevOpsDesignSuite Active 🚀” at bottom-right for 5 seconds.

---

## 💻 Development & Debug

- **Watch Mode:**  
  ```bash
  npm run watch
  ```
  Continuously compiles `.ts` changes into `dist/`.

- **Rebuild:**  
  ```bash
  npm run clean
  npm run build
  ```

---

## 📝 Author & Links

**Created by** Krisshatta Nicole Esclovon™ (GitHub: [@Divinedevops87](https://github.com/Divinedevops87)).  
All rights reserved under SIEL.  

---

## 🌟 Enjoy NoCode DevOps + Design Suite b.v1.0! 🌟
