// Louisiana Government Resource Discovery App - Content Script
// Provides contextual assistance and resource discovery on government websites

class GovernmentResourceAssistant {
  private banner: HTMLElement | null = null;
  private assistantPanel: HTMLElement | null = null;
  private isGovernmentSite: boolean = false;

  constructor() {
    this.detectSiteType();
    this.injectBanner();
    this.setupContextualAssistance();
  }

  private detectSiteType(): void {
    const hostname = window.location.hostname.toLowerCase();
    const governmentDomains = [
      'gov',
      'benefits.gov',
      'ssa.gov',
      'va.gov',
      'usda.gov',
      'hud.gov',
      'healthcare.gov',
      'irs.gov',
      'dol.gov',
      'fema.gov',
      'louisiana.gov',
      'ldh.la.gov',
      'laworks.net'
    ];

    this.isGovernmentSite = governmentDomains.some(domain => 
      hostname.includes(domain) || hostname.endsWith(domain)
    );
  }

  private injectBanner(): void {
    const banner = document.createElement('div');
    banner.className = 'gov-resource-banner';
    
    if (this.isGovernmentSite) {
      banner.innerHTML = `
        <div class="banner-content">
          <img src="${chrome.runtime.getURL('assets/icons/icon-128.png')}" alt="Louisiana Gov Resources" class="banner-logo">
          <div class="banner-text">
            <strong>🏛️ Louisiana Government Resource Helper Active</strong>
            <p>Need help finding other benefits? Click our extension icon!</p>
          </div>
          <button class="banner-close" id="closeBanner">×</button>
        </div>
      `;
    } else {
      banner.innerHTML = `
        <div class="banner-content">
          <img src="${chrome.runtime.getURL('assets/icons/icon-128.png')}" alt="Louisiana Gov Resources" class="banner-logo">
          <div class="banner-text">
            <strong>💡 Looking for Louisiana government benefits?</strong>
            <p>Click our extension to find available resources!</p>
          </div>
          <button class="banner-close" id="closeBanner">×</button>
        </div>
      `;
    }

    document.body.appendChild(banner);
    this.banner = banner;

    // Add close functionality
    const closeBtn = banner.querySelector('#closeBanner') as HTMLButtonElement;
    closeBtn?.addEventListener('click', () => this.removeBanner());

    // Auto-remove banner after 8 seconds
    setTimeout(() => this.removeBanner(), 8000);
  }

  private setupContextualAssistance(): void {
    if (this.isGovernmentSite) {
      this.addQuickHelperPanel();
      this.highlightImportantForms();
      this.addEligibilityHelpers();
    }
  }

  private addQuickHelperPanel(): void {
    const panel = document.createElement('div');
    panel.className = 'gov-helper-panel';
    panel.innerHTML = `
      <div class="helper-header">
        <h4>🎯 Quick Actions</h4>
        <button class="panel-toggle" id="togglePanel">−</button>
      </div>
      <div class="helper-content" id="helperContent">
        <button class="helper-btn" id="translatePage">🌐 Translate Page</button>
        <button class="helper-btn" id="simplifyForm">📝 Simplify Forms</button>
        <button class="helper-btn" id="findOtherBenefits">🔍 Find Other Benefits</button>
        <button class="helper-btn" id="saveProgress">💾 Save Progress</button>
      </div>
    `;

    document.body.appendChild(panel);
    this.assistantPanel = panel;

    // Add event listeners
    panel.querySelector('#togglePanel')?.addEventListener('click', this.togglePanel.bind(this));
    panel.querySelector('#translatePage')?.addEventListener('click', this.translatePage.bind(this));
    panel.querySelector('#simplifyForm')?.addEventListener('click', this.simplifyForms.bind(this));
    panel.querySelector('#findOtherBenefits')?.addEventListener('click', this.findOtherBenefits.bind(this));
    panel.querySelector('#saveProgress')?.addEventListener('click', this.saveProgress.bind(this));
  }

  private highlightImportantForms(): void {
    // Find and highlight important form elements
    const formSelectors = [
      'form[action*="apply"]',
      'form[action*="submit"]',
      '.application-form',
      '.benefit-form',
      'input[type="submit"][value*="Apply"]',
      'button[type="submit"]'
    ];

    formSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.classList.add('gov-helper-highlight');
        
        // Add helpful tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'gov-helper-tooltip';
        tooltip.textContent = '💡 Need help with this form? Use our extension!';
        element.appendChild(tooltip);
      });
    });
  }

  private addEligibilityHelpers(): void {
    // Look for eligibility-related content and add helpful hints
    const eligibilityKeywords = ['eligible', 'qualify', 'requirements', 'criteria', 'income limit'];
    const textNodes = this.getTextNodes(document.body);

    textNodes.forEach(node => {
      const text = node.textContent?.toLowerCase() || '';
      if (eligibilityKeywords.some(keyword => text.includes(keyword))) {
        const parent = node.parentElement;
        if (parent && !parent.querySelector('.eligibility-helper')) {
          const helper = document.createElement('span');
          helper.className = 'eligibility-helper';
          helper.innerHTML = ' <span class="helper-icon" title="Check your eligibility with our extension!">ℹ️</span>';
          parent.appendChild(helper);
        }
      }
    });
  }

  private getTextNodes(element: Element): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      if (node.textContent?.trim()) {
        textNodes.push(node as Text);
      }
    }

    return textNodes;
  }

  private togglePanel(): void {
    const content = this.assistantPanel?.querySelector('#helperContent') as HTMLElement;
    const toggle = this.assistantPanel?.querySelector('#togglePanel') as HTMLElement;
    
    if (content && toggle) {
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? 'block' : 'none';
      toggle.textContent = isHidden ? '−' : '+';
    }
  }

  private translatePage(): void {
    // Simple translation helper
    const currentLang = document.documentElement.lang || 'en';
    if (currentLang === 'en') {
      this.showTranslationOptions();
    } else {
      window.location.href = window.location.href; // Refresh to original
    }
  }

  private showTranslationOptions(): void {
    const overlay = document.createElement('div');
    overlay.className = 'translation-overlay';
    overlay.innerHTML = `
      <div class="translation-modal">
        <h3>🌐 Translation Options</h3>
        <p>Select your preferred language:</p>
        <button class="lang-btn" data-lang="es">🇪🇸 Español</button>
        <button class="lang-btn" data-lang="fr">🇫🇷 Français</button>
        <button class="lang-btn" data-lang="en">🇺🇸 English</button>
        <button class="close-modal">Close</button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('lang-btn')) {
        const lang = target.getAttribute('data-lang');
        this.applyTranslation(lang || 'en');
        overlay.remove();
      } else if (target.classList.contains('close-modal')) {
        overlay.remove();
      }
    });
  }

  private applyTranslation(lang: string): void {
    // Simple translation simulation - in production, use Google Translate API
    if (lang === 'es') {
      document.title = '🏛️ Recursos Gubernamentales de Louisiana';
    } else if (lang === 'fr') {
      document.title = '🏛️ Ressources Gouvernementales de Louisiane';
    }
    
    // Show translation notice
    this.showNotification(`Page translated to ${lang === 'es' ? 'Spanish' : lang === 'fr' ? 'French' : 'English'}`);
  }

  private simplifyForms(): void {
    // Add helpful explanations to complex forms
    const formInputs = document.querySelectorAll('input, select, textarea');
    let simplified = 0;

    formInputs.forEach(input => {
      const label = this.findLabelForInput(input as HTMLInputElement);
      if (label && !label.querySelector('.simple-help')) {
        const helpText = this.getSimplifiedHelp(input as HTMLInputElement);
        if (helpText) {
          const helpSpan = document.createElement('span');
          helpSpan.className = 'simple-help';
          helpSpan.innerHTML = ` <small style="color: #0066cc;">(${helpText})</small>`;
          label.appendChild(helpSpan);
          simplified++;
        }
      }
    });

    this.showNotification(`Simplified ${simplified} form fields`);
  }

  private findLabelForInput(input: HTMLInputElement): HTMLElement | null {
    // Find associated label
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) return label as HTMLElement;
    }

    // Check parent elements
    let parent = input.parentElement;
    while (parent) {
      if (parent.tagName === 'LABEL') return parent;
      const label = parent.querySelector('label');
      if (label) return label;
      parent = parent.parentElement;
    }

    return null;
  }

  private getSimplifiedHelp(input: HTMLInputElement): string {
    const type = input.type?.toLowerCase();
    const name = input.name?.toLowerCase() || '';
    const placeholder = input.placeholder?.toLowerCase() || '';

    if (name.includes('income') || placeholder.includes('income')) {
      return 'Total money your household earns per month';
    }
    if (name.includes('ssn') || placeholder.includes('social')) {
      return 'Your 9-digit Social Security number';
    }
    if (name.includes('address')) {
      return 'Where you currently live';
    }
    if (type === 'email') {
      return 'Your email address for updates';
    }
    if (type === 'tel' || name.includes('phone')) {
      return 'Your phone number';
    }
    if (name.includes('birth') || name.includes('dob')) {
      return 'Your date of birth (MM/DD/YYYY)';
    }

    return '';
  }

  private findOtherBenefits(): void {
    // Open the extension popup programmatically
    chrome.runtime.sendMessage({ action: 'openPopup' });
    this.showNotification('Opening Louisiana Government Resource Discovery...');
  }

  private saveProgress(): void {
    // Save form progress
    const forms = document.querySelectorAll('form');
    let savedData: any = {};

    forms.forEach((form, index) => {
      const formData = new FormData(form);
      const formObject: any = {};
      
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      if (Object.keys(formObject).length > 0) {
        savedData[`form_${index}`] = formObject;
      }
    });

    if (Object.keys(savedData).length > 0) {
      chrome.storage.local.set({
        [`saved_progress_${window.location.hostname}`]: {
          data: savedData,
          url: window.location.href,
          timestamp: Date.now()
        }
      });
      this.showNotification('Form progress saved! ✅');
    } else {
      this.showNotification('No form data to save');
    }
  }

  private showNotification(message: string): void {
    const notification = document.createElement('div');
    notification.className = 'gov-helper-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  private removeBanner(): void {
    if (this.banner) {
      this.banner.remove();
      this.banner = null;
    }
  }
}

// Initialize the assistant when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GovernmentResourceAssistant();
  });
} else {
  new GovernmentResourceAssistant();
}
