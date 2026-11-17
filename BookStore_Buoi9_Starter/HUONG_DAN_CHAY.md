# Hướng dẫn chạy BookStore — Buổi 9 (bản đã hoàn thiện)

## 1. Yêu cầu
- **Node.js 20+** (kiểm tra: `node -v`)
- **VS Code** (khuyến nghị)
- Điện thoại cài **Expo Go** (nếu muốn chạy trên máy thật), hoặc dùng trình duyệt (bản web)

## 2. Cài đặt (làm 1 lần)
```bash
# giải nén BookStore_Buoi9_Done.zip, mở thư mục bằng VS Code, mở Terminal
cd BookStore_Buoi9_Starter
npm install
```

## 3. Chạy app — cần MỞ 2 TERMINAL

**Terminal 1 — chạy API giả (json-server):**
```bash
npm run api
```
Thấy `Resources: http://localhost:3000/...` là thành công. **Giữ terminal này luôn mở.**

**Terminal 2 — chạy app:**
```bash
npx expo start
```
- Nhấn **`w`** để mở bản **web** (dễ nhất để thử và chụp ảnh).
- Hoặc mở **Expo Go** trên điện thoại rồi **quét mã QR**.

## 4. Chạy trên điện thoại thật
Máy tính và điện thoại phải **cùng Wi-Fi**. Trên điện thoại, `localhost` là chính điện thoại nên cần chỉ IP máy tính:

```bash
# Windows: xem IP bằng  ipconfig   (dòng IPv4 Address)
# macOS/Linux: ifconfig / ip a
# Windows PowerShell:
$env:EXPO_PUBLIC_API_URL="http://192.168.1.10:3000"; npx expo start -c
# macOS / Linux:
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000 npx expo start -c
```
(Thay `192.168.1.10` bằng IP máy bạn.) Nếu Windows chặn kết nối, cho phép Node.js qua Firewall.

## 5. Tài khoản demo
`demo@bookstore.vn` / `123456`  (đã có sẵn đơn hàng, thông báo, yêu thích)

## 6. Kiểm tra trước khi nộp
```bash
npm run typecheck                # phải không báo lỗi
```
Tìm `TODO BT9` (Ctrl+Shift+F): **không còn kết quả**.

## 7. Cách thử từng bài (theo đề)
| Bài | Cách thử |
|---|---|
| 9.1 | Vào Giỏ → Thanh toán: form chưa có lỗi đỏ, nút mờ. Điền địa chỉ → nút sáng. Chọn Chuyển khoản → thẻ viền indigo. |
| 9.2 | Đặt hàng → thông báo thành công, về Home, giỏ = 0; mở `http://localhost:3000/orders` thấy đơn mới. **Tắt json-server (Ctrl+C)** rồi đặt → hiện lỗi đỏ, giỏ còn nguyên; bật lại, bấm lại → đặt được. |
| 9.3 | Tài khoản → **Đơn hàng của tôi**: đơn mới nhất trên cùng, bấm thẻ để mở chi tiết, có lọc theo trạng thái. Đơn *Hoàn tất* có nút **Mua lại** (thử thách C1). |
| 9.4 | Tài khoản → **✎ Chỉnh sửa**: đổi tên/SĐT, lưu → tên mới hiện ngay; để trống tên hoặc SĐT sai → báo lỗi, không gửi. |
| 9.5 | Tài khoản → **Thông báo**: chưa đọc nền xanh + chấm đỏ; bấm → đổi trắng ngay rồi chuyển màn. |
| 9.6 | Trên **điện thoại/giả lập** kéo Home xuống để làm mới (bản web không có hiệu ứng kéo). |
| 9.7 | `app.json` đã có icon, splash (#0B1F5C), adaptiveIcon. Sau khi sửa app.json chạy `npx expo start -c`. Expo Go không hiện icon/splash riêng, muốn thấy phải build bằng EAS. |

## 8. Ảnh chụp màn hình cần nộp
Chụp 4 màn: **Checkout, Đơn hàng, Hồ sơ, Thông báo** (bản web: F12 → chế độ điện thoại, hoặc Win+Shift+S / Cmd+Shift+4).

## 9. Đưa dữ liệu về ban đầu
json-server ghi thẳng vào `db.json`. Muốn reset (ví dụ trước khi demo): giải nén lại file zip gốc, hoặc chép lại `db.json` gốc.

## 10. Lỗi thường gặp
| Triệu chứng | Cách xử lý |
|---|---|
| `Network Error` trên điện thoại | Đặt `EXPO_PUBLIC_API_URL` như mục 4, cùng Wi-Fi |
| Đổi `app.json` không có tác dụng | `npx expo start -c` |
| Cổng 3000 bận | Tắt tiến trình đang dùng cổng 3000, hoặc đổi `--port` trong script `api` |
| App báo lỗi khi tải dữ liệu | Quên chạy `npm run api` (Terminal 1) |
