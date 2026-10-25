import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export function Loading() {
  return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={colors.blue} />
      <Text style={s.text}>Đang tải...</Text>
    </View>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={s.center}>
      <Text style={[s.text, { color: colors.red, fontWeight: "700" }]}>{message}</Text>
      <Pressable style={s.btn} onPress={onRetry}><Text style={s.btnText}>THỬ LẠI</Text></Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 20 },
  text: { fontSize: 16, color: colors.text },
  btn: { backgroundColor: colors.blue, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 6 },
  btnText: { color: "#fff", fontWeight: "700" },
});
