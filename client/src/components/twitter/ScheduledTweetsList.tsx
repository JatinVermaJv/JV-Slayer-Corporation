'use client';

import { useState, useEffect } from 'react';
import { Clock, Trash2, RefreshCw, AlertCircle, Calendar, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { twitterAPI } from '@/lib/twitter-api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ScheduleInfo {
  id: string;
  displayId: string;
  content?: string;
  nextRun?: string;
}

export default function ScheduledTweetsList() {
  const [schedules, setSchedules] = useState<ScheduleInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const processScheduleIds = (scheduleIds: string[]): ScheduleInfo[] => {
    return scheduleIds.map(fullId => {
      // Remove userId prefix for display (format: userId_scheduleId)
      const parts = fullId.split('_');
      const displayId = parts.slice(1).join('_') || fullId;
      
      return {
        id: fullId,
        displayId: displayId,
      };
    });
  };

  const fetchSchedules = async () => {
    try {
      // Check if user is authenticated
      if (!session?.accessToken) {
        toast.error('Please sign in with Twitter to view schedules');
        router.push('/login');
        return;
      }

      const response = await twitterAPI.getSchedules();
      
      if (response.success && response.data) {
        const scheduleIds: string[] = Array.isArray(response.data) ? response.data : [];
        const processedSchedules = processScheduleIds(scheduleIds);
        setSchedules(processedSchedules);
      } else if (response.code === 'TWITTER_AUTH_FAILED') {
        toast.error('Twitter authentication failed. Please re-login.');
        router.push('/login');
      } else {
        toast.error(response.error || 'Failed to fetch schedules');
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to fetch schedules');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchSchedules();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSchedules();
  };

  const handleCancel = async (scheduleInfo: ScheduleInfo) => {
    if (!confirm(`Are you sure you want to cancel the scheduled tweet "${scheduleInfo.displayId}"?`)) {
      return;
    }

    try {
      // Use the displayId (without userId prefix) for the API call
      const response = await twitterAPI.cancelSchedule(scheduleInfo.displayId);
      
      if (response.success) {
        toast.success('Schedule cancelled successfully');
        setSchedules(schedules.filter(s => s.id !== scheduleInfo.id));
      } else if (response.code === 'TWITTER_AUTH_FAILED') {
        toast.error('Twitter authentication failed. Please re-login.');
        router.push('/login');
      } else {
        toast.error(response.error || 'Failed to cancel schedule');
      }
    } catch (error) {
      console.error('Error cancelling schedule:', error);
      toast.error('An error occurred while cancelling schedule');
    }
  };

  const getScheduleDescription = (displayId: string): string => {
    // Parse common schedule patterns
    if (displayId.includes('daily')) return 'Daily tweet';
    if (displayId.includes('hourly')) return 'Hourly tweet';
    if (displayId.includes('weekly')) return 'Weekly tweet';
    if (displayId.includes('motivation')) return 'Motivational tweet';
    if (displayId.includes('update')) return 'Regular update';
    return 'Scheduled tweet';
  };

  const formatScheduleId = (displayId: string): string => {
    // Make the ID more readable
    return displayId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-6 h-6 text-green-600" />
          Active Schedules
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {schedules.length} active
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            title="Refresh schedules"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No active schedules</p>
          <p className="text-sm text-gray-400 mt-1">Schedule a tweet to get started</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {schedules.map((scheduleInfo) => (
            <div
              key={scheduleInfo.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200
                       border border-gray-100 hover:border-gray-200 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-0.5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 group-hover:text-gray-900">
                        {formatScheduleId(scheduleInfo.displayId)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {getScheduleDescription(scheduleInfo.displayId)}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          ID: {scheduleInfo.displayId}
                        </span>
                        {scheduleInfo.nextRun && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Next: {scheduleInfo.nextRun}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCancel(scheduleInfo)}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200
                           text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100
                           focus:opacity-100 ml-2"
                  title="Cancel schedule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Optional: Add a progress bar or status indicator */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Status</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Info section */}
      {schedules.length > 0 && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-xs text-gray-500 text-center">
            Scheduled tweets will be posted automatically at their specified times
          </p>
        </div>
      )}
    </div>
  );
}