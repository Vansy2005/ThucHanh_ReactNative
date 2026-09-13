// TỔNG HỢP GIỜ 1 + 2 + 3 — Màn hình Trang chủ BookStore
// Ghép: Header (giờ 1) + CategoryChips (giờ 2) + BookGrid có DiscountBadge (giờ 2/3)
// + FloatingCartButton (giờ 3), đúng thứ tự yêu cầu của đề bài.
import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from './components/Header';
import { CategoryChips } from './components/CategoryChips';
import { BookGrid } from './components/BookGrid';
import { FloatingCartButton } from './components/FloatingCartButton';
import { BOOKS } from './data';

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <View style={styles.screen}>
      {/* 1. Header cố định trên cùng — nằm NGOÀI ScrollView nên không cuộn theo */}
      <Header />

      {/* 2. ScrollView chứa Chips + Grid — paddingBottom đủ lớn để
          FloatingCartButton không che mất sách cuối cùng */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <CategoryChips />

        <Text style={styles.sectionTitle}>Sách nổi bật</Text>
        <BookGrid
          books={BOOKS}
          onPressBook={(id) => {
            // Chưa yêu cầu điều hướng — chỉ log để kiểm tra bấm được vào item
            console.log('Mở sách', id);
            setCartCount((n) => n + 1);
          }}
        />
      </ScrollView>

      {/* 3. Nút giỏ nổi — NGOÀI ScrollView, luôn đè lên trên khi cuộn */}
      <FloatingCartButton count={cartCount} onPress={() => setCartCount((n) => n + 1)} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
    marginTop: 4,
  },
});
