# Trả lời câu hỏi bổ sung — Buổi 9 (BookStore)

## 1. Giá trị dẫn xuất
`errors` và `valid` hoàn toàn suy ra được từ `name`, `phone`, `address` và giỏ hàng, nên tính trực tiếp mỗi lần render thì **luôn khớp** với dữ liệu hiện tại, không cần nhớ cập nhật. Nếu lưu bằng `useState` riêng thì phải gọi thêm `setErrors/setValid` ở mọi chỗ `setName`, `setPhone`, `setAddress`, thay đổi giỏ…; quên một chỗ là lỗi đỏ hiện sai, hoặc nút "Xác nhận đặt hàng" sáng/mờ không đúng với nội dung form (dữ liệu bị lệch pha, còn gọi là *stale state*).

## 2. Thứ tự gọi
Nếu `clear()` chạy **trước** `await createOrder(...)` mà mất mạng thì giỏ đã bị xoá (cả trong store lẫn AsyncStorage) trong khi đơn **chưa hề được tạo** trên server: người dùng mất hết hàng đã chọn và phải chọn lại từ đầu. Đặt `clear()` ngay **sau** `createOrder` là đúng vì khi `await` không ném lỗi nghĩa là server đã nhận đơn; lúc đó mới xoá giỏ. Nếu lỗi thì code nhảy vào `catch`, bỏ qua `clear()`, giỏ còn nguyên để bấm thử lại.

## 3. PUT hay PATCH
`PUT /users/1` với `{ name, phone }` sẽ **thay toàn bộ** object nên user đó trong `db.json` chỉ còn `id`, `name`, `phone`; các trường `email` và `password` bị mất, tài khoản không đăng nhập được nữa. `PATCH` chỉ cập nhật những trường được gửi và giữ nguyên các trường còn lại, nên phù hợp với form chỉ sửa một phần (tên, số điện thoại). Vì thế bài này dùng `PATCH`.

## 4. Cập nhật lạc quan
Nếu bỏ đoạn hoàn lại `read: false` trong `catch` thì khi mất mạng giao diện vẫn hiện "đã đọc" (nền trắng, mất chấm đỏ) trong khi server vẫn lưu `read: false`. Người dùng bị đánh lừa, đến lần mở màn sau thông báo lại quay về chưa đọc, rất khó hiểu.

- **Nên dùng:** thao tác nhẹ, ít khi lỗi, sai cũng không nghiêm trọng, ví dụ **thả tim / bỏ yêu thích** sách (đổi icon ngay, gọi API sau, lỗi thì hoàn lại).
- **Không nên dùng:** **thanh toán / đặt hàng**, vì phải chắc chắn server đã nhận đơn mới được báo thành công và xoá giỏ; báo thành công giả sẽ khiến người dùng tưởng đã mua trong khi thực tế không có đơn.

## 5. Code bổ sung: bộ lọc trạng thái ở màn Đơn hàng
Đã làm trong `src/screens/OrdersScreen.tsx`:

```tsx
type StatusFilter = "all" | OrderStatus;
const [status, setStatus] = useState<StatusFilter>("all");

// một chỗ sửa trong dữ liệu truyền cho FlatList
const visibleOrders = useMemo(
  () => orders.filter((o) => status === "all" || o.status === status),
  [orders, status]
);

<FlatList data={visibleOrders} ... />
```

Hàng chip lọc (Tất cả / Chờ xác nhận / Đang giao / Hoàn tất / Đã huỷ) nằm phía trên danh sách, giống `CategoryChips`. Khi lọc mà không có đơn nào thì hiện trạng thái rỗng riêng kèm nút "Xem tất cả".

> Ảnh chụp màn hình: sinh viên tự chụp trên máy mình khi chạy app (xem mục "Ảnh chụp màn hình" trong `HUONG_DAN_CHAY.md`).
