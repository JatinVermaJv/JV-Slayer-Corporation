'use client';

import React from 'react';
import { Twitter, ArrowLeft, LogOut, Loader2, AlertCircle } from 'lucide-react';
import TweetComposer from '@/components/twitter/TweetComposer';
import ScheduleTweet from '@/components/twitter/ScheduleTweet';
import ScheduledTweetsList from '@/components/twitter/ScheduledTweetsList';
import { Toaster } from 'react-hot-toast';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { twitterAPI } from '@/lib/twitter-api';

export default function TwitterDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    // Check if user is not authenticated or doesn't have Twitter access token
    if (status === 'unauthenticated' || !session?.accessToken) {
      router.push('/login');
    }
  }, [status, session, router]);

  const handleLogout = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Logging out...');
      
      // Clean up backend data (cancel schedules, remove tokens)
      await twitterAPI.logout();
      
      // Sign out from NextAuth
      await signOut({ callbackUrl: '/login' });
      
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error during logout');
      console.error('Logout error:', error);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading your Twitter dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or no Twitter access
  if (status === 'unauthenticated' || !session?.accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Twitter Authentication Required</h2>
          <p className="text-gray-400 mb-4">Please sign in with Twitter to continue</p>
          <Link href="/login">
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in with Twitter
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-700">
            <h1 className="text-4xl font-bold text-blue-400 flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg">
                <Twitter className="w-8 h-8" />
              </div>
              Twitter Automation Dashboard
            </h1>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard" passHref>
                <motion.button
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-full flex items-center gap-2 transition-colors duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Dashboard
                </motion.button>
              </Link>
              
              <motion.button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full flex items-center gap-2 transition-colors duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </motion.button>
            </div>
          </div>
          
          {/* User info section */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  className="w-10 h-10 rounded-full border-2 border-gray-600"
                />
              )}
              <div>
                <p className="text-sm text-gray-400">Signed in as</p>
                <p className="font-semibold text-white">@{session.user?.name || 'Twitter User'}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              <span className="inline-flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Connected to Twitter
              </span>
            </div>
          </div>
        </motion.header>

        <motion.p 
          className="text-gray-300 mt-2 mb-8 text-center text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Post tweets instantly or schedule them for later
        </motion.p>

        {/* Error Boundary wrapper for the main content */}
        <ErrorBoundary>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <TweetComposer />
              <ScheduleTweet />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <ScheduledTweetsList />
            </motion.div>
          </div>
        </ErrorBoundary>

        <motion.footer 
          className="mt-12 text-center text-sm text-gray-500 pt-8 border-t border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <p>Remember to follow Twitters automation rules and best practices</p>
          <p className="mt-2 text-xs">
            Rate limits apply: 300 posts per 3 hours • 2,400 posts per day
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Twitter Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900/20 border border-red-600 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">Something went wrong</h3>
          <p className="text-gray-400 mb-4">There was an error loading the Twitter components</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}