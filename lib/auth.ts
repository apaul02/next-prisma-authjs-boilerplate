import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username: string;
    } & DefaultSession["user"];
  }
  interface User {
    username: string;
  }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "text", placeholder: ""},
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        };
        const existingUser = await prisma.user.findUnique({
          where : {email: credentials.email as string}
        })
        if(!existingUser) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password as string, existingUser.password);
        if(!isValid) {
          return null;
        }
        return {
          id: String(existingUser.id),
          email: existingUser.email,
          name: existingUser.name,
          username: existingUser.username
        }
      }
    })
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt({ token, user}) {
      if(user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    session({ session, token, user}) {
      if(token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
})