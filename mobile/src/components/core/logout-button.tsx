// ~/components/auth/LogoutButton.tsx
import { Button } from "~/components/ui/button";
import { useProfile } from "~/hooks/useProfile";
import { LogoutSheet } from "../ui/sheets/logout-sheet";

export default function LogoutButton() {
   const { handleSignOut, logout, setLogout } = useProfile();

  return (
    <>
      <Button
        text={"Log Out"}
        onPress={() => setLogout(true)}
        variant="destructiveoutline"
        size="default"
        className="w-full text-center"
      />

      <LogoutSheet
        visible={logout}
        onClose={() => setLogout(false)}
        handleSignOut={handleSignOut}
      />
    </>
  );
}
