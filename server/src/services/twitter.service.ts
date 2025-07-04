import { TwitterApi, TweetV2PostTweetResult } from 'twitter-api-v2';

export class TwitterService {
  private client: TwitterApi;

  constructor(accessToken: string) {
    this.client = new TwitterApi(accessToken);
  }

  async postTweet(content: string): Promise<TweetV2PostTweetResult> {
    try {
      const tweet = await this.client.v2.tweet(content);
      console.log('Tweet posted successfully:', tweet.data.id);
      return tweet;
    } catch (error) {
      console.error('Error posting tweet:', error);
      throw error;
    }
  }
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    });

    const { accessToken, refreshToken: newRefreshToken } = await client.refreshOAuth2Token(refreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken || refreshToken
    };
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
}

  async postThreadTweet(tweets: string[]): Promise<void> {
    try {
      let lastTweetId: string | undefined;

      for (const tweetContent of tweets) {
        const tweetData: any = { text: tweetContent };

        if (lastTweetId) {
          tweetData.reply = { in_reply_to_tweet_id: lastTweetId };
        }

        const tweet = await this.client.v2.tweet(tweetData);
        lastTweetId = tweet.data.id;

        // Add delay between tweets to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('Thread posted successfully');
    } catch (error) {
      console.error('Error posting thread:', error);
      throw error;
    }
  }

  async postTweetWithMedia(content: string, mediaPath: string): Promise<TweetV2PostTweetResult> {
    try {
      // Upload media first
      const mediaId = await this.client.v1.uploadMedia(mediaPath);

      // Post tweet with media
      const tweet = await this.client.v2.tweet({
        text: content,
        media: { media_ids: [mediaId] }
      });

      console.log('Tweet with media posted successfully:', tweet.data.id);
      return tweet;
    } catch (error) {
      console.error('Error posting tweet with media:', error);
      throw error;
    }
  }
}
