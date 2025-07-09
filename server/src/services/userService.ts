
import { PrismaClient } from '../../src/generated/prisma';
import { User } from '../types/user';

const prisma = new PrismaClient();

export const createOrUpdateTwitterUser = async (userData: {
  twitterId: string;
  username?: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
  name: string;
}): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { twitterId: userData.twitterId },
  });

  if (existingUser) {
    // Update existing user
    const updatedUser = await prisma.user.update({
      where: { twitterId: userData.twitterId },
      data: {
        twitterUsername: userData.username,
        twitterAccessToken: userData.accessToken,
        twitterRefreshToken: userData.refreshToken,
        lastLogin: new Date(),
        name: userData.name,
        email: userData.email,
      },
    });
    return { ...updatedUser, password: updatedUser.password ?? undefined };
  } else {
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        twitterId: userData.twitterId,
        twitterUsername: userData.username,
        twitterAccessToken: userData.accessToken,
        twitterRefreshToken: userData.refreshToken,
        lastLogin: new Date(),
      },
    });
    return { ...newUser, password: newUser.password ?? undefined };
  }
};

export const getUserByTwitterId = async (twitterId: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { twitterId },
  });
  return user ? { ...user, password: user.password ?? undefined } : null;
};

export const updateLastLogin = async (twitterId: string): Promise<void> => {
  await prisma.user.update({
    where: { twitterId },
    data: { lastLogin: new Date() },
  });
};

export const disconnectTwitterUser = async (twitterId: string): Promise<void> => {
  await prisma.user.update({
    where: { twitterId },
    data: {
      twitterAccessToken: null,
      twitterRefreshToken: null,
    },
  });
};