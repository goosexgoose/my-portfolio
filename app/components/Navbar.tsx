'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

export default function Navbar() {
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState('/pics/user.png'); // default avatar

  // Mobile navbar toggle
  useEffect(() => {
    const toggleNavbar = () => {
      const nav = document.getElementById('myTopnav');
      const burger = document.getElementById('burger-icon');
      if (nav && burger) {
        nav.classList.toggle('responsive');
        burger.classList.toggle('change');
      }
    };

    const icon = document.querySelector('.icon');
    icon?.addEventListener('click', toggleNavbar);
    return () => icon?.removeEventListener('click', toggleNavbar);
  }, []);

  // Auth avatar listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const isGoogleUser = user.providerData.some(
            (provider) => provider.providerId === 'google.com'
          );
          const fallback = isGoogleUser ? user.photoURL ?? '/pics/user.png' : '/pics/user.png';
          setAvatarUrl(user.photoURL ?? fallback);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="topnav" id="myTopnav">
  <div className="nav-left">
    <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
    <Link href="/experiences" className={pathname === '/experiences' ? 'active' : ''}>CV</Link>
    <Link href="/projects" className={pathname === '/projects' ? 'active' : ''}>Projects</Link>
    <Link href="/gallery" className={pathname === '/gallery' ? 'active' : ''}>Gallery</Link>
    <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>Contact</Link>
    <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
      <img
        src={avatarUrl}
        alt="User Profile"
        className="navbar-avatar"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/pics/user.png';
        }}
      />
    </Link>
  </div>

  <div className="Logo">
    <img src="/pics/autographs.png" alt="Logo" />
  </div>

  <a className="icon">
    <div className="container" id="burger-icon">
      <div className="bar1"></div>
      <div className="bar2"></div>
      <div className="bar3"></div>
    </div>
  </a>
</div>

  );
}
