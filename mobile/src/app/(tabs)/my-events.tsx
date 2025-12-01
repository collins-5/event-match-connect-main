import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import { MyEventsScreen } from "~/screens/MyEventsScreen";

export default function EventsRoute() {
  return (
    <>
      <HeaderSafeAreaView /> <MyEventsScreen />{" "}
    </>
  );
}
