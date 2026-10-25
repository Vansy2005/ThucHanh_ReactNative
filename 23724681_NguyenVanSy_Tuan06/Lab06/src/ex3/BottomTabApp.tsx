import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { PHONES } from "../data/phones";
import { colors } from "../theme";

type TabParamList = { Home: undefined; Search: undefined; Profile: undefined };
const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Home: ["home", "home-outline"],
  Search: ["search", "search-outline"],
  Profile: ["person", "person-outline"],
};
const TITLES: Record<keyof TabParamList, string> = { Home: "Trang chủ", Search: "Tìm kiếm", Profile: "Cá nhân" };

function HomeTab() {
  return (
    <FlatList data={PHONES} keyExtractor={(p) => p.id} contentContainerStyle={{ padding: 16, gap: 10 }}
      renderItem={({ item }) => (<View style={s.card}><Text>{item.name.split(" - ")[0]}</Text></View>)} />
  );
}

// TODO 1
function SearchTab() {
  const [keyword, setKeyword] = useState("");
  const result = PHONES.filter((p) => p.name.toLowerCase().includes(keyword.trim().toLowerCase()));
  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <TextInput value={keyword} onChangeText={setKeyword} placeholder="Nhập từ khóa" style={s.input} />
      {result.length === 0 ? (
        <Text style={s.empty}>Không có kết quả cho “{keyword}”</Text>
      ) : (
        <FlatList data={result} keyExtractor={(p) => p.id} contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (<View style={s.card}><Text>{item.name.split(" - ")[0]}</Text></View>)} />
      )}
    </View>
  );
}

// TODO 2
function ProfileTab() {
  return (
    <View style={s.center}>
      <View style={s.avatar}><Text style={s.avatarText}>N</Text></View>
      <Text style={s.name}>Nguyễn Văn An</Text>
      <Text style={s.muted}>an.nguyen@example.com</Text>
    </View>
  );
}

// TODO 3
export function BottomTabApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: colors.red,
          title: TITLES[route.name],
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeTab} />
        <Tab.Screen name="Search" component={SearchTab} />
        <Tab.Screen name="Profile" component={ProfileTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.line },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 10, backgroundColor: "#fff" },
  empty: { color: colors.muted, textAlign: "center", marginTop: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 40, fontWeight: "700" },
  name: { fontSize: 22, fontWeight: "700", color: colors.text, marginTop: 8 },
  muted: { color: colors.muted },
});
