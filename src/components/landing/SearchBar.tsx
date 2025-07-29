'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (!keyword.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className='mt-32 flex w-full flex-col items-center gap-4 md:mt-50'>
      <h2 className='text-16-b md:text-32-b mb-12 whitespace-nowrap text-gray-950'>
        무엇을 체험하고 싶으신가요?
      </h2>

      <div className='relative w-full max-w-[1080px]'>
        {/* 아이콘 */}
        <span className='absolute top-1/2 left-6 -translate-y-1/2'>
          <Image src='/icons/icon_search.svg' alt='검색 아이콘' width={24} height={24} />
        </span>

        {/* 검색 버튼 */}
        <button
          aria-label='체험 검색 버튼'
          type='button'
          onClick={handleSearch}
          className='bg-primary-500 text-14-b md:text-16-b absolute top-1/2 right-4 h-[41px] w-[85px] -translate-y-1/2 cursor-pointer rounded-[14px] text-white transition md:h-[50px] md:w-[120px]'
        >
          검색하기
        </button>

        {/* 인풋 필드 */}
        <input
          aria-label='체험 검색 입력창'
          type='text'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='내가 원하는 체험은?'
          className='text-14-m shadow-custom-5 h-53 w-full rounded-[12px] bg-white pr-[95px] pl-[48px] text-gray-500 focus:outline-none md:h-70 md:pr-[130px]'
        />
      </div>
    </section>
  );
};

export default SearchBar;
