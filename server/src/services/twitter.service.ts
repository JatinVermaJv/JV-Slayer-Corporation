import { twitterV2Client, twitterClient } from '../config/twitter.config';
import { TweetV2PostTweetResult } from 'twitter-api-v2';

export class TwitterService {
  async postTweet(content: string): Promise<TweetV2PostTweetResult> {
    try {
      const tweet = await twitterV2Client.tweet(content);
      console.log('Tweet posted successfully:', tweet.data.id);
      return tweet;
    } catch (error) {
      console.error('Error posting tweet:', error);
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
        
        const tweet = await twitterV2Client.tweet(tweetData);
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
      // Upload media first using v1 client
      const mediaId = await twitterClient.v1.uploadMedia(mediaPath);
      
      // Post tweet with media using v2 client
      const tweet = await twitterV2Client.tweet({
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