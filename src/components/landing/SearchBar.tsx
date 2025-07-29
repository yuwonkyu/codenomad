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
    <section className='m-18 flex w-full flex-col items-center gap-4'>
      <div className='relative w-full max-w-[900px]'>
        {/* 아이콘 */}
        <span className='absolute top-1/2 left-12 -translate-y-1/2'>
          <Image src='/icons/icon_search.svg' alt='검색 아이콘' width={24} height={24} />
        </span>

        {/* 검색 버튼 */}
        <button
          aria-label='체험 검색 버튼'
          type='button'
          onClick={handleSearch}
          className='bg-primary-500 text-12-b md:text-14-b absolute top-1/2 right-10 h-[41px] w-[85px] -translate-y-1/2 cursor-pointer rounded-[14px] text-white transition md:h-[50] md:w-[120]'
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
          className='text-14-m shadow-custom-5 md:text-16-m h-53 w-full rounded-[18px] bg-white pr-[95px] pl-[48px] text-gray-600 focus:outline-none md:h-70 md:pr-[130px]'
        />
      </div>
      <div className='mt-18 flex w-full items-center justify-center gap-12 px-4'>
        <div className='h-2 w-full bg-white' />
        <Image
          src='/icons/flower.svg'
          alt='꽃 아이콘'
          width={20}
          height={20}
          className='h-20 w-20'
        />
        <div className='h-2 w-full bg-white' />
      </div>
    </section>
  );
};

export default SearchBar;
