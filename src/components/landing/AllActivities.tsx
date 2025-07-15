'use client';

import { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import PriceSortDropdown from './PriceSortDropdown';
import LandingCard from './LandingCard';

const mockActivities = [
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
    bannerImageUrl: '/imgs/thumbnail2.jpg',
    title: '스트릿 댄스 워크샵',
    rating: 4.7,
    reviewCount: 87,
    price: 18000,
  },
  {
    id: 4,
    bannerImageUrl: '/imgs/banner.jpg',
    title: '로컬 농장 체험 프로그램',
    rating: 4.9,
    reviewCount: 120,
    price: 19000,
  },
  {
    id: 5,
    bannerImageUrl: '/imgs/thumbnail.jpg',
    title: '해녀 일일 체험',
    rating: 4.8,
    reviewCount: 95,
    price: 30000,
  },
  {
    id: 6,
    bannerImageUrl: '/imgs/banner.jpg',
    title: '챌린지 파크 액티비티 체험',
    rating: 4.7,
    reviewCount: 87,
    price: 40000,
  },
  {
    id: 7,
    bannerImageUrl: '/imgs/thumbnail.jpg',
    title: '수제 도자기 만들기',
    rating: 4.8,
    reviewCount: 95,
    price: 20000,
  },
  {
    id: 8,
    bannerImageUrl: '/imgs/thumbnail2.jpg',
    title: '스트릿 댄스 워크샵',
    rating: 4.7,
    reviewCount: 87,
    price: 18000,
  },
];

const AllActivities = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  return (
    <section className='mt-80 mb-160'>
      {/* 타이틀 + 드롭다운 */}
      <div className='flex items-center justify-between mb-12'>
        <h2 className='text-20-b md:text-24-b'>🛼 모든 체험</h2>
        <PriceSortDropdown selectedSort={selectedSort} onSelectSort={setSelectedSort} />
      </div>

      {/* 카테고리 필터 (아래로 내려오기) */}
      <div className='mb-20'>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* 카드 목록 */}
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-16 sm:gap-24 no-scrollbar'>
        {mockActivities.map((item) => (
          <LandingCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
};

export default AllActivities;
