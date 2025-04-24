// Timeline.tsx
'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './cv.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const workExperiences = [
  // Each job now includes a color or gradient for the progress line and dot
  {
    company: 'TikTok',
    gradient: 'linear-gradient(135deg, #000000, #111111)',
    logo: '/pics/logo-TikTok.png',
    title: 'International Operations Specialist',
    responsibilities: [
      'Managed cross-regional user feedback.',
      'Provided product support.',
      'Optimized product workflows to reduce invalid feedback.',
    ],
    dates: 'Aug 2018 - Jun 2020',
    type: 'Full-time',
    location: 'Beijing, China',
  },
  {
    company: 'Sina Weibo',
    color: '#e6162d',
    logo: '/pics/sina-png-512x512-pixel-512.png',
    title: 'Product Strategy Specialist',
    responsibilities: [
      'Maintained strategic account plans.',
      'Organised interdepartmental strategies.',
      'Analyzed user data to improve experience.',
    ],
    dates: 'Dec 2020 - Aug 2021',
    type: 'Full-time',
    location: 'Beijing, China',
  },
  {
    company: 'ByteDance',
    color: '#0070f3', // keep default blue
    logo: '/pics/ByteDance_Logo-1536x265-873688352.png',
    title: 'Douyin Encyclopaedia - Product Strategy Specialist',
    responsibilities: [
      'Responsible for community operations: construction, editor training, growth.',
      'Set and executed operational goals.',
      'Collaborated with product/editorial teams for community development.',
    ],
    dates: 'Jan 2023 - Jun 2023',
    type: 'Full-time',
    location: 'Shenzhen, Guangdong, China',
  },
  {
    company: 'Marks & Spencer',
    color: '#000000',
    logo: '/pics/Marks_and_Spencer_MS_logo_logotype_emblem-1826219277.png',
    title: 'Customer Assistant',
    responsibilities: ['Engaged with customers to improve service.'],
    dates: 'Dec 2023 - Jan 2024',
    type: 'Part-time',
    location: 'Cardiff, Wales, UK',
  },
  {
    company: 'Freelance Translator & Developer',
    gradient: 'linear-gradient(135deg, #ff8a00, #e52e71)',
    logo: '/pics/autographs.png',
    title: 'Current Projects: Freelance & Portfolio Development',
    responsibilities: [
      'Building personal portfolio with Next.js.',
      'Translating games between English and Chinese.',
      'Exploring opportunities in product and UI/UX design.',
    ],
    dates: 'Jan 2024 - Today',
    type: 'Self-employed',
    location: 'Remote / UK',
    isToday: true,
  },
];

export default function Timeline() {
  const timelineRef = useRef(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const defaultColor = workExperiences[0].gradient || workExperiences[0].color;
    if (progressRef.current) progressRef.current.style.background = defaultColor || '#000000'; // Fallback to black
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(`.${styles.timelineItem}`) as HTMLElement[];

      items.forEach((item, index) => {
        const color = workExperiences[index].gradient || workExperiences[index].color;

        ScrollTrigger.create({
        trigger: item,
        start: 'bottom bottom',
        end: '+=1', // short range to snap change
        onEnter: () => {
          if (progressRef.current) progressRef.current.style.background = color || '#000000'; // Fallback to black
          const dot = item.querySelector(`.${styles.timelineDot}`) as HTMLElement;
          if (dot) dot.style.background = color || '#000000'; // Fallback to black
        },
        onEnterBack: () => {
          if (progressRef.current) progressRef.current.style.background = color || '#000000';
          const dot = item.querySelector(`.${styles.timelineDot}`) as HTMLElement;
          if (dot) dot.style.background = color || '#000000'; // Fallback to black
        },
      });
      });

      gsap.to(progressRef.current, {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
        height: '100%',
        ease: 'none',
      });

      items.forEach((item) => {
        const content = item.querySelector(`.${styles.timelineRight}`) as HTMLElement;
        const dot = item.querySelector(`.${styles.timelineDot}`) as HTMLElement;
        const date = item.querySelector(`.${styles.timelineDate}`) as HTMLElement;

        gsap.to([dot, date], {
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom center-=10%',
            scrub: true,
          },
          y: 100,
          ease: 'none'
        });

        // Parallax timelineRight
        gsap.fromTo(
          content,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom center',
              scrub: true
            },
            ease: 'none'
          }
        );

        ScrollTrigger.create({
          trigger: item,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleClass: { targets: content, className: styles.active },
        });
      });
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={timelineRef} className={styles.timelineSection}>
      <h2 className={styles.timelineTitle}>Career Timeline</h2>
      <div className={styles.timelineLineWrapper}>
        <div ref={progressRef} className={styles.timelineProgress}></div>
      </div>

      <div className={styles.timelineGrid}>
        {workExperiences.map((job, idx) => (
          <div key={idx} className={styles.timelineItem}>
            <div className={styles.timelineMeta}>
              <div className={`${styles.timelineDate} ${job.isToday ? styles.todayDate : ''}`}>{job.dates}</div>
              <div className={`${styles.timelineDot} ${job.isToday ? styles.todayDot : ''}`}></div>
            </div>

            <div className={`${styles.timelineRight} ${job.isToday ? styles.todayHighlight : ''}`}>
              <Image
                src={job.logo}
                alt={job.company}
                width={120}
                height={40}
                className={styles.timelineLogo}
              />
              {job.isToday && <span className={styles.todayBadge}>NOW</span>}
              <h3>{job.title}</h3>
              <p>
                <strong>{job.company}</strong> — {job.type}
              </p>
              <p className={styles.timelineLocation}>{job.location}</p>
              <ul>
                {job.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
