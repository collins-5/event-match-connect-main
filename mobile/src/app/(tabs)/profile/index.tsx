import { ProfileScreen } from "@/screens/ProfileScreen";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function ProfileRoute() {
  return (
    <>
      <HeaderSafeAreaView /> 
      <ProfileScreen />
    </>
  );
}
