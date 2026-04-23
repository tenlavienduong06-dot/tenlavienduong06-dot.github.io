# 📁 Figma Export — Hướng dẫn đặt file

Sau khi export từ Figma, hãy đặt file vào **đúng thư mục** theo hướng dẫn dưới đây:

---

## 📂 Cấu trúc thư mục

```
figma-export/
├── screens/          ← Ảnh mockup toàn trang (Home, Destinations, Detail, About, Contact)
├── components/       ← Ảnh các component riêng lẻ (Card, Nav, Button, Footer...)
└── tokens/           ← Ảnh bảng màu, typography, spacing, icons
```

---

## 🎨 tokens/ — Design Tokens (BẮT BUỘC cần trước tiên)

Đây là thông tin quan trọng nhất để Agent đọc ra đúng Design System. Hãy export:

| File cần có | Nội dung |
|---|---|
| `color-palette.png` | Bảng màu chủ đạo (primary, secondary, neutral, accent...) |
| `typography.png` | Font name, size scale, weight (H1–H6, Body, Caption...) |
| `spacing.png` | Spacing scale (4px, 8px, 16px, 24px...) nếu có |
| `icons.png` | Bộ icon dùng trong project (nếu có) |

---

## 🖥️ screens/ — Màn hình đầy đủ

Export từng trang theo tên file:

| File cần có | Trang tương ứng |
|---|---|
| `home.png` | Trang chủ (Home) |
| `destinations.png` | Trang Destinations (bản đồ + danh sách) |
| `destination-detail.png` | Trang chi tiết 1 địa danh |
| `about.png` | Trang About Us |
| `contact.png` | Trang Contact |

---

## 🧩 components/ — Component riêng lẻ (tùy chọn)

Nếu có thiết kế component riêng, export vào đây:

| File cần có | Mô tả |
|---|---|
| `nav.png` | Navigation bar |
| `destination-card.png` | Card địa danh |
| `hero-banner.png` | Hero section |
| `map-hover.png` | Trạng thái hover bản đồ |
| `footer.png` | Footer |

---

> 💡 **Tip**: Export ở độ phân giải **2x hoặc 3x** để Agent đọc được rõ màu sắc và text.
