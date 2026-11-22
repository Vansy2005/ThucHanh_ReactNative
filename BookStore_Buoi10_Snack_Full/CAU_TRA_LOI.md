# Câu hỏi bổ sung · Buổi 10

**1. Vì sao đổi numColumns phải đổi key? Bỏ key thì sao?**
FlatList xếp hàng theo số cột ngay lúc dựng nên không cho đổi khi đang chạy. Đổi key làm React huỷ FlatList cũ và dựng cái mới với numColumns mới. Bỏ key thì bật Switch sẽ báo lỗi "Changing numColumns on the fly is not supported".

**2. Dữ liệu nào để useState, dữ liệu nào đưa vào Redux?**
Dữ liệu chỉ một màn hình dùng và mất khi rời màn (keyword, category, isTile) để trong useState. Dữ liệu nhiều màn hình cùng đọc/ghi (giỏ hàng: Chi tiết, Giỏ hàng, badge tab; yêu thích: Chi tiết và tab Yêu thích) đưa vào Redux.

**3. Vì sao trong createSlice được viết state.items.push(…) và found.quantity += 1?**
Redux Toolkit dùng Immer: reducer nhận một bản nháp (draft) của state, các thao tác sửa trên bản nháp được ghi lại rồi tạo ra state mới, state cũ không bị đổi. Ở component bình thường không có Immer, sửa trực tiếp state thì React không nhận ra thay đổi nên không render lại.

**4. selectIsFavorite(id) trả về hàm: vì sao? Chỉ lưu id có lợi gì?**
useAppSelector cần một hàm nhận state; viết selector trả về hàm giúp vừa khớp kiểu đó, vừa giữ được tham số id. Chỉ lưu id thì không bị lệch dữ liệu: tên, giá, rating luôn lấy từ một nguồn là mảng sách, sách đổi thì danh sách yêu thích tự đúng theo.

**5. Bỏ useCallback thì React.memo còn tác dụng không?**
Không còn. Không bọc useCallback thì mỗi lần Home render, onSelect là một hàm mới, props của BookCard đổi nên React.memo coi là props khác và vẽ lại tất cả thẻ.

**6. (Bonus) Ba hành động của createAsyncThunk đổi những trường nào?**
pending: status = "loading", error = null. fulfilled: status = "succeeded", items = dữ liệu nhận được. rejected: status = "failed", error = thông báo từ rejectWithValue (hoặc thông báo mặc định).
