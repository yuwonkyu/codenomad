'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import ExperienceCard from '@/components/profile/ExperienceCard';
import { getMyActivities, MyActivity, deleteMyActivity } from '@/lib/api/profile/my-activities';
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

  return (
    <section className='w-full max-w-2xl mx-auto'>
      {/* 상단 타이틀/설명 */}
      <div className='w-full mb-8 flex justify-between items-center'>
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
        {/* PC/테블릿: 등록하기 버튼 */}
        <Link
          href='/experiences/add'
          className='w-[138px] h-[48px] flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-base text-center whitespace-nowrap hidden md:block'
        >
          <span className='w-full h-full flex items-center justify-center'>체험 등록하기</span>
        </Link>
      </div>
      {/* 중앙 카드 스타일 콘텐츠 */}
      {activities.length === 0 && !isLoading ? (
        <div className='bg-white rounded-2xl shadow-custom-5 p-4 md:p-8 w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[40vh]'>
          <img src='/icons/empty.svg' alt='empty' width={120} height={120} className='mb-6' />
          <p className='text-lg text-gray-500 mb-4'>아직 등록한 체험이 없어요</p>
          <Link
            href='/experiences/add'
            className='w-[138px] h-[48px] flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-base text-center whitespace-nowrap block md:hidden'
          >
            <span className='w-full h-full flex items-center justify-center'>체험 등록하기</span>
          </Link>
        </div>
      ) : null}

      {/* 체험이 있을 때 ExperienceCard로 목록 렌더링 */}
      {activities.length > 0 && (
        <div className='flex flex-col gap-6 w-full'>
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
