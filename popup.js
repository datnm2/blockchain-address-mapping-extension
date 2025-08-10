/**
 * @typedef {Object.<string, string>} WalletMapping
 * @typedef {{mappings: WalletMapping, enabled: boolean}} StorageData
 */

// Constants for storage management
const CHUNK_SIZE = 100; // Store 100 mappings per chunk
const USE_LOCAL_STORAGE = true; // Use local storage for larger capacity

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePopup);

/**
 * Initialize the popup interface and load existing data
 */
async function initializePopup() {
  await loadAndDisplayMappings();
  setupEventListeners();
  updateToggleButtonState();
}

/**
 * Set up all event listeners for popup interactions
 */
function setupEventListeners() {
  // CSV import handler
  const importBtn = document.getElementById('importBtn');
  importBtn.addEventListener('click', handleCsvImport);

  // Manual add handler
  const addBtn = document.getElementById('addBtn');
  addBtn.addEventListener('click', handleManualAdd);

  // Toggle enable/disable handler
  const toggleBtn = document.getElementById('toggleBtn');
  toggleBtn.addEventListener('click', handleToggleExtension);

  // Clear all mappings handler
  const clearBtn = document.getElementById('clearBtn');
  clearBtn.addEventListener('click', handleClearAll);
}

/**
 * Handle CSV file import
 */
async function handleCsvImport() {
  const fileInput = document.getElementById('csvFile');
  const statusDiv = document.getElementById('importStatus');
  
  if (!fileInput.files || fileInput.files.length === 0) {
    statusDiv.textContent = 'Please select a CSV file';
    statusDiv.style.color = '#f44336';
    return;
  }

  const file = fileInput.files[0];
  
  try {
    statusDiv.textContent = 'Importing...';
    statusDiv.style.color = '#2196F3';
    
    const csvContent = await readFileAsText(file);
    const mappings = parseCsvToMappings(csvContent);
    
    // Get existing mappings
    const existingData = await getStorageData();
    const mergedMappings = { ...existingData.mappings, ...mappings };
    
    // Save with chunking for large datasets
    await saveMappingsChunked(mergedMappings);
    await loadAndDisplayMappings();
    
    const totalCount = Object.keys(mergedMappings).length;
    statusDiv.textContent = `Imported ${Object.keys(mappings).length} new mappings. Total: ${totalCount}`;
    statusDiv.style.color = '#4CAF50';
    
    // Clear file input
    fileInput.value = '';
  } catch (error) {
    console.error('Import error:', error);
    statusDiv.textContent = `Error: ${error.message}`;
    statusDiv.style.color = '#f44336';
  }
}

/**
 * Read file content as text
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Parse CSV content into wallet mappings
 */
function parseCsvToMappings(csvContent) {
  const lines = csvContent.trim().split('\n');
  const mappings = {};
  
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length < 2) continue;
    
    const address = parts[0].trim();
    const name = parts.slice(1).join(',').trim(); // Handle names with commas
    
    if (!address || !name) continue;
    
    // Skip header row
    if (address.toLowerCase() === 'address' && name.toLowerCase() === 'name') continue;
    
    const normalizedAddress = address.toLowerCase();
    
    // Validate Ethereum address
    if (normalizedAddress.startsWith('0x') && normalizedAddress.length === 42) {
      mappings[normalizedAddress] = name;
    }
  }
  
  return mappings;
}

/**
 * Save mappings in chunks to avoid quota limits
 */
async function saveMappingsChunked(mappings) {
  const storage = USE_LOCAL_STORAGE ? chrome.storage.local : chrome.storage.sync;
  
  // Clear old chunks first
  await clearStorageChunks();
  
  // Convert mappings object to entries array
  const entries = Object.entries(mappings);
  const chunks = [];
  
  // Split into chunks
  for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
    chunks.push(entries.slice(i, i + CHUNK_SIZE));
  }
  
  // Save each chunk
  const savePromises = chunks.map((chunk, index) => {
    const chunkData = Object.fromEntries(chunk);
    return new Promise((resolve, reject) => {
      storage.set({ [`mappings_chunk_${index}`]: chunkData }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  });
  
  // Save metadata
  savePromises.push(new Promise((resolve, reject) => {
    storage.set({ 
      mappings_metadata: {
        chunkCount: chunks.length,
        totalCount: entries.length,
        lastUpdated: Date.now()
      }
    }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  }));
  
  await Promise.all(savePromises);
  
  // Notify content scripts
  notifyContentScripts();
}

/**
 * Clear old storage chunks
 */
async function clearStorageChunks() {
  const storage = USE_LOCAL_STORAGE ? chrome.storage.local : chrome.storage.sync;
  
  return new Promise((resolve) => {
    storage.get('mappings_metadata', (result) => {
      if (result.mappings_metadata && result.mappings_metadata.chunkCount) {
        const keysToRemove = [];
        for (let i = 0; i < result.mappings_metadata.chunkCount; i++) {
          keysToRemove.push(`mappings_chunk_${i}`);
        }
        keysToRemove.push('mappings_metadata');
        
        storage.remove(keysToRemove, resolve);
      } else {
        // Also try to remove old non-chunked data
        storage.remove(['mappings'], resolve);
      }
    });
  });
}

/**
 * Get all mappings from chunked storage
 */
async function getStorageData() {
  const storage = USE_LOCAL_STORAGE ? chrome.storage.local : chrome.storage.sync;
  
  return new Promise((resolve) => {
    // First get metadata
    storage.get(['mappings_metadata', 'enabled'], (result) => {
      if (!result.mappings_metadata || !result.mappings_metadata.chunkCount) {
        // Try old format
        storage.get(['mappings', 'enabled'], (oldResult) => {
          resolve({
            mappings: oldResult.mappings || {},
            enabled: oldResult.enabled !== false
          });
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
        let allMappings = {};
        for (const key of chunkKeys) {
          if (chunksResult[key]) {
            allMappings = { ...allMappings, ...chunksResult[key] };
          }
        }
        
        resolve({
          mappings: allMappings,
          enabled: result.enabled !== false
        });
      });
    });
  });
}

/**
 * Handle manual address-name addition
 */
async function handleManualAdd() {
  const addressInput = document.getElementById('addressInput');
  const nameInput = document.getElementById('nameInput');
  
  const address = addressInput.value.trim().toLowerCase();
  const name = nameInput.value.trim();
  
  if (!address || !name) {
    alert('Please enter both address and name');
    return;
  }
  
  if (!address.startsWith('0x') || address.length !== 42) {
    alert('Please enter a valid Ethereum address (0x...)');
    return;
  }
  
  // Add to storage
  const data = await getStorageData();
  data.mappings[address] = name;
  await saveMappingsChunked(data.mappings);
  
  // Clear inputs and refresh display
  addressInput.value = '';
  nameInput.value = '';
  await loadAndDisplayMappings();
}

/**
 * Load and display current mappings
 */
async function loadAndDisplayMappings() {
  const data = await getStorageData();
  const listDiv = document.getElementById('mappingsList');
  const mappingCount = Object.keys(data.mappings).length;
  
  if (mappingCount === 0) {
    listDiv.innerHTML = '<div style="color: #999; text-align: center;">No mappings yet</div>';
    return;
  }
  
  // Show count and limited list for performance
  const maxDisplay = 100;
  const entries = Object.entries(data.mappings).slice(0, maxDisplay);
  
  let html = `<div style="padding: 5px; background: #e3f2fd; margin-bottom: 10px;">
    <strong>Total mappings: ${mappingCount}</strong>
    ${mappingCount > maxDisplay ? ` (showing first ${maxDisplay})` : ''}
  </div>`;
  
  html += entries.map(([address, name]) => createMappingItemHtml(address, name)).join('');
  
  listDiv.innerHTML = html;
  
  // Add delete button handlers
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', handleDeleteMapping);
  });
}

/**
 * Create HTML for a single mapping item
 */
function createMappingItemHtml(address, name) {
  const displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  return `
    <div class="mapping-item">
      <div style="flex: 1; min-width: 0;">
        <div class="mapping-name">${name}</div>
        <div class="mapping-address" title="${address}">${displayAddress}</div>
      </div>
      <button class="delete-btn" data-address="${address}">×</button>
    </div>
  `;
}

/**
 * Handle deletion of a single mapping
 */
async function handleDeleteMapping(event) {
  const button = event.target;
  const address = button.dataset.address;
  
  if (!address) return;
  
  const data = await getStorageData();
  delete data.mappings[address];
  await saveMappingsChunked(data.mappings);
  await loadAndDisplayMappings();
}

/**
 * Toggle extension enabled/disabled state
 */
async function handleToggleExtension() {
  const storage = USE_LOCAL_STORAGE ? chrome.storage.local : chrome.storage.sync;
  const data = await getStorageData();
  data.enabled = !data.enabled;
  
  await new Promise((resolve) => {
    storage.set({ enabled: data.enabled }, resolve);
  });
  
  updateToggleButtonState();
  notifyContentScripts();
}

/**
 * Update toggle button text based on current state
 */
async function updateToggleButtonState() {
  const data = await getStorageData();
  const toggleBtn = document.getElementById('toggleBtn');
  
  toggleBtn.textContent = data.enabled ? 'Disable' : 'Enable';
  toggleBtn.style.background = data.enabled ? '#4CAF50' : '#9E9E9E';
}

/**
 * Clear all mappings after confirmation
 */
async function handleClearAll() {
  const data = await getStorageData();
  const count = Object.keys(data.mappings).length;
  
  if (count > 0 && !confirm(`Are you sure you want to delete all ${count} mappings?`)) {
    return;
  }
  
  await clearStorageChunks();
  await loadAndDisplayMappings();
}

/**
 * Notify all content scripts to refresh their mappings
 */
function notifyContentScripts() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'refreshMappings' })
          .catch(() => {
            // Ignore errors for tabs without content script
          });
      }
    });
  });
}

/**
 * Export mappings to CSV
 */
async function exportMappings() {
  const data = await getStorageData();
  const entries = Object.entries(data.mappings);
  
  if (entries.length === 0) {
    alert('No mappings to export');
    return;
  }
  
  let csv = 'address,name\n';
  entries.forEach(([address, name]) => {
    // Escape commas in name
    const escapedName = name.includes(',') ? `"${name}"` : name;
    csv += `${address},${escapedName}\n`;
  });
  
  // Create download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wallet_mappings_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}