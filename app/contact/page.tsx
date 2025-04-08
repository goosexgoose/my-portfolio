'use client';

import React, { useState } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname || !email) {
      setMessage('Please enter your name and email.');
    } else {
      setMessage('Thanks for subscribing! 🚀');
      setNickname('');
      setEmail('');
    }
  };

  return (
    <div>
      <h1 className={styles.heading}>Contact and Subscribe</h1>

      <div className={styles.container}>
        {/* Left Section - Info */}
        <div className={styles.section}>
          <h2>Working Hours</h2>
          <p>09.00am - 07.00pm Weekdays</p>

          <h2>My Official Email</h2>
          <p>Liyuquanr@gmail.com</p>

          <a
            href="mailto:liyuquanr@gmail.com"
            className={styles.button}
            style={{ marginTop: '1rem', display: 'inline-block' }}
          >
            Send Me Email
          </a>
        </div>

        {/* Right Section - Subscribe */}
        <div className={styles.section}>
          <h2>Subscribe My Newsletter</h2>
          <div className={styles.text}>
            Get notified when I post new content!
          </div>

          {message && <div className={styles.alert}>{message}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="What should I call you?"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
