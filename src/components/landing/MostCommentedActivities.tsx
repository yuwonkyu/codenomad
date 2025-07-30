'use client';

import { useState, useEffect, useRef } from 'react';
import axios from '@/lib/api/axios';
import type { Activity } from './LandingCard';
import LandingCard from './LandingCard';

const MostCommentedActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMostCommentedActivities = async () => {
    try {
      const response = await axios.get('/activities', {
        params: {
          method: 'offset',
          sort: 'most_reviewed',
          page: 1,
          size: 10,
        },
      });
      setActivities(response.data.activities);
    } catch (error) {
      console.error('인기 체험 API 호출 실패:', error);
    }
  };

  useEffect(() => {
    fetchMostCommentedActivities();
  }, []);

  // 인기체험 카드 자동 슬라이드(2초마다)
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const cardWidth = 200;
    const scrollStep = cardWidth + 16;

    const interval = setInterval(() => {
      if (!scrollContainer) return;
      scrollAmount += scrollStep;

      if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollAmount = 0;
      }

      scrollContainer.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activities]);

  return (
    <section className='-mx-24 mt-80 mb-60 md:-mx-30 lg:-mx-40'>
      <h2 className='text-20-b md:text-24-b mb-30 px-24 md:px-30 lg:px-40'> 인기 체험</h2>
      <div
        ref={scrollRef}
        className='no-scrollbar flex gap-16 overflow-hidden overflow-x-auto px-24 sm:gap-24 md:px-30 lg:px-40'
      >
        {activities.map((item) => (
          <LandingCard key={item.id} activity={item} />
        ))}
      </div>
    </section>
  );
};

export default MostCommentedActivities;
