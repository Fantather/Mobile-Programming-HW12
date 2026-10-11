import React, { createContext, useContext, useEffect, useRef, useState } from "react";

import { Chat, incomingTexts, initialChats } from "@/data/chats";

export interface IncomingNotification {
  id: string;
  chatId: string;
  title: string;
  text: string;
}

interface ChatContextType {
  chats: Chat[];
  notification: IncomingNotification | null;
  getChat: (chatId: string) => Chat | undefined;
  sendMessage: (chatId: string, text: string) => void;
  markAsRead: (chatId: string) => void;
  setOpenedChat: (chatId: string | null) => void;
  hideNotification: () => void;
}

const MIN_DELAY_MS = 5000;
const MAX_DELAY_MS = 15000;

const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const randomDelay = () => MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [notification, setNotification] = useState<IncomingNotification | null>(null);
  const openedChatId = useRef<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      timer = setTimeout(() => {
        const chat = randomItem(initialChats);
        const id = `${chat.id}-${Date.now()}`;
        const text = randomItem(incomingTexts[chat.id]);
        const isOpened = openedChatId.current === chat.id;

        setChats((prev) =>
          prev.map((c) =>
            c.id === chat.id
              ? {
                  ...c,
                  unread: isOpened ? 0 : c.unread + 1,
                  messages: [...c.messages, { id, text, fromMe: false, time: Date.now() }],
                }
              : c
          )
        );

        if (!isOpened) {
          setNotification({ id, chatId: chat.id, title: chat.name, text });
        }

        scheduleNext();
      }, randomDelay());
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  const getChat = (chatId: string) => chats.find((chat) => chat.id === chatId);

  const sendMessage = (chatId: string, text: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { id: `${chatId}-me-${Date.now()}`, text, fromMe: true, time: Date.now() },
              ],
            }
          : chat
      )
    );
  };

  const markAsRead = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId && chat.unread > 0 ? { ...chat, unread: 0 } : chat))
    );
  };

  const setOpenedChat = (chatId: string | null) => {
    openedChatId.current = chatId;
    if (chatId) {
      setNotification((current) => (current?.chatId === chatId ? null : current));
    }
  };

  const hideNotification = () => setNotification(null);

  return (
    <ChatContext.Provider
      value={{
        chats,
        notification,
        getChat,
        sendMessage,
        markAsRead,
        setOpenedChat,
        hideNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChats = () => useContext(ChatContext);
