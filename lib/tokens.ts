import { v4 as uuidv4 } from 'uuid';
import { getVerificationTokenByEmail } from './getVerificationToken';
import { prisma } from './db';

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