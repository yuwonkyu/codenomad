'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/api/axios';
import type { Activity } from './LandingCard';
import CategoryFilter from './CategoryFilter';
import PriceSortDropdown from './PriceSortDropdown';
import LandingCard from './LandingCard';
import Pagination from '../common/Pagination';

const AllActivities = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 8;

  const fetchActivities = async () => {
    try {
      const params: Record<string, string | number> = {
        method: 'offset',
        page: currentPage,
        size: PAGE_SIZE,
      };
      if (selectedCategory) params.category = selectedCategory;
      if (selectedSort) params.sort = selectedSort;

      const response = await axios.get('/activities', { params });
      setActivities(response.data.activities);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      console.error('체험 목록 요청 실패', err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedCategory, selectedSort, currentPage]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <section className='mt-80 mb-160'>
      {/* 타이틀 + 드롭다운 */}
      <div className='mb-12 flex items-center justify-between'>
        <h2 className='text-20-b md:text-24-b'>🛼 모든 체험</h2>
        <PriceSortDropdown
          selectedSort={selectedSort}
          onSelectSort={(sort) => {
            setSelectedSort(sort);
            setCurrentPage(1);
          }}
        />
      </div>
      {/* 카테고리 필터 */}
      <div className='mb-20'>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            setCurrentPage(1);
          }}
        />
      </div>
      {/* 카드 목록 */}
      <div className='no-scrollbar grid grid-cols-2 gap-16 sm:grid-cols-2 sm:gap-24 lg:grid-cols-4'>
        {activities.map((item) => (
          <LandingCard key={item.id} activity={item} />
        ))}
      </div>
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </section>
  );
};

export default AllActivities;
