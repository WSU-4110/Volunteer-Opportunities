// This code was provided from the zustand docs. I modified it to use our use case of controlling whether the user is viewing our website from a volunteer or organization point of view based on a global state that is stored using zustand.
import { createStore } from "zustand/vanilla";

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

export const createUserStatusStore = (
  initState: UserStatusState = defaultInitState
) => {
  return createStore<UserStatusStore>()((set) => ({
    ...initState,
    changeUserStatus: () =>
      set((state) => ({ ...state, userStatus: !state.userStatus })),
  }));
};
