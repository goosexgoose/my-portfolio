'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import emailjs from 'emailjs-com';

export default function ContactPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname || !email || !message) {
      setStatus('⚠️ Please fill out all fields.');
      return;
    }

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'contacts'), {
        name: nickname,
        email,
        message,
        timestamp: Timestamp.now(),
      });

      // 2. Send email via EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: nickname,
          reply_to: email,
          message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setStatus('✅ Thank you! I’ll be in touch soon.');
      setNickname('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('❌ Error:', error);
      setStatus('❌ Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="bg-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-none shadow-md p-8 md:p-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">Contact and Subscribe</h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Working Hours</h2>
            <p className="text-gray-700">09:00am – 07:00pm (London Time)</p>
            <p className="text-sm text-gray-500 mb-6">Monday to Friday </p>

            <h2 className="text-xl font-semibold mb-3">My Official Email</h2>
            <p className="text-gray-700 mb-2">Liyuquanr@gmail.com</p>
            <a
              href="mailto:liyuquanr@gmail.com"
              className="inline-block mt-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Send Me Email
            </a>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Send Me a Message</h2>
            <p className="text-sm text-gray-600 mb-6">Have a question, collab, or feedback?</p>

            {/* 👇 Reserved space to prevent layout shift */}
            <div className="min-h-[52px] mb-4">
              {status && (
                <div className="text-sm bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded">
                  {status}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm mb-1 font-medium">Name</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-black/30"
                  placeholder="What should I call you?"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-black/30"
                  placeholder="Your email address"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-black/30"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
