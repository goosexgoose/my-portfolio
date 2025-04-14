'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './cv.module.css';
import Timeline from './Timeline';
import SkillForceLayout from '@/components/SkillForceLayout';



export default function CVPage() {
  return (
    <div className={styles.cvContainer}>
      <header className={styles.header}>
        <h1>Kaiya's CV</h1>
      </header>

      {/* --- Summary Section --- */}
      <section className={styles.section}>
        <h2>Professional Summary</h2>
        <div className={styles.row}>
          <div className={styles.colText}>
            <p>I am Kaiya Li, a dynamic tech and media professional with a unique blend of computing expertise and a flair for digital storytelling...</p>
            <p>My full-time roles at ByteDance Douyin Encyclopaedia, Sina Weibo and SOHU TV have honed my expertise in creating user-centric digital products...</p>
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



      
      {/* --- Hobbies --- */}
      <section className={styles.section}>
        <h2>Other Passions</h2>
        <div className={styles.carousel}>
          <Image src="/pics/R0014467.jpg" alt="Photography" width={600} height={400} />
          <p>I like to capture humanity through the way I capture light and shadow.</p>
          <Image src="/pics/game1.jpg" alt="Gaming" width={600} height={400} />
          <p>I sometimes livestream games like Splatoon3.</p>
        </div>
      </section>

      {/* --- Buttons --- */}
      <div className={styles.buttonGroup}>
        <Link href="/blog" className="btn">See More Artworks</Link>
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
