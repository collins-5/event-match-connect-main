// app/(tabs)/chat/hooks/useSingleChat.ts

import { useLocalSearchParams } from "expo-router";

export type Message = {
    id: string;
    role: "user" | "friend";
    content: string;
    time: string;
};

const chatData: Record<string, { name: string; messages: Message[] }> = {
    "1": {
        name: "Alex Kimani",
        messages: [
            { id: "1", role: "friend", content: "Yo! You going to that AfroBeat Night at K1 this Friday?", time: "2:31 PM" },
            { id: "2", role: "user", content: "Wait, there's an AfroBeat event?! When did this happen?", time: "2:33 PM" },
            { id: "3", role: "friend", content: "Bro it's been trending all week! DJ Grauchi is headlining + live band. Tickets are moving fast", time: "2:34 PM" },
            { id: "4", role: "user", content: "No way! I've been looking for something good. What's the vibe? Dress code?", time: "2:35 PM" },
            { id: "5", role: "friend", content: "Smart casual, Ankara touches if you have. I'm wearing that green shirt you said looks good on me", time: "2:36 PM" },
            { id: "6", role: "user", content: "Bet. I'm coming with Sarah and Mike. You bringing anyone?", time: "2:37 PM" },
            { id: "7", role: "friend", content: "Yeah, bringing Amina and her cousin from Mombasa. She's new in town, trying to show her Nairobi nightlife", time: "2:38 PM" },
            { id: "8", role: "user", content: "Perfect! More the merrier. What time should we link up?", time: "2:39 PM" },
            { id: "9", role: "friend", content: "Let's meet at Java Westlands at 8 PM for dinner first, then head to K1 together. Sound good?", time: "2:40 PM" },
            { id: "10", role: "user", content: "Done deal. Already excited!", time: "2:40 PM" },
            { id: "11", role: "friend", content: "Same! This is gonna be legendary", time: "2:41 PM" },
            { id: "12", role: "user", content: "Just booked my ticket", time: "2:42 PM" },
            { id: "13", role: "friend", content: "Legend! See you Friday", time: "2:42 PM" },
        ],
    },

    "2": {
        name: "Sarah Wanjiku",
        messages: [
            { id: "1", role: "friend", content: "Hey! You free Friday night?", time: "1:10 PM" },
            { id: "2", role: "user", content: "Yeah what's up?", time: "1:12 PM" },
            { id: "3", role: "friend", content: "There's a rooftop jazz night at The Alchemist. Live sax, cocktails, city views", time: "1:13 PM" },
            { id: "4", role: "user", content: "That sounds amazing. I'm in", time: "1:14 PM" },
            { id: "5", role: "friend", content: "Yes! Starts at 7, but let's get there early for good seats", time: "1:15 PM" },
            { id: "6", role: "user", content: "Cool, 6:30?", time: "1:16 PM" },
            { id: "7", role: "friend", content: "Perfect. I'll pick you up?", time: "1:17 PM" },
            { id: "8", role: "user", content: "No need, I'll drive. See you there!", time: "1:18 PM" },
            { id: "9", role: "friend", content: "Can't wait", time: "1:18 PM" },
            { id: "10", role: "user", content: "Same here", time: "1:19 PM" },
        ],
    },

    "3": {
        name: "Nairobi Events Group",
        messages: [
            { id: "1", role: "friend", content: "Mike: Anyone going to Blankets & Wine this Sunday?", time: "11:30 AM" },
            { id: "2", role: "friend", content: "Grace: I'm in! Who else?", time: "11:32 AM" },
            { id: "3", role: "user", content: "Count me in too! Been waiting for this", time: "11:35 AM" },
            { id: "4", role: "friend", content: "Kevin: Bringing my speaker + cooler", time: "11:38 AM" },
            { id: "5", role: "friend", content: "Aisha: I'll bring snacks", time: "11:40 AM" },
            { id: "6", role: "user", content: "Perfect squad forming", time: "11:42 AM" },
            { id: "7", role: "friend", content: "Mike: Let's meet at the main gate at 12 PM", time: "11:45 AM" },
            { id: "8", role: "user", content: "See y'all there!", time: "11:46 AM" },
            { id: "9", role: "friend", content: "Grace: This is gonna be epic", time: "11:47 AM" },
            { id: "10", role: "friend", content: "Kevin: Already packed my shades", time: "11:48 AM" },
        ],
    },

    "4": {
        name: "Amina",
        messages: [
            { id: "1", role: "friend", content: "Just landed in Nairobi!", time: "Yesterday" },
            { id: "2", role: "user", content: "Welcome!! How was the flight?", time: "Yesterday" },
            { id: "3", role: "friend", content: "Long but good. So excited to finally be here", time: "Yesterday" },
            { id: "4", role: "user", content: "You made it! When do you want to link up?", time: "Yesterday" },
            { id: "5", role: "friend", content: "This weekend? Show me the real Nairobi", time: "Yesterday" },
            { id: "6", role: "user", content: "Say less. Saturday night we go out", time: "Yesterday" },
            { id: "7", role: "friend", content: "I'm ready", time: "Yesterday" },
            { id: "8", role: "user", content: "It's about to be a movie", time: "Yesterday" },
            { id: "9", role: "friend", content: "Can't wait", time: "Yesterday" },
            { id: "10", role: "user", content: "Rest up. Nairobi starts tomorrow", time: "Yesterday" },
        ],
    },

    "5": {
        name: "DJ Grauchi",
        messages: [
            { id: "1", role: "friend", content: "New mix dropping tonight at 9 PM", time: "Mon" },
            { id: "2", role: "user", content: "Finally! Been waiting for this", time: "Mon" },
            { id: "3", role: "friend", content: "This one is special. Afro house + amapiano", time: "Mon" },
            { id: "4", role: "user", content: "My body is ready", time: "Mon" },
            { id: "5", role: "friend", content: "Link in bio at 9 sharp", time: "Mon" },
            { id: "6", role: "user", content: "Setting reminder now", time: "Mon" },
            { id: "7", role: "friend", content: "Appreciate you fam", time: "Mon" },
            { id: "8", role: "user", content: "Always supporting", time: "Mon" },
            { id: "9", role: "friend", content: "Means a lot", time: "Mon" },
            { id: "10", role: "user", content: "See you at the top", time: "Mon" },
            { id: "11", role: "friend", content: "Facts", time: "Mon" },
        ],
    },
};

export const useSingleChat = () => {
    const { id } = useLocalSearchParams() as { id: string };

    const chat = chatData[id] || { name: "Unknown Chat", messages: [] };

    return {
        chatName: chat.name,
        messages: chat.messages,
    };
};