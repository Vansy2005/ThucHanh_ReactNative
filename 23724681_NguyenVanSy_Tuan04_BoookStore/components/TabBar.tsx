// GIỜ 5 — Bài tập 1: Thanh Tab Bar dưới cùng (giao diện tĩnh, chưa dùng thư viện
// navigation thật — chỉ chuyển màn bằng useState ở App.tsx, đúng yêu cầu tài liệu).
//
// SO SÁNH 2 CÁCH ĐẶT TAB BAR (theo gợi ý của đề bài):
// 1) position: 'absolute' ở đáy màn hình (ĐANG DÙNG ở component này)
//    - Tab bar "nổi" đè lên trên nội dung phía trên, không chiếm chỗ trong luồng flex.
//    - BẮT BUỘC phải chừa paddingBottom (bằng chiều cao tab bar) cho nội dung/ScrollView
//      phía trên, nếu không phần tử cuối cùng sẽ bị tab bar che mất.
//    - Dùng khi: tab bar cần "nổi" trên nhiều màn hình con khác nhau dùng chung 1 layout
//      cha (giống bố cục thật của navigation library), hoặc khi muốn nội dung có thể
//      cuộn tràn xuống dưới tab bar (hiệu ứng mờ dần) mà không cần tính lại chiều cao.
// 2) đặt cố định ngoài ScrollView (row cuối cùng trong View cha, KHÔNG absolute)
//    - Tab bar chiếm chỗ thật trong luồng flex (giống FloatingCartButton kiểu "tĩnh"),
//      phần nội dung phía trên chỉ cần flex: 1 là tự động co lại vừa đủ, KHÔNG cần tính
//      paddingBottom thủ công vì không có nguy cơ bị che.
//    - Dùng khi: layout đơn giản, chỉ 1 màn hình cha bao toàn bộ, ưu tiên sự chắc chắn
//      (không lệch số liệu paddingBottom nếu sau này đổi chiều cao tab bar).
// => Ở dự án này chọn cách (1) vì TabBar dùng chung cho nhiều tab/màn hình khác nhau
//    (xem App.tsx) nên đặt tách biệt, "nổi đè" gọn hơn là lặp lại trong từng màn hình.
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export type TabKey = "home" | "category" | "cart" | "account";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "home", label: "Trang chủ", icon: "🏠" },
  { key: "category", label: "Danh mục", icon: "📂" },
  { key: "cart", label: "Giỏ hàng", icon: "🛒" },
  { key: "account", label: "Tài khoản", icon: "👤" },
];

export function TabBar({ active, onChange }: { active: TabKey; onChange: (key: TabKey) => void }) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            style={styles.tabItem} // flex:1 -> 4 mục chia đều bằng nhau theo chiều ngang
            onPress={() => onChange(tab.key)}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute", // neo cố định đáy màn hình, nổi trên ScrollView bên trên
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row", // 4 mục xếp ngang
    height: 64,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  tabItem: {
    flex: 1, // chia đều 1/4 bề rộng cho mỗi mục, không cần tính width tay
    flexDirection: "column", // icon trên, chữ dưới
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  icon: {
    fontSize: 18,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  labelActive: {
    color: "#4338CA", // màu nổi bật cho mục đang chọn
    fontWeight: "700",
  },
});
