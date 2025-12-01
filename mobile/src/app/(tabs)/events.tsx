import { EventsScreen } from "@/screens/EventsScreen";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function EventsRoute() {
  return (
    <>
      <HeaderSafeAreaView />
      <EventsScreen />
    </>
  );
}
