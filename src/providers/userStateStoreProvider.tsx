// This code was provided from the zustand docs. I modified it to use our use case of controlling whether the user is viewing our website from a volunteer or organization point of view based on a global state that is stored using zustand.

"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type UserStatusStore,
  createUserStatusStore,
} from "@/stores/userStatusStore";

export type UserStatusStoreApi = ReturnType<typeof createUserStatusStore>;

export const UserStatusStoreContext = createContext<
  UserStatusStoreApi | undefined
>(undefined);

export interface UserStatusStoreProviderProps {
  children: ReactNode;
}

export const UserStatusStoreProvider = ({
  children,
}: UserStatusStoreProviderProps) => {
  const storeRef = useRef<UserStatusStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createUserStatusStore();
  }

  return (
    <UserStatusStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStatusStoreContext.Provider>
  );
};

export const useUserStatusStore = <T,>(
  selector: (store: UserStatusStore) => T
): T => {
  const userStateStoreContext = useContext(UserStatusStoreContext);

  if (!userStateStoreContext) {
    throw new Error(
      `useCounterStore must be used within UserStatusStoreProvider`
    );
  }

  return useStore(userStateStoreContext, selector);
};
