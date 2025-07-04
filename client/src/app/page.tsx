'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Twitter, LogIn } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring" as const, stiffness: 100 }
    },
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { yoyo: Infinity, duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.main 
        className="text-center flex flex-col items-center" 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-8" 
          variants={itemVariants}
          animate={{ y: [0, -10, 0], transition: { repeat: Infinity, repeatType: "loop", duration: 2 } }}
        >
          <Twitter className="w-24 h-24 text-blue-400" />
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          variants={itemVariants}
        >
          JV-Slayer
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10"
          variants={itemVariants}
        >
          Automate your Twitter presence with ease. Schedule tweets, analyze performance, and grow your audience effortlessly.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link href="/login" passHref>
            <motion.button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-colors duration-300 shadow-lg shadow-blue-500/20"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <LogIn className="w-5 h-5" />
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </motion.main>

      <motion.div 
        className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{ top: '10%', left: '20%' }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{ bottom: '10%', right: '20%' }}
      />
    </div>
  );
}
