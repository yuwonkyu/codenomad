'use client';

import { useContext } from 'react';
import { ProfileMobileContext } from '@/contexts/ProfileMobileContext';

// 📱 모바일 전용 페이지 헤더 컴포넌트
// 역할: 프로필 서브페이지에서 공통으로 사용하는 뒤로가기 기능 + 제목 표시
interface MobilePageHeaderProps {
  title: string; // 페이지 제목 (예: "내 정보", "예약 현황")
  description?: string; // 선택적 설명 텍스트
  actionButton?: React.ReactNode; // 오른쪽에 표시할 액션 버튼 (선택적)
}

const MobilePageHeader = ({ title, description, actionButton }: MobilePageHeaderProps) => {
  // 🔗 부모 레이아웃의 onCancel 함수 가져오기
  // 이 함수를 호출하면 모바일에서 메뉴 화면으로 돌아감
  const mobileContext = useContext(ProfileMobileContext);

  return (
    <div className='mb-20 w-full'>
      <div className='relative'>
        {/* 📱 모바일 전용 헤더: 뒤로가기 기능 포함 */}
        <button
          type='button'
          className='mb-1 flex items-center gap-2 md:hidden'
          onClick={mobileContext?.onCancel} // 🔄 Context의 onCancel 호출 → 메뉴로 돌아감
          style={{ cursor: 'pointer' }}
        >
          {/* 왼쪽 화살표 아이콘 */}
          <img src='/icons/Vector.png' alt='뒤로가기' width={20} height={20} />
          {/* 페이지 제목 */}
          <span className='text-xl font-bold'>{title}</span>
        </button>

        {/* 💻 데스크톱/태블릿 전용 헤더 */}
        <h1 className='mb-1 hidden text-xl font-bold md:block'>{title}</h1>

        {/* 📄 설명 텍스트 (있는 경우만 표시) */}
        {description && <p className='mb-4 text-sm text-gray-500'>{description}</p>}

        {/* 🎯 액션 버튼 (있는 경우만 표시, 오른쪽 상단 절대 위치) */}
        {actionButton && (
          <div className='absolute top-0 right-0 hidden md:block'>{actionButton}</div>
        )}
      </div>
    </div>
  );
};

export default MobilePageHeader;
