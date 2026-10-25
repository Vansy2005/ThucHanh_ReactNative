import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "./src/theme";
import { PHONES } from "./src/data/phones";
import { SelectPhoneApp } from "./src/ex1/SelectPhoneApp";
import { SelectPhoneApi } from "./src/ex1/SelectPhoneApi";
import { BottomTabApp } from "./src/ex3/BottomTabApp";
import { StackTabApp } from "./src/ex4/StackTabApp";
import { DrawerApp } from "./src/ex5/DrawerApp";

const ITEMS: { key: string; title: string; render: () => React.ReactElement }[] = [
  { key: "1", title: "Bài 1: Select Phone (dữ liệu mẫu)", render: () => <SelectPhoneApp phone={PHONES[0]} /> },
  { key: "2", title: "Bài 2: Select Phone + API", render: () => <SelectPhoneApi /> },
  { key: "3", title: "Bài 3: Bottom Tab", render: () => <BottomTabApp /> },
  { key: "4", title: "Bài 4: Stack + Tab + Params", render: () => <StackTabApp /> },
  { key: "5", title: "Bài 5: Drawer", render: () => <DrawerApp /> },
];

export default function App() {
  const [current, setCurrent] = useState<string | null>(null);
  const item = ITEMS.find((i) => i.key === current);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {item ? (
          <View style={{ flex: 1 }}>
            <SafeAreaView edges={["top"]} style={s.bar}>
              <Pressable onPress={() => setCurrent(null)}><Text style={s.back}>← Menu</Text></Pressable>
            </SafeAreaView>
            <View style={{ flex: 1 }}>{item.render()}</View>
          </View>
        ) : (
          <SafeAreaView style={s.menu}>
            <Text style={s.h1}>Lab 06 · Navigation</Text>
            {ITEMS.map((i) => (
              <Pressable key={i.key} style={s.btn} onPress={() => setCurrent(i.key)}>
                <Text style={s.btnText}>{i.title}</Text>
              </Pressable>
            ))}
          </SafeAreaView>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
const s = StyleSheet.create({
  menu: { flex: 1, padding: 20, gap: 12, backgroundColor: colors.bg },
  h1: { fontSize: 24, fontWeight: "700", color: colors.navy, marginBottom: 12 },
  btn: { backgroundColor: colors.blue, padding: 16, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  bar: { backgroundColor: colors.navy, paddingHorizontal: 12, paddingBottom: 8 },
  back: { color: "#fff", fontWeight: "700", fontSize: 16, paddingTop: 6 },
});
