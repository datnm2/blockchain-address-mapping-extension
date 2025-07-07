// Prevent double declaration of AddressMapper
if (!window.__AddressMapperLoaded) {
    window.__AddressMapperLoaded = true;

    // Content script for blockchain address mapping
    class AddressMapper {
        constructor() {
            this.addressMap = {};
            this.settings = {
                enabled: true,
                replaceMode: false,
                debug: false
            };
            this.processed = new Set();
            this.mappedAdresses = new Set();
            this.mappingTimeout = null;
            this.intervalId = null;
            this.init();
        }

        async init() {
            await this.loadData();
            if (this.settings.enabled) {
                this.log('Extension enabled, starting mapping...');
                this.log(`Loaded ${Object.keys(this.addressMap).length} addresses`);
                this.startMapping();
            } else {
                this.log('Extension disabled');
            }
        }

        log(message) {
            if (this.settings.debug) {
                console.log(`[AddressMapper] ${message}`);
            }
        }

        async loadData() {
            return new Promise((resolve) => {
                chrome.storage.local.get(['addressMap', 'settings'], (result) => {
                    this.addressMap = result.addressMap || {};
                    this.settings = {
                        enabled: result.settings?.enabled !== false,
                        replaceMode: result.settings?.replaceMode || false,
                        debug: result.settings?.debug || false
                    };

                    this.log(`Settings loaded: ${JSON.stringify(this.settings)}`);
                    resolve();
                });
            });
        }

        startMapping() {
            // Initial mapping with delay to ensure page is loaded
            setTimeout(() => this.mapAddresses(), 500);

            // Watch for dynamic content changes
            const observer = new MutationObserver((mutations) => {
                let shouldProcess = false;
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check if any added nodes contain addresses
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                const text = node.textContent || '';
                                if (this.containsAddress(text)) {
                                    shouldProcess = true;
                                }
                            }
                        });
                    }
                });

                if (shouldProcess) {
                    // Debounce processing to avoid too many calls
                    clearTimeout(this.mappingTimeout);
                    this.mappingTimeout = setTimeout(() => this.mapAddresses(), 300);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Also check periodically for SPAs and missed elements
            this.intervalId = setInterval(() => {
                this.mapAddresses();
            }, 10000);

            // Listen for page navigation in SPAs
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    // Reset processed elements on navigation
                    this.processed.clear();
                    this.mappedAdresses.clear();
                    setTimeout(() => this.mapAddresses(), 1000);
                }
            }).observe(document, { subtree: true, childList: true });
        }

        mapAddresses() {
            console.log('Mapping addresses...');
            // More specific selectors for blockchain explorers
            const selectors = [
                // Links with addresses
                'a[href*="/address/0x"]',
                'a[href*="/tx/0x"]',
                'a[href*="/token/0x"]',

                // Common classes
                // '.hash-tag',
                // '.text-monospace',
                // '.font-monospace',
                '[data-highlight-target]',
                // '.text-truncate',
                // '.hash',
                // '.address',

                // Any element with address-like content
                '[title*="0x"]',
                'span[data-original-title*="0x"]',

                // General text elements that might contain addresses
                'span:not(.address-label):not(.address-mapped)',
                'div:not(.address-label):not(.address-mapped)',
                'td:not(.address-label):not(.address-mapped)'
            ];

            // Process elements with specific selectors first
            const elements = document.querySelectorAll(selectors.join(','));
            elements.forEach(element => {
                this.processElement(element);
            });
            console.log(`Processed ${elements.length} elements with addresses, labeled ${this.processed.size} elements.`)
        }

        processElement(element) {
            if (this.processed.has(element)) return;

            // Get text content
            let text = element.textContent || element.innerText || '';
            const href = element.href || '';

            // Extract address from text or href or attribute
            let address = this.extractAddress(text) || this.extractAddress(href) || this.extractAddress(element.getAttribute('data-highlight-target'));

            if (address) {
                const friendlyName = this.addressMap[address.toLowerCase()];
                if (friendlyName) {
                    this.addMapping(element, address, friendlyName);
                    this.processed.add(element);
                    return;
                }
            }
        }

        addMapping(element, address, friendlyName) {

            if (this.settings.replaceMode) {
                // Replace the address completely
                element.setAttribute('title', address);
                element.classList.add('address-mapped');

                // If it's a link, preserve the href

                element.textContent = friendlyName;
            } else {
                // Always replace the text of <a> with mapping label, not just add label
                if (element.tagName === 'A') {
                    element.setAttribute('title', address);
                    element.classList.add('address-mapped');
                    element.innerHTML = `<span class="address-mapped">${friendlyName}</span>`;
                } else {
                    // Add label next to address (giữ nguyên logic cũ cho các element khác)
                    if (!element.querySelector('.address-label')) {
                        element.classList.add('address-with-label');

                        // Create label element
                        const label = document.createElement('span');
                        label.className = 'address-label';
                        label.title = address;
                        label.textContent = friendlyName;

                        // Add label after the address text
                        if (element.children.length === 0) {
                            element.appendChild(document.createTextNode(' '));
                            element.appendChild(label);
                        } else {
                            // For complex elements, add at the end
                            element.appendChild(label);
                        }
                    }
                }
            }
        }

        extractAddress(text) {
            // Match Ethereum-style addresses (0x followed by 40 hex characters)
            const match = text?.match(/0x[a-fA-F0-9]{40}/);
            return match ? match[0] : null;
        }

        containsAddress(text) {
            const flexibleShortenedAddressRegex = /^0x[0-9A-Fa-f]{6,10}\.{3}[0-9A-Fa-f]{6,10}$/;

            return /0x[a-fA-F0-9]{40}/.test(text) || flexibleShortenedAddressRegex.test(text);
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
}