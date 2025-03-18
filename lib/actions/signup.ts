"use server"

import bcrypt from "bcryptjs"
import { prisma } from "../db"

export async function signup(name: string, email: string, password: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (existingUser) {
      throw new Error("User already exists")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })
    return user
  }catch(err) {
    console.log(err)
  }
}