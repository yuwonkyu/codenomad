'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ExperienceCard from '@/components/profile/ExperienceCard';

const INITIAL_DATA = [
  {
    title: '함께 배우면 즐거운 스트릿 댄스',
    rating: 4.9,
    reviews: 293,
    price: 10000,
    image: '/imgs/thumbnail.jpg',
  },
  {
    title: '서울 야경 투어 가이드',
    rating: 4.8,
    reviews: 156,
    price: 25000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '한국 전통 요리 클래스',
    rating: 4.7,
    reviews: 89,
    price: 35000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '한강 래프팅 체험',
    rating: 4.6,
    reviews: 234,
    price: 45000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '전통 한복 체험',
    rating: 4.5,
    reviews: 178,
    price: 20000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '서울 타워 전망대 투어',
    rating: 4.4,
    reviews: 312,
    price: 30000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '강남 쇼핑 가이드',
    rating: 4.3,
    reviews: 145,
    price: 18000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '한국 전통 차 문화 체험',
    rating: 4.2,
    reviews: 98,
    price: 22000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '서울 지하철 투어',
    rating: 4.1,
    reviews: 267,
    price: 15000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '한국 전통 공예 체험',
    rating: 4.0,
    reviews: 134,
    price: 28000,
    image: '/icons/profile_default.svg',
  },
];

const MORE_DATA = [
  {
    title: '새로운 체험 1',
    rating: 4.8,
    reviews: 120,
    price: 15000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '새로운 체험 2',
    rating: 4.7,
    reviews: 95,
    price: 22000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '새로운 체험 3',
    rating: 4.6,
    reviews: 88,
    price: 18000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '새로운 체험 4',
    rating: 4.5,
    reviews: 156,
    price: 32000,
    image: '/icons/profile_default.svg',
  },
  {
    title: '새로운 체험 5',
    rating: 4.4,
    reviews: 203,
    price: 25000,
    image: '/icons/profile_default.svg',
  },
];

export default function MyExperiencesPage() {
  const [experiences, setExperiences] = useState<typeof INITIAL_DATA>([]);
  const [, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  // 초기 데이터 로드 (처음 5개만)
  useEffect(() => {
    setExperiences(INITIAL_DATA.slice(0, 5));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMoreData();
        }
      },
      { threshold: 0.1 },
    );

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loading]);

  const fetchMoreData = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // 실제 API 호출 또는 더미 데이터 추가
    setTimeout(() => {
      const currentLength = experiences.length;
      const remainingData = INITIAL_DATA.slice(currentLength, currentLength + 5);

      if (remainingData.length > 0) {
        setExperiences((prev) => [...prev, ...remainingData]);
        setPage((p) => p + 1);
      } else {
        // 초기 데이터가 모두 로드되면 추가 데이터 로드
        setExperiences((prev) => [...prev, ...MORE_DATA]);
        setHasMore(false); // 더 이상 로드할 데이터가 없음을 표시
      }

      setLoading(false);
    }, 1000);
  }, [loading, hasMore, experiences.length]);

  return (
    <div className='flex flex-col items-center gap-6 py-6'>
      {experiences.map((exp, idx) => (
        <ExperienceCard key={`${exp.title}-${idx}`} {...exp} />
      ))}

      {/* 로딩 인디케이터 */}
      {loading && (
        <div className='flex items-center justify-center py-4'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
        </div>
      )}

      {/* 무한 스크롤 트리거 */}
      {hasMore && <div ref={loader} className='h-4' />}
    </div>
  );
}
