import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import NotificationBanner from "@/components/notification-banner";
import { ChatProvider } from "@/context/ChatContext";

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ChatProvider>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="chats" options={{ headerShown: false }} />
            <Stack.Screen name="chat/[id]" options={{ presentation: "modal", headerShown: false }} />
          </Stack>
          <NotificationBanner />
        </View>
      </ChatProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
