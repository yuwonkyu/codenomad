// app/search/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from '@/lib/api/axios';
import type { Activity } from '@/components/landing/LandingCard';
import LandingCard from '@/components/landing/LandingCard';
import Pagination from '@/components/common/Pagination';
import NoResult from '@/components/search/NoResult';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const page = Number(searchParams.get('page')) || 1;
  const size = 8;
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(`/activities`, {
          params: {
            method: 'offset',
            keyword,
            page,
            size,
          },
        });

        setActivities(res.data.activities);
        setTotalCount(res.data.totalCount);
      } catch (err) {
        console.error('검색 결과 요청 실패', err);
      }
    };

    fetchActivities();
  }, [keyword, page]);

  const totalPages = Math.ceil(totalCount / size);

  return (
    <main className='w-full min-h-screen px-20'>
      <div className='text-20-b mb-20'>{`‘${keyword}’에 대한 검색 결과입니다.`}</div>

      {activities.length === 0 ? (
        <NoResult />
      ) : (
        <>
          <section className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-20'>
            {activities.map((activity) => (
              <LandingCard key={activity.id} activity={activity} />
            ))}
          </section>
          {totalCount > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.set('page', newPage.toString());
                router.push(`?${newParams.toString()}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </>
      )}
    </main>
  );
};

export default SearchPage;
