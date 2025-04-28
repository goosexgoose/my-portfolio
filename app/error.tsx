'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';



export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-8 text-center">
      {/* Animated Floating SVG */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="w-40 h-40 mb-8"
      >
        {/* Warning Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
          <path d="M12 2L2 22h20L12 2z" fill="#f0f0f0" />
          <path d="M12 8v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold mb-4"
      >
        Something Went Wrong
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg text-gray-600 mb-8"
      >
        An unexpected error has occurred. Please try again.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex space-x-4"
      >
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Try Again
        </button>
        <Link href="/" className="px-6 py-3 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition">
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
