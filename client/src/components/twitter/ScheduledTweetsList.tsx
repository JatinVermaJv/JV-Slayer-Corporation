'use client';

import { useState, useEffect } from 'react';
import { Clock, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { twitterAPI } from '@/lib/twitter-api';


export default function ScheduledTweetsList() {
  const [schedules, setSchedules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSchedules = async () => {
    try {
      const response = await twitterAPI.getSchedules();
      if (response.success && response.data) {
        setSchedules(response.data);
      }
    } catch {
      toast.error('Failed to fetch schedules');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSchedules();
  };

  const handleCancel = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to cancel this scheduled tweet?')) {
      return;
    }

    try {
      const response = await twitterAPI.cancelSchedule(scheduleId);
      if (response.success) {
        toast.success('Schedule cancelled successfully');
        setSchedules(schedules.filter(id => id !== scheduleId));
      } else {
        toast.error(response.error || 'Failed to cancel schedule');
      }
    } catch {
      toast.error('An error occurred while cancelling schedule');
    }
  };


  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-6 h-6 text-green-600" />
          Active Schedules
        </h2>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No active schedules</p>
          <p className="text-sm text-gray-400 mt-1">Schedule a tweet to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((scheduleId) => (
            <div
              key={scheduleId}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200
                       border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{scheduleId}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Schedule ID: {scheduleId}
                  </p>
                </div>
                
                <button
                  onClick={() => handleCancel(scheduleId)}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-200
                           text-red-600 hover:text-red-700"
                  title="Cancel schedule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}