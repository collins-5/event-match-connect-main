// app/(tabs)/chat/hooks/useChatInbox.ts
import { useRouter } from "expo-router";

export type Conversation = {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
};

const conversations: Conversation[] = [
    { id: "1", name: "Alex Kimani", lastMessage: "This is gonna be legendary", time: "2:41 PM", unread: 2 },
    { id: "2", name: "Sarah Wanjiku", lastMessage: "Are we still meeting at Java at 8?", time: "1:15 PM", unread: 0 },
    { id: "3", name: "Nairobi Events Group", lastMessage: "Mike: Anyone going to Blankets & Wine this Sunday?", time: "12:03 PM", unread: 8 },
    { id: "4", name: "Amina", lastMessage: "Just landed! Can't wait to explore", time: "Yesterday", unread: 0 },
    { id: "5", name: "DJ Grauchi", lastMessage: "New mix dropping tonight", time: "Mon", unread: 1 },
];

export const useChatInbox = () => {
    const router = useRouter();

    const openChat = (id: string) => {
        router.push(`/chat/${id}`);
    };

    return {
        conversations,
        openChat,
    };
};