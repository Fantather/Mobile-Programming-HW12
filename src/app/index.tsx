import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useChats } from "@/context/ChatContext";
import { formatTime } from "@/lib/format";

const HomeScreen = () => {
  const router = useRouter();
  const { chats } = useChats();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadTotal = chats.reduce((sum, chat) => sum + chat.unread, 0);
  const date = new Date(now).toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.clockBlock}>
        <Text style={styles.clock}>{formatTime(now)}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <View style={styles.dock}>
        <TouchableOpacity
          style={styles.app}
          activeOpacity={0.7}
          onPress={() => router.push("/chats")}
        >
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>✉</Text>
            {unreadTotal > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadTotal}</Text>
              </View>
            )}
          </View>
          <Text style={styles.appName}>Messenger</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e2a44",
    padding: 24,
  },
  clockBlock: {
    marginTop: 80,
    alignItems: "center",
  },
  clock: {
    fontSize: 72,
    fontWeight: "200",
    color: "#fff",
  },
  date: {
    fontSize: 16,
    color: "#d0d8e8",
  },
  dock: {
    marginTop: "auto",
    marginBottom: 24,
    alignItems: "center",
  },
  app: {
    alignItems: "center",
    gap: 6,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#2b7de0",
    alignItems: "center",
    justifyContent: "center",
  },
  appIconText: {
    color: "#fff",
    fontSize: 30,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: "#e02b2b",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  appName: {
    color: "#fff",
    fontSize: 13,
  },
});

export default HomeScreen;
