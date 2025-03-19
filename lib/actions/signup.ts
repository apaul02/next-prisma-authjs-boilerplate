"use server"

import bcrypt from "bcryptjs"
import { prisma } from "../db"
import { generateVerificationToken } from "../tokens"
import { sendVerificationEmail } from "../mail"

export async function signup(name: string, email: string, password: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (existingUser) {
      return {error: "User already exists"}
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })
    const verificationToken  = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Verification email sent" }
  }catch(err) {
    return { error: "Something went wrong" }
  }
}