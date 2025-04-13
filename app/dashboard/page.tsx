'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseClient'; 

import {
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  deleteUser,
  signOut,
} from 'firebase/auth';
import styles from './dashboard.module.css';
import LoginRegisterForm from '@/components/LoginRegisterForm';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [message, setMessage] = useState('');

  const avatars = [
    '/pics/avatar1.png',
    '/pics/avatar2.png',
    '/pics/avatar3.png',
    '/pics/avatar4.png',
    '/pics/avatar5.png',
    '/pics/avatar6.png',
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isGoogleUser = firebaseUser.providerData.some(
          (provider) => provider.providerId === 'google.com'
        );
  
        const defaultAvatar = isGoogleUser
          ? firebaseUser.photoURL
          : '/pics/user.png';
  
        setUser(firebaseUser);
        setDisplayName(firebaseUser.displayName || '');
        setSelectedAvatar((firebaseUser.photoURL ?? defaultAvatar) as string); // 
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
    
  }, []);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 2000);
      return () => clearTimeout(timeout);
    }
  }, [message]);
  
  const handleChangeUsername = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        setMessage('Username updated successfully ✅');
      }
    } catch (error: any) {
      setMessage(`Failed to update username: ${error.message}`);
    }
  };
  

  const handleUpdateProfile = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL: selectedAvatar,
        });
        setMessage('Profile updated successfully.');
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (auth.currentUser && newPassword.length >= 6) {
        await updatePassword(auth.currentUser, newPassword);
        setMessage('Password updated.');
      } else {
        setMessage('Password must be at least 6 characters.');
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        setMessage('Account deleted.');
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  if (!user) {
    return (
      <div className={styles.container}>
        <LoginRegisterForm />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {message && (
            <div className={`${styles.toast} ${styles.toastVisible} ${styles.toastSuccess}`}>

        {message}
      </div>
    )}

  <h1 className={styles.pageTitle}>Welcome back, {displayName || 'User'} 👋</h1>
  
  <div className={styles.userInfo}>
    {selectedAvatar && (
      <img src={selectedAvatar} alt="User Avatar" className={styles.avatar} />
    )}
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Provider:</strong> {user.providerData[0]?.providerId}</p>
    <p><strong>Joined:</strong> {new Date(user.metadata.creationTime).toLocaleString()}</p>
  </div>


      <hr className={styles.divider} />

      <div className={styles.section}>
      <h2>Change Username</h2>
      <input
        className={styles.input}
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Enter new display name"
      />
      <button onClick={handleChangeUsername} className={styles.button}>
        Update Username
      </button>

      </div>

      <div className={styles.section}>

        <h2>Profile Picture</h2>
        <p className={styles.avatarNote}>
      I currently provide a few preset avatars for simplicity and performance. More customization features are coming soon!
      </p>
        <div className={styles.avatarList}>
          {avatars.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Avatar ${index + 1}`}
              className={`${styles.avatarOption} ${selectedAvatar === url ? styles.avatarSelected : ''}`}
              onClick={() => setSelectedAvatar(url)}
            />
          ))}
        </div>
        <button onClick={handleUpdateProfile} className={styles.button}>Save Profile</button>
      </div>

      <div className={styles.section}>
        <h2>Change Password</h2>
        <input
          className={styles.input}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />
        <button onClick={handleChangePassword} className={styles.button}>Update Password</button>
      </div>

      <hr className={styles.divider} />

      <div className={styles.section}>
        <h2>Account Actions</h2>
        <button onClick={handleLogout} className={`${styles.button} ${styles.logout}`}>Log Out</button>
        <button onClick={handleDeleteAccount} className={`${styles.button} ${styles.delete}`}>Delete Account</button>
      </div>

    
    </div>
  );
}
