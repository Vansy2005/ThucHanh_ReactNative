# Trả lời câu hỏi bổ sung – Buổi 8

## 1. Cờ `ready`
Lần render đầu tiên, giỏ hàng trong store còn là mảng rỗng `[]`, còn dữ liệu cũ vẫn nằm trong AsyncStorage và đang được đọc bất đồng bộ. Nếu `useAutoPersist` bỏ điều kiện `ready` thì ngay sau render 1, effect chạy `saveJSON(key, [])` và ghi mảng rỗng đè lên giỏ đã lưu, trước khi `loadJSON` kịp trả kết quả. Đến render 2 (sau khi `hydrateCart` nạp dữ liệu) thì dữ liệu cũ đã mất, giỏ hàng luôn trống mỗi lần mở lại app. Cờ `ready` chỉ bật sau khi đọc xong, nên chỉ cho phép ghi từ lúc đó.

## 2. Token giả
Hai điểm không an toàn:
- Mật khẩu nằm sẵn trong `db.json` (dạng thô, không băm) và được app tải về để tự so sánh, nên ai gọi `/users` cũng thấy mật khẩu của mọi người.
- Token do app tự tạo (`token-<id>-<thời gian>`) nên ai cũng đoán và làm giả được; server không hề xác thực nó.

Hệ thống thật: **server** kiểm tra mật khẩu (đã băm bằng bcrypt/argon2) và cấp token có chữ ký, có thời hạn (JWT hoặc session). App nên lưu token bằng **SecureStore** (Keychain trên iOS, Keystore trên Android) thay vì AsyncStorage, vì AsyncStorage lưu dạng thô, không mã hóa.

## 3. Hai effect trong `CartItemRow`
Nếu xóa effect đồng bộ `setQty(item.quantity)` thì `qty` chỉ lấy `item.quantity` một lần ở render đầu. Số hiển thị sẽ lệch store khi store đổi từ nơi khác mà component không bị mount lại, ví dụ: giỏ được nạp từ AsyncStorage sau khi mở app (render đầu còn rỗng/giá trị cũ), hoặc bấm "Thêm vào giỏ" ở trang chi tiết làm tăng số lượng cùng sách, hoặc store tự kẹp (`clamp`) số lượng về tồn kho. Lúc đó nút vẫn hiện số cũ trong khi tổng tiền tính theo số mới.

## 4. Một nguồn state
Nếu mỗi `HeartButton` giữ `useState` riêng thì mỗi nơi là một bản sao độc lập: thả tim ở lưới sách, vào trang chi tiết tim vẫn trắng (và ngược lại), màn Yêu thích cũng không biết gì, và tải lại thì mất hết. Với store, tất cả `HeartButton` cùng đọc `ids` từ `wishlist` qua `useWishlist()` và cùng gọi `toggle(bookId)`; một thay đổi làm mọi component đang đọc store render lại, nên các tim luôn khớp nhau. Store còn là chỗ duy nhất để `useAutoPersist` lưu xuống máy.

## 5. Code bổ sung: 👁 hiện/ẩn mật khẩu ở màn Đăng nhập
`FormField` được thêm prop `accessory` (nút đặt bên phải ô nhập). Trong `LoginScreen.tsx`:

```tsx
const [showPassword, setShowPassword] = useState(false);

<FormField
  label="Mật khẩu"
  value={password}
  onChangeText={setPassword}
  error={errors.password}
  secureTextEntry={!showPassword}
  accessory={
    <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}
      accessibilityLabel={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
      <Text style={{ fontSize: 20, opacity: showPassword ? 1 : 0.5 }}>👁</Text>
    </Pressable>
  }
/>
```

