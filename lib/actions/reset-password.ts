"use server";

import { z } from "zod";
import { prisma } from "../db";
import { resetSchema } from "../schemas";
import { generatePasswordResetToken } from "../tokens";
import { sendPasswordResetEmail } from "../mail";

export async function reset(values: z.infer<typeof resetSchema>) {
  const validateFields = resetSchema.safeParse(values);

  if(!validateFields.success) {
    return { error: "Invalid email address!" }
  } 

  const { email } = validateFields.data;

  const existingUser = await prisma.user.findFirst({
    where: { email }
  })

  if(!existingUser) {
    return { error: "User not found" }
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);



  return { success: "Password reset email sent" }
}