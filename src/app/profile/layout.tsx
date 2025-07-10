import type { Metadata } from 'next';
import '@/app/globals.css';
import ProfileMenu from '@/components/profile/ProfileMenu';

export const metadata: Metadata = {
  title: 'GlobalNomad',
  description: '코드노마드 팀프로젝트',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function MyLayout({ children }: { children: React.ReactNode }) {
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
        <ProfileMenu />
      </aside>
      {/* 선택된 메뉴 컨텐츠 */}
      <main className='w-full md:flex-1'>{children}</main>
    </div>
  );
}
