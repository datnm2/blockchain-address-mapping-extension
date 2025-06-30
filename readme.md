# 🏷️ Blockchain Address Mapper Chrome Extension

Extension Chrome giúp tự động mapping các blockchain address với tên thân thiện từ file CSV khi browse các blockchain explorer như Arbiscan, Etherscan, v.v.

## ✨ Tính năng

- **Tự động mapping**: Thay thế hoặc thêm label cho các blockchain address
- **Hỗ trợ nhiều explorer**: Arbiscan, Etherscan, BSCScan, PolygonScan
- **Import CSV**: Dễ dàng import danh sách mapping từ file CSV
- **2 chế độ hiển thị**: 
  - Thêm label bên cạnh address (mặc định)
  - Thay thế hoàn toàn address bằng tên thân thiện
- **Real-time**: Tự động áp dụng cho nội dung được tải động
- **Responsive**: Hoạt động tốt trên mobile và desktop

## 🚀 Cài đặt

1. **Tải extension**:
   - Tạo thư mục mới cho extension
   - Copy tất cả các file vào thư mục đó

2. **Load extension vào Chrome**:
   - Mở Chrome và vào `chrome://extensions/`
   - Bật "Developer mode" ở góc trên bên phải
   - Click "Load unpacked" và chọn thư mục chứa extension
   - Extension sẽ xuất hiện trong danh sách

3. **Cấp quyền**:
   - Extension sẽ yêu cầu quyền truy cập các blockchain explorer
   - Click "Allow" để cấp quyền

## 📋 Cách sử dụng

### Bước 1: Chuẩn bị file CSV

Tạo file CSV với format:
```csv
address,name
0x1234567890123456789012345678901234567890,Binance Hot Wallet
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,Uniswap V3 Router
```

**Lưu ý**:
- Cột đầu tiên: blockchain address (bắt buộc có 0x và 40 ký tự hex)
- Cột thứ hai: tên thân thiện
- Có thể có dấu phẩy trong tên (sẽ được xử lý tự động)
- Không phân biệt hoa thường cho address

### Bước 2: Import CSV

1. Click vào icon extension trên thanh công cụ Chrome
2. Trong popup, click "Chọn file CSV" hoặc kéo thả file vào
3. Click "Tải CSV" để import
4. Extension sẽ hiển thị số lượng address đã import thành công

### Bước 3: Cấu hình

**Chế độ hiển thị**:
- ✅ **Label mode** (mặc định): Thêm label bên cạnh address
  - Ví dụ: `0x1234...5678 (Binance Hot Wallet)`
- ✅ **Replace mode**: Thay thế hoàn toàn address
  - Ví dụ: `Binance Hot Wallet` (hover để xem address gốc)

**Bật/tắt extension**:
- Toggle "Bật extension" để bật/tắt tính năng
- Click "Lưu cài đặt" để áp dụng

### Bước 4: Sử dụng

1. Mở bất kỳ blockchain explorer nào được hỗ trợ
2. Browse các transaction, address, contract...
3. Extension sẽ tự động thêm label hoặc thay thế address
4. Hover vào label để xem address gốc

## 🌐 Blockchain Explorer được hỗ trợ

- **Arbitrum**: arbiscan.io
- **Ethereum**: etherscan.io  
- **BSC**: bscscan.com
- **Polygon**: polygonscan.com

## 🎨 Giao diện

### Label Mode (mặc định)
- Address gốc + label màu gradient
- Hover effect với animation mượt mà
- Tooltip hiển thị thông tin chi tiết

### Replace Mode  
- Thay thế hoàn toàn bằng tên thân thiện
- Background màu xanh lá
- Hover để xem address gốc

### Dark Mode
- Tự động detect dark mode của hệ thống
- Màu sắc phù hợp với theme tối

## 🛠️ Tính năng nâng cao

### Context Menu
- Right-click vào address để copy address gốc
- Quick add mapping cho address mới

### Thống kê
- Hiển thị số lượng address đã mapping
- Badge trên icon extension
- Thời gian cập nhật cuối cùng

### Storage Management
- Dữ liệu lưu trong Chrome storage
- Nút xóa tất cả dữ liệu
- Tự động sync giữa các tab

## 🔧 Troubleshooting

### Extension không hoạt động
1. Kiểm tra extension đã được enable chưa
2. Refresh trang web
3. Kiểm tra quyền truy cập website

### Không thấy label
1. Kiểm tra file CSV có đúng format không
2. Đảm bảo address trong CSV có prefix 0x
3. Thử chế độ replace mode

### Performance
- Extension tự động throttle để không ảnh hưởng hiệu suất
- Chỉ xử lý các element mới được thêm vào DOM

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

1. **Tổ chức CSV**: Phân loại theo exchange, DeFi, cá nhân...
2. **Tên ngắn gọn**: Sử dụng tên ngắn để không làm rối giao diện
3. **Cập nhật thường xuyên**: Thêm address mới khi gặp
4. **Backup CSV**: Lưu file CSV để backup và chia sẻ
5. **Test trước khi dùng**: Thử với một vài address trước khi import hàng loạt

## 🔐 Bảo mật & Privacy

- Extension chỉ chạy trên các blockchain explorer được chỉ định
- Không thu thập dữ liệu cá nhân
- Dữ liệu mapping chỉ lưu local trong Chrome storage
- Không gửi dữ liệu về server nào

## 📈 Roadmap

- [ ] Hỗ trợ thêm blockchain explorer khác
- [ ] Export CSV từ extension
- [ ] Sync dữ liệu giữa các device
- [ ] API integration với các service mapping phổ biến
- [ ] Bulk edit mapping
- [ ] Custom color cho từng loại address

## 🐛 Báo lỗi

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra Console log (F12)
2. Thử disable/enable extension
3. Restart Chrome
4. Tạo issue với thông tin chi tiết về lỗi

---

*Made with ❤️ for the blockchain community*