import './globals.css';
import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Head from 'next/head'; 
import React from 'react';
import { Toaster } from 'react-hot-toast';

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
