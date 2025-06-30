// Background service worker for Address Mapper extension

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Set default settings on first install
        chrome.storage.local.set({
            settings: {
                enabled: true,
                replaceMode: false
            }
        });
        
        // Show welcome notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'Address Mapper đã được cài đặt!',
            message: 'Click vào icon extension để import file CSV và bắt đầu mapping addresses.'
        });
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Open popup (this is handled automatically by manifest)
});

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const url = new URL(tab.url);
        const supportedDomains = [
            'arbiscan.io',
            'etherscan.io', 
            'bscscan.com',
            'polygonscan.com'
        ];
        
        const isSupported = supportedDomains.some(domain => 
            url.hostname.includes(domain)
        );
        
        if (isSupported) {
            try {
                // Check if extension is enabled
                const result = await chrome.storage.local.get(['settings']);
                const settings = result.settings || { enabled: true };
                
                if (settings.enabled) {
                    // Ensure content script is injected
                    await chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ['content.js']
                    });
                }
            } catch (error) {
                console.log('Content script already injected or error:', error);
            }
        }
    }
});

// Handle storage changes and notify content scripts
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        // Notify all tabs about storage changes
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                if (tab.url && (
                    tab.url.includes('arbiscan.io') ||
                    tab.url.includes('etherscan.io') ||
                    tab.url.includes('bscscan.com') ||
                    tab.url.includes('polygonscan.com')
                )) {
                    chrome.tabs.sendMessage(tab.id, {
                        type: 'STORAGE_CHANGED',
                        changes: changes
                    }).catch(() => {
                        // Ignore errors if content script not loaded
                    });
                }
            });
        });
    }
});

// Context menu for quick actions
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'copyAddress',
        title: 'Copy original address',
        contexts: ['selection']
    });
    
    chrome.contextMenus.create({
        id: 'addMapping',
        title: 'Add to address mapping',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'copyAddress') {
        // Extract address from selection
        const text = info.selectionText;
        const addressMatch = text.match(/0x[a-fA-F0-9]{40}/);
        if (addressMatch) {
            // Copy to clipboard
            chrome.tabs.sendMessage(tab.id, {
                type: 'COPY_TO_CLIPBOARD',
                text: addressMatch[0]
            });
        }
    } else if (info.menuItemId === 'addMapping') {
        // Open popup for quick add
        chrome.action.openPopup();
    }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_STORAGE') {
        chrome.storage.local.get(request.keys, (result) => {
            sendResponse(result);
        });
        return true; // Keep message channel open
    }
    
    if (request.type === 'SET_STORAGE') {
        chrome.storage.local.set(request.data, () => {
            sendResponse({ success: true });
        });
        return true;
    }
    
    if (request.type === 'SHOW_NOTIFICATION') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: request.title || 'Address Mapper',
            message: request.message
        });
    }
});

// Badge management
chrome.storage.local.get(['addressMap'], (result) => {
    const count = result.addressMap ? Object.keys(result.addressMap).length : 0;
    if (count > 0) {
        chrome.action.setBadgeText({ text: count.toString() });
        chrome.action.setBadgeBackgroundColor({ color: '#007cba' });
    }
});

// Update badge when storage changes
chrome.storage.onChanged.addListener((changes) => {
    if (changes.addressMap) {
        const count = changes.addressMap.newValue ? 
            Object.keys(changes.addressMap.newValue).length : 0;
        
        if (count > 0) {
            chrome.action.setBadgeText({ text: count.toString() });
            chrome.action.setBadgeBackgroundColor({ color: '#007cba' });
        } else {
            chrome.action.setBadgeText({ text: '' });
        }
    }
});