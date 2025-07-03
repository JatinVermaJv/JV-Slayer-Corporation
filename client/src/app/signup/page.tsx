"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your signup logic here
    // For example, call an API route to create a new user
    console.log({ email, password });
    router.push("/login");
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col justify-center items-center p-4">
      <motion.div
        className="bg-gray-800 shadow-2xl rounded-xl p-8 max-w-md w-full border border-gray-700"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold text-center mb-8 text-purple-400"
          variants={itemVariants}
        >
          Sign Up for JV-Slayer
        </motion.h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-white"
              required
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-white"
              required
            />
          </motion.div>
          <motion.button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 items-center gap-2"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <UserPlus className="w-5 h-5" />
            Sign Up
          </motion.button>
        </form>
        <motion.p className="mt-6 text-center text-gray-400" variants={itemVariants}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300">
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
