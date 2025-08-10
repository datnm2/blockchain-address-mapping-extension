# 🏷️ Blockchain Address Mapping Extension (English)

This Chrome extension automatically labels or replaces blockchain addresses with friendly names, based on a user-imported CSV file. It works directly on popular blockchain explorers such as Arbiscan, Etherscan, BSCScan, and PolygonScan.

## ✨ Main Features

- **Automatic mapping**: Finds and replaces or labels blockchain addresses on supported sites, using your CSV data.
- **Multi-explorer support**: Works on Arbiscan, Etherscan, BSCScan, PolygonScan (and can be extended).
- **CSV import**: Import a CSV file with the format `address,name` for mapping.
- **Two display modes**:
  - **Label mode** (default): Adds a friendly name label next to the original address.
  - **Replace mode**: Replaces the address entirely with the friendly name (hover to see the original address).
- **Realtime DOM update**: Applies mapping even to dynamically loaded content (SPA, Ajax, etc.).
- **Local storage**: All mapping data and settings are stored locally in Chrome storage, never sent externally.
- **Popup UI**: Import CSV, choose display mode, enable/disable extension, and see mapping stats.

## 🚀 Installation

1. **Download the extension**:
   - Clone or download the entire extension source code into a separate folder.
2. **Load the extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension folder
   - The extension icon will appear in the toolbar
3. **Grant permissions**:
   - The extension will request access to supported explorer sites (etherscan.io, bscscan.com, etc.)
   - Click "Allow" if prompted

## 📋 Usage Guide

### 1. Prepare your CSV file
Create a CSV file with the following format:
```csv
address,name
0x1234567890123456789012345678901234567890,Binance Hot Wallet
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,Uniswap V3 Router
```
**Notes:**
- Address must start with 0x and be 40 hex characters
- Friendly name can contain commas
- Address matching is case-insensitive

### 2. Import CSV
1. Click the extension icon in the Chrome toolbar
2. In the popup, select or drag-and-drop your CSV file
3. Click "Import CSV" to load your mappings
4. The number of successful mappings will be displayed

### 3. Configure display mode
- **Label mode**: Adds a friendly name label next to the address (e.g. `0x1234...5678 (Binance Hot Wallet)`)
- **Replace mode**: Replaces the address with the friendly name (hover to see the original address)
- You can enable/disable the extension and save settings in the popup

### 4. Use the extension
1. Visit any supported blockchain explorer
2. The extension will automatically label or replace addresses according to your settings
3. Hover over a label to see the original address (in Replace mode)

## 🌐 Supported Blockchain Explorers

- **Arbitrum**: arbiscan.io
- **Ethereum**: etherscan.io
- **BSC**: bscscan.com
- **Polygon**: polygonscan.com

## 🎨 UI & Experience

- **Label mode**: Original address with a friendly name label, using a gradient color
- **Replace mode**: Only the friendly name is shown, hover to see the original address (tooltip)
- **Dark mode**: Automatically detects system theme
- **Responsive**: Popup and labels display well on desktop and mobile

## 🛠️ Other

- All mapping data and settings are stored locally in Chrome storage
- You can clear all mappings in the popup
- The extension syncs automatically between tabs

## 🔧 Troubleshooting

- Make sure the extension is enabled
- Check your CSV format
- Refresh the explorer page
- Check site permissions
- If you don't see labels, try switching display modes

## 📝 Sample CSV file
```csv
address,name
0x1234567890123456789012345678901234567890,Binance Hot Wallet
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,Uniswap V3 Router
0x0987654321098765432109876543210987654321,USDC Contract
0xfedcbafedcbafedcbafedcbafedcbafedcbafedcba,MetaMask Swap
0x1111222233334444555566667777888899990000,Personal Wallet
```

## 🎯 Tips for Effective Use

1. Organize your CSV by group (exchange, DeFi, personal, etc.)
2. Use short, clear names
3. Update your CSV regularly as you encounter new addresses
4. Back up your CSV to avoid data loss
5. Test with a few addresses before importing a large list

## 🔐 Privacy & Security

- The extension only runs on specified blockchain explorers
- No personal data is collected or sent externally
- All mapping data is stored locally in Chrome storage

## 📈 Roadmap (planned)
- [ ] Support more explorers
- [ ] Export CSV from the extension
- [ ] Sync data across devices
- [ ] Automatic mapping via API
- [ ] Custom label colors by address type

## 🐛 Reporting Issues

If you encounter a bug:
1. Check the Console log (F12)
2. Try disabling/enabling the extension
3. Refresh or restart Chrome
4. Open an issue with details

---

*Made with ❤️ for the blockchain community*

# 🏷️ Blockchain Address Mapping Extension

Tiện ích Chrome này tự động gắn nhãn (label) hoặc thay thế các địa chỉ blockchain bằng tên thân thiện, dựa trên file CSV do người dùng import. Extension hoạt động trực tiếp trên các blockchain explorer phổ biến như Arbiscan, Etherscan, BSCScan, PolygonScan.


## ✨ Tính năng chính

- **Mapping tự động**: Tìm và thay thế hoặc gắn nhãn cho các địa chỉ blockchain xuất hiện trên trang web, dựa trên dữ liệu từ file CSV.
- **Hỗ trợ nhiều explorer**: Arbiscan, Etherscan, BSCScan, PolygonScan (có thể mở rộng thêm).
- **Import CSV**: Cho phép import file CSV với định dạng `address,name` để mapping.
- **Hai chế độ hiển thị**:
  - **Label mode** (mặc định): Thêm label tên thân thiện bên cạnh địa chỉ gốc.
  - **Replace mode**: Thay thế hoàn toàn địa chỉ bằng tên thân thiện (hover để xem địa chỉ gốc).
- **Realtime DOM update**: Tự động áp dụng mapping cho cả nội dung được tải động (SPA, Ajax, v.v.).
- **Lưu trữ local**: Dữ liệu mapping và cài đặt lưu trong Chrome storage, không gửi ra ngoài.
- **Giao diện popup**: Import CSV, chọn chế độ hiển thị, bật/tắt extension, xem số lượng mapping.


## 🚀 Cài đặt

1. **Tải extension**:
   - Clone hoặc tải về toàn bộ mã nguồn extension vào một thư mục riêng.
2. **Load extension vào Chrome**:
   - Mở Chrome, truy cập `chrome://extensions/`
   - Bật "Developer mode" (Chế độ nhà phát triển)
   - Chọn "Load unpacked" và trỏ tới thư mục chứa extension
   - Extension sẽ xuất hiện trên thanh công cụ
3. **Cấp quyền**:
   - Extension sẽ yêu cầu quyền truy cập các trang explorer (etherscan.io, bscscan.com, v.v.)
   - Nhấn "Allow" nếu được hỏi


## 📋 Hướng dẫn sử dụng

### 1. Chuẩn bị file CSV
Tạo file CSV với định dạng:
```csv
address,name
0x1234567890123456789012345678901234567890,Binance Hot Wallet
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,Uniswap V3 Router
```
**Lưu ý:**
- Địa chỉ phải bắt đầu bằng 0x và có 40 ký tự hex
- Tên thân thiện có thể chứa dấu phẩy
- Không phân biệt hoa/thường địa chỉ

### 2. Import CSV
1. Click icon extension trên thanh công cụ Chrome
2. Trong popup, chọn "Chọn file CSV" hoặc kéo thả file vào
3. Nhấn "Tải CSV" để import
4. Số lượng mapping thành công sẽ hiển thị

### 3. Cấu hình chế độ hiển thị
- **Label mode**: Thêm label tên thân thiện bên cạnh địa chỉ (ví dụ: `0x1234...5678 (Binance Hot Wallet)`)
- **Replace mode**: Thay thế hoàn toàn địa chỉ bằng tên thân thiện (hover để xem địa chỉ gốc)
- Có thể bật/tắt extension và lưu cài đặt trong popup

### 4. Sử dụng
1. Truy cập các blockchain explorer được hỗ trợ
2. Extension sẽ tự động gắn label hoặc thay thế địa chỉ theo cấu hình
3. Hover vào label để xem địa chỉ gốc (ở chế độ Replace)


## 🌐 Blockchain Explorer được hỗ trợ

- **Arbitrum**: arbiscan.io
- **Ethereum**: etherscan.io
- **BSC**: bscscan.com
- **Polygon**: polygonscan.com


## 🎨 Giao diện & Trải nghiệm

- **Label mode**: Địa chỉ gốc kèm label tên thân thiện, label có màu gradient nổi bật
- **Replace mode**: Chỉ hiển thị tên thân thiện, hover để xem địa chỉ gốc (tooltip)
- **Dark mode**: Tự động nhận diện theme tối/sáng của hệ thống
- **Responsive**: Popup và label hiển thị tốt trên desktop/mobile


## 🛠️ Khác

- Dữ liệu mapping và cài đặt lưu trong Chrome storage, không gửi ra ngoài
- Có thể xóa toàn bộ mapping trong popup
- Extension tự động đồng bộ giữa các tab


## 🔧 Khắc phục sự cố

- Đảm bảo extension đã được bật
- Kiểm tra file CSV đúng định dạng
- Refresh lại trang explorer
- Kiểm tra quyền truy cập website
- Nếu không thấy label, thử chuyển đổi chế độ hiển thị


## 📝 File CSV mẫu
```csv
address,name
0x1234567890123456789012345678901234567890,Binance Hot Wallet
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,Uniswap V3 Router
0x0987654321098765432109876543210987654321,USDC Contract
0xfedcbafedcbafedcbafedcbafedcbafedcbafedcba,MetaMask Swap
0x1111222233334444555566667777888899990000,Personal Wallet
```


## 🎯 Tips sử dụng hiệu quả

1. Tổ chức file CSV theo nhóm (exchange, DeFi, cá nhân...)
2. Ưu tiên tên ngắn gọn, dễ nhận biết
3. Cập nhật CSV thường xuyên khi gặp địa chỉ mới
4. Backup file CSV để tránh mất dữ liệu
5. Test với một vài address trước khi import hàng loạt


## 🔐 Bảo mật & Quyền riêng tư

- Extension chỉ hoạt động trên các blockchain explorer được chỉ định
- Không thu thập hay gửi bất kỳ dữ liệu cá nhân nào
- Dữ liệu mapping chỉ lưu local trong Chrome storage


## 📈 Roadmap (dự kiến)
- [ ] Hỗ trợ thêm explorer khác
- [ ] Export CSV từ extension
- [ ] Đồng bộ dữ liệu giữa các thiết bị
- [ ] API mapping tự động
- [ ] Chỉnh màu label theo loại address


## 🐛 Báo lỗi

Nếu gặp lỗi:
1. Kiểm tra Console log (F12)
2. Thử tắt/bật lại extension
3. Refresh hoặc khởi động lại Chrome
4. Tạo issue với thông tin chi tiết

---

*Made with ❤️ for the blockchain community*