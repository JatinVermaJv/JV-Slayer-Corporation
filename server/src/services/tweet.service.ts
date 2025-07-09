import { PrismaClient } from '../generated/prisma';
import { TweetStatus } from '../generated/prisma';

const prisma = new PrismaClient();

export const createTweet = async (userId: number, content: string, scheduledFor?: Date) => {
  return prisma.tweet.create({
    data: {
      userId,
      content,
      scheduledFor,
      status: scheduledFor ? TweetStatus.SCHEDULED : TweetStatus.POSTED,
      postedAt: scheduledFor ? null : new Date(),
    },
  });
};

export const getUserTweets = async (userId: number) => {
  return prisma.tweet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getScheduledTweets = async (userId: number) => {
  return prisma.tweet.findMany({
    where: { userId, status: TweetStatus.SCHEDULED },
    orderBy: { scheduledFor: 'asc' },
  });
};

export const updateTweetStatus = async (tweetId: number, status: TweetStatus, twitterPostId?: string) => {
  return prisma.tweet.update({
    where: { id: tweetId },
    data: {
      status,
      twitterPostId,
      postedAt: status === TweetStatus.POSTED ? new Date() : undefined,
    },
  });
};

export const deleteTweet = async (tweetId: number) => {
  return prisma.tweet.delete({
    where: { id: tweetId },
  });
};
