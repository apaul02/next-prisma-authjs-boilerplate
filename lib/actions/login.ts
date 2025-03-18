"use server";

import { AuthError } from "next-auth";
import { signIn } from "../auth";
import { DEFAULT_REDIRECT_AFTER_LOGIN } from "@/routes";

export async function login(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT_AFTER_LOGIN
    })
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