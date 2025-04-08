'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebaseClient';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import styles from './LoginRegisterForm.module.css';

export default function LoginRegisterForm() {
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
      // No redirect — user stays on the page
    } catch (error: any) {
      const code = error.code;
  
      if (isLogin) {
        switch (code) {
          case 'auth/user-not-found':
            toast.error('No account found with that email.');
            break;
          case 'auth/wrong-password':
            toast.error('Incorrect password.');
            break;
          case 'auth/invalid-email':
            toast.error('Invalid email format.');
            break;
          default:
            toast.error(error.message);
        }
      } else {
        switch (code) {
          case 'auth/email-already-in-use':
            toast.error('Email is already registered.');
            break;
          case 'auth/weak-password':
            toast.error('Password should be at least 6 characters.');
            break;
          case 'auth/invalid-email':
            toast.error('Invalid email format.');
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
      // No redirect here either
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Please enter your email to reset password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Reset email sent! Check your inbox.');
    } catch (error: any) {
      toast.error('Failed to send reset email.');
    }
  };

  return (
    <div className={`${styles.formContainer} ${fadeIn ? styles.fadeIn : ''}`}>
      <h3 className={styles.notice}>🔒 This page requires login to access.</h3>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!isLogin ? true : false}
          minLength={6}
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      {isLogin && (
        <p className={styles.resetLink} onClick={handleResetPassword}>
          Forgot password?
        </p>
      )}

      <div className={styles.divider}>or</div>

      <button onClick={handleGoogleLogin} className={styles.googleButton} disabled={loading}>
        <img src="/google-icon.png" alt="Google logo" className={styles.googleIcon} />
        {loading ? 'Loading...' : 'Continue with Google'}
      </button>

      <p onClick={() => setIsLogin(!isLogin)} className={styles.toggle}>
        {isLogin ? 'No account? Register' : 'Have an account? Login'}
      </p>
    </div>
  );
}
