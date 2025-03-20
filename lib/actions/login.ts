"use server";

import { AuthError } from "next-auth";
import { signIn } from "../auth";
import { DEFAULT_REDIRECT_AFTER_LOGIN } from "@/routes";
import { prisma } from "../db";
import { generateVerificationToken } from "../tokens";
import { sendVerificationEmail } from "../mail";

export async function login(email: string, password: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where : { email }
    })

    if(!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "User not found" }
    }

    if(!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(existingUser.email);
      await sendVerificationEmail(verificationToken.email, verificationToken.token);
      return { success : "Verification email sent" }
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false
    })
    return { success : "Login successful" }
  }catch(error) {
    if(error instanceof AuthError) {
      switch(error.message) {
        case "MISSING_CREDENTIALS":
          return {error: "Please enter your email and password"};
        case "USER_NOT_FOUND":
          return {error: "User not found"};
        case "INVALID_PASSWORD":
          return {error: "Invalid password"};
        default:
          return {error: "An error occurred"};
      }
    }
    throw error;
  }
}