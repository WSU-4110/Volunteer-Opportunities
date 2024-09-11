import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { accounts, sessions, users, verificationTokens } from "@/database/schema"
import { database } from "./database"
import type { NextAuthConfig } from "next-auth"

console.log(process.env.GOOGLE_CLIENT_SECRET)

const config = {
    theme: { logo: "https://authjs.dev/img/logo-sm.png" },
    adapter: DrizzleAdapter(database),
    providers: [
      Google({
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        clientId: process.env.GOOGLE_CLIENT_ID || ""
      })
    ],
  } satisfies NextAuthConfig
  
  export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config);