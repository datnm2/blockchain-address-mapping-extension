# 🎨 Tạo Icon cho Extension

Extension cần các file icon sau:

## Kích thước cần thiết:
- `icon16.png` - 16x16px (toolbar)
- `icon48.png` - 48x48px (extension management)  
- `icon128.png` - 128x128px (Chrome Web Store)

## Design gợi ý:

### Concept 1: Label Tag
- Biểu tượng nhãn (tag) với ký tự "0x" bên trong
- Màu gradient xanh dương (#667eea → #764ba2)
- Style hiện đại, minimalist

### Concept 2: Address Mapping
- Icon địa chỉ với mũi tên chuyển đổi
- Hex code → tên thân thiện
- Màu gradient xanh lá (#11998e → #38ef7d)

### Concept 3: Blockchain + Tag
- Kết hợp ký hiệu blockchain (chuỗi khối) với tag
- Màu tương tự theme extension

## Tools tạo icon:
1. **Figma/Sketch** - Professional design
2. **Canva** - Template có sẵn
3. **GIMP** - Free alternative
4. **Online generators** - Quick solution

## SVG Template:

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="64" cy="64" r="60" fill="url(#grad1)" stroke="white" stroke-width="4"/>
  
  <!-- Tag shape -->
  <path d="M30 40 L90 40 L90 55 L95 64 L90 73 L90 88 L30 88 Z" fill="white" opacity="0.9"/>
  
  <!-- 0x text -->
  <text x="50" y="70" font-family="monospace" font-size="16" font-weight="bold" fill="#333">0x</text>
  
  <!-- Dots for address -->
  <circle cx="70" cy="58" r="2" fill="#667eea"/>
  <circle cx="76" cy="58" r="2" fill="#667eea"/>
  <circle cx="82" cy="58" r="2" fill="#667eea"/>
  
  <circle cx="70" cy="70" r="2" fill="#667eea"/>
  <circle cx="76" cy="70" r="2" fill="#667eea"/>
  <circle cx="82" cy="70" r="2" fill="#667eea"/>
</svg>
```

## Tạo nhanh với CSS:

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

## Cập nhật manifest.json:

Sau khi có icon, thêm vào manifest.json:

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