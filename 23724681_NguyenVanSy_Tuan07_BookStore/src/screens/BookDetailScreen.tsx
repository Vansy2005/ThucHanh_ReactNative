import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getBookById } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useCart, useWishlist } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { Book } from "../types";
import { colors, formatPrice, radius } from "../theme";

// gọi getBookById thay cho mảng tĩnh; có loading + lỗi + thử lại
export function BookDetailScreen({ route }: RootScreenProps<"BookDetail">) {
  const { bookId } = route.params;
  const { add } = useCart();
  const { isFavorite, toggle } = useWishlist(); // BT7.C1

  // BT7.5d: state + load() chạy lại khi bookId đổi
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBook(await getBookById(bookId));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    load();
  }, [load]);

  // BT7.5e: kiểm tra loading / lỗi TRƯỚC khi dùng book.title (tránh lỗi "undefined")
  if (loading) return <LoadingView label="Đang tải chi tiết…" />;
  if (error || !book) return <ErrorView message={error ?? "Không tìm thấy sách."} onRetry={load} />;

  const fav = isFavorite(book.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.cover, { backgroundColor: book.color }]}>
        <Text style={styles.emoji}>{book.emoji}</Text>
      </View>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{book.title}</Text>
        {/* BT7.C1: nút yêu thích — UI chỉ biết useWishlist(), không biết Redux */}
        <Pressable onPress={() => toggle(book.id)} hitSlop={10} accessibilityLabel="Yêu thích">
          <Text style={[styles.heart, fav && styles.heartOn]}>{fav ? "♥" : "♡"}</Text>
        </Pressable>
      </View>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.price}>{formatPrice(book.price)}</Text>
      <Text style={styles.stock}>Còn {book.stock} cuốn</Text>
      <Text style={styles.desc}>{book.description}</Text>
      {/* BT7.3c */}
      <Pressable
        style={styles.btn}
        onPress={() =>
          add({ bookId: book.id, title: book.title, price: book.price, emoji: book.emoji, color: book.color, stock: book.stock })
        }
      >
        <Text style={styles.btnText}>Thêm vào giỏ</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 8 },
  cover: { height: 220, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 90 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 8 },
  title: { flex: 1, fontSize: 22, fontWeight: "800", color: colors.text },
  heart: { fontSize: 30, color: colors.muted },
  heartOn: { color: colors.heart },
  author: { color: colors.muted, fontSize: 15 },
  price: { fontSize: 20, fontWeight: "800", color: colors.indigo },
  stock: { color: colors.muted },
  desc: { color: colors.text, lineHeight: 22, marginTop: 4 },
  btn: { backgroundColor: colors.indigo, padding: 14, borderRadius: radius.md, alignItems: "center", marginTop: 12 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
