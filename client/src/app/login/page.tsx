"use client";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Twitter } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/twitter");
    }
  }, [status, router]);

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
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
        <motion.div
          className="flex justify-center mb-6"
          variants={itemVariants}
        >
          <Twitter className="w-16 h-16 text-blue-400" />
        </motion.div>
        <motion.h1
          className="text-3xl font-bold text-center mb-4 text-blue-400"
          variants={itemVariants}
        >
          Login to JV-Slayer
        </motion.h1>
        <motion.button
          onClick={() => signIn("twitter", { callbackUrl: "/twitter" })}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 items-center gap-3"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Twitter className="w-5 h-5" />
          Continue with Twitter
        </motion.button>
        <motion.div
          className="mt-8 text-center text-sm text-gray-400"
          variants={itemVariants}
        >
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
        <motion.div
          className="mt-4 text-center"
          variants={itemVariants}
        >
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
