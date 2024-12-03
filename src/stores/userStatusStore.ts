// This code was provided from the zustand docs. I modified it to use our use case of controlling whether the user is viewing our website from a volunteer or organization point of view based on a global state that is stored using zustand.
"use client";

import {
  filterListingsWithOffset,
  getNumberOfPagesOfListingsWithFilter,
} from "@/app/explore/actions";
import { create } from "zustand";

export type UserStatusState = {
  userStatus: boolean;
  userListings: any;
  numberOfPages: number;
  initialTitle: string;
  initialDescription: string;
  initialSkills: string[];
};

export type UserStatusActions = {
  changeUserStatus: () => void;
  filterListings: (
    initialTitle: string,
    initialDescription: string,
    initialSkills: string[],
    limit: number,
    offset: number
  ) => Promise<void>;
  getNumberOfPages: (
    limit: number,
    title: string,
    description: string,
    skills: string[]
  ) => Promise<void>;
  setMetadata: (title: string, description: string, skills: string[]) => void;
};

export type UserStatusStore = UserStatusState & UserStatusActions;

export const defaultInitState: UserStatusState = {
  userStatus: false,
  userListings: [],
  numberOfPages: 0,
  initialTitle: "",
  initialDescription: "",
  initialSkills: [],
};

export const useUserStatusStore = create<UserStatusStore>((set) => ({
  ...defaultInitState,
  changeUserStatus: () =>
    set((state) => ({ ...state, userStatus: !state.userStatus })),
  filterListings: async (
    initialTitle: string,
    initialDescription: string,
    initialSkills: string[],
    limit: number,
    offset: number
  ): Promise<void> => {
    const [updatedListings] = await filterListingsWithOffset({
      title: initialTitle,
      description: initialDescription,
      skills: initialSkills,
      limit,
      offset,
    });
    set((state) => ({ ...state, userListings: updatedListings || [] }));
  },
  getNumberOfPages: async (
    limit: number,
    title: string,
    description: string,
    skills: string[]
  ): Promise<void> => {
    const [filterNumberOfPages, filterNumberOfPagesError] =
      await getNumberOfPagesOfListingsWithFilter({
        limit,
        title,
        description,
        skills,
      });
    set((state) => ({ ...state, numberOfPages: filterNumberOfPages || 0 }));
  },
  setMetadata: async (title: string, description: string, skills: string[]) => {
    set((state) => ({
      ...state,
      initialTitle: title,
      initialDescription: description,
      initialSkills: skills,
    }));
  },
}));

export default useUserStatusStore;
