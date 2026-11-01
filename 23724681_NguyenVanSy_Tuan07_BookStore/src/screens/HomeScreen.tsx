import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { PriceFilter } from "../components/PriceFilter";
import { BookGrid } from "../components/BookGrid";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getBooks } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import { getErrorMessage } from "../api/client";
import { useDebounce } from "../hooks/useDebounce";
import { filterBooks, PriceRange } from "../utils/filters";
import { useCart } from "../store/hooks";
import { TabScreenProps } from "../navigation/types";
import { Book, Category } from "../types";
import { colors, radius } from "../theme";

type SortOrder = "asc" | "desc" | null;

export function HomeScreen({ navigation, route }: TabScreenProps<"Home">) {
  // BT7.3d
  const { totalQuantity } = useCart();

  // BT7.5b: state dữ liệu + 3 trạng thái
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 2 API độc lập → gọi SONG SONG
      const [b, c] = await Promise.all([getBooks(), getCategories()]);
      setBooks(b);
      setCategories(c);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>(null);
  const [sort, setSort] = useState<SortOrder>(null); // câu hỏi bổ sung số 5

  // BT7.7a: chỉ lọc sau khi ngừng gõ 400 ms
  const debouncedKeyword = useDebounce(keyword, 400);

  // BT7.7c + câu 5: lọc kết hợp rồi sắp xếp (sắp xếp trên BẢN SAO, không đụng vào state books)
  const visibleBooks = useMemo(() => {
    const filtered = filterBooks(books, { keyword: debouncedKeyword, categoryId, priceRange });
    if (sort === null) return filtered;
    return [...filtered].sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
  }, [books, debouncedKeyword, categoryId, priceRange, sort]);

  // BT7.8b: nhận categoryId từ tab Danh mục, dùng xong thì xoá params để không áp dụng lại
  useEffect(() => {
    const id = route.params?.categoryId;
    if (id !== undefined) {
      setCategoryId(id);
      navigation.setParams({ categoryId: undefined });
    }
  }, [route.params?.categoryId, navigation]);

  // BT7.7e
  const hasFilter = keyword !== "" || categoryId !== null || priceRange !== null;
  const clearFilters = () => {
    setKeyword("");
    setCategoryId(null);
    setPriceRange(null);
  };

  const toggleSort = (v: Exclude<SortOrder, null>) => setSort((cur) => (cur === v ? null : v));

  // BT7.5c: loading → LoadingView · error → ErrorView · còn lại → lưới sách
  let content: React.ReactNode;
  if (loading) {
    content = <LoadingView label="Đang tải sách…" />;
  } else if (error) {
    content = <ErrorView message={error} onRetry={load} />;
  } else {
    content = (
      <BookGrid
        data={visibleBooks}
        // BT7.2a
        onPressBook={(b) => navigation.navigate("BookDetail", { bookId: b.id })}
        ListHeaderComponent={
          <View>
            <CategoryChips categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
            <PriceFilter value={priceRange} onChange={setPriceRange} />
            <View style={styles.sortRow}>
              <Text style={styles.sortLabel}>Sắp xếp:</Text>
              <Pressable style={[styles.sortBtn, sort === "asc" && styles.sortBtnActive]} onPress={() => toggleSort("asc")}>
                <Text style={[styles.sortText, sort === "asc" && styles.sortTextActive]}>Giá tăng dần ↑</Text>
              </Pressable>
              <Pressable style={[styles.sortBtn, sort === "desc" && styles.sortBtnActive]} onPress={() => toggleSort("desc")}>
                <Text style={[styles.sortText, sort === "desc" && styles.sortTextActive]}>Giá giảm dần ↓</Text>
              </Pressable>
            </View>
            {hasFilter && (
              <Pressable style={styles.clearChip} onPress={clearFilters}>
                <Text style={styles.clearText}>✕ Xóa bộ lọc</Text>
              </Pressable>
            )}
          </View>
        }
        // BT7.7d
        ListEmptyComponent={
          <EmptyState
            emoji="🔎"
            title="Không tìm thấy sách phù hợp"
            message="Hãy thử từ khoá khác hoặc bỏ bớt bộ lọc."
            actionLabel="Xóa bộ lọc"
            onAction={clearFilters}
          />
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="📚 BookStore" onSearchPress={() => setSearchOpen((v) => !v)} />
      {searchOpen && (
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          onClose={() => {
            setSearchOpen(false);
            setKeyword("");
          }}
        />
      )}
      {content}
      <FloatingCartButton count={totalQuantity} onPress={() => navigation.navigate("Cart")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  sortRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingBottom: 8 },
  sortLabel: { color: colors.muted, fontWeight: "600" },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: "#fff" },
  sortBtnActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  sortText: { color: colors.text, fontWeight: "600", fontSize: 12 },
  sortTextActive: { color: "#fff" },
  clearChip: { alignSelf: "flex-start", marginLeft: 12, marginBottom: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: "#FEE2E2" },
  clearText: { color: colors.danger, fontWeight: "700" },
});
