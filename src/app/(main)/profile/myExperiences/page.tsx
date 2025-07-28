'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import ExperienceCard from '@/components/profile/ExperienceCard';
import { getMyActivities, MyActivity, deleteMyActivity } from '@/lib/api/profile/myActivities';
import { ProfileMobileContext } from '../layout';
import { useContext } from 'react';
// 🆕 공통 컴포넌트 import (파일명 변경: index.ts → components.ts)
import { MobilePageHeader } from '@/components/profile/common/components';

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
      setActivities((prev) => {
        const ids = new Set(prev.map((a) => a.id));
        const newActivities = data.activities.filter((a) => !ids.has(a.id));
        return [...prev, ...newActivities];
      });
      setCursorId(
        data.activities.length > 0 ? data.activities[data.activities.length - 1].id : null,
      );
      setHasMore(data.activities.length > 0);
    } catch (err) {
      // 에러는 조용히 처리 (사용자에게는 빈 상태로 표시됨)
    } finally {
      setIsLoading(false);
    }
  }, [cursorId, hasMore]);

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
  }, [cursorId, hasMore]);

  // 삭제 핸들러
  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteMyActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  // 🎯 등록하기 버튼 컴포넌트 (actionButton으로 사용)
  const addExperienceButton = (
    <Link
      href='/experiences/add'
      className='flex h-[48px] w-[138px] items-center justify-center rounded-lg bg-blue-500 text-center text-base whitespace-nowrap text-white transition-colors hover:bg-blue-600'
    >
      <span className='flex h-full w-full items-center justify-center'>체험 등록하기</span>
    </Link>
  );

  return (
    <section className='mx-auto w-full max-w-2xl'>
      {/* 🆕 공통 MobilePageHeader 컴포넌트 사용 */}
      <MobilePageHeader
        title='내 체험 관리'
        description='내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.'
        actionButton={addExperienceButton}
      />

      {/* 🎯 체험이 없는 경우: 빈 상태 표시 */}
      {activities.length === 0 && !isLoading ? (
        <div className='shadow-custom-5 mx-auto flex min-h-[40vh] w-full max-w-2xl flex-col items-center justify-center rounded-2xl bg-white p-4 md:p-8'>
          <img src='/icons/empty.svg' alt='empty' width={120} height={120} className='mb-6' />
          <p className='mb-4 text-lg text-gray-500'>아직 등록한 체험이 없어요</p>
          {/* 📱 모바일에서만 보이는 등록 버튼 */}
          <Link
            href='/experiences/add'
            className='block flex h-[48px] w-[138px] items-center justify-center rounded-lg bg-blue-500 text-center text-base whitespace-nowrap text-white transition-colors hover:bg-blue-600 md:hidden'
          >
            <span className='flex h-full w-full items-center justify-center'>체험 등록하기</span>
          </Link>
        </div>
      ) : null}

      {/* 📋 체험이 있을 때: ExperienceCard로 목록 렌더링 */}
      {activities.length > 0 && (
        <div className='flex w-full flex-col gap-6'>
          {activities.map((activity) => (
            <ExperienceCard
              key={activity.id}
              id={activity.id}
              title={activity.title}
              rating={activity.rating}
              reviews={activity.reviewCount}
              price={activity.price}
              image={activity.bannerImageUrl}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
