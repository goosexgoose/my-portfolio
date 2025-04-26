'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebaseClient';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginOverlay() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Registered successfully!');
      }
    } catch (error: any) {
      const code = error.code;
      if (isLogin) {
        switch (code) {
          case 'auth/user-not-found':
            toast.error('No account found.');
            break;
          case 'auth/wrong-password':
            toast.error('Wrong password.');
            break;
          default:
            toast.error(error.message);
        }
      } else {
        switch (code) {
          case 'auth/email-already-in-use':
            toast.error('Email already in use.');
            break;
          case 'auth/weak-password':
            toast.error('Password should be at least 6 characters.');
            break;
          default:
            toast.error(error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Logged in with Google!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Enter your email first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-lg">
        <h2 className="text-center text-2xl font-semibold mb-6">{isLogin ? 'Login' : 'Register'}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded focus:outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            className="border p-2 rounded focus:outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading} className="bg-black text-white py-2 rounded hover:bg-gray-800 transition">
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {isLogin && (
          <p className="text-center text-sm text-blue-600 hover:underline mt-2 cursor-pointer" onClick={handleResetPassword}>
            Forgot Password?
          </p>
        )}

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-400">or</span>
          </div>
        </div>

        <button onClick={handleGoogleLogin} disabled={loading} className="flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 transition w-full">
          <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
          {loading ? 'Loading...' : 'Continue with Google'}
        </button>

        <p
          className="text-center text-sm text-gray-600 mt-4 hover:underline cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
