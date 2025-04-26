'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function SelectedProjects() {
  const projects = [
    {
      id: 'QvQsjZM9sWWOBn9O21Bf',
      title: 'MealCraft – AI Dinner Assistant',
      category: 'Coding Project',
      cover: 'https://res.cloudinary.com/dnp3ljchb/image/upload/v1744634972/portfolio/layouts/mfy9mu5p2woxpmdcdo9i.png',
      description: 'A smart recipe app that suggests dinner ideas based on what you have.',
    },
    {
      id: 'TaLuVMNQhbxWFcBMwX66',
      title: 'Dire Destiny – Game Localization',
      category: 'Game Localization',
      cover: 'https://res.cloudinary.com/dnp3ljchb/image/upload/v1744634972/portfolio/layouts/dire-destiny-cover.jpg',
      description: 'Localized a fantasy RPG from English to Chinese with style and accuracy.',
    },
    {
      id: 'J9dlC7DVqhKP9pgwRs5O',
      title: 'Urban Light & Shadow',
      category: 'Photography Project',
      cover: 'https://res.cloudinary.com/dnp3ljchb/image/upload/v1744634972/portfolio/layouts/urban-light-shadow.jpg',
      description: 'Capturing street light and humanity through subtle timing and emotion.',
    },
  ];

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
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
              <Image
                src={project.cover}
                alt={project.title}
                width={800}
                height={400}
                className="object-contain max-h-full max-w-full"
              />
            </div>
        
            <div className="px-6 py-4">
              <h3 className="text-xl font-bold mb-1">
                <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
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
