import { HomeScreen } from "@/screens/HomeScreen";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function HomeRoute() {
  return (
    <>
      <HeaderSafeAreaView />
      <HomeScreen />
    </>
  );
}
