'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { twitterAPI } from '@/lib/twitter-api';

const tweetSchema = z.object({
  content: z.string().min(1, 'Tweet cannot be empty').max(280, 'Tweet cannot exceed 280 characters'),
});

type TweetFormData = z.infer<typeof tweetSchema>;

export default function TweetComposer() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TweetFormData>({
    resolver: zodResolver(tweetSchema),
  });

  const content = watch('content', '');
  const characterCount = content.length;

  const onSubmit = async (data: TweetFormData) => {
    setIsLoading(true);
    try {
      const response = await twitterAPI.postTweet(data.content);
      if (response.success) {
        toast.success('Tweet posted successfully! 🎉');
        reset();
      } else {
        toast.error(response.error || 'Failed to post tweet');
      }
    } catch{
      toast.error('An error occurred while posting tweet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Send className="w-6 h-6 text-blue-600" />
        Compose Tweet
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <textarea
            {...register('content')}
            placeholder="What's happening?"
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 
                     focus:outline-none resize-none transition-colors duration-200
                     text-gray-800 placeholder-gray-400"
            rows={4}
            disabled={isLoading}
          />
          
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <span className={`text-sm font-medium ${
              characterCount > 280 ? 'text-red-500' : 
              characterCount > 250 ? 'text-yellow-500' : 'text-gray-500'
            }`}>
              {characterCount}/280
            </span>
          </div>
        </div>
        
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
        
        <button
          type="submit"
          disabled={isLoading || characterCount === 0 || characterCount > 280}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold
                   py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                   flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Post Tweet
            </>
          )}
        </button>
      </form>
    </div>
  );
}