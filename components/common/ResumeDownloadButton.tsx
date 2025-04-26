'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

type Lang = 'en' | 'zh';

export default function ResumeDownloadButton() {
  const [resumes, setResumes] = useState<{ [key in Lang]?: string }>({});

  useEffect(() => {
    const fetchResumes = async () => {
      const q = query(collection(db, 'assets'));
      const snapshot = await getDocs(q);
      const data: { [key in Lang]?: string } = {};

      snapshot.docs.forEach((doc) => {
        const docData = doc.data();
        if (docData.type === 'cv-en') data.en = docData.url;
        if (docData.type === 'cv-zh') data.zh = docData.url;
      });

      setResumes(data);
    };

    fetchResumes();
  }, []);

  if (!resumes.en && !resumes.zh) return null;

  return (
    <>
      {resumes.en && (
        <a
          href={resumes.en}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="btn"
        >
          📥 Download English Resume
        </a>
      )}
      {resumes.zh && (
        <a
          href={resumes.zh}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="btn"
        >
          📥 下载中文简历
        </a>
      )}
    </>
  );
}
