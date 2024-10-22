import NavbarClient from "@/components/NavbarClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { signOutAction, getOneUserOrganization } from "./actions";

const Navbar = async () => {
  const authStatus = await auth();
  const [userHasOrganization, error] = await getOneUserOrganization();

  return (
    <NavbarClient
      authStatus={authStatus as Session | undefined}
      signOut={signOutAction}
      userHasOrganization={userHasOrganization || false}
    />
  );
};

export default Navbar;
