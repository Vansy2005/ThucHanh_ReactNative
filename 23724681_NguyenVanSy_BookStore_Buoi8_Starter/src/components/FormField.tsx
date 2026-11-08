import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors, radius } from "../theme";

interface Props extends TextInputProps {
  label: string;
  error?: string | null; // có lỗi → viền đỏ + dòng báo lỗi NGAY DƯỚI ô nhập
  accessory?: React.ReactNode; // nút nhỏ nằm bên phải ô nhập (ví dụ 👁 hiện/ẩn mật khẩu)
}

export function FormField({ label, error, style, accessory, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          style={[styles.input, error ? styles.inputError : null, accessory ? styles.inputWithAccessory : null, style]}
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          {...rest}
        />
        {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  label: { fontWeight: "700", color: colors.text },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, color: colors.text },
  inputWithAccessory: { paddingRight: 44 },
  accessory: { position: "absolute", right: 8, top: 0, bottom: 0, justifyContent: "center" },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 12 },
});
