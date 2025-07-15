'use client';

import LandingCard from './LandingCard';

const mockData = [
  {
    id: 1,
    bannerImageUrl: '/imgs/banner.jpg',
    title: '요가 클래스',
    rating: 4.9,
    reviewCount: 120,
    price: 15000,
  },
  {
    id: 2,
    bannerImageUrl: '/imgs/thumbnail.jpg',
    title: '수제 도자기 만들기',
    rating: 4.8,
    reviewCount: 95,
    price: 20000,
  },
  {
    id: 3,
    bannerImageUrl: '/imgs/banner.jpg',
    title: '스트릿 댄스 워크샵',
    rating: 4.7,
    reviewCount: 87,
    price: 18000,
  },
];

const MostCommentedActivities = () => {
  return (
    <section className='mt-80 mb-60 '>
      <h2 className='text-20-b md:text-24-b mb-30'>🔥 인기 체험</h2>
      <div className='flex gap-16 sm:gap-24 overflow-x-auto no-scrollbar'>
        {mockData.map((item) => (
          <LandingCard key={item.id} activity={item} />
        ))}
      </div>
    </section>
  );
};

export default MostCommentedActivities;
