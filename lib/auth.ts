import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import GitHub from "next-auth/providers/github"




export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
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
        if(!existingUser || !existingUser.password) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password as string, existingUser.password);
        if(!isValid) {
          return null;
        }
        return existingUser;
      }
    })
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt({ token }) {
      return token;
    },
    session({ session, token, user}) {
      if(token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
})