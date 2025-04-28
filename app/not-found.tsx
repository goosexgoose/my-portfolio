'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-8 text-center">
      {/* Animated Floating SVG Illustration */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="w-40 h-40 mb-8"
      >
        {/* Simple SVG: Lost map */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
          <path d="M2 8L22 2L42 8L62 2V56L42 62L22 56L2 62V8Z" stroke="#000" strokeWidth="2" fill="#f0f0f0" />
          <path d="M22 2V56M42 8V62" stroke="#000" strokeWidth="2" />
          <circle cx="32" cy="32" r="3" fill="#0077b5" />
          <path d="M32 35V44" stroke="#0077b5" strokeWidth="2" />
        </svg>
      </motion.div>

      {/* Animated Heading */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold mb-4"
      >
        Lost in the Map
      </motion.h1>

      {/* Animated Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg text-gray-600 mb-8"
      >
        Sorry, we couldn't find the page you're looking for.
      </motion.p>

      {/* Animated Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link href="/" className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition">
          Take Me Home
        </Link>
      </motion.div>
    </div>
  );
}
