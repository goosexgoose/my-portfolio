import Image from 'next/image';
import Link from 'next/link';
import React from 'react';



export default function Home() {
  return (
    <main className="home">
      <h2>This is me</h2>

      <section className="intro-section">
        <div className="intro-text">
          <p className="card-subtitle">
            I'm a <span className="highlight">Software Developer,</span>
          </p>
          <p className="card-text">
            A vision-driven <span className="highlight">Product Strategy Specialist</span> with a noteworthy record in entertainment business development.
          </p>
          <p className="card-text">
            And an <span className="highlight">Independent Documentary Photographer</span>
          </p>
        </div>

        <div className="intro-image">
          <img src="/pics/IMG_8124.JPG" alt="Kaiya" />
        </div>
      </section>

      <section className="employment">
  <h3 className="employment-header">Areas of my past employment</h3>

  <div className="employment-group">
    
    <div className="logo-row">
      <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
        <img src="/pics/logo-TikTok.png" alt="TikTok Logo" />
      </a>
      <a href="https://www.bytedance.com" target="_blank" rel="noopener noreferrer">
        <img src="/pics/ByteDance+Logo-2069413131.png" alt="ByteDance Logo" />
      </a>
      <a href="https://www.weibo.com" target="_blank" rel="noopener noreferrer">
        <img src="/pics/sina-png-512x512-pixel-512.png" alt="Weibo Logo" />
      </a>
    </div>

    
    

   
    <Link href="/experiences">
      <button className="btn btn-dark">See the full CV</button>
    </Link>

  </div>
</section>

    </main>
  );
}
