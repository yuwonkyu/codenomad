'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import ProfileMenu from '@/components/profile/ProfileMenu';

// Context 생성
export const ProfileMobileContext = createContext<{ onCancel: () => void } | null>(null);

export default function MyLayout({ children }: { children: ReactNode }) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div
      className='
        flex flex-col items-center
        md:flex-row md:items-start md:justify-center
        max-w-full md:max-w-5xl lg:max-w-7xl
        mx-auto px-4 md:px-8 lg:px-16 py-10
        gap-8 md:gap-12
        min-h-screen bg-gray-50
      '
    >
      {/* 사이드 메뉴 */}
      <aside
        className='
          w-full max-w-xs
          md:w-1/3 md:max-w-sm
          lg:w-1/4
          flex justify-center md:block
        '
      >
        {/* 모바일: 메뉴만 보이고 클릭 시 children 보임, PC: 기존대로 */}
        <div className='block md:hidden'>
          {!showContent ? <ProfileMenu onMenuClick={() => setShowContent(true)} /> : null}
        </div>
        <div className='hidden md:block'>
          <ProfileMenu />
        </div>
      </aside>
      {/* 선택된 메뉴 컨텐츠 */}
      <main className='w-full md:flex-1'>
        {/* 모바일: 메뉴 클릭 전에는 children 숨김, 클릭 후에만 children 보임 */}
        <div className='block md:hidden'>
          {showContent && (
            <ProfileMobileContext.Provider value={{ onCancel: () => setShowContent(false) }}>
              {children}
            </ProfileMobileContext.Provider>
          )}
        </div>
        {/* PC: 항상 children 보임 */}
        <div className='hidden md:block'>{children}</div>
      </main>
    </div>
  );
}
