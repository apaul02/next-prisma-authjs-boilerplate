import { prisma } from "./db";

export async function getPasswordResetTokenByToken(token: string) {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })
    return passwordResetToken;
  }catch {
    return null;
  }
}

export async function getPasswordTokenByEmail(email: string) {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { email }
    })
    return passwordResetToken;
  }catch {
    return null;
  }
}