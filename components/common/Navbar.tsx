'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { ADMIN_UID } from '@/lib/firebaseShared';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState('/pics/user.png');
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const isGoogleUser = user.providerData.some(
          (provider) => provider.providerId === 'google.com'
        );
        const fallback = isGoogleUser ? user.photoURL ?? '/pics/user.png' : '/pics/user.png';
        setAvatarUrl(user.photoURL ?? fallback);
        if (user.uid === ADMIN_UID) setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="w-full flex items-center justify-between h-[70px] px-8 xl:px-16 2xl:px-24">


        {/* Left group */}
        <div className="flex items-center gap-2 flex-1">
          {/* Hamburger for small screens */}
          <button
            className="block md:hidden mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Menu links */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className={`navlink ${pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/experiences" className={`navlink ${pathname === '/experiences' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>CV</Link>
            <Link href="/projects" className={`navlink ${pathname === '/projects' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Projects</Link>
            <Link href="/gallery" className={`navlink ${pathname === '/gallery' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Gallery</Link>
            <Link href="/contact" className={`navlink ${pathname === '/contact' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Contact</Link>
            {isAdmin && (
              <Link href="/admin" className={`navlink ${pathname === '/admin' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Admin</Link>
            )}
            <Link href="/dashboard" className="flex items-center px-2 py-2" onClick={() => setMenuOpen(false)}>
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-[50px] h-[50px] rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/pics/user.png';
                }}
              />
            </Link>
          </div>
        </div>

        {/* Right group: Logo */}
        <div className="flex items-center">
          <img src="/pics/autographs.png" alt="Logo" className="w-[80px] h-auto" />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out bg-white md:hidden ${
          menuOpen ? 'max-h-[500px] py-4' : 'max-h-0 py-0'
        }`}
      >
        <div className="flex flex-col gap-4 px-4">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/experiences" onClick={() => setMenuOpen(false)}>CV</Link>
          <Link href="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
          <Link href="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          {isAdmin && (
            <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
