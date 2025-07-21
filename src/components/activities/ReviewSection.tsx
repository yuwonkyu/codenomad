'use client';

import { useState } from 'react';
import Image from 'next/image';
import Pagination from '@/components/common/Pagination';
import ReviewCard from '@/components/activities/ReviewCard';
import type { ReviewResponse } from './Activities.types';

interface ReviewSectionProps {
  reviewData: ReviewResponse;
}

const PAGE_SIZE = 3;
const INITIAL_REVIEW_PAGE = 1;

const ReviewSection = ({ reviewData }: ReviewSectionProps) => {
  const { reviews, averageRating, totalCount } = reviewData;

  const [currentPage, setCurrentPage] = useState(INITIAL_REVIEW_PAGE);

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const currentReviews = reviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getSatisfactionText = (rating: number) => {
    if (rating >= 4.5) return '매우 만족';
    if (rating >= 3.5) return '만족';
    if (rating >= 2.5) return '보통';
    if (rating >= 1.5) return '불만족';
    return '매우 불만족';
  };

  return (
    <section className='flex flex-col items-center justify-center gap-8'>
      {/* 후기 요약 헤더 */}
      <h2 className='text-18-b self-start text-gray-950'>
        체험 후기 <span className='text-[14px] font-semibold text-[#79747E]'>{totalCount}개</span>
      </h2>
      <p className='text-2xl font-semibold text-gray-950'>{averageRating}</p>
      <p className='text-lg font-bold text-gray-950'>{getSatisfactionText(averageRating)}</p>

      <div className='mb-10 flex items-center gap-0.5'>
        <Image src='/icons/icon_star_on.svg' alt='별' width={16} height={16} />
        <p className='text-14-body-m text-gray-700'>{totalCount}개 후기</p>
      </div>

      {/* 후기 리스트 */}
      <div className='flex w-full flex-col gap-20'>
        {currentReviews.map((review) => (
          <article key={review.id}>
            <ReviewCard
              nickname={review.user.nickname}
              rating={review.rating}
              content={review.content}
              createdAt={review.createdAt}
            />
          </article>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
};

export default ReviewSection;
