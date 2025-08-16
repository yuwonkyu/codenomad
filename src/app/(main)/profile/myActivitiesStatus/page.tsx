'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/profile/common/components';

// Dynamic import로 클라이언트 사이드에서만 렌더링
const MyActivitiesStatusContent = dynamic(() => import('./MyActivitiesStatusContent'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

const MyActivitiesStatusPage = () => {
  return <MyActivitiesStatusContent />;
};

export default MyActivitiesStatusPage;
