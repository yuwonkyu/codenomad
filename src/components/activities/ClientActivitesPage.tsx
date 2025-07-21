'use client';

import PhotoSection from '@/components/activities/PhotoSection';
import ReviewCard from '@/components/activities/ReviewCard';
import DropdownMenu from '@/components/activities/ActivitesDropdown';
import ReservationContent from '@/components/activities/ReservationFlow/ReservationContent';
import MapView from '@/components/activities/MapView';
import Image from 'next/image';
import { useResponsive } from '@/hooks/useResponsive';
import { useState, useEffect } from 'react';
import Pagination from '@/components/common/Pagination';

type ActivityDetail = {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  subImages: SubImage[];
  schedules: Schedule[];
};

type SubImage = {
  id: number;
  imageUrl: string;
};

type Schedule = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
};

const mock = {
  id: 7,
  userId: 21,
  title: '함께 배우면 즐거운 스트릿댄스',
  description: '안녕하세요! 저희 스트릿 댄스 체험을 소개합니다. ...',
  category: '투어',
  price: 10000,
  address: '서울특별시 강남구 테헤란로 427',
  bannerImageUrl:
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/a.png',
  subImages: [
    {
      id: 1,
      imageUrl:
        'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/b.png',
    },
  ],
  schedules: [
    {
      id: 1,
      date: '2023-12-01',
      startTime: '12:00',
      endTime: '13:00',
    },
    {
      id: 2,
      date: '2023-12-05',
      startTime: '12:00',
      endTime: '13:00',
    },
  ],
  reviewCount: 1,
  rating: 4.74,
  createdAt: '2023-12-31T21:28:50.589Z',
  updatedAt: '2023-12-31T21:28:50.589Z',
};

const mockReviews = {
  averageRating: 0,
  totalCount: 0,
  reviews: [
    {
      id: 0,
      user: {
        profileImageUrl: 'string',
        nickname: '아무개',
        id: 0,
      },
      activityId: 0,
      rating: 3,
      content: '"저는 저희 스트릿 댄서 체험에 참가하게 된 지 얼마 안됐지만 ..."',
      createdAt: '2025-07-15T18:28:41.527Z',
      updatedAt: '2025-07-15T18:28:41.527Z',
    },
  ],
};

interface Props {
  id: string;
}

const ClientActivitesPage = ({ id }: Props) => {
  const screenSize = useResponsive();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDesktop = screenSize === 'lg';

  return (
    <>
      {!isDesktop ? (
        <article className='flex flex-col gap-20'>
          <PhotoSection />

          <header className='flex justify-between border-b-1 border-gray-100 pb-12'>
            <div className='flex flex-col'>
              <p className='text-13-m mb-4 text-gray-700'>{mock.category}</p>
              <h1 className='text-18-b mb-16 text-gray-950'>{mock.title}</h1>
              <div className='mb-10 flex gap-0.5'>
                <Image src='/icons/icon_star_on.svg' alt='별' width={16} height={16} />
                <p className='text-14-m text-gray-700'>
                  {mock.rating}({mock.reviewCount})
                </p>
              </div>
              <div className='flex gap-0.5'>
                <Image src='/icons/icon_map.svg' alt='지도 마크' width={16} height={16} />
                <p className='text-14-m text-gray-700'>{mock.address}</p>
              </div>
            </div>
            <DropdownMenu />
          </header>

          <section className='flex flex-col gap-8 border-b-1 border-gray-100'>
            <h2 className='text-18-b text-gray-950'>체험 설명</h2>
            <p className='text-16-body-m mb-20 text-gray-950 md:mb-40'>{mock.description}</p>
          </section>

          <section className='flex flex-col gap-8 border-b-1 border-gray-100'>
            <h2 className='text-18-b text-gray-950'>오시는 길</h2>
            <p className='text-[14px] font-semibold text-gray-950'>{mock.address}</p>
            <MapView address={mock.address} />
          </section>

          <section className='flex flex-col items-center justify-center gap-8'>
            <h2 className='text-18-b self-start text-gray-950'>
              체험 후기{' '}
              <span className='text-[14px] font-semibold text-[#79747E]'>{mock.reviewCount}개</span>
            </h2>
            <p className='text-2xl font-semibold text-gray-950'>{mock.rating}</p>
            <p className='text-lg font-bold text-gray-950'>매우 만족</p>
            <div className='mb-10 flex items-center gap-0.5'>
              <Image src='/icons/icon_star_on.svg' alt='별' width={16} height={16} />
              <p className='text-14-body-m text-gray-700'>{mock.reviewCount}개 후기</p>
            </div>
            {mockReviews.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                nickname={review.user.nickname}
                rating={review.rating}
                content={review.content}
                createdAt={review.createdAt}
              />
            ))}
            {/* 임시 적용 */}
            <Pagination currentPage={1} totalPages={1} onPageChange={(page) => console.log(page)} />
          </section>

          <div>
            <ReservationContent />
          </div>
        </article>
      ) : (
        <div className='flex gap-40'>
          <article className='flex flex-1 flex-col gap-40'>
            <PhotoSection />

            <div className='flex flex-col gap-20'>
              <section className='flex flex-col gap-8 border-b-1 border-gray-100'>
                <h3 className='text-18-b text-gray-950'>체험 설명</h3>
                <p className='text-16-body-m mb-20 text-gray-950 md:mb-40'>{mock.description}</p>
              </section>

              <section className='flex flex-col gap-8 border-b-1 border-gray-100'>
                <h3 className='text-18-b text-gray-950'>오시는 길</h3>
                <p className='text-[14px] font-semibold text-gray-950'>{mock.address}</p>
                <MapView address={mock.address} />
              </section>

              <section className='flex flex-col items-center justify-center gap-8'>
                <h3 className='text-18-b self-start text-gray-950'>
                  체험 후기{' '}
                  <span className='text-[14px] font-semibold text-[#79747E]'>
                    {mock.reviewCount}개
                  </span>
                </h3>
                <p className='text-2xl font-semibold text-gray-950'>{mock.rating}</p>
                <p className='text-lg font-bold text-gray-950'>매우 만족</p>
                <div className='mb-10 flex items-center gap-0.5'>
                  <Image src='/icons/icon_star_on.svg' alt='별' width={16} height={16} />
                  <p className='text-14-body-m text-gray-700'>{mock.reviewCount}개 후기</p>
                </div>
                {mockReviews.reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    nickname={review.user.nickname}
                    rating={review.rating}
                    content={review.content}
                    createdAt={review.createdAt}
                  />
                ))}
                {/* 임시 적용 */}
                <Pagination
                  currentPage={1}
                  totalPages={1}
                  onPageChange={(page) => console.log(page)}
                />
              </section>
            </div>
          </article>

          <section className='flex flex-col gap-24'>
            <header className='flex justify-between border-b-1 border-gray-100 pb-16'>
              <div className='flex flex-col'>
                <p className='text-13-m mb-4 text-gray-700'>{mock.category}</p>
                <h2 className='text-18-b mb-16 text-gray-950'>{mock.title}</h2>
                <div className='mb-10 flex gap-0.5'>
                  <Image src='/icons/icon_star_on.svg' alt='별' width={16} height={16} />
                  <p className='text-14-m text-gray-700'>
                    {mock.rating}({mock.reviewCount})
                  </p>
                </div>
                <div className='flex gap-0.5'>
                  <Image src='/icons/icon_map.svg' alt='지도 마크' width={16} height={16} />
                  <p className='text-14-m text-gray-700'>{mock.address}</p>
                </div>
              </div>
              <DropdownMenu />
            </header>

            <div className='sticky top-20'>
              <ReservationContent />
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ClientActivitesPage;
