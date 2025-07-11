'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const { user, logout } = useAuthStore();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    window.location.href = '/';
  };

  const hasNewNotification = false; // 추후 API 연동

  // 외부 클릭 시 드롭다운 닫기(수정 예정)
  useEffect(() => {
    const handler = (e: MouseEvent) =>
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      setOpenDropdown(false);

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className='w-full border-b border-gray-200 bg-white'>
      <div className='max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4'>
        {/* 로고 */}
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='/icons/logoVertical.svg'
            alt='GlobalNomad 로고'
            width={174}
            height={28}
            priority
          />
        </Link>

        {/* 로그인 여부에 따라 분기 */}
        {user ? (
          <div className='flex items-center gap-4 relative'>
            {/* 알림 아이콘 */}
            <Image
              src={hasNewNotification ? '/icons/icon_bell_on.svg' : '/icons/icon_bell_off.svg'}
              alt='알림'
              width={24}
              height={24}
              className='cursor-pointer color-gray-600 hover:opacity-80 transition-opacity duration-200'
            />

            {/* 구분선 */}
            <div className='w-px h-14 bg-gray-200' />

            {/* 프로필 + 닉네임 */}
            <div
              className='flex items-center gap-2 item-center cursor-pointer'
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              <Image
                src={user.profileImageUrl || '/icons/default_profile30.svg'}
                alt='프로필'
                width={30}
                height={30}
                className='rounded-full w-auto h-auto object-cover'
              />
              <span className='text-sm font-bold text-gray-950 cursor-pointer '>
                {user.nickname}
              </span>
            </div>

            {/* 드롭다운 */}
            {openDropdown && (
              <div
                ref={dropdownRef}
                className='absolute top-40 right-8 bg-white border border-[#dfdfdf] rounded-md shadow-lg w-76 whitespace-nowrap z-10'
              >
                <Link
                  href='/profile'
                  className='block px-4 py-2 text-sm text-center text-gray-800 hover:bg-gray-100'
                  onClick={() => setOpenDropdown(false)}
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full text-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100'
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <nav className='flex gap-4 text-sm text-gray-900 no-underline'>
            <Link href='/login'>로그인</Link>
            <Link href='/signup'>회원가입</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
