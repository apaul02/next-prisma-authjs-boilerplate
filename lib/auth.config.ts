import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import { prisma } from "./db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
 
export default { providers: [
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
  ] } satisfies NextAuthConfig