import Banner from '@/components/landing/Banner';
import SearchBar from '@/components/landing/SearchBar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GlobalNomad',
  description: '코드노마드 팀프로젝트',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Home() {
  return (
    <main className='w-full'>
      <div className='w-full max-w-[1120px] mx-auto px-24 md:px-30 lg:px-40'>
        <Banner />
        <SearchBar />
      </div>
    </main>
  );
}
