'use client';

import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='h-[116px] w-full border-t border-b border-gray-200 bg-white md:h-[140px]'>
      <div className='text-13-m mx-auto flex h-full max-w-screen-xl items-center justify-between px-6 text-gray-500'>
        {/* 왼쪽: 저작권 */}
        <div>©CodeNomad - 2025</div>

        {/* 가운데: 정책 링크 */}
        <div className='flex gap-2'>
          <a href='#' className='hover:underline'>
            Privacy Policy
          </a>
          <span>·</span>
          <a href='#' className='hover:underline'>
            FAQ
          </a>
        </div>

        {/* 오른쪽: 소셜 아이콘 */}
        <div className='flex items-center gap-3'>
          <Image src='/icons/icon_facebook.svg' alt='Facebook' width={16} height={16} />
          <Image src='/icons/icon_instagram.svg' alt='Instagram' width={16} height={16} />
          <Image src='/icons/icon_youtube.svg' alt='YouTube' width={16} height={16} />
          <Image src='/icons/icon_X.svg' alt='X' width={16} height={16} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
