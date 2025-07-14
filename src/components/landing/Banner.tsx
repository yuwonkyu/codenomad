'use client';

import Image from 'next/image';

const Banner = () => {
  return (
    <section className='w-full h-181 rounded-[12px] md:h-375 lg:h-500 relative rounded-[24px] overflow-hidden'>
      <Image src='/imgs/banner.jpg' alt='메인 배너 이미지' fill className='object-cover' priority />
      <div className='absolute inset-0 flex flex-col justify-center items-center bg-black/30 text-white px-4 text-center'>
        <h1 className='text-xl md:text-24-b lg:text-32-b font-semibold mb-4'>
          함께 배우면 즐거운 스트릿 댄스
        </h1>
        <p className='text-14-m md:text-18-b lg:text-18-b'>1월의 인기체험 BEST 🔥</p>
      </div>
    </section>
  );
};

export default Banner;
