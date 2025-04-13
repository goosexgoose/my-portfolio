'use client';

import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import styles from './gallery.module.css';
import { auth } from '@/lib/firebaseClient';
import LoginRegisterForm from '@/components/LoginRegisterForm';

export default function GalleryPage() {
  const [user, setUser] = useState<{ displayName?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const privateGalleryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          displayName: firebaseUser.displayName || undefined,
          email: firebaseUser.email || undefined,
        });

        // Scroll to private gallery
        setTimeout(() => {
          privateGalleryRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const recentWorks = [
    '/pics/private_gallery/IMG_4906.JPG',
    '/pics/private_gallery/R0013540.JPG',
    '/pics/private_gallery/R0015305.JPG',
  ];

  const allWorks = [
    {
      title: 'Memories of China',
      description: 'Film Photographs',
      images: [
        '/pics/private_gallery/IMG_4906.JPG',
        '/pics/private_gallery/IMG_4912.JPG',
        '/pics/private_gallery/IMG_4915.JPG',
        '/pics/private_gallery/IMG_4905.JPG',
        '/pics/private_gallery/2e1fc306dq7ac08bcee0219ce9ae3d95.jpg',
        '/pics/private_gallery/37e8c3faeu1ad4fed317284c2253bbd6.jpg',
        '/pics/private_gallery/438fef673vd8b38bb324ef746d8a6af9.jpg',
        '/pics/private_gallery/bd5b4a6bbrd1e6c479135f2e7ef267d9.jpg',
        '/pics/private_gallery/d94295acci407237fefc3793855fbc85.jpg',
      ],
    },
    {
      title: 'Digital Photography',
      description: 'Everyday Life & Architecture',
      images: [
        '/pics/private_gallery/R0013540.JPG',
        '/pics/private_gallery/R0014697.JPG',
        '/pics/private_gallery/R0010302.jpg',
        '/pics/private_gallery/R0010247.JPG',
        '/pics/private_gallery/R0014672.JPG',
        '/pics/private_gallery/R0010313.jpg',
        '/pics/private_gallery/R0010314.JPG',
      ],
    },
    {
      title: 'Chairs Series',
      description: 'Digital Photography',
      images: [
        '/pics/private_gallery/R0015305.JPG',
        '/pics/private_gallery/R0015316.JPG',
        '/pics/private_gallery/R0015329.JPG',
        '/pics/private_gallery/R0015331.JPG',
        '/pics/private_gallery/R0015330.JPG',
        '/pics/private_gallery/R0015312.JPG',
        '/pics/private_gallery/R0015318.JPG',
      ],
    },
  ];

    function openLightbox(imgSrc: string): void {
        const lightbox = document.createElement('div');
        lightbox.style.position = 'fixed';
        lightbox.style.top = '0';
        lightbox.style.left = '0';
        lightbox.style.width = '100%';
        lightbox.style.height = '100%';
        lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        lightbox.style.display = 'flex';
        lightbox.style.justifyContent = 'center';
        lightbox.style.alignItems = 'center';
        lightbox.style.zIndex = '1000';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';
        img.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        img.style.borderRadius = '8px';

        lightbox.appendChild(img);

        lightbox.addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });

        document.body.appendChild(lightbox);
    }
  return (
    <div className={styles.galleryContainer}>
      <h1>Photography Gallery</h1>

      {/* Public section */}
      <section className={styles.recentSection}>
        <h2>Recent Works</h2>
        <div className={styles.imageRow}>
          {recentWorks.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`recent-${i}`}
              width={400}
              height={280}
              className={styles.galleryImage}
            />
          ))}
        </div>
      </section>

      {/* Private section */}
      <section ref={privateGalleryRef} className={styles.privateSection}>
  <h2>All Works</h2>

  <div className={styles.previewWrapper}>
    {!user && (
      <div className={styles.authOverlay}>
        <LoginRegisterForm />
      </div>
    )}

    <div className={`${styles.previewContainer} ${!user ? styles.blurred : ''}`}>
      {[allWorks[0]].map((section, index) => (
        <div key={index} className={styles.carouselSection}>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
          <div className={styles.imageRow}>
            {section.images.map((imgSrc, i) => (
              <Image
                key={i}
                src={imgSrc}
                alt={`photo-${i}`}
                width={500}
                height={350}
                className={styles.galleryImage}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>






    </div>
  );
}
