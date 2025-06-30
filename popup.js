document.addEventListener('DOMContentLoaded', function() {
    const csvFileInput = document.getElementById('csvFile');
    const loadCsvBtn = document.getElementById('loadCsv');
    const csvStatus = document.getElementById('csvStatus');
    const replaceMode = document.getElementById('replaceMode');
    const enableExtension = document.getElementById('enableExtension');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const addressCount = document.getElementById('addressCount');
    const clearDataBtn = document.getElementById('clearData');
    const refreshPageBtn = document.getElementById('refreshPage');

    // Load settings when popup opens
    loadSettings();
    loadAddressCount();

    // File input change event
    csvFileInput.addEventListener('change', function(e) {
        if (e.target.files[0]) {
            loadCsvBtn.disabled = false;
            loadCsvBtn.textContent = `Tải "${e.target.files[0].name}"`;
        }
    });

    // Load CSV button
    loadCsvBtn.addEventListener('click', function() {
        const file = csvFileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const csv = e.target.result;
                const addresses = parseCSV(csv);
                
                if (addresses.length === 0) {
                    showStatus('Không tìm thấy dữ liệu hợp lệ trong file CSV', 'error');
                    return;
                }

                // Save to chrome storage
                chrome.storage.local.set({
                    addressMap: addresses,
                    lastUpdated: new Date().toISOString()
                }, function() {
                    showStatus(`Đã tải ${addresses.length} địa chỉ thành công!`, 'success');
                    loadAddressCount();
                    
                    // Refresh current tab
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.reload(tabs[0].id);
                    });
                });

            } catch (error) {
                showStatus('Lỗi khi đọc file CSV: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    });

    // Save settings
    saveSettingsBtn.addEventListener('click', function() {
        const settings = {
            replaceMode: replaceMode.checked,
            enabled: enableExtension.checked
        };

        chrome.storage.local.set({settings: settings}, function() {
            showStatus('Đã lưu cài đặt!', 'success');
            
            // Refresh current tab to apply new settings
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        });
    });

    // Clear all data
    clearDataBtn.addEventListener('click', function() {
        if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu mapping?')) {
            chrome.storage.local.clear(function() {
                showStatus('Đã xóa tất cả dữ liệu!', 'success');
                loadAddressCount();
                replaceMode.checked = false;
                enableExtension.checked = true;
            });
        }
    });

    // Refresh current page
    refreshPageBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
            window.close();
        });
    });

    function parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        const addresses = {};
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Handle CSV with or without quotes
            const parts = line.split(',').map(part => 
                part.trim().replace(/^["']|["']$/g, '')
            );
            
            if (parts.length >= 2) {
                const address = parts[0].toLowerCase();
                const name = parts.slice(1).join(',').trim();
                
                // Basic validation for Ethereum-like addresses
                if (address.length >= 40 && name) {
                    addresses[address] = name;
                }
            }
        }
        
        return addresses;
    }

    function loadSettings() {
        chrome.storage.local.get(['settings'], function(result) {
            if (result.settings) {
                replaceMode.checked = result.settings.replaceMode || false;
                enableExtension.checked = result.settings.enabled !== false;
            }
        });
    }

    function loadAddressCount() {
        chrome.storage.local.get(['addressMap'], function(result) {
            const count = result.addressMap ? Object.keys(result.addressMap).length : 0;
            addressCount.textContent = count;
        });
    }

    function showStatus(message, type) {
        csvStatus.innerHTML = `<div class="status ${type}">${message}</div>`;
        setTimeout(() => {
            csvStatus.innerHTML = '';
        }, 3000);
    }

    // Drag and drop functionality
    const fileInput = document.querySelector('.file-input');
    
    fileInput.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#007cba';
        this.style.backgroundColor = '#f0f8ff';
    });

    fileInput.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#ccc';
        this.style.backgroundColor = '#f9f9f9';
    });

    fileInput.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#ccc';
        this.style.backgroundColor = '#f9f9f9';
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'text/csv') {
            csvFileInput.files = files;
            loadCsvBtn.disabled = false;
            loadCsvBtn.textContent = `Tải "${files[0].name}"`;
        }
    });
});