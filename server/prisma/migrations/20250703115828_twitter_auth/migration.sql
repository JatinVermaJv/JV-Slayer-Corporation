-- CreateTable
CREATE TABLE "twitter_post" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "media" TEXT,
    "posted" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitter_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitter_account" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "twitter_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expires_at" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitter_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "twitter_account_twitter_id_key" ON "twitter_account"("twitter_id");
