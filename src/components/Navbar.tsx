import NavbarClient from "@/components/NavbarClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { signOutAction } from "@/components/actions";

const Navbar = async () => {
  const authStatus = await auth();

  return <NavbarClient authStatus={authStatus as Session | undefined} signOut={signOutAction} />;
};

export default Navbar;