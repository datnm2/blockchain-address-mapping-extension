# 🎨 Icon Guide for Blockchain Address Mapping Extension (English)

This extension requires the following icon files for proper display in Chrome:

## Required Sizes
- `icon16.png` - 16x16px (toolbar)
- `icon48.png` - 48x48px (extension management)
- `icon128.png` - 128x128px (Chrome Web Store)

## Design Suggestions

- **Tag symbol with "0x"**: Clearly represents the address mapping function
- **Blue gradient (#667eea → #764ba2)**: Matches the extension theme
- **Modern, minimalist style**
- **Optionally add blockchain chain or arrow effect** to highlight mapping

## Icon Creation Tools
1. **Figma/Sketch** (professional)
2. **Canva** (easy, many templates)
3. **GIMP** (free)
4. **Online generators** (quick)

## Example SVG Template

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="64" cy="64" r="60" fill="url(#grad1)" stroke="white" stroke-width="4"/>
  <path d="M30 40 L90 40 L90 55 L95 64 L90 73 L90 88 L30 88 Z" fill="white" opacity="0.9"/>
  <text x="50" y="70" font-family="monospace" font-size="16" font-weight="bold" fill="#333">0x</text>
  <circle cx="70" cy="58" r="2" fill="#667eea"/>
  <circle cx="76" cy="58" r="2" fill="#667eea"/>
  <circle cx="82" cy="58" r="2" fill="#667eea"/>
  <circle cx="70" cy="70" r="2" fill="#667eea"/>
  <circle cx="76" cy="70" r="2" fill="#667eea"/>
  <circle cx="82" cy="70" r="2" fill="#667eea"/>
</svg>
```

## Quick Icon with CSS/HTML

If you don't have a design tool, you can create an icon with HTML/CSS and take a screenshot:

```html
<div style="
  width: 128px;
  height: 128px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: monospace;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
">
  0x🏷️
</div>
```

## Update manifest.json

After creating your icons, add them to `manifest.json`:

```json
{
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },
  "action": {
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png"
    }
  }
}
```

**Note:** The icon will appear in the toolbar, popup, and Chrome Web Store. Test your icon in both light and dark mode to ensure good visibility.

# 🎨 Hướng dẫn tạo Icon cho Blockchain Address Mapping Extension

Extension cần các file icon sau để hiển thị đúng trên Chrome:

## Kích thước cần thiết
- `icon16.png` - 16x16px (toolbar)
- `icon48.png` - 48x48px (extension management)
- `icon128.png` - 128x128px (Chrome Web Store)

## Gợi ý thiết kế

- **Biểu tượng nhãn (tag) với ký tự "0x"**: Thể hiện rõ chức năng mapping địa chỉ blockchain
- **Màu gradient xanh dương (#667eea → #764ba2)**: Đồng bộ với theme extension
- **Phong cách hiện đại, tối giản**
- **Có thể thêm hiệu ứng chuỗi khối hoặc mũi tên chuyển đổi** để nhấn mạnh tính năng mapping

## Công cụ tạo icon
1. **Figma/Sketch** (chuyên nghiệp)
2. **Canva** (dễ dùng, nhiều template)
3. **GIMP** (miễn phí)
4. **Online generators** (tạo nhanh)

## SVG Template mẫu

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="64" cy="64" r="60" fill="url(#grad1)" stroke="white" stroke-width="4"/>
  <path d="M30 40 L90 40 L90 55 L95 64 L90 73 L90 88 L30 88 Z" fill="white" opacity="0.9"/>
  <text x="50" y="70" font-family="monospace" font-size="16" font-weight="bold" fill="#333">0x</text>
  <circle cx="70" cy="58" r="2" fill="#667eea"/>
  <circle cx="76" cy="58" r="2" fill="#667eea"/>
  <circle cx="82" cy="58" r="2" fill="#667eea"/>
  <circle cx="70" cy="70" r="2" fill="#667eea"/>
  <circle cx="76" cy="70" r="2" fill="#667eea"/>
  <circle cx="82" cy="70" r="2" fill="#667eea"/>
</svg>
```

## Tạo icon nhanh với CSS/HTML

Nếu không có tool design, có thể tạo icon bằng HTML/CSS rồi screenshot:

```html
<div style="
  width: 128px;
  height: 128px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: monospace;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
">
  0x🏷️
</div>
```

## Cập nhật manifest.json

Sau khi tạo icon, thêm vào `manifest.json`:

```json
{
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },
  "action": {
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png"
    }
  }
}
```

**Lưu ý:** Icon sẽ xuất hiện trên toolbar, popup và Chrome Web Store. Nên test icon ở cả chế độ sáng/tối để đảm bảo hiển thị tốt.