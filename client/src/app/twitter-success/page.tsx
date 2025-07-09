'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Twitter, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { twitterUserAPI } from '@/lib/twitter-user-api';
import toast, { Toaster } from 'react-hot-toast';

export default function TwitterSuccess() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.accessToken) {
      router.push('/login');
      return;
    }

    // Connect user to database
    const connectUser = async () => {
      try {
        setIsConnecting(true);
        await twitterUserAPI.connectUser();
        await twitterUserAPI.recordLogin();
        toast.success('Successfully connected to Twitter!');
        setIsConnecting(false);
      } catch (error) {
        console.error('Failed to connect user:', error);
        toast.error('Failed to connect to database, but Twitter auth was successful');
        setIsConnecting(false);
      }
    };

    connectUser();

    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use setTimeout to avoid setState during render
          setTimeout(() => router.push('/twitter'), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
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
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="relative">
            <Twitter className="w-20 h-20 text-blue-400 mx-auto mb-4" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2"
            >
              <CheckCircle className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-4 text-green-400"
        >
          Twitter Connected Successfully!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mb-8"
        >
          Welcome to JV-Slayer, <span className="font-semibold text-blue-400">@{session?.user?.name}</span>! 
          {isConnecting ? (
            <span className="block mt-2 text-sm text-yellow-400">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Connecting to database...
            </span>
          ) : (
            <span className="block mt-2 text-sm text-green-400">
              Your Twitter account is now connected and ready to go.
            </span>
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <p className="text-sm text-gray-400">
            Redirecting to your dashboard in {countdown} seconds...
          </p>
          
          <Link href="/twitter">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 mx-auto transition-colors duration-300"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-xs text-gray-500"
        >
          <p>You can now schedule tweets, analyze performance, and grow your audience automatically.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
