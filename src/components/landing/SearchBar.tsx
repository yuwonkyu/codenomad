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
    <section className='w-full mt-32 md:mt-50 flex flex-col items-center gap-4'>
      <h2 className='text-16-b md:text-32-b text-gray-950'>무엇을 체험하고 싶으신가요?</h2>

      <div className='relative w-full max-w-[1080px]'>
        {/* 아이콘 */}
        <span className='absolute left-4 top-1/2 -translate-y-1/2'>
          <Image src='/icons/icon_search.svg' alt='검색 아이콘' width={24} height={24} />
        </span>

        {/* 검색 버튼 */}
        <button
          onClick={handleSearch}
          className='absolute right-4 top-1/2 -translate-y-1/2 
                     w-[85px] h-[41px] md:w-[120px] md:h-[50px] 
                     bg-primary-500 text-white text-14-b md:text-16-b 
                     rounded-[14px] hover:bg-blue-400 transition cursor-pointer'
        >
          검색하기
        </button>

        {/* 인풋 필드 */}
        <input
          type='text'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='내가 원하는 체험은?'
          className='w-full h-53 rounded-[12px] 
                     pl-[30px] pr-[95px] md:pr-[130px] 
                     text-gray-500 text-14-m md:h-70 focus:outline-none cursor-pointer'
          style={{
            boxShadow: '0px 6px 10px rgba(13, 153, 255, 0.05)',
          }}
        />
      </div>
    </section>
  );
};

export default SearchBar;
