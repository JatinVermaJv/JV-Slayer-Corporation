'use client';

import { motion } from 'framer-motion';
import { Twitter, CheckCircle, ArrowRight } from 'lucide-react';

interface WelcomeMessageProps {
  onGetStarted: () => void;
  isFirstTime?: boolean;
}

export default function WelcomeMessage({ onGetStarted, isFirstTime = true }: WelcomeMessageProps) {
  const features = [
    "Schedule tweets in advance",
    "Analyze your tweet performance",
    "Manage multiple Twitter accounts",
    "Track engagement metrics",
    "Auto-retweet and reply features"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white mb-8"
    >
      <div className="flex items-center justify-center mb-6">
        <Twitter className="w-12 h-12 text-white mr-4" />
        <h2 className="text-3xl font-bold">
          {isFirstTime ? 'Welcome to JV-Slayer!' : 'Great to have you back!'}
        </h2>
      </div>
      
      {isFirstTime && (
        <>
          <p className="text-lg text-center mb-6 opacity-90">
            Your Twitter account is now connected! Here&apos;s what you can do:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <CheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </>
      )}
      
      <div className="text-center">
        <motion.button
          onClick={onGetStarted}
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFirstTime ? 'Get Started' : 'Continue'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
}
