import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "expo-router";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useChats } from "@/context/ChatContext";

const VISIBLE_MS = 4000;

const NotificationBanner = () => {
  const { notification, hideNotification, getChat } = useChats();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    if (!notification) {
      return;
    }

    translateY.setValue(-200);
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, { toValue: -200, duration: 250, useNativeDriver: true }).start(
        () => hideNotification()
      );
    }, VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [notification?.id]);

  if (!notification) {
    return null;
  }

  const chat = getChat(notification.chatId);

  const handlePress = () => {
    hideNotification();

    if (pathname.startsWith("/chat/")) {
      router.replace({ pathname: "/chat/[id]", params: { id: notification.chatId } });
      return;
    }

    if (pathname !== "/chats") {
      router.push("/chats");
    }
    router.push({ pathname: "/chat/[id]", params: { id: notification.chatId } });
  };

  return (
    <Animated.View
      style={[styles.wrapper, { top: insets.top + 8, transform: [{ translateY }] }]}
    >
      <TouchableOpacity style={styles.banner} activeOpacity={0.9} onPress={handlePress}>
        <View style={styles.appRow}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>✉</Text>
          </View>
          <Text style={styles.appName}>Messenger · сейчас</Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.avatar, { backgroundColor: chat?.color ?? "#999" }]}>
            <Text style={styles.avatarText}>{notification.title[0]}</Text>
          </View>
          <View style={styles.texts}>
            <Text style={styles.title} numberOfLines={1}>
              {notification.title}
            </Text>
            <Text style={styles.text} numberOfLines={2}>
              {notification.text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 8,
    right: 8,
    zIndex: 100,
    elevation: 100,
  },
  banner: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  appRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  appIcon: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: "#2b7de0",
    alignItems: "center",
    justifyContent: "center",
  },
  appIconText: {
    color: "#fff",
    fontSize: 11,
  },
  appName: {
    fontSize: 12,
    color: "#6b6b6b",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  texts: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f0f0f",
  },
  text: {
    fontSize: 14,
    color: "#3a3a3a",
  },
});

export default NotificationBanner;
