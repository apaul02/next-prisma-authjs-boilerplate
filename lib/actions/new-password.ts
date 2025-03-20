"use server";

import { z } from "zod";
import { NewPasswordSchema } from "../schemas";
import { getPasswordResetTokenByToken } from "../getPasswordResetToken";
import { prisma } from "../db";
import bcrypt from "bcryptjs";

export const newPassword =  async (values: z.infer<typeof NewPasswordSchema>, token? : string | null) => {
  if(!token) {
    return { error: "Missing token" }
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if(!validatedFields.success) {
    return { error: "Invalid Password"}
  }

  const { password } = validatedFields.data;

  const exsitingToken = await getPasswordResetTokenByToken(token);

  if(!exsitingToken) {
    return { error: "Invalid token" }
  }

  const hasExpired = new Date() > new Date(exsitingToken.expires);

  if(hasExpired) {
    return { error : "Token has expired" }
  }

  const exsitingUser = await prisma.user.findUnique({
    where: { email: exsitingToken.email }
  })

  if(!exsitingUser) {
    return { error: "User not found" }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: exsitingUser.id },
    data: {
      password: hashedPassword
    }
  })

  await prisma.passwordResetToken.delete({
    where : { id: exsitingToken.id }
  })

  return { success: "Password updated" }
}