import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PRICE_RANGES, PriceRange } from "../utils/filters";
import { colors, radius } from "../theme";

interface Props {
  value: PriceRange;
  onChange: (v: PriceRange) => void;
}

// BT7.C2: 3 nút lọc khoảng giá (bấm lần nữa để bỏ chọn)
export function PriceFilter({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {PRICE_RANGES.map((r) => {
        const active = value === r.key;
        return (
          <Pressable key={r.key} onPress={() => onChange(active ? null : r.key)} style={[styles.btn, active && styles.btnActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{r.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, paddingHorizontal: 12, paddingBottom: 8 },
  btn: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.cyan, backgroundColor: "#fff" },
  btnActive: { backgroundColor: colors.cyan },
  text: { color: colors.cyan, fontWeight: "700", fontSize: 13 },
  textActive: { color: "#fff" },
});
