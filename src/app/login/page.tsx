import NavbarClient from "@/components/NavbarClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import {
  signInAction,
  signOutAction,
  getOneUserOrganization,
} from "@/components/actions";
import Login from "./login";

const Navbar = async () => {
  const authStatus = await auth();

  return (
    <Login
      authStatus={authStatus as Session | undefined}
      signOut={signOutAction}
      signIn={signInAction}
    />
  );
};

export default Navbar;
