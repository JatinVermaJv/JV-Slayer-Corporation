"use client";
import Link from 'next/link';
import { Twitter, LayoutDashboard, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  };

  if (status === 'unauthenticated') {
    return null;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    hover: { scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex justify-between items-center mb-10 pb-4 border-b border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold flex items-center gap-3 text-blue-400">
            <LayoutDashboard className="w-9 h-9" />
            Dashboard
          </h1>
          <motion.button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full flex items-center gap-2 transition-colors duration-300 shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Twitter Automation Card */}
          <Link href="/twitter" passHref>
            <motion.div 
              className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 cursor-pointer flex flex-col items-center text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="p-4 bg-blue-600 rounded-full text-white mb-4 shadow-md">
                <Twitter className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Twitter Automation</h2>
              <p className="text-gray-400">
                Post tweets instantly or schedule them for automated posting
              </p>
            </motion.div>
          </Link>

          {/* Add other dashboard cards here */}
          <motion.div 
            className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col items-center text-center opacity-50 cursor-not-allowed"
            variants={cardVariants}
          >
            <div className="p-4 bg-gray-600 rounded-full text-white mb-4 shadow-md">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Coming Soon</h2>
            <p className="text-gray-400">
              More awesome features are on their way!
            </p>
          </motion.div>

          <motion.div 
            className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col items-center text-center opacity-50 cursor-not-allowed"
            variants={cardVariants}
          >
            <div className="p-4 bg-gray-600 rounded-full text-white mb-4 shadow-md">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Coming Soon</h2>
            <p className="text-gray-400">
              Stay tuned for exciting updates!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}