// PROJECT GỘP — Giờ 4 + Giờ 5: toàn bộ app BookStore trong 1 project duy nhất.
// Luồng điều hướng (chỉ dùng useState, KHÔNG dùng thư viện navigation thật,
// đúng phạm vi bài tập "không đi sâu vào navigation"):
//
//   TabBar (4 tab: Trang chủ / Danh mục / Giỏ hàng / Tài khoản)
//     - Tab "Trang chủ"  -> HomeScreen (Giờ 4 - Bài 1)
//     - Tab "Giỏ hàng"   -> CartScreen (Giờ 5 - Bài 2)
//     - Tab "Danh mục"/"Tài khoản" -> Placeholder (ngoài phạm vi tài liệu)
//   Bấm vào 1 cuốn sách ở HomeScreen -> đẩy full-screen BookDetailScreen
//   (Giờ 4 - Bài 2), CHE TabBar đi vì màn Detail đã có thanh "Thêm vào giỏ"
//   cố định riêng của nó — tránh 2 thanh cố định chồng lên nhau ở đáy màn hình.
import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TabBar, TabKey } from './components/TabBar';
import { HomeScreen } from './screens/HomeScreen';
import { BookDetailScreen } from './screens/BookDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { BOOKS, CART_ITEMS } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const selectedBook = BOOKS.find((b) => b.id === selectedBookId) ?? null;

  // Đang xem chi tiết 1 cuốn sách -> hiển thị FULL MÀN HÌNH, không vẽ TabBar.
  if (selectedBook) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.body}>
          <BookDetailScreen
            book={selectedBook}
            onBack={() => setSelectedBookId(null)}
            onAddToCart={() => {
              setCartCount((n) => n + 1);
              setSelectedBookId(null);
              setActiveTab('cart'); // thêm xong -> quay lại và nhảy luôn sang tab Giỏ hàng
            }}
          />
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* flex:1 -> containing block cho TabBar (position:'absolute') bên dưới */}
      <View style={styles.body}>
        {activeTab === 'home' && (
          <HomeScreen
            cartCount={cartCount}
            onPressBook={(id) => setSelectedBookId(id)}
            onPressCart={() => setActiveTab('cart')}
          />
        )}
        {activeTab === 'cart' && <CartScreen items={CART_ITEMS} />}
        {(activeTab === 'category' || activeTab === 'account') && (
          <Placeholder tab={activeTab} />
        )}

        <TabBar active={activeTab} onChange={setActiveTab} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function Placeholder({ tab }: { tab: TabKey }) {
  const note: Record<TabKey, string> = {
    home: '',
    cart: '',
    category: 'Màn "Danh mục" nằm ngoài phạm vi bài tập Giờ 4-5, để trống.',
    account: 'Màn "Tài khoản" nằm ngoài phạm vi bài tập Giờ 4-5, để trống.',
  };
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{note[tab]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  body: { flex: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  placeholderText: { textAlign: 'center', color: '#5B6B7F' },
});
