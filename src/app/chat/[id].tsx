import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useChats } from "@/context/ChatContext";
import { Message } from "@/data/chats";
import { formatTime } from "@/lib/format";

const ChatScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getChat, sendMessage, markAsRead, setOpenedChat } = useChats();
  const [text, setText] = useState("");
  const listRef = useRef<FlatList<Message>>(null);

  const chat = getChat(id);

  useEffect(() => {
    setOpenedChat(id);
    return () => setOpenedChat(null);
  }, [id]);

  useEffect(() => {
    markAsRead(id);
  }, [id, chat?.messages.length]);

  if (!chat) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>Чат не найден</Text>
      </SafeAreaView>
    );
  }

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    sendMessage(chat.id, trimmed);
    setText("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.close}>Закрыть</Text>
        </TouchableOpacity>
        <View style={[styles.avatar, { backgroundColor: chat.color }]}>
          <Text style={styles.avatarText}>{chat.name[0]}</Text>
        </View>
        <Text style={styles.chatName} numberOfLines={1}>
          {chat.name}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={listRef}
          data={chat.messages}
          keyExtractor={(message) => message.id}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.fromMe ? styles.myBubble : styles.theirBubble]}>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageTime}>{formatTime(item.time)}</Text>
            </View>
          )}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Сообщение"
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.8}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef1f5",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6b6b6b",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  close: {
    fontSize: 15,
    color: "#2b7de0",
    fontWeight: "600",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  chatName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#0f0f0f",
  },
  body: {
    flex: 1,
  },
  messages: {
    padding: 12,
    gap: 6,
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#d4e7ff",
  },
  theirBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 15,
    color: "#0f0f0f",
  },
  messageTime: {
    fontSize: 11,
    color: "#8a8a8a",
    alignSelf: "flex-end",
    marginTop: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2b7de0",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ChatScreen;
