'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './projects.module.css';
import { ReactElement } from 'react';

const codingProjects = [
  {
    title: 'MealCraft',
    description: 'An iOS app that recognizes ingredients from photos and suggests recipes.',
    tech: ['Swift', 'Core ML', 'Google Vision API', 'Firebase'],
    image: '/pics/mealcraft.png',
    github: 'https://github.com/yourname/mealcraft',
    demo: 'https://mealcraft-demo.com',
  },
  {
    title: 'Personal Portfolio',
    description: 'This website! Built to showcase my background, work, and thoughts.',
    tech: ['Next.js', 'TypeScript', 'Firebase', 'CSS Modules'],
    image: '/pics/portfolio.png',
    github: 'https://github.com/yourname/portfolio',
    demo: '/',
  },
];

const localizationProjects = [
  {
    title: 'Dire Destiny',
    description: 'English to Chinese localization project for a card strategy game.',
    tech: ['Trados', 'MemoQ', 'Excel'],
    image: '/pics/destiny.png',
  },
  {
    title: 'Twin Mirror',
    description: 'English translation polishing for narrative adventure game.',
    tech: ['MemoQ', 'Proofreading'],
    image: '/pics/twinmirror.png',
  },
];

const photographyProjects = [
  {
    title: 'Private Gallery',
    description: 'Login to access the full gallery of my documentary and travel photography.',
    tech: ['Protected Page', 'Firebase Auth'],
    image: '/pics/IMG_4906.JPG',
    demo: '/gallery',
  },
  {
    title: 'Recent Works',
    description: 'A visual archive of recent photography featuring architecture, daily life and landscapes.',
    tech: ['Ricoh GR2', 'Canon Prima Super 90 Wide'],
    image: '/pics/R0015041.jpg',
    demo: '/projects#photography',
  },
];

export default function ProjectsPage() {
interface Project {
    title: string;
    description: string;
    tech: string[];
    image: string;
    github?: string;
    demo?: string;
}

const renderProjectGrid = (projects: Project[]): ReactElement => (
    <div className={styles.grid}>
        {projects.map((project, index) => (
            <div className={styles.card} key={index}>
                <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={300}
                    className={styles.image}
                />
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className={styles.techList}>
                    {project.tech.map((tool, i) => (
                        <span key={i} className={styles.tech}>{tool}</span>
                    ))}
                </div>
                <div className={styles.links}>
                    {project.demo && (
                        <Link href={project.demo} target="_blank" className={styles.btn}>Explore</Link>
                    )}
                    {project.github && (
                        <Link href={project.github} target="_blank" className={styles.btnSecondary}>GitHub</Link>
                    )}
                </div>
            </div>
        ))}
    </div>
);

  return (
    <div className={styles.projectsContainer}>
      <h1 className={styles.title}>My Projects</h1>
      <p className={styles.intro}>Here’s a glimpse into the work I’ve done across development, localization, and photography.</p>

      <h2 className={styles.sectionTitle}>Coding Projects</h2>
      {renderProjectGrid(codingProjects)}

      <h2 className={styles.sectionTitle}>Game Localization</h2>
      {renderProjectGrid(localizationProjects)}

      <h2 className={styles.sectionTitle}>Photography</h2>
      {renderProjectGrid(photographyProjects)}
    </div>
  );
}
