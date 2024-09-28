"use server";

import { signOut, auth } from "@/auth";

export const signOutAction = async () => {
  return await signOut();
};

export const uploadFile = () => {};
