# BookStore — Buổi 9 (ĐÃ HOÀN THIỆN)

Bản đã làm xong toàn bộ BT9.1 → BT9.7 và thử thách BT9.C1. Xem `HUONG_DAN_CHAY.md` để chạy và `TraLoi.md` cho phần câu hỏi bổ sung.

## Chạy
```bash
npm install
npm run api          # terminal 1: json-server http://localhost:3000
npx expo start       # terminal 2: quét QR bằng Expo Go, nhấn w để mở web
npm run typecheck    # tsc --noEmit
```
Tài khoản demo: `demo@bookstore.vn` / `123456`

Điện thoại thật: cùng Wi-Fi với máy tính, đặt `EXPO_PUBLIC_API_URL=http://<IP-máy>:3000` trước khi `npx expo start`.

> Đăng nhập là **giả lập** (so sánh mật khẩu ở client) chỉ để học; hệ thống thật phải xác thực ở server và lưu token bằng SecureStore.

Stack: Expo SDK 57 · React Native 0.86 · TypeScript · React Navigation 7 · Redux Toolkit · Axios · json-server 0.17.4.
Giao diện mô tả: xem `docs/UI.md` và `docs/ui/*.png`.

## Trạng thái
BT9.1a/b/c ✅ · BT9.2 ✅ · BT9.3a/b/c/d ✅ · BT9.4a/b/c ✅ · BT9.5a–f ✅ · BT9.6 ✅ · BT9.7 ✅ · BT9.C1 (Mua lại) ✅ · Bộ lọc trạng thái đơn ✅

Kiểm tra: `grep -rn "TODO BT9" src` không còn kết quả.
