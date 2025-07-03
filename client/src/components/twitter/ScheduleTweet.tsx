'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { twitterAPI } from '@/lib/twitter-api';
type CronPreset = {
  label: string;
  value: string;
  description: string;
};

const scheduleSchema = z.object({
  scheduleId: z.string().min(1, 'Schedule ID is required'),
  content: z.string().min(1, 'Tweet cannot be empty').max(280, 'Tweet cannot exceed 280 characters'),
  cronExpression: z.string().min(1, 'Schedule time is required'),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

const cronPresets: CronPreset[] = [
  { label: 'Every Hour', value: '0 * * * *', description: 'Posts at the start of every hour' },
  { label: 'Every 6 Hours', value: '0 */6 * * *', description: 'Posts 4 times a day' },
  { label: 'Daily at 9 AM', value: '0 9 * * *', description: 'Posts every morning' },
  { label: 'Daily at 6 PM', value: '0 18 * * *', description: 'Posts every evening' },
  { label: 'Weekdays at Noon', value: '0 12 * * MON-FRI', description: 'Posts on weekdays only' },
  { label: 'Weekly on Monday', value: '0 10 * * MON', description: 'Posts every Monday at 10 AM' },
];

export default function ScheduleTweet() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomCron, setIsCustomCron] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      cronExpression: cronPresets[0].value,
    },
  });

  const content = watch('content', '');

  const onSubmit = async (data: ScheduleFormData) => {
    setIsLoading(true);
    try {
      const response = await twitterAPI.scheduleTweet(
        data.scheduleId,
        data.cronExpression,
        data.content
      );
      
      if (response.success) {
        toast.success('Tweet scheduled successfully! 📅');
        reset();
      } else {
        toast.error(response.error || 'Failed to schedule tweet');
      }
    } catch{
      toast.error('An error occurred while scheduling tweet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-purple-600" />
        Schedule Tweet
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Schedule ID
          </label>
          <input
            {...register('scheduleId')}
            type="text"
            placeholder="e.g., daily-motivation"
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 
                     focus:outline-none transition-colors duration-200"
            disabled={isLoading}
          />
          {errors.scheduleId && (
            <p className="text-red-500 text-sm mt-1">{errors.scheduleId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tweet Content
          </label>
          <textarea
            {...register('content')}
            placeholder="What do you want to schedule?"
            className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 
                     focus:outline-none resize-none transition-colors duration-200"
            rows={3}
            disabled={isLoading}
          />
          <div className="text-right mt-1">
            <span className={`text-sm ${content.length > 280 ? 'text-red-500' : 'text-gray-500'}`}>
              {content.length}/280
            </span>
          </div>
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Time
          </label>
          
          <div className="space-y-2">
            {!isCustomCron && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cronPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setValue('cronExpression', preset.value)}
                    className={`p-3 rounded-lg text-left transition-all duration-200 ${
                      watch('cronExpression') === preset.value
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white hover:bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className="font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {preset.label}
                    </div>
                    <div className={`text-xs mt-1 ${
                      watch('cronExpression') === preset.value ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="customCron"
                checked={isCustomCron}
                onChange={(e) => setIsCustomCron(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="customCron" className="text-sm text-gray-700">
                Use custom cron expression
              </label>
            </div>
            
            {isCustomCron && (
              <div>
                <input
                  {...register('cronExpression')}
                  type="text"
                  placeholder="e.g., 0 */4 * * *"
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 
                           focus:outline-none transition-colors duration-200"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: minute hour day month weekday
                </p>
              </div>
            )}
          </div>
          
          {errors.cronExpression && (
            <p className="text-red-500 text-sm">{errors.cronExpression.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold
                   py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                   flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              Schedule Tweet
            </>
          )}
        </button>
      </form>
    </div>
  );
}