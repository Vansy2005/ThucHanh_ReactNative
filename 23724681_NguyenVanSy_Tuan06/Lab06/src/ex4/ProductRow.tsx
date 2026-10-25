import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Phone } from "../types";
import { PHONE_COLORS } from "../data/phones";
import { colors, formatPrice } from "../theme";

export function ProductRow({ phone, onPress }: { phone: Phone; onPress: () => void }) {
  return (
    <Pressable style={s.row} onPress={onPress}>
      <Image source={PHONE_COLORS[phone.defaultColor].image} style={s.img} resizeMode="contain" />
      <View style={{ flex: 1 }}>
        <Text style={s.name}>{phone.name.split(" - ")[0]}</Text>
        <Text style={s.price}>{formatPrice(phone.price)}</Text>
      </View>
    </Pressable>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#fff", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.line },
  img: { width: 48, height: 64 },
  name: { fontSize: 15, fontWeight: "600", color: colors.text },
  price: { color: colors.red, marginTop: 4, fontWeight: "700" },
});
