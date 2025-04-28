import './globals.css';
import type { ReactNode } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Head from 'next/head'; 
import React from 'react';
import { Toaster } from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const metadata = {
  title: "Kaiya's Portfolio",
  description: 'Built with Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        {/* Fonts & Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          integrity="sha512-dYjF2e0N6ZsEGTeZ7i1Y1jVhKjQKtZAvh8XswxkgAYgYAZu6Vt5DZBzy45Kzbh7GukEr6a6+0OsVUXB+jDth9w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className="min-h-screen flex flex-col">
        <Navbar />

        
        <main className="flex-1">
          {children}
        </main>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              marginTop: '4rem',
            },
          }}
        />

        <Footer />
      </body>
    </html>
  );
}
