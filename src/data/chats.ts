export interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  time: number;
}

export interface Chat {
  id: string;
  name: string;
  color: string;
  messages: Message[];
  unread: number;
}

const minutesAgo = (minutes: number) => Date.now() - minutes * 60 * 1000;

export const initialChats: Chat[] = [
  {
    id: "mom",
    name: "Мама",
    color: "#e57373",
    unread: 0,
    messages: [
      { id: "mom-1", text: "Ты покушал?", fromMe: false, time: minutesAgo(90) },
      { id: "mom-2", text: "Да, всё хорошо", fromMe: true, time: minutesAgo(85) },
    ],
  },
  {
    id: "max",
    name: "Макс",
    color: "#64b5f6",
    unread: 0,
    messages: [
      { id: "max-1", text: "Сегодня в доту?", fromMe: false, time: minutesAgo(60) },
      { id: "max-2", text: "После пар", fromMe: true, time: minutesAgo(58) },
    ],
  },
  {
    id: "group",
    name: "Группа",
    color: "#81c784",
    unread: 0,
    messages: [
      { id: "group-1", text: "Кто сделал домашку по мобилкам?", fromMe: false, time: minutesAgo(40) },
    ],
  },
  {
    id: "teacher",
    name: "Преподаватель",
    color: "#ffb74d",
    unread: 0,
    messages: [
      { id: "teacher-1", text: "Не забудьте сдать ДЗ до пятницы", fromMe: false, time: minutesAgo(30) },
      { id: "teacher-2", text: "Хорошо, спасибо", fromMe: true, time: minutesAgo(29) },
    ],
  },
];

export const incomingTexts: Record<string, string[]> = {
  mom: ["Позвони, как освободишься", "Купи хлеба по дороге", "Ты шапку надел?", "Когда будешь дома?"],
  max: ["Заходи в игру", "Скинь конспект", "Ты где?", "Го гулять вечером"],
  group: ["Пара перенесена", "Кто-нибудь знает аудиторию?", "Скиньте ссылку на задание", "Завтра контрольная!"],
  teacher: ["Проверил ваши работы", "Завтра занятие онлайн", "Жду ссылку на репозиторий", "Отличная работа!"],
};
