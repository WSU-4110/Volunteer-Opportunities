// This code was provided from the zustand docs. I modified it to use our use case of controlling whether the user is viewing our website from a volunteer or organization point of view based on a global state that is stored using zustand.
"use client";

import { create } from "zustand";

export type UserStatusState = {
  userStatus: boolean;
};

export type UserStatusActions = {
  changeUserStatus: () => void;
};

export type UserStatusStore = UserStatusState & UserStatusActions;

export const defaultInitState: UserStatusState = {
  userStatus: false,
};

export const useUserStatusStore = create<UserStatusStore>((set) => ({
  ...defaultInitState,
  changeUserStatus: () =>
    set((state) => ({ ...state, userStatus: !state.userStatus })),
}));

export default useUserStatusStore;
