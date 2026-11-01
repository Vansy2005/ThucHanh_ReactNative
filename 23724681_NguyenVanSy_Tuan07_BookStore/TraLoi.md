# Trả lời câu hỏi bổ sung — Buổi 7

## 1. Cấu trúc điều hướng
`BookDetail` được đăng ký ở Stack ngoài cùng nên khi mở, nó phủ lên toàn bộ màn hình (che luôn Tab Bar) và Native Stack tự có nút ← để quay lại màn trước, giữ nguyên vị trí cuộn của Home. Nếu đặt vào Tab thì nó trở thành một tab riêng: Tab Bar vẫn hiện, phải có thêm một mục tab chỉ để xem sách, không có nút quay lại, và bấm "Chi tiết" ở Home sẽ nhảy sang tab khác thay vì "mở lên" như người dùng mong đợi. Chi tiết sách là màn tạm thời theo ngữ cảnh chứ không phải một mục điều hướng chính, nên thuộc về Stack.

## 2. Redux
Redux Toolkit dùng thư viện Immer: `state` trong reducer thực chất là một bản nháp (draft). Khi ta gọi `state.items.push(...)`, Immer ghi lại thay đổi rồi tạo ra một state mới bất biến, state gốc không bị sửa. Nếu bỏ `useMemo` trong `useCart` thì kết quả hiển thị vẫn đúng vì tổng vẫn được tính từ `items`. Hậu quả chỉ là tổng số lượng và tổng tiền bị tính lại ở mọi lần render (kể cả khi `items` không đổi), giỏ nhỏ thì không thấy gì nhưng giỏ lớn sẽ tốn. Vậy `useMemo` chỉ là tối ưu hiệu năng, không quyết định đúng hay sai.

## 3. Promise.all
Nếu `getCategories()` lỗi còn `getBooks()` thành công thì `Promise.all` bị reject cả nhóm, nên `catch` chạy và Home hiện `ErrorView` dù dữ liệu sách đã tải được. Dùng `Promise.allSettled` thì cả hai request đều chạy xong và trả về trạng thái riêng cho từng cái: ta vẫn `setBooks` khi sách thành công và chỉ để trống phần chip danh mục. Đánh đổi là phải tự xử lý lỗi cho từng phần (ví dụ báo "không tải được danh mục" và có nút thử lại riêng), code dài hơn, và giao diện có thể ở trạng thái "tải một nửa" khó kiểm soát hơn so với cách thành công hết hoặc lỗi hết.

```ts
const [b, c] = await Promise.allSettled([getBooks(), getCategories()]);
if (b.status === "fulfilled") setBooks(b.value); else setError(getErrorMessage(b.reason));
if (c.status === "fulfilled") setCategories(c.value); // lỗi danh mục: bỏ qua chip, không chặn danh sách sách
```

## 4. Debounce
Nếu đặt `setTimeout` thẳng trong `onChangeText` thì mỗi phím gõ tạo ra một timer riêng và không timer nào bị huỷ, nên gõ 10 ký tự vẫn kích hoạt 10 lần cập nhật (chỉ trễ đi chứ không được gộp lại). Hàm dọn dẹp `return () => clearTimeout(t)` chạy trước lần effect kế tiếp và khi component bị gỡ (unmount), nhờ đó chỉ timer của lần gõ cuối cùng được giữ lại. Nó cũng tránh lỗi gọi `setState` trên component đã unmount, và tránh timer cũ ghi đè giá trị mới.

## 5. Code bổ sung — sắp xếp giá tăng/giảm
Thêm một state `sort` và sửa đúng một chỗ là `useMemo` của `visibleBooks` trong `HomeScreen.tsx`. Sắp xếp trên bản sao `[...filtered]` để không làm thay đổi mảng `books` gốc (`sort()` sửa trực tiếp mảng). Hai nút "Giá tăng dần ↑ / Giá giảm dần ↓" bấm lần nữa thì bỏ sắp xếp.

```tsx
type SortOrder = "asc" | "desc" | null;
const [sort, setSort] = useState<SortOrder>(null);

const visibleBooks = useMemo(() => {
  const filtered = filterBooks(books, { keyword: debouncedKeyword, categoryId, priceRange });
  if (sort === null) return filtered;
  return [...filtered].sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
}, [books, debouncedKeyword, categoryId, priceRange, sort]);
```
