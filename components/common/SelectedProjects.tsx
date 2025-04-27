'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  updatedAt: any;
  cover: string;
};

// 提取封面图，包括Cloudinary图片、YouTube缩略图、或默认图
function extractFirstCoverFromLayout(layout: any, fallback: string): string {
  const contentArray = layout?.content || [];

  for (const block of contentArray) {
    const src = block?.attrs?.src;

    if (!src) continue;

    if (isImageUrl(src)) {
      return src;
    }

    if (isYouTubeUrl(src)) {
      const youtubeThumb = getYouTubeThumbnail(src);
      if (youtubeThumb) {
        return youtubeThumb;
      }
    }
  }

  return fallback;
}

// 判断是否是图片链接
function isImageUrl(url: string): boolean {
  if (!url) return false;
  if (/\.(jpeg|jpg|gif|png|webp)$/i.test(url)) return true;
  if (url.includes('res.cloudinary.com')) return true;
  return false;
}

// 判断是否是YouTube链接
function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

// 提取YouTube视频的缩略图URL
function getYouTubeThumbnail(url: string): string | null {
  let videoId = null;

  const match1 = url.match(/v=([^&]+)/);
  if (match1) {
    videoId = match1[1];
  }

  const match2 = url.match(/youtu\.be\/([^?&]+)/);
  if (match2) {
    videoId = match2[1];
  }

  if (videoId) {
    // 直接优先返回maxres版本
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  return null;
}


export default function SelectedProjects() {
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);

  const DEFAULT_COVER = 'https://res.cloudinary.com/dnp3ljchb/image/upload/v1745778529/aev8mgr0nnlvpdrckcie.png';

  useEffect(() => {
    async function fetchProjects() {
      const q = query(collection(db, 'projects'), orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const allProjects = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const firstCoverUrl = extractFirstCoverFromLayout(data.layout, DEFAULT_COVER);

        return {
          id: doc.id,
          title: data.title,
          category: data.category,
          description: data.description,
          images: [],
          updatedAt: data.updatedAt || data.createdAt,
          cover: firstCoverUrl,
        };
      }) as Project[];

      const categories = ['Coding', 'Localization', 'Photography'];
      const latestByCategory: Project[] = [];

      for (const category of categories) {
        const project = allProjects.find((proj) => proj.category === category);
        if (project) {
          latestByCategory.push(project);
        }
      }

      setSelectedProjects(latestByCategory);
    }

    fetchProjects();
  }, []);

  if (selectedProjects.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <section className="my-20 px-4">
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <p className="text-gray-600 text-sm">
          A curated selection of my recent work across software development, game localization, and photography.
        </p>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="w-full max-w-4xl mx-auto pb-15"
      >
        {selectedProjects.map((project) => (
          <SwiperSlide key={project.id}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                {project.cover ? (
                  <Image
                    src={project.cover}
                    alt={project.title}
                    width={800}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="px-6 py-4">
                <h3 className="text-xl font-bold mb-1">
                  <Link href={`/projects/${project.category}/${project.id}`} className="text-blue-600 hover:underline">
                    {project.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 mb-2">{project.category}</p>
                <p className="text-gray-700 text-sm line-clamp-3">{project.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
