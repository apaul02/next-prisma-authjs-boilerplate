import { v4 as uuidv4 } from 'uuid';
import { getVerificationTokenByEmail } from './getVerificationToken';
import { prisma } from './db';
import { getPasswordTokenByEmail } from './getPasswordResetToken';

export async function generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if(existingToken) {
    await prisma.verificationToken.delete({
      where : {
        id: existingToken.id
      }
    })
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires
    }
  })
  return verificationToken;
}

export const generatePasswordResetToken = async(email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordTokenByEmail(email);

  if(existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  })
  return passwordResetToken;
}