"use strict";
// Louisiana Government Resource Discovery App - Popup Script
// Integrates with multiple government APIs to help residents find resources
class GovernmentResourceApp {
    constructor() {
        this.currentLanguage = 'en';
        this.userLocation = '';
        // Government API endpoints and configurations
        this.apiEndpoints = {
            benefits: 'https://api.benefits.gov/v1',
            louisiana: 'https://api.louisiana.gov/v1',
            usda: 'https://api.usda.gov/food-assistance/v1',
            hud: 'https://api.hud.gov/v1',
            healthcare: 'https://api.healthcare.gov/v1',
            ssa: 'https://api.ssa.gov/v1',
            va: 'https://api.va.gov/v1',
            irs: 'https://api.irs.gov/v1',
            dol: 'https://api.dol.gov/v1',
            fema: 'https://api.fema.gov/v1'
        };
        // Mock data for demonstration (in real implementation, this would come from APIs)
        this.mockResources = [
            {
                id: 'snap-001',
                title: 'SNAP Food Benefits',
                description: 'Supplemental Nutrition Assistance Program provides monthly food benefits to eligible low-income individuals and families.',
                category: 'food',
                agency: 'USDA',
                url: 'https://www.fns.usda.gov/snap',
                eligibility: ['income_below_130_poverty', 'us_citizen_or_eligible_non_citizen', 'work_requirements'],
                tags: ['food', 'monthly benefits', 'nutrition'],
                deadline: 'Apply anytime'
            },
            {
                id: 'medicaid-la-001',
                title: 'Louisiana Medicaid',
                description: 'Free or low-cost health coverage for eligible Louisiana residents including families, children, pregnant women, elderly, and disabled.',
                category: 'healthcare',
                agency: 'Louisiana DHH',
                url: 'https://ldh.la.gov/medicaid',
                eligibility: ['income_based', 'louisiana_resident', 'citizenship_requirement'],
                tags: ['healthcare', 'insurance', 'free', 'low-cost']
            },
            {
                id: 'housing-voucher-001',
                title: 'Housing Choice Voucher Program',
                description: 'Section 8 rental assistance to help low-income families afford decent, safe, and sanitary housing.',
                category: 'housing',
                agency: 'HUD',
                url: 'https://www.hud.gov/program_offices/public_indian_housing/programs/hcv',
                eligibility: ['income_below_50_median', 'family_status', 'background_check'],
                tags: ['housing', 'rental assistance', 'section 8']
            },
            {
                id: 'va-disability-001',
                title: 'VA Disability Compensation',
                description: 'Monthly tax-free payments to veterans who were injured or became ill due to military service.',
                category: 'veterans',
                agency: 'VA',
                url: 'https://www.va.gov/disability',
                eligibility: ['veteran_status', 'service_connected_condition', 'discharge_status'],
                tags: ['veterans', 'disability', 'monthly payments', 'tax-free']
            },
            {
                id: 'wic-001',
                title: 'WIC Program',
                description: 'Women, Infants, and Children program provides nutrition education, healthy food, and support for pregnant women and young children.',
                category: 'food',
                agency: 'USDA',
                url: 'https://www.fns.usda.gov/wic',
                eligibility: ['pregnant_or_postpartum', 'children_under_5', 'income_requirements', 'nutritional_risk'],
                tags: ['nutrition', 'women', 'infants', 'children', 'food vouchers']
            },
            {
                id: 'unemployment-la-001',
                title: 'Louisiana Unemployment Insurance',
                description: 'Temporary financial assistance for workers who lost their job through no fault of their own.',
                category: 'employment',
                agency: 'Louisiana Workforce Commission',
                url: 'https://www.laworks.net',
                eligibility: ['recent_job_loss', 'job_search_requirement', 'work_history', 'not_at_fault'],
                tags: ['unemployment', 'temporary assistance', 'job search']
            }
        ];
        // Translation dictionary for multi-language support
        this.translations = {
            en: {
                searchPlaceholder: '🔍 Search for benefits, services, programs...',
                benefits: '💰 Benefits & Financial Aid',
                healthcare: '🏥 Healthcare & Insurance',
                housing: '🏠 Housing Assistance',
                food: '🍽️ Food & Nutrition',
                veterans: '🎖️ Veterans Services',
                education: '📚 Education & Training',
                checkEligibility: '📋 Check Your Eligibility',
                findLocal: '📍 Find Local Services',
                availableResources: '📋 Available Resources',
                searching: 'Searching government databases...',
                noResults: 'No resources found. Try different search terms.',
                applyNow: 'Apply Now',
                learnMore: 'Learn More'
            },
            es: {
                searchPlaceholder: '🔍 Buscar beneficios, servicios, programas...',
                benefits: '💰 Beneficios y Ayuda Financiera',
                healthcare: '🏥 Atención Médica y Seguros',
                housing: '🏠 Asistencia de Vivienda',
                food: '🍽️ Alimentación y Nutrición',
                veterans: '🎖️ Servicios para Veteranos',
                education: '📚 Educación y Capacitación',
                checkEligibility: '📋 Verificar Elegibilidad',
                findLocal: '📍 Encontrar Servicios Locales',
                availableResources: '📋 Recursos Disponibles',
                searching: 'Buscando en bases de datos gubernamentales...',
                noResults: 'No se encontraron recursos. Intente términos diferentes.',
                applyNow: 'Aplicar Ahora',
                learnMore: 'Más Información'
            },
            fr: {
                searchPlaceholder: '🔍 Rechercher des avantages, services, programmes...',
                benefits: '💰 Avantages et Aide Financière',
                healthcare: '🏥 Soins de Santé et Assurance',
                housing: '🏠 Aide au Logement',
                food: '🍽️ Alimentation et Nutrition',
                veterans: '🎖️ Services aux Anciens Combattants',
                education: '📚 Éducation et Formation',
                checkEligibility: '📋 Vérifier l\'Admissibilité',
                findLocal: '📍 Trouver des Services Locaux',
                availableResources: '📋 Ressources Disponibles',
                searching: 'Recherche dans les bases de données gouvernementales...',
                noResults: 'Aucune ressource trouvée. Essayez différents termes.',
                applyNow: 'Postuler Maintenant',
                learnMore: 'En Savoir Plus'
            }
        };
        this.initializeElements();
        this.attachEventListeners();
        this.loadUserPreferences();
        this.detectUserLocation();
    }
    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.resultsList = document.getElementById('resultsList');
        this.loadingIndicator = document.getElementById('loadingIndicator');
    }
    attachEventListeners() {
        // Search functionality
        document.getElementById('searchBtn')?.addEventListener('click', () => this.performSearch());
        this.searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter')
                this.performSearch();
        });
        // Category buttons
        document.getElementById('benefitsBtn')?.addEventListener('click', () => this.searchByCategory('benefits'));
        document.getElementById('healthcareBtn')?.addEventListener('click', () => this.searchByCategory('healthcare'));
        document.getElementById('housingBtn')?.addEventListener('click', () => this.searchByCategory('housing'));
        document.getElementById('foodBtn')?.addEventListener('click', () => this.searchByCategory('food'));
        document.getElementById('veteransBtn')?.addEventListener('click', () => this.searchByCategory('veterans'));
        document.getElementById('educationBtn')?.addEventListener('click', () => this.searchByCategory('education'));
        // Eligibility and location
        document.getElementById('eligibilityBtn')?.addEventListener('click', () => this.startEligibilityScreening());
        document.getElementById('locationBtn')?.addEventListener('click', () => this.findLocalServices());
        // Language selector
        document.getElementById('languageSelect')?.addEventListener('change', (e) => {
            const target = e.target;
            this.changeLanguage(target.value);
        });
    }
    async performSearch() {
        const query = this.searchInput.value.trim();
        if (!query)
            return;
        this.showLoading(true);
        this.hideResults();
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            const results = this.searchResources(query);
            this.displayResults(results);
        }
        catch (error) {
            console.error('Search error:', error);
            this.showError('Search failed. Please try again.');
        }
        finally {
            this.showLoading(false);
        }
    }
    searchResources(query) {
        const searchTerms = query.toLowerCase().split(' ');
        return this.mockResources.filter(resource => {
            const searchableText = `${resource.title} ${resource.description} ${resource.tags.join(' ')} ${resource.category}`.toLowerCase();
            return searchTerms.some(term => searchableText.includes(term));
        });
    }
    async searchByCategory(category) {
        this.showLoading(true);
        this.hideResults();
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const results = this.mockResources.filter(resource => resource.category === category || resource.tags.includes(category));
            this.displayResults(results);
        }
        catch (error) {
            console.error('Category search error:', error);
            this.showError('Category search failed. Please try again.');
        }
        finally {
            this.showLoading(false);
        }
    }
    displayResults(resources) {
        if (resources.length === 0) {
            this.showNoResults();
            return;
        }
        this.resultsList.innerHTML = '';
        resources.forEach(resource => {
            const resultElement = this.createResultElement(resource);
            this.resultsList.appendChild(resultElement);
        });
        this.showResults();
    }
    createResultElement(resource) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item';
        resultDiv.innerHTML = `
      <div class="result-title">${resource.title}</div>
      <div class="result-description">${resource.description}</div>
      <div class="result-tags">
        ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="result-actions" style="margin-top: 8px;">
        <button onclick="window.open('${resource.url}', '_blank')" style="padding: 4px 8px; font-size: 0.8rem; margin-right: 4px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">
          ${this.getTranslation('applyNow')}
        </button>
      </div>
    `;
        return resultDiv;
    }
    async startEligibilityScreening() {
        // Create eligibility screening form
        const eligibilityData = await this.showEligibilityForm();
        if (eligibilityData) {
            this.showLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                const eligibleResources = this.checkEligibility(eligibilityData);
                this.displayResults(eligibleResources);
            }
            catch (error) {
                console.error('Eligibility check error:', error);
                this.showError('Eligibility check failed. Please try again.');
            }
            finally {
                this.showLoading(false);
            }
        }
    }
    async showEligibilityForm() {
        return new Promise((resolve) => {
            // For demo purposes, use simplified eligibility criteria
            const age = prompt('What is your age?');
            const income = prompt('What is your monthly household income? (enter number only)');
            const familySize = prompt('How many people in your household?');
            if (age && income && familySize) {
                resolve({
                    age: parseInt(age),
                    income: parseInt(income),
                    familySize: parseInt(familySize),
                    location: this.userLocation || 'Louisiana'
                });
            }
            else {
                resolve(null);
            }
        });
    }
    checkEligibility(eligibilityData) {
        return this.mockResources.filter(resource => {
            // Simplified eligibility logic for demo
            if (resource.category === 'food' && eligibilityData.income && eligibilityData.income < 2000) {
                return true;
            }
            if (resource.category === 'healthcare' && eligibilityData.income && eligibilityData.income < 3000) {
                return true;
            }
            if (resource.category === 'housing' && eligibilityData.income && eligibilityData.income < 2500) {
                return true;
            }
            return false;
        });
    }
    async findLocalServices() {
        if (!this.userLocation) {
            await this.detectUserLocation();
        }
        this.showLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Filter resources by location (for demo, show all Louisiana resources)
            const localResources = this.mockResources.filter(resource => resource.agency.includes('Louisiana') ||
                resource.url.includes('louisiana') ||
                resource.tags.includes('local'));
            this.displayResults(localResources);
        }
        catch (error) {
            console.error('Location search error:', error);
            this.showError('Location search failed. Please try again.');
        }
        finally {
            this.showLoading(false);
        }
    }
    async detectUserLocation() {
        try {
            // For demo purposes, set default location
            this.userLocation = 'Lake Charles, Louisiana';
            // In real implementation, use geolocation API
            // navigator.geolocation.getCurrentPosition(...)
        }
        catch (error) {
            console.error('Location detection error:', error);
            this.userLocation = 'Louisiana';
        }
    }
    changeLanguage(language) {
        this.currentLanguage = language;
        this.updateUILanguage();
        this.saveUserPreferences();
    }
    updateUILanguage() {
        // Update placeholder text
        if (this.searchInput) {
            this.searchInput.placeholder = this.getTranslation('searchPlaceholder');
        }
        // Update button texts
        const buttonMappings = [
            { id: 'benefitsBtn', key: 'benefits' },
            { id: 'healthcareBtn', key: 'healthcare' },
            { id: 'housingBtn', key: 'housing' },
            { id: 'foodBtn', key: 'food' },
            { id: 'veteransBtn', key: 'veterans' },
            { id: 'educationBtn', key: 'education' },
            { id: 'eligibilityBtn', key: 'checkEligibility' },
            { id: 'locationBtn', key: 'findLocal' }
        ];
        buttonMappings.forEach(({ id, key }) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.getTranslation(key);
            }
        });
    }
    getTranslation(key) {
        return this.translations[this.currentLanguage]?.[key] ||
            this.translations.en[key] ||
            key;
    }
    showLoading(show) {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.toggle('hidden', !show);
        }
    }
    showResults() {
        if (this.resultsContainer) {
            this.resultsContainer.classList.remove('hidden');
        }
    }
    hideResults() {
        if (this.resultsContainer) {
            this.resultsContainer.classList.add('hidden');
        }
    }
    showNoResults() {
        this.resultsList.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #888;">
        <p>${this.getTranslation('noResults')}</p>
      </div>
    `;
        this.showResults();
    }
    showError(message) {
        this.resultsList.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #ff6b6b;">
        <p>❌ ${message}</p>
      </div>
    `;
        this.showResults();
    }
    loadUserPreferences() {
        chrome.storage.local.get(['language', 'location'], (result) => {
            if (result.language) {
                this.currentLanguage = result.language;
                const languageSelect = document.getElementById('languageSelect');
                if (languageSelect) {
                    languageSelect.value = this.currentLanguage;
                }
            }
            if (result.location) {
                this.userLocation = result.location;
            }
            this.updateUILanguage();
        });
    }
    saveUserPreferences() {
        chrome.storage.local.set({
            language: this.currentLanguage,
            location: this.userLocation
        });
    }
}
// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GovernmentResourceApp();
});
