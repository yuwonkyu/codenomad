'use client';

import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='w-full bg-white border-t border-b border-gray-200'>
      <div className='max-w-screen-xl mx-auto flex justify-between items-center px-6 py-6 text-xs text-gray-500'>
        {/* 왼쪽: 저작권 */}
        <div>©codeit - 2023</div>

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
        <div className='flex gap-3 items-center'>
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
