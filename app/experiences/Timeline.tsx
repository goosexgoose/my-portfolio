'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './cv.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const workExperiences = [
  {
    company: 'ByteDance TikTok',
    gradient: 'linear-gradient(135deg, #000000, #111111)',
    logo: '/pics/logo-TikTok.png',
    title: 'International Operations Specialist',
    responsibilities: [
      'Managed cross-functional communication between international teams to address user feedback effectively.',
      'Developed and refined SOPs (Standard Operating Procedures), streamlining product workflow.',
      'Led product workflow optimization, reducing invalid feedback by 60% and improving response efficiency.',
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
      'Maintained strategic account plans, ensuring alignment across Data, Product, and R&D teams.',
      'Spearheaded interdepartmental strategies to optimize product functions and improve efficiency.',
      'Analysed user data and feedback to enhance product features, optimizing workflows and reducing inefficiencies.',
      'Developed performance tracking reports, supporting business decisions with data-driven insights.',
    ],
    dates: 'Dec 2020 - May 2022',
    type: 'Full-time',
    location: 'Beijing, China',
  },
  {
    company: 'ByteDance Douyin Encyclopedia',
    color: '#0070f3',
    logo: '/pics/ByteDance_Logo-1536x265-873688352.png',
    title: 'Product Strategy Specialist',
    responsibilities: [
      'Managed community operations, overseeing engagement strategies, editorial quality, and user retention initiatives.',
      'Led cross-functional collaboration between product, editorial, and data teams to improve workflow efficiency.',
      'Developed and executed operational goals, improving critical path tracking and content delivery.',
    ],
    dates: 'Jan 2023 - Jun 2023',
    type: 'Full-time',
    location: 'Shenzhen, Guangdong, China',
  },
  {
    company: 'Freelancer (Full-Stack & iOS Developer)',
    gradient: 'linear-gradient(135deg, #ff8a00, #e52e71)',
    logo: '/pics/autographs.png', 
    title: 'Current Projects: Freelance & Portfolio Development',
    responsibilities: [
      'Building a personal portfolio website using Next.js, Tailwind CSS, and Firebase.',
      'Developed MealCraft, an iOS application using Swift, Core ML, and Google Vision API.',
      'Continuously enhancing skills in full-stack development, mobile apps, and cloud services.',
      'Actively seeking full-time opportunities in software engineering and mobile development.',
    ],
    dates: 'Oct 2024 - Today',
    type: 'Freelance',
    location: 'Remote / United Kingdom',
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