// Content script for blockchain address mapping
class AddressMapper {
    constructor() {
        this.addressMap = {};
        this.settings = {
            enabled: true,
            replaceMode: false
        };
        this.processed = new Set();
        this.init();
    }

    async init() {
        await this.loadData();
        if (this.settings.enabled) {
            this.startMapping();
        }
    }

    async loadData() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['addressMap', 'settings'], (result) => {
                this.addressMap = result.addressMap || {};
                this.settings = {
                    enabled: result.settings?.enabled !== false,
                    replaceMode: result.settings?.replaceMode || false
                };
                resolve();
            });
        });
    }

    startMapping() {
        // Initial mapping
        this.mapAddresses();
        
        // Watch for dynamic content changes
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                }
            });
            
            if (shouldProcess) {
                setTimeout(() => this.mapAddresses(), 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check periodically for SPAs
        setInterval(() => this.mapAddresses(), 2000);
    }

    mapAddresses() {
        // Common selectors for blockchain explorers
        const selectors = [
            'a[href*="/address/"]',
            'a[href*="/tx/"]',
            '.hash-tag',
            '.text-monospace',
            '[data-highlight-target]',
            '.d-flex.align-items-center a',
            'span[title*="0x"]',
            'a[title*="0x"]',
            '.text-truncate',
            '.hash',
            '.address'
        ];

        const elements = document.querySelectorAll(selectors.join(','));
        
        elements.forEach(element => {
            this.processElement(element);
        });

        // Also process text nodes that might contain addresses
        this.processTextNodes();
    }

    processElement(element) {
        if (this.processed.has(element)) return;
        
        const text = element.textContent || element.innerText || '';
        const href = element.href || '';
        
        // Extract address from text or href
        let address = this.extractAddress(text) || this.extractAddress(href);
        
        if (address && this.addressMap[address.toLowerCase()]) {
            this.addMapping(element, address);
            this.processed.add(element);
        }
    }

    processTextNodes() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script and style nodes
                    const parent = node.parentNode;
                    if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    // Skip if already processed
                    if (this.processed.has(parent)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    // Check if text contains address-like pattern
                    const text = node.textContent;
                    if (this.containsAddress(text)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            this.processTextNode(node);
        }
    }

    processTextNode(textNode) {
        const text = textNode.textContent;
        const addresses = this.extractAllAddresses(text);
        
        if (addresses.length === 0) return;

        let hasMapping = false;
        for (const addr of addresses) {
            if (this.addressMap[addr.toLowerCase()]) {
                hasMapping = true;
                break;
            }
        }

        if (hasMapping) {
            this.addMappingToTextNode(textNode, addresses);
            this.processed.add(textNode.parentNode);
        }
    }

    addMappingToTextNode(textNode, addresses) {
        const parent = textNode.parentNode;
        let html = textNode.textContent;

        addresses.forEach(address => {
            const friendlyName = this.addressMap[address.toLowerCase()];
            if (friendlyName) {
                const regex = new RegExp(address.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                
                if (this.settings.replaceMode) {
                    html = html.replace(regex, `<span class="address-mapped" title="${address}">${friendlyName}</span>`);
                } else {
                    html = html.replace(regex, `<span class="address-with-label">${address} <span class="address-label" title="${address}">(${friendlyName})</span></span>`);
                }
            }
        });

        if (html !== textNode.textContent) {
            const wrapper = document.createElement('span');
            wrapper.innerHTML = html;
            parent.replaceChild(wrapper, textNode);
        }
    }

    addMapping(element, address) {
        const friendlyName = this.addressMap[address.toLowerCase()];
        
        if (this.settings.replaceMode) {
            // Replace the address completely
            element.setAttribute('title', address);
            element.innerHTML = `<span class="address-mapped">${friendlyName}</span>`;
        } else {
            // Add label next to address
            if (!element.querySelector('.address-label')) {
                const label = document.createElement('span');
                label.className = 'address-label';
                label.title = address;
                label.textContent = ` (${friendlyName})`;
                element.appendChild(label);
                element.classList.add('address-with-label');
            }
        }
    }

    extractAddress(text) {
        // Match Ethereum-style addresses (0x followed by 40 hex characters)
        const match = text.match(/0x[a-fA-F0-9]{40}/);
        return match ? match[0] : null;
    }

    extractAllAddresses(text) {
        const matches = text.match(/0x[a-fA-F0-9]{40}/g);
        return matches || [];
    }

    containsAddress(text) {
        return /0x[a-fA-F0-9]{40}/.test(text);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AddressMapper();
    });
} else {
    new AddressMapper();
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && (changes.addressMap || changes.settings)) {
        // Reload the page to apply new changes
        window.location.reload();
    }
});