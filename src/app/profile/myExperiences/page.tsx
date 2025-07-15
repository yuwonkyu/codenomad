'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import ExperienceCard from '@/components/profile/ExperienceCard';
import { getMyActivities, MyActivity } from '@/lib/api/profile/my-activities';
import { ProfileMobileContext } from '../layout';
import { useContext } from 'react';

export default function MyExperiencesPage() {
  const [activities, setActivities] = useState<MyActivity[]>([]);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const mobileContext = useContext(ProfileMobileContext);

  const fetchActivities = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const data = await getMyActivities(cursorId ?? undefined, 5);
      setActivities((prev) => [...prev, ...data.activities]);
      setCursorId(
        data.activities.length > 0 ? data.activities[data.activities.length - 1].id : null,
      );
      setHasMore(data.activities.length > 0);
    } catch (err) {
      console.error('체험 목록을 가져오는데 실패했습니다:', err);
    } finally {
      setIsLoading(false);
    }
  }, [cursorId, hasMore, isLoading]);

  useEffect(() => {
    fetchActivities();
  }, []); // 초기 한 번만 호출

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchActivities();
        }
      },
      { threshold: 1.0 },
    );

    const loader = loaderRef.current;
    if (loader) {
      observer.observe(loader);
    }

    return () => {
      if (loader) {
        observer.unobserve(loader);
      }
    };
  }, [fetchActivities]);

  return (
    <div className='w-full max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        {/* 모바일: 아이콘+텍스트, 클릭 시 onCancel */}
        <button
          type='button'
          className='flex items-center gap-2 mb-1 block md:hidden'
          onClick={mobileContext?.onCancel}
          style={{ cursor: 'pointer' }}
        >
          <img src='/icons/Vector.png' alt='vector' width={20} height={20} />
          <span className='text-xl font-bold'>내 체험 관리</span>
        </button>
        {/* PC/테블릿: 텍스트만 */}
        <h1 className='text-xl font-bold mb-1 hidden md:block'>내 체험 관리</h1>

        <Link
          href='/experiences/add'
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          체험 등록하기
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {activities.map((activity) => (
          <ExperienceCard
            key={activity.id}
            title={activity.title}
            rating={activity.rating}
            reviews={activity.reviewCount}
            price={activity.price}
            image={activity.bannerImageUrl}
          />
        ))}
      </div>
      <div ref={loaderRef} className='h-10 flex justify-center items-center'>
        {isLoading && <p>로딩 중...</p>}
      </div>
      {!hasMore && activities.length > 0 && (
        <p className='text-center my-4'>더 이상 체험이 없습니다.</p>
      )}
      {!isLoading && activities.length === 0 && (
        <div className='text-center py-10'>
          <p>등록된 체험이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
