import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "../components/StatusBadge";
import { PrimaryButton } from "../components/PrimaryButton";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getOrdersByUser } from "../services/orderService";
import { getBooks } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useAuth, useCart } from "../store/hooks";
import { formatDateTime } from "../utils/format";
import { showMessage } from "../utils/dialog";
import { RootScreenProps } from "../navigation/types";
import { Order, OrderStatus } from "../types";
import { colors, formatPrice, radius } from "../theme";

export const PAYMENT_LABEL = { cod: "Thanh toán khi nhận hàng (COD)", bank: "Chuyển khoản ngân hàng" } as const;

// Bộ lọc trạng thái (câu hỏi bổ sung): "all" hoặc một OrderStatus
type StatusFilter = "all" | OrderStatus;
const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã huỷ" },
];

export function OrdersScreen({ navigation }: RootScreenProps<"Orders">) {
  const { user, isLoggedIn } = useAuth();
  const { items: cartItems, add, setQty } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null); // đơn đang mở rộng (xem chi tiết ngay tại màn này)
  const [status, setStatus] = useState<StatusFilter>("all");

  // BT9.3a: tải đơn hàng của người dùng
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersByUser(user.id);
      // sắp xếp lại ở client cho chắc: mới nhất lên đầu (chuỗi ISO so sánh được)
      setOrders([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    load();
  }, [load]);

  // Dữ liệu truyền cho FlatList sau khi lọc theo trạng thái
  const visibleOrders = useMemo(
    () => orders.filter((o) => status === "all" || o.status === status),
    [orders, status]
  );

  // BT9.C1 (thử thách "Mua lại"): thêm lại toàn bộ sản phẩm của đơn vào giỏ hiện tại
  const reorder = async (order: Order) => {
    try {
      const books = await getBooks(); // lấy giá và tồn kho MỚI NHẤT (giá trong đơn cũ có thể đã khác)
      let added = 0;
      order.items.forEach((it) => {
        const book = books.find((b) => b.id === it.bookId);
        if (!book || book.stock <= 0) return; // sách đã bị xoá hoặc hết hàng → bỏ qua
        const inCart = cartItems.find((c) => c.bookId === it.bookId);
        if (!inCart) add({ bookId: book.id, title: book.title, price: book.price, emoji: book.emoji, color: book.color, stock: book.stock });
        // cùng sách thì cộng số lượng; setQty tự chặn ở tồn kho
        setQty(it.bookId, (inCart?.quantity ?? 0) + it.quantity);
        added += 1;
      });
      if (added === 0) {
        showMessage("Không thể mua lại", "Các sản phẩm của đơn này hiện đã hết hàng hoặc không còn bán.");
        return;
      }
      showMessage("Đã thêm vào giỏ", "Các sản phẩm của đơn hàng đã được thêm lại vào giỏ.", () =>
        navigation.navigate("Tabs", { screen: "Cart" })
      );
    } catch (e) {
      showMessage("Không thể mua lại", getErrorMessage(e));
    }
  };

  if (!isLoggedIn) {
    return <EmptyState emoji="🔒" title="Bạn cần đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      {orders.length > 0 && (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {FILTERS.map((f) => {
              const active = f.value === status;
              return (
                <Pressable key={f.value} style={[styles.chip, active && styles.chipActive]} onPress={() => setStatus(f.value)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
      <FlatList
        data={visibleOrders}
        keyExtractor={(o) => String(o.id)}
        contentContainerStyle={{ padding: 12, gap: 10, flexGrow: 1 }}
        // BT9.3c: trạng thái rỗng (chưa có đơn nào / không có đơn ở trạng thái đang lọc)
        ListEmptyComponent={
          orders.length === 0 ? (
            <EmptyState
              emoji="🧾"
              title="Bạn chưa có đơn hàng nào"
              message="Đặt đơn đầu tiên để theo dõi tại đây."
              actionLabel="Mua sắm ngay"
              onAction={() => navigation.navigate("Tabs", { screen: "Home" })}
            />
          ) : (
            <EmptyState emoji="🔎" title="Không có đơn nào ở trạng thái này" actionLabel="Xem tất cả" onAction={() => setStatus("all")} />
          )
        }
        // BT9.3b: thẻ đơn hàng, bấm để mở rộng chi tiết ngay trong thẻ
        renderItem={({ item: o }) => {
          const open = openId === o.id;
          return (
            <View style={styles.card}>
              <Pressable onPress={() => setOpenId(open ? null : o.id)} style={styles.head}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.code}>Đơn #{o.id}</Text>
                  <Text style={styles.date}>{formatDateTime(o.createdAt)}</Text>
                  <Text style={styles.total}>{formatPrice(o.total)}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <StatusBadge status={o.status} />
                  <Text style={styles.toggle}>{open ? "Thu gọn ▲" : "Chi tiết ▼"}</Text>
                </View>
              </Pressable>
              {open && (
                <View style={styles.detail}>
                  {o.items.map((it) => (
                    <View key={it.bookId} style={styles.itemRow}>
                      <Text style={styles.itemTitle} numberOfLines={1}>{it.title} × {it.quantity}</Text>
                      <Text style={styles.itemPrice}>{formatPrice(it.price * it.quantity)}</Text>
                    </View>
                  ))}
                  <View style={styles.addr}>
                    <Text style={styles.addrH}>Giao đến</Text>
                    <Text style={styles.addrT}>{o.address.name} · {o.address.phone}</Text>
                    <Text style={styles.addrT}>{o.address.address}</Text>
                    <Text style={styles.addrT}>Thanh toán: {PAYMENT_LABEL[o.paymentMethod]}</Text>
                  </View>
                  {o.status === "completed" && <PrimaryButton title="Mua lại" variant="outline" onPress={() => reorder(o)} />}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  filterRow: { paddingHorizontal: 12, paddingTop: 10, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line },
  chipActive: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  chipText: { color: colors.text, fontWeight: "600" },
  chipTextActive: { color: "#fff" },
  card: { backgroundColor: "#fff", borderRadius: radius.md, overflow: "hidden" },
  head: { flexDirection: "row", alignItems: "center", gap: 8, padding: 14 },
  code: { fontWeight: "800", color: colors.navy, fontSize: 16 },
  date: { color: colors.muted, fontSize: 12 },
  total: { color: colors.indigo, fontWeight: "800", marginTop: 2 },
  toggle: { color: colors.indigo, fontWeight: "700", fontSize: 12 },
  detail: { borderTopWidth: 1, borderTopColor: colors.line, padding: 14, gap: 8 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  itemTitle: { flex: 1, color: colors.text },
  itemPrice: { fontWeight: "700", color: colors.text },
  addr: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: 10, gap: 2, marginTop: 4 },
  addrH: { fontWeight: "800", color: colors.navy },
  addrT: { color: colors.text, fontSize: 13 },
});
