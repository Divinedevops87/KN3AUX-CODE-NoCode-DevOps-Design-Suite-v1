"use strict";
// Louisiana Government Resource Discovery App - Background Service Worker
// Handles API integrations, notifications, and offline caching
chrome.runtime.onInstalled.addListener(() => {
    console.log("✅ Louisiana Government Resource Discovery App Installed!");
    // Show welcome notification
    chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icons/icon-128.png",
        title: "🏛️ Louisiana Gov Resources",
        message: "Ready to help you find government resources and benefits! 🌟"
    });
    // Initialize default settings
    chrome.storage.local.set({
        language: 'en',
        location: 'Louisiana',
        notifications: true,
        cacheExpiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });
    // Set up periodic cache updates
    chrome.alarms.create('updateCache', {
        delayInMinutes: 60,
        periodInMinutes: 60
    });
});
// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'searchResources':
            handleResourceSearch(message.query, message.filters)
                .then(results => sendResponse({ success: true, data: results }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true; // Keep message channel open for async response
        case 'checkEligibility':
            handleEligibilityCheck(message.criteria)
                .then(eligibleResources => sendResponse({ success: true, data: eligibleResources }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
        case 'getLocationServices':
            handleLocationSearch(message.location)
                .then(services => sendResponse({ success: true, data: services }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
        case 'saveApplication':
            handleApplicationSave(message.applicationData)
                .then(result => sendResponse({ success: true, data: result }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
        case 'scheduleReminder':
            handleReminderSchedule(message.reminder)
                .then(result => sendResponse({ success: true, data: result }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
        default:
            sendResponse({ success: false, error: 'Unknown action' });
    }
});
// Handle cache update alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateCache') {
        updateResourceCache();
    }
});
// Government API integration functions
async function handleResourceSearch(query, filters) {
    try {
        // Check cache first
        const cachedResults = await getCachedResults(query, filters);
        if (cachedResults) {
            return cachedResults;
        }
        // Parallel API calls to multiple government services
        const apiPromises = [
            searchBenefitsGov(query, filters),
            searchLouisianaGov(query, filters),
            searchUSDAServices(query, filters),
            searchHUDServices(query, filters),
            searchVAServices(query, filters)
        ];
        const results = await Promise.allSettled(apiPromises);
        const combinedResults = results
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => result.value);
        // Cache results for future use
        await cacheResults(query, filters, combinedResults);
        return combinedResults;
    }
    catch (error) {
        console.error('Resource search error:', error);
        throw new Error('Failed to search government resources');
    }
}
async function handleEligibilityCheck(criteria) {
    try {
        // Process eligibility criteria against multiple program requirements
        const eligibilityPromises = [
            checkSNAPEligibility(criteria),
            checkMedicaidEligibility(criteria),
            checkHousingEligibility(criteria),
            checkVAEligibility(criteria),
            checkUnemploymentEligibility(criteria)
        ];
        const eligibilityResults = await Promise.allSettled(eligibilityPromises);
        const eligiblePrograms = eligibilityResults
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => result.value);
        return eligiblePrograms;
    }
    catch (error) {
        console.error('Eligibility check error:', error);
        throw new Error('Failed to check eligibility');
    }
}
async function handleLocationSearch(location) {
    try {
        // Search for local government services and offices
        const locationPromises = [
            findLocalDHHOffices(location),
            findLocalWICOffices(location),
            findLocalHousingAuthorities(location),
            findLocalVAFacilities(location),
            findLocalWorkforceOffices(location)
        ];
        const locationResults = await Promise.allSettled(locationPromises);
        const localServices = locationResults
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => result.value);
        return localServices;
    }
    catch (error) {
        console.error('Location search error:', error);
        throw new Error('Failed to find local services');
    }
}
async function handleApplicationSave(applicationData) {
    try {
        // Save application data to local storage with encryption
        const encryptedData = await encryptApplicationData(applicationData);
        const applicationId = generateApplicationId();
        await chrome.storage.local.set({
            [`application_${applicationId}`]: {
                id: applicationId,
                data: encryptedData,
                status: 'draft',
                created: Date.now(),
                updated: Date.now()
            }
        });
        return { applicationId, status: 'saved' };
    }
    catch (error) {
        console.error('Application save error:', error);
        throw new Error('Failed to save application');
    }
}
async function handleReminderSchedule(reminder) {
    try {
        // Schedule notifications for deadlines and appointments
        const alarmName = `reminder_${reminder.id}`;
        chrome.alarms.create(alarmName, {
            when: reminder.timestamp
        });
        await chrome.storage.local.set({
            [`reminder_${reminder.id}`]: reminder
        });
        return { reminderId: reminder.id, status: 'scheduled' };
    }
    catch (error) {
        console.error('Reminder schedule error:', error);
        throw new Error('Failed to schedule reminder');
    }
}
// API integration functions (mock implementations for demo)
async function searchBenefitsGov(query, filters) {
    // Mock implementation - in production, this would call actual Benefits.gov API
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 'benefits-001',
                    title: 'Federal SNAP Benefits',
                    description: 'Food assistance for low-income families',
                    source: 'Benefits.gov',
                    category: 'food'
                }
            ]);
        }, 500);
    });
}
async function searchLouisianaGov(query, filters) {
    // Mock implementation - in production, this would call actual Louisiana.gov API
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 'la-001',
                    title: 'Louisiana TANF Program',
                    description: 'Temporary assistance for needy families',
                    source: 'Louisiana.gov',
                    category: 'benefits'
                }
            ]);
        }, 600);
    });
}
async function searchUSDAServices(query, filters) {
    // Mock implementation - in production, this would call actual USDA API
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 'usda-001',
                    title: 'WIC Program Louisiana',
                    description: 'Special nutrition program for women, infants, and children',
                    source: 'USDA',
                    category: 'food'
                }
            ]);
        }, 400);
    });
}
async function searchHUDServices(query, filters) {
    // Mock implementation
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 'hud-001',
                    title: 'Section 8 Housing Louisiana',
                    description: 'Rental assistance program',
                    source: 'HUD',
                    category: 'housing'
                }
            ]);
        }, 700);
    });
}
async function searchVAServices(query, filters) {
    // Mock implementation
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 'va-001',
                    title: 'VA Disability Benefits',
                    description: 'Compensation for service-connected disabilities',
                    source: 'VA',
                    category: 'veterans'
                }
            ]);
        }, 550);
    });
}
// Eligibility check functions
async function checkSNAPEligibility(criteria) {
    // Simplified eligibility logic
    if (criteria.income && criteria.income < 2000) {
        return [{ program: 'SNAP', eligible: true, reason: 'Income qualifies' }];
    }
    return [];
}
async function checkMedicaidEligibility(criteria) {
    if (criteria.income && criteria.income < 3000) {
        return [{ program: 'Medicaid', eligible: true, reason: 'Income qualifies' }];
    }
    return [];
}
async function checkHousingEligibility(criteria) {
    if (criteria.income && criteria.income < 2500) {
        return [{ program: 'Housing Assistance', eligible: true, reason: 'Income qualifies' }];
    }
    return [];
}
async function checkVAEligibility(criteria) {
    if (criteria.veteranStatus) {
        return [{ program: 'VA Benefits', eligible: true, reason: 'Veteran status confirmed' }];
    }
    return [];
}
async function checkUnemploymentEligibility(criteria) {
    if (criteria.employmentStatus === 'unemployed') {
        return [{ program: 'Unemployment Insurance', eligible: true, reason: 'Employment status qualifies' }];
    }
    return [];
}
// Location service functions
async function findLocalDHHOffices(location) {
    return [
        { name: 'Louisiana DHH - Lake Charles Office', address: '123 Main St, Lake Charles, LA', phone: '(337) 555-0100' }
    ];
}
async function findLocalWICOffices(location) {
    return [
        { name: 'WIC Office - Calcasieu Parish', address: '456 Oak Ave, Lake Charles, LA', phone: '(337) 555-0200' }
    ];
}
async function findLocalHousingAuthorities(location) {
    return [
        { name: 'Lake Charles Housing Authority', address: '789 Pine St, Lake Charles, LA', phone: '(337) 555-0300' }
    ];
}
async function findLocalVAFacilities(location) {
    return [
        { name: 'VA Medical Center - Lake Charles', address: '321 Veteran Blvd, Lake Charles, LA', phone: '(337) 555-0400' }
    ];
}
async function findLocalWorkforceOffices(location) {
    return [
        { name: 'Louisiana Workforce Commission - Calcasieu Parish', address: '654 Work St, Lake Charles, LA', phone: '(337) 555-0500' }
    ];
}
// Cache management functions
async function getCachedResults(query, filters) {
    const cacheKey = `cache_${query}_${JSON.stringify(filters)}`;
    const result = await chrome.storage.local.get([cacheKey]);
    if (result[cacheKey] && result[cacheKey].expiry > Date.now()) {
        return result[cacheKey].data;
    }
    return null;
}
async function cacheResults(query, filters, results) {
    const cacheKey = `cache_${query}_${JSON.stringify(filters)}`;
    const cacheData = {
        data: results,
        expiry: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
    };
    await chrome.storage.local.set({ [cacheKey]: cacheData });
}
async function updateResourceCache() {
    // Periodically update cached government resources
    console.log('Updating resource cache...');
    // Implementation would refresh commonly searched resources
}
// Utility functions
async function encryptApplicationData(data) {
    // Simple base64 encoding for demo - in production, use proper encryption
    return btoa(JSON.stringify(data));
}
function generateApplicationId() {
    return `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
// Notification handling for reminders
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name.startsWith('reminder_')) {
        const reminderId = alarm.name.replace('reminder_', '');
        chrome.storage.local.get([`reminder_${reminderId}`]).then(result => {
            const reminder = result[`reminder_${reminderId}`];
            if (reminder) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'assets/icons/icon-128.png',
                    title: '📅 Government Resource Reminder',
                    message: reminder.message
                });
            }
        });
    }
});
