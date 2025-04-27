'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './cv.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const workExperiences = [
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
    color: '#0070f3',
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
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(`.${styles.timelineItem}`) as HTMLElement[];

      items.forEach((item, index) => {
        const color = workExperiences[index].gradient || workExperiences[index].color || '#000000';
        const dot = item.querySelector(`.${styles.timelineDot}`) as HTMLElement;
        const content = item.querySelector(`.${styles.timelineRight}`) as HTMLElement;

        ScrollTrigger.create({
          trigger: item,
          start: 'top center+=100',
          end: 'bottom center-=100',
          onEnter: () => {
            if (dot) dot.style.background = color;
          },
          onEnterBack: () => {
            if (dot) dot.style.background = color;
          },
        });

        gsap.fromTo(
          content,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'top center',
              scrub: true,
            },
          }
        );
      });

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          backgroundPosition: '0% 100%',
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={timelineRef} className="relative max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Career Timeline</h2>

      {/* 只控制内容区 */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-0 left-1/2 md:left-[20%] transform -translate-x-1/2 md:translate-x-0 w-[2px] h-full bg-gray-300 overflow-hidden z-0">
          <div
            ref={progressRef}
            className="w-full h-full"
            style={{
              background: 'linear-gradient(to bottom, transparent, #000000, #0070f3, #e52e71, transparent)',
              backgroundSize: '100% 300%',
              backgroundPosition: '0% 0%',
            }}
          ></div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-24">
          {workExperiences.map((job, idx) => (
            <div
              key={idx}
              className={`${styles.timelineItem} relative flex flex-col md:flex-row items-center md:items-start`}
            >
              {/* 时间 + Dot */}
              <div className="relative w-full md:w-[20%] text-center md:text-right pr-6 md:pr-8 mb-4 md:mb-0">
                <div className="text-gray-400 text-sm">{job.dates}</div>
                <div
                  className={`${styles.timelineDot} absolute left-1/2 md:right-0 md:left-auto transform -translate-x-1/2 md:translate-x-1/2 top-6 w-4 h-4 bg-black rounded-full z-10`}
                />
              </div>

              {/* 内容区 */}
              <div className={`${styles.timelineRight} w-full md:w-[80%] pt-8 md:pt-0`}>
                <Image
                  src={job.logo}
                  alt={job.company}
                  width={120}
                  height={40}
                  className="mb-2"
                />
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600 mb-1">
                  <strong>{job.company}</strong> — {job.type}
                </p>
                <p className="text-gray-400 mb-2">{job.location}</p>
                <ul className="list-disc list-inside text-gray-700">
                  {job.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}