'use client';

import LandingCard from './LandingCard';

const mockData = [
  {
    id: 1,
    imageUrl: '/imgs/banner.jpg',
    title: '요가 클래스',
    rating: 4.9,
    totalReview: 120,
    price: 15000,
  },
  {
    id: 2,
    imageUrl: '/imgs/thumbnail.jpg',
    title: '수제 도자기 만들기',
    rating: 4.8,
    totalReview: 95,
    price: 20000,
  },
  {
    id: 3,
    imageUrl: '/imgs/banner.jpg',
    title: '스트릿 댄스 워크샵',
    rating: 4.7,
    totalReview: 87,
    price: 18000,
  },
];

const MostCommentedActivities = () => {
  return (
    <section className='mt-80 px-24 md:px-40'>
      <h2 className='text-20-b md:text-24-b mb-30'>🔥 인기 체험</h2>
      <div className='flex gap-20 overflow-x-scroll no-scrollbar md:grid md:grid-cols-4 md:gap-30'>
        {mockData.map((item) => (
          <LandingCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
};

export default MostCommentedActivities;
