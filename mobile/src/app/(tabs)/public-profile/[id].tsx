import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import PublicProfileScreen from "~/screens/PublicProfileScreen";

export default function ProfileRoute() {
  return (
    <>
      <HeaderSafeAreaView /> 
      <PublicProfileScreen />
    </>
  );
}
