'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dropdown from './Dropdown/Dropdown';

const Header = () => {
  const [user, setUser] = useState<{ nickname: string; profileImageUrl?: string } | null>(null);
  const router = useRouter();

  // 유저 정보 로드
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener('user-update', loadUser);
    return () => {
      window.removeEventListener('user-update', loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user-update')); // 헤더 갱신을 위해 이벤트 발생
    router.push('/');
  };

  const hasNewNotification = false; // 추후 API 연동

  return (
    <header className='w-full h-[48px] md:h-[80px] bg-white'>
      <div className='max-w-screen-xl h-full mx-auto flex justify-between items-center px-6'>
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
              className='cursor-pointer text-gray-600 hover:opacity-80 transition-opacity duration-200'
            />
            {/* 구분선 */}
            <div className='w-px h-14 bg-gray-200' />

            {/* 프로필 + 닉네임 + 드롭다운 */}
            <Dropdown>
              <Dropdown.Trigger>
                <div className='flex items-center mt-8 gap-2 cursor-pointer'>
                  <Image
                    src={user.profileImageUrl || '/icons/default_profile30.svg'}
                    alt='프로필'
                    width={30}
                    height={30}
                    className='rounded-full object-cover w-auto h-auto'
                  />
                  <span className='text-14-m text-gray-950 leading-none whitespace-nowrap truncate max-w-[100px]'>
                    {user.nickname}
                  </span>
                </div>
              </Dropdown.Trigger>

              <Dropdown.Content className='top-40 right-0'>
                <Dropdown.Item>
                  <Link
                    href='/profile'
                    className='block px-4 py-2 text-sm text-gray-800 w-full text-center'
                  >
                    마이페이지
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  <span className='block px-4 py-2 text-sm text-gray-800 w-full text-center'>
                    로그아웃
                  </span>
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </div>
        ) : (
          <nav className='flex gap-10 whitespace-nowrap text-sm text-gray-900 no-underline'>
            <Link href='/login'>로그인</Link>
            <Link href='/signup'>회원가입</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
