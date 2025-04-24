'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './cv.module.css';
import Timeline from './Timeline';
import SkillForceLayout from '@/components/SkillForceLayout';
import SelectedProjects from '@/components/SelectedProjects';
import ResumeDownloadButton from '@/components/ResumeDownloadButton';



export default function CVPage() {
  return (
    <div className={styles.cvContainer}>
      <header className={styles.header}>
        <h1></h1>
      </header>

      {/* --- Summary Section --- */}
      <section className={styles.section}>
        <h2>Professional Summary</h2>
        <div className={styles.row}>
          <div className={styles.colText}>
            <p>I'm a software developer with a background in product strategy and a growing focus on building full-stack applications that solve real-world problems. Currently completing my MSc in Computing at Cardiff University, I’ve developed projects like MealCraft, an iOS app that uses Core ML and Firebase to provide personalized recipe recommendations and real-time inventory tracking. My technical skill set includes Swift, Python, JavaScript, SQL, and Firebase, with hands-on experience in user authentication, cloud integration, and machine learning model deployment.</p>

            <p className="mt-4">Before transitioning into tech, I worked at ByteDance and Sina Weibo, where I led cross-functional projects to improve product performance and user engagement. I also bring experience in game localization and translation, having adapted major titles between Chinese and English with attention to nuance and player experience. My strength lies in bridging code, creativity, and product thinking to build scalable, user-centered solutions.</p>
          </div>
          <div className={styles.colImage}>
            <Image src="/pics/touxiang1.JPG" alt="Kaiya" width={300} height={300} className={styles.avatar} />
          </div>
        </div>
        

      </section>


      {/* --- Education --- */}
      <section className={styles.section}>
        <h2>Education</h2>
        <div className={styles.education}>
          <div>
            <small>Sep 2023 - Jun 2025</small>
            <h3>Cardiff University</h3>
            <p>Master of Computing with Placement (MSc)</p>
          </div>
          <div>
            <small>Sep 2014 - Jun 2018</small>
            <h3>Xi'an University of Posts & Telecommunications</h3>
            <p>Bachelor of Business English (B.A)</p>
          </div>
        </div>
      </section>

      


    {/*
      --- Work Experience --- 
      <section className={styles.section}>
        <h2>Work Experience</h2>
        <div className={styles.cardGrid}>
          {workExperiences.map((exp) => (
            <div className={styles.card} key={exp.title}>
              <Image src={exp.logo} alt={exp.company} width={160} height={60} className={styles.cardLogo} />
              <h5>{exp.title}</h5>
              <ul>
                {exp.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <small>{exp.dates} | {exp.type}<br />Location: {exp.location}</small>
            </div>
          ))}
        </div>
      </section>
      */}
      

      <section className={styles.section}>
        <Timeline />
      </section>


      {/* --- Skills --- */}
      <section className={styles.section}>
        <h2>Skills</h2>
        <SkillForceLayout />
      </section>



      
      {/* --- Selected Projects --- */}
      <section className={styles.section}>
        <h2>Selected Projects</h2>
        <SelectedProjects />
      </section>


      {/* --- Buttons --- */}
      <div className={styles.buttonGroup}>
        <Link href="/projects" className="btn">See More Projects</Link>
        <ResumeDownloadButton />
        <Link href="/more" className="btn">Contact Me</Link>
      </div>
    </div>
  );
}



// Work Experience Data
const workExperiences = [
  {
    company: 'ByteDance',
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
    company: 'Sina Weibo',
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
    company: 'TikTok',
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
    company: 'Marks & Spencer',
    logo: '/pics/Marks_and_Spencer_MS_logo_logotype_emblem-1826219277.png',
    title: 'Customer Assistant',
    responsibilities: [
      'Engaged with customers to improve service.',
    ],
    dates: 'Dec 2023 - Jan 2024',
    type: 'Part-time',
    location: 'Cardiff, Wales, UK',
  },
];
