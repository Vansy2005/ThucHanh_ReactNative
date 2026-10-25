import React, { createContext, useContext, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

type DrawerParamList = { Home: undefined; Profile: undefined; Settings: undefined };
const Drawer = createDrawerNavigator<DrawerParamList>();

// TODO 3 (nâng cao): Context cho notify / dark
interface SettingsCtx { notify: boolean; setNotify: (v: boolean) => void; dark: boolean; setDark: (v: boolean) => void }
const SettingsContext = createContext<SettingsCtx>({ notify: true, setNotify: () => {}, dark: false, setDark: () => {} });
const useSettings = () => useContext(SettingsContext);

function Page({ children }: { children: React.ReactNode }) {
  const { dark } = useSettings();
  return <View style={[s.center, { backgroundColor: dark ? "#111827" : "#fff" }]}>{children}</View>;
}
const useText = () => ({ color: useSettings().dark ? "#fff" : colors.text });

function HomeScreen() {
  const t = useText();
  return <Page><Text style={[s.big, t]}>Xin chào 👋</Text></Page>;
}
function ProfileScreen() {
  const t = useText();
  return (
    <Page>
      <View style={s.avatar}><Text style={s.avatarText}>NA</Text></View>
      <Text style={[s.big, t]}>Nguyễn Văn An</Text>
      <Text style={s.muted}>an.nguyen@example.com</Text>
    </Page>
  );
}

// TODO 1
function SettingsScreen() {
  const { notify, setNotify, dark, setDark } = useSettings();
  const t = useText();
  return (
    <Page>
      <View style={s.row}><Text style={[s.label, t]}>Nhận thông báo</Text><Switch value={notify} onValueChange={setNotify} /></View>
      <View style={s.row}><Text style={[s.label, t]}>Chế độ tối</Text><Switch value={dark} onValueChange={setDark} /></View>
      <Text style={[s.muted, { marginTop: 16 }]}>Thông báo: {notify ? "BẬT" : "TẮT"} · Giao diện: {dark ? "tối" : "sáng"}</Text>
    </Page>
  );
}

const ICONS: Record<keyof DrawerParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "home-outline", Profile: "person-outline", Settings: "settings-outline",
};
const TITLES: Record<keyof DrawerParamList, string> = { Home: "Trang chủ", Profile: "Hồ sơ", Settings: "Cài đặt" };

// TODO 2
export function DrawerApp() {
  const [notify, setNotify] = useState(true);
  const [dark, setDark] = useState(false);
  return (
    <SettingsContext.Provider value={{ notify, setNotify, dark, setDark }}>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={({ route }) => ({
            title: TITLES[route.name],
            drawerActiveTintColor: colors.red,
            drawerIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
          })}
        >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SettingsContext.Provider>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  big: { fontSize: 24, fontWeight: "700" },
  muted: { color: colors.muted },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: 260 },
  label: { fontSize: 16 },
});
