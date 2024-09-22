import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { database } from "./database";
import type { DefaultSession, NextAuthConfig } from "next-auth";

const config = {
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: DrizzleAdapter(database),
  providers: [
    Google({
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;

      return session;
    },
  },
} satisfies NextAuthConfig;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
