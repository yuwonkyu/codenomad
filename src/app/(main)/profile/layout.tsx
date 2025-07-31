'use client';
import { useState } from 'react';
import { ProfileMobileContext } from '@/contexts/ProfileMobileContext';
import ProfileMenu from '@/components/profile/ProfileMenu';

export default function MyLayout({ children }: { children: React.ReactNode }) {
  // 🔄 모바일 화면 전환 상태 관리
  // false: 프로필 메뉴 화면 / true: 선택된 서브페이지 화면
  const [showContent, setShowContent] = useState(false);

  return (
    <div className='mx-auto flex min-h-screen max-w-375 flex-col items-center gap-8 bg-white px-4 py-10 md:max-w-744 md:flex-row md:items-start md:justify-center md:gap-12 md:px-8 lg:max-w-7xl lg:px-16'>
      {/* 🎯 사이드바 영역: 프로필 메뉴가 들어가는 공간 */}
      <aside className='sticky top-10 flex w-full max-w-xs justify-center md:block md:w-1/3 md:max-w-sm lg:w-1/4'>
        {/* 📱 모바일 화면 (md 미만): 조건부 메뉴 표시 */}
        <div className='block md:hidden'>
          {/* showContent가 false일 때만 메뉴 표시 (메뉴 ↔ 콘텐츠 토글) */}
          {!showContent ? <ProfileMenu onMenuClick={() => setShowContent(true)} /> : null}
        </div>

        {/* 💻 데스크톱/태블릿 화면 (md 이상): 항상 메뉴 표시 */}
        <div className='hidden md:block'>
          <div className='ml-40 lg:ml-100'>
            {/* onMenuClick 없음 = 화면 전환 없이 라우팅만 */}
            <ProfileMenu />
          </div>
        </div>
      </aside>

      {/* 📄 메인 콘텐츠 영역: 선택된 페이지 내용이 표시되는 공간 */}
      <main className='w-full md:flex-1'>
        {/* 📱 모바일 화면에서의 콘텐츠 표시 */}
        <div className='block flex min-h-[60vh] items-center justify-center md:hidden'>
          {/* showContent가 true일 때만 자식 컴포넌트 렌더링 */}
          {showContent && (
            // 🔗 Context Provider: 자식 컴포넌트들에게 onCancel 함수 제공
            // onCancel 실행 시 → setShowContent(false) → 메뉴 화면으로 돌아감
            <ProfileMobileContext.Provider value={{ onCancel: () => setShowContent(false) }}>
              {children}
            </ProfileMobileContext.Provider>
          )}
        </div>

        {/* 💻 데스크톱/태블릿 화면에서의 콘텐츠 표시 */}
        {/* 항상 children 렌더링 (메뉴와 콘텐츠 동시 표시) */}
        <div className='hidden md:block'>{children}</div>
      </main>
    </div>
  );
}
