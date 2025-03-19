import NextAuth, { type DefaultSession } from "next-auth";
import { prisma } from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config";

declare module "next-auth" {
  interface Session {
    user: {
      role: 'USER' | 'ADMIN';
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {strategy: "jwt"},
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, account}) {
      if(account?.provider !== 'credentials') return true;

      const existingUser = await prisma.user.findUnique({
        where : { id : user.id }
      })
      if(!existingUser?.emailVerified) {
        return false;
      }
      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await prisma.user.findUnique({ where: { id: token.sub}});

      if(!existingUser) return token;

      token.role = existingUser.role;
      return token;


    },
    session({ session, token}) {
      if(token.sub && session.user) {
        session.user.id = token.sub;
      }

      if(token.role && session.user) {
        session.user.role = token.role as 'USER' | 'ADMIN';
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
})