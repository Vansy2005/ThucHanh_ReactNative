import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { NotificationItem } from "../components/NotificationItem";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getNotifications, markAsRead } from "../services/notificationService";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { AppNotification } from "../types";
import { colors } from "../theme";

export function NotificationsScreen({ navigation }: RootScreenProps<"Notifications">) {
  const { user, isLoggedIn } = useAuth();
  const [data, setData] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // BT9.5c: tải danh sách thông báo
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      setData(await getNotifications(user.id));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    load();
  }, [load]);

  const setRead = (id: number, read: boolean) =>
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, read } : x)));

  // BT9.5d: cập nhật lạc quan + điều hướng theo dữ liệu
  const open = async (n: AppNotification) => {
    if (!n.read) {
      setRead(n.id, true); // (1) đổi giao diện NGAY
      markAsRead(n.id).catch(() => setRead(n.id, false)); // lỗi API → hoàn lại chưa đọc
    }
    // (2) chuyển tới màn liên quan nếu thông báo có gắn đích
    if (n.target?.screen === "Orders") navigation.navigate("Orders");
    else if (n.target?.screen === "BookDetail" && n.target.bookId) navigation.navigate("BookDetail", { bookId: n.target.bookId });
  };

  if (!isLoggedIn) {
    return <EmptyState emoji="🔒" title="Bạn cần đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      {/* BT9.5e */}
      <FlatList
        data={data}
        keyExtractor={(n) => String(n.id)}
        contentContainerStyle={{ padding: 12, gap: 8, flexGrow: 1 }}
        renderItem={({ item }) => <NotificationItem item={item} onPress={open} />}
        ListEmptyComponent={<EmptyState emoji="🔔" title="Chưa có thông báo nào" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.bg } });
