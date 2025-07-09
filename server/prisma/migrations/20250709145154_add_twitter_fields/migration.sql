/*
  Warnings:

  - You are about to drop the `twitter_account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `twitter_post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[twitterId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "twitterAccessToken" TEXT,
ADD COLUMN     "twitterId" TEXT,
ADD COLUMN     "twitterRefreshToken" TEXT,
ADD COLUMN     "twitterUsername" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "password" DROP NOT NULL;

-- DropTable
DROP TABLE "twitter_account";

-- DropTable
DROP TABLE "twitter_post";

-- CreateIndex
CREATE UNIQUE INDEX "user_twitterId_key" ON "user"("twitterId");
