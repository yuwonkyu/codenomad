'use client';

import PhotoSection from '@/components/activities/PhotoSection';
import clsx from 'clsx';
import DropdownMenu from '@/components/activities/ActivitesDropdown';
import ReservationContent from '@/components/activities/ReservationFlow/ReservationContent';
import MapView from '@/components/activities/MapView';
import Image from 'next/image';
import { useResponsive } from '@/hooks/useResponsive';
import { useState, useEffect } from 'react';
import ReviewSection from '@/components/activities/ReviewSection';
import type { ActivityDetail } from '@/components/activities/Activities.types';
import { fetchActivitiesDetails } from '@/lib/api/activities';

const activityReviews = {
  averageRating: 4.2,
  totalCount: 10,
  reviews: [
    {
      id: 1,
      user: { profileImageUrl: 'string', nickname: '아무개1', id: 1 },
      activityId: 1000,
      rating: 5,
      content: '정말 유익한 체험이었어요!',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
    {
      id: 2,
      user: { profileImageUrl: 'string', nickname: '아무개2', id: 2 },
      activityId: 1000,
      rating: 4,
      content: '재밌고 강사님이 친절했어요.',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
    {
      id: 3,
      user: { profileImageUrl: 'string', nickname: '아무개3', id: 3 },
      activityId: 1000,
      rating: 3,
      content: '기대보다 평범했지만 괜찮았어요.',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
    {
      id: 4,
      user: { profileImageUrl: 'string', nickname: '아무개4', id: 4 },
      activityId: 1000,
      rating: 5,
      content: '잊지 못할 시간이었습니다!',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
    {
      id: 5,
      user: { profileImageUrl: 'string', nickname: '아무개5', id: 5 },
      activityId: 1000,
      rating: 4,
      content: '친구들과 함께 해서 더 좋았어요.',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
    {
      id: 6,
      user: { profileImageUrl: 'string', nickname: '아무개6', id: 6 },
      activityId: 1000,
      rating: 4,
      content: '한 번쯤 해볼 만한 체험이에요.',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
    {
      id: 7,
      user: { profileImageUrl: 'string', nickname: '아무개7', id: 7 },
      activityId: 1000,
      rating: 5,
      content: '분위기가 정말 좋았어요.',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
    {
      id: 8,
      user: { profileImageUrl: 'string', nickname: '아무개8', id: 8 },
      activityId: 1000,
      rating: 4,
      content: '내용도 알차고 만족합니다.',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
    {
      id: 9,
      user: { profileImageUrl: 'string', nickname: '아무개9', id: 9 },
      activityId: 1000,
      rating: 3,
      content: '무난무난 했어요.',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
    {
      id: 10,
      user: { profileImageUrl: 'string', nickname: '아무개10', id: 10 },
      activityId: 1000,
      rating: 5,
      content: '강추합니다! 또 가고 싶어요!',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
  ],
};

interface ClientActivitesPageProps {
  id: number;
}

const ClientActivitesPage = ({ id }: ClientActivitesPageProps) => {
  const screenSize = useResponsive();
  const [activity, setActivity] = useState<ActivityDetail | null>(null);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const res = await fetchActivitiesDetails(id);
        setActivity(res);
        console.log(activity);
      } catch (err) {
        console.error('데이터 불러오기 실패', err); // 추후 not-found나 error 페이지 작성 시 변경 예정
        setActivity(null); // 또는 fallback
      }
    };

    loadActivity();
  }, [id]);

  if (!activity) return null; // 추후 조건부 렌더링으로 스켈레톤 적용 예정

  const isDesktop = screenSize === 'lg';

  return (
    <>
      {/* 상단 공통 이미지 */}
      <PhotoSection bannerImages={activity.bannerImageUrl} subImages={activity.subImages} />

      <div className={clsx('w-full', isDesktop ? 'flex gap-40' : 'flex flex-col gap-20')}>
        {/* 본문 */}
        <article className='flex flex-1 flex-col gap-40'>
          <header className='flex justify-between border-b-1 border-gray-100 pb-12'>
            <div className='flex flex-col'>
              <p className='text-13-m mb-4 text-gray-700'>{activity.category}</p>
              <h1 className='text-18-b mb-16 text-gray-950'>{activity.title}</h1>
              <div className='mb-10 flex gap-0.5'>
                <Image src='/icons/icon_star_on.svg' alt='별' width={16} height={16} />
                <p className='text-14-m text-gray-700'>
                  {activity.rating}({activity.reviewCount})
                </p>
              </div>
              <div className='flex gap-0.5'>
                <Image src='/icons/icon_map.svg' alt='지도 마크' width={16} height={16} />
                <p className='text-14-m text-gray-700'>{activity.address}</p>
              </div>
            </div>
            <DropdownMenu activityId={id} />
          </header>

          <section className='flex flex-col gap-8 border-b-1 border-gray-100'>
            <h2 className='text-18-b text-gray-950'>체험 설명</h2>
            <p className='text-16-body-m mb-20 text-gray-950 md:mb-40'>{activity.description}</p>
          </section>

          <section className='flex flex-col gap-8 border-b-1 border-gray-100'>
            <h2 className='text-18-b text-gray-950'>오시는 길</h2>
            <p className='text-[0.875rem] font-semibold text-gray-950'>{activity.address}</p>
            <MapView address={activity.address} />
          </section>

          <ReviewSection reviewData={activityReviews} />
        </article>

        {/* 예약 영역 */}
        <section
          className={clsx(
            'flex flex-col gap-24',
            isDesktop ? 'sticky top-20 w-[25.625rem]' : 'mt-20',
          )}
        >
          <ReservationContent activity={activity} />
        </section>
      </div>
    </>
  );
};

export default ClientActivitesPage;
