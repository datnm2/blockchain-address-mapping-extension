/**
 * @typedef {Object.<string, string>} WalletMapping
 * @typedef {{mappings: WalletMapping, enabled: boolean}} StorageData
 */

// Global variables
let walletMappings = {};
let isEnabled = true;
let observerInstance = null;

// CSS class to mark processed elements
const PROCESSED_CLASS = "wallet-mapped";

// Storage preference
const USE_LOCAL_STORAGE = true;

// Regex pattern for Ethereum addresses
const ADDRESS_PATTERN =
  /^(0x[a-fA-F0-9]{40}|0x[a-fA-F0-9]{6,10}\.{3}[a-fA-F0-9]{6,10})$/;

/**
 * Initialize content script
 */
async function initialize() {
  await loadMappings();

  if (isEnabled) {
    startReplacement();
  }

  // Listen for updates from popup
  chrome.runtime.onMessage.addListener(handleMessage);
}

/**
 * Handle messages from popup
 */
async function handleMessage(request, sender, sendResponse) {
  if (request.action === "refreshMappings") {
    await loadMappings();

    // Clear all processed marks
    document.querySelectorAll(`.${PROCESSED_CLASS}`).forEach((el) => {
      el.classList.remove(PROCESSED_CLASS);
      delete el.dataset.originalAddress;
    });

    if (isEnabled) {
      performReplacement();
    }
  }
}

/**
 * Load mappings from chunked storage
 */
async function loadMappings() {
  const storage = USE_LOCAL_STORAGE
    ? chrome.storage.local
    : chrome.storage.sync;

  return new Promise((resolve) => {
    // First get metadata
    storage.get(["mappings_metadata", "enabled"], (result) => {
      if (!result.mappings_metadata || !result.mappings_metadata.chunkCount) {
        // Try old format
        storage.get(["mappings", "enabled"], (oldResult) => {
          walletMappings = oldResult.mappings || {};
          isEnabled = oldResult.enabled !== false;
          resolve();
        });
        return;
      }

      // Get all chunks
      const chunkKeys = [];
      for (let i = 0; i < result.mappings_metadata.chunkCount; i++) {
        chunkKeys.push(`mappings_chunk_${i}`);
      }

      storage.get(chunkKeys, (chunksResult) => {
        // Merge all chunks
        walletMappings = {};
        for (const key of chunkKeys) {
          if (chunksResult[key]) {
            Object.assign(walletMappings, chunksResult[key]);
          }
        }

        isEnabled = result.enabled !== false;
        console.log(`Loaded ${Object.keys(walletMappings).length} mappings`);
        resolve();
      });
    });
  });
}

/**
 * Start the replacement process
 */
function startReplacement() {
  // Initial replacement
  performReplacement();

  // Set up observer for dynamic content
  setupMutationObserver();
}

/**
 * Perform replacement on visible address elements
 */
function performReplacement() {
  if (!isEnabled || Object.keys(walletMappings).length === 0) {
    return;
  }

  debugger;

  // Target only the most specific and common address containers
  const elements = document.querySelectorAll(`
    span[data-highlight-target]:not(.${PROCESSED_CLASS}),
    a[href*="/address/"]:not(.${PROCESSED_CLASS}) span:not(.${PROCESSED_CLASS}),
    a[href*="/address/"]:not(.${PROCESSED_CLASS}),
    td a[href*="/address/"]:not(.${PROCESSED_CLASS}),
    .hash-tag:not(.${PROCESSED_CLASS})
  `);

  // Also process address elements inside any insight iframe
  const insightIframes = document.querySelectorAll('iframe[id*="token"]');
  insightIframes.forEach((iframe) => {
    try {
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;
      const iframeElements = iframeDoc.querySelectorAll(`
            span[data-highlight-target]:not(.${PROCESSED_CLASS}),
            a[href*="/address/"]:not(.${PROCESSED_CLASS}) span:not(.${PROCESSED_CLASS}),
            a[href*="/address/"]:not(.${PROCESSED_CLASS}),
            td a[href*="/address/"]:not(.${PROCESSED_CLASS}),
            .hash-tag:not(.${PROCESSED_CLASS})
        `);
      Array.from(iframeElements).forEach(processAddressElement);
    } catch (e) {
      // Ignore cross-origin iframes
    }
  });

  // Process in batches for better performance
  const batchSize = 50;
  let index = 0;

  function processBatch() {
    const batch = Array.from(elements).slice(index, index + batchSize);
    batch.forEach(processAddressElement);

    index += batchSize;
    if (index < elements.length) {
      requestAnimationFrame(processBatch);
    }
  }

  processBatch();
}

/**
 * Process a single address element
 */
function processAddressElement(element) {
  // Mark as processed immediately
  element.classList.add(PROCESSED_CLASS);

  // Get the address from data attribute or text
  let address =
    element.dataset.highlightTarget ||
    element.getAttribute("data-highlight-target") ||
    "";

  // If no data attribute, check text
  if (!address) {
    const text = element.textContent.trim();
    if (ADDRESS_PATTERN.test(text)) {
      // Try to find full address from parent link
      const parentLink = element.closest('a[href*="/address/"]');
      if (parentLink) {
        const match = parentLink.href.match(/address\/(0x[a-fA-F0-9]{40})/i);
        if (match) {
          address = match[1];
        }
      }
    }
  }

  if (!address) return;

  // Normalize address
  const normalizedAddress = address.toLowerCase();

  // Check mapping
  const name = walletMappings[normalizedAddress];

  if (name) {
    // Replace text
    element.textContent = name;

    // Store original
    element.dataset.originalAddress = address;
    element.title = `Address: ${address}`;

    // Add class for styling
    element.classList.add("wallet-name");
  }
}

/**
 * Set up MutationObserver for dynamic content
 */
function setupMutationObserver() {
  if (observerInstance) {
    observerInstance.disconnect();
  }

  let debounceTimer = null;
   // Fallback: periodic scan for edge cases (e.g. innerHTML updates, AJAX, etc.)
  if (!window._walletMappingInterval) {
    window._walletMappingInterval = setInterval(() => {
      if (isEnabled) performReplacement();
    }, 3000); // every 3 seconds
  }

  observerInstance = new MutationObserver((mutations) => {
    // Quick check for relevant changes
    const hasRelevantChanges = mutations.some((mutation) => {
      if (mutation.type !== "childList" || !mutation.addedNodes.length) {
        return false;
      }

      return Array.from(mutation.addedNodes).some((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;

        const element = node;
        return (
          element.matches &&
          (element.matches("span[data-highlight-target]") ||
            element.matches(".hash-tag") ||
            element.querySelector?.("span[data-highlight-target]") ||
            element.querySelector?.(".hash-tag"))
        );
      });
    });

    if (!hasRelevantChanges) return;

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debugger;
      performReplacement();
    }, 2000);
  });

  // Observe body with limited scope
  observerInstance.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: false,
    attributes: false,
  });
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
