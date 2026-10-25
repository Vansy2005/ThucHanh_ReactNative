import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { PHONES, PHONE_COLORS } from "../data/phones";
import { Stars } from "../components/Stars";
import { colors, formatPrice } from "../theme";
import { useFavorites } from "./FavoritesContext";
import { RootProps } from "./types";

export function ProductDetailsScreen({ route }: RootProps<"ProductDetails">) {
  const { id } = route.params;                              // TODO 4
  const phone = PHONES.find((p) => p.id === id);
  const { has, toggle } = useFavorites();
  if (!phone) {                                             // TODO 5
    return <View style={s.center}><Text>Không tìm thấy sản phẩm #{id}</Text></View>;
  }
  const saved = has(phone.id);
  return (                                                  // TODO 6
    <View style={s.root}>
      <Image source={PHONE_COLORS[phone.defaultColor].image} style={s.img} resizeMode="contain" />
      <Text style={s.name}>{phone.name}</Text>
      <Stars value={phone.rating} />
      <Text style={s.price}>{formatPrice(phone.price)}</Text>
      <Text style={s.muted}>Cung cấp bởi {phone.supplier}</Text>
      {/* TODO 7 */}
      <Pressable style={[s.btn, saved && s.btnOn]} onPress={() => toggle(phone.id)}>
        <Text style={[s.btnText, saved && { color: "#fff" }]}>{saved ? "♥ Đã lưu" : "♡ Lưu vào yêu thích"}</Text>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", padding: 16, gap: 8, alignItems: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  img: { width: 180, height: 260 },
  name: { fontSize: 18, fontWeight: "700", textAlign: "center", color: colors.text },
  price: { fontSize: 20, fontWeight: "700", color: colors.red },
  muted: { color: colors.muted },
  btn: { marginTop: 12, borderWidth: 1, borderColor: colors.red, borderRadius: 6, paddingVertical: 12, paddingHorizontal: 24 },
  btnOn: { backgroundColor: colors.red },
  btnText: { color: colors.red, fontWeight: "700" },
});
