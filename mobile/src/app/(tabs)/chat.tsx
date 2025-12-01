import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import { ChatScreen } from "~/screens/ChatScreen";

export default function ChatRoute() {
  return (
    <>
      <HeaderSafeAreaView />
      <ChatScreen />
    </>
  );
}
