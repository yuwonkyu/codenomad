'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/api/axios';
import type { Activity } from './LandingCard';
import LandingCard from './LandingCard';


const MostCommentedActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

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
  
  return (
    <section className='mt-80 mb-60 '>
      <h2 className='text-20-b md:text-24-b mb-30'>🔥 인기 체험</h2>
      <div className='flex gap-16 sm:gap-24 overflow-x-auto no-scrollbar overflow-hidden'>
        {activities.map((item) => (
          <LandingCard key={item.id} activity={item} />
        ))}
      </div>
    </section>
  );
};

export default MostCommentedActivities;
