'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { LoadingSpinner } from '@/components/profile/common/components';

export default function ProfilePage() {
  const router = useRouter();
  const screenSize = useResponsive();

  useEffect(() => {
    // PC/태블릿 (md 이상)에서는 내 정보 페이지로 리다이렉트
    if (screenSize !== 'sm') {
      router.replace('/profile/info');
    }
  }, [screenSize, router]);

  // 모바일(sm)에서는 기존 layout.tsx의 메뉴 로직이 동작하도록 null 반환
  // PC/태블릿에서는 리다이렉트 중이므로 로딩 스피너 표시
  if (screenSize === 'sm') {
    return null; // 모바일: layout의 ProfileMenu가 표시됨
  }

  // PC/태블릿: 리다이렉트 중 로딩 표시
  return <LoadingSpinner message='페이지를 불러오는 중...' useLogo={true} />;
}
