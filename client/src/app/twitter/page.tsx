'use client';

import { Twitter, ArrowLeft } from 'lucide-react';
import TweetComposer from '@/components/twitter/TweetComposer';
import ScheduleTweet from '@/components/twitter/ScheduleTweet';
import ScheduledTweetsList from '@/components/twitter/ScheduledTweetsList';
import { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TwitterDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return null;
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
          className="mb-8 flex items-center justify-between pb-4 border-b border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-blue-400 flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg">
              <Twitter className="w-8 h-8" />
            </div>
            Twitter Automation Dashboard
          </h1>
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
        </motion.header>

        <motion.p 
          className="text-gray-300 mt-2 mb-8 text-center text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Post tweets instantly or schedule them for later
        </motion.p>

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

        <motion.footer 
          className="mt-12 text-center text-sm text-gray-500 pt-8 border-t border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <p>Remember to follow Twitters automation rules and best practices</p>
        </motion.footer>
      </div>
    </div>
  );
}