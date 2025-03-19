"use server";

import { prisma } from "../db";
import { getVerificationTokenByToken } from "../getVerificationToken";

export async function newVerification (token: string) {
  const exsitingToken = await getVerificationTokenByToken(token);

  if(!exsitingToken) {
    return { error: "Token does not exist." }
  }

  const hasExpired = new Date(exsitingToken.expires) < new Date();

  if(hasExpired) {
    return { error : "Token has expired." }
  }

  const exsitingUser = await prisma.user.findUnique({
    where: { email: exsitingToken.email }
  })

  if(!exsitingUser) {
    return { error: "Email does not exist." }
  }

  await prisma.user.update({
    where: { id: exsitingUser.id },
    data: {
      emailVerified: new Date(),
      email: exsitingToken.email
    }
  })

  await prisma.verificationToken.delete({
    where: { id: exsitingToken.id }
  })

  return { success: "Email verified successfully." }
}