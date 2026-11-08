import { useEffect } from "react";
import { saveJSON } from "../storage/storage";

// HOOK CHUNG: mỗi khi `value` đổi (và đã nạp xong dữ liệu cũ) → tự ghi vào AsyncStorage.
// Dùng cho cart, wishlist… — không phải viết lại effect ở từng nơi.
export function useAutoPersist<T>(key: string, value: T, ready: boolean) {
  // Cờ ready chặn ghi quá sớm: lần render đầu store còn rỗng, nếu ghi ngay thì đè mất dữ liệu cũ trước khi kịp đọc.
  useEffect(() => {
    if (ready) saveJSON(key, value);
  }, [key, value, ready]);
}
