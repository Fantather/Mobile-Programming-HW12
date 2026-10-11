import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useChats } from "@/context/ChatContext";
import { formatTime } from "@/lib/format";

const ChatListScreen = () => {
  const router = useRouter();
  const { chats } = useChats();

  const sortedChats = [...chats].sort(
    (a, b) => (b.messages.at(-1)?.time ?? 0) - (a.messages.at(-1)?.time ?? 0)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.back}>‹ Домой</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Чаты</Text>
      </View>

      <FlatList
        data={sortedChats}
        keyExtractor={(chat) => chat.id}
        renderItem={({ item }) => {
          const lastMessage = item.messages.at(-1);

          return (
            <TouchableOpacity
              style={styles.chatRow}
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: "/chat/[id]", params: { id: item.id } })}
            >
              <View style={[styles.avatar, { backgroundColor: item.color }]}>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
              </View>

              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {lastMessage && <Text style={styles.time}>{formatTime(lastMessage.time)}</Text>}
                </View>

                <View style={styles.chatHeader}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {lastMessage ? `${lastMessage.fromMe ? "Вы: " : ""}${lastMessage.text}` : ""}
                  </Text>
                  {item.unread > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 4,
  },
  back: {
    fontSize: 15,
    color: "#2b7de0",
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0f0f0f",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  chatInfo: {
    flex: 1,
    gap: 4,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  chatName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#0f0f0f",
  },
  time: {
    fontSize: 12,
    color: "#8a8a8a",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: "#6b6b6b",
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: "#2b7de0",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default ChatListScreen;
