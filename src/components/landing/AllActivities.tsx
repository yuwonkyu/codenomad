'use client';

import { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import PriceSortDropdown from './PriceSortDropdown';
import LandingCard from './LandingCard';
import Pagination from '../common/Pagination';



const AllActivities = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
          <LandingCard key={item.id} activity={item} />
        ))}
      </div>
      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={7}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </section>
  );
};

export default AllActivities;
