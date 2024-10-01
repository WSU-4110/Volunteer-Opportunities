"use server";

import { signOut, auth } from "@/auth";

export const signOutAction = async () => {
  await signOut({ redirect: true, redirectTo: "/" });
};
