'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: '/icons/icon_user.svg', label: '내 정보', href: '/profile/info' },
  { icon: '/icons/icon_list.svg', label: '예약내역', href: '/profile/reservations' },
  { icon: '/icons/icon_setting.svg', label: '내 체험 관리', href: '/profile/myExperiences' },
  { icon: '/icons/icon_calendar.svg', label: '예약 현황', href: '/profile/reservationStatus' },
];

interface ProfileMenuProps {
  onMenuClick?: () => void;
}

export default function ProfileMenu({ onMenuClick }: ProfileMenuProps) {
  const pathname = usePathname();
  return (
    <div
      className='
      bg-white rounded-2xl shadow-custom-5 flex flex-col items-center
        w-[327px] h-[453px]
        md:w-[178px] md:h-[370px]
        lg:w-[290px] lg:h-[450px]
        mx-auto
        px-6 py-8 md:px-4 md:py-6 lg:px-8 lg:py-10
      '
    >
      {/* 프로필 이미지 */}
      <div className='relative mb-8'>
        <div className='w-[120px] h-[120px] rounded-full bg-blue-100 flex items-center justify-center'>
          <Image src='/icons/profile_default.svg' alt='프로필' width={120} height={120} />
        </div>
        {/* 연필 아이콘 */}
        <button
          className='absolute bottom-2 right-2 bg-gray-300 rounded-full p-1 shadow-custom-5 border border-gray-200'
          aria-label='프로필 수정'
        >
          <Image
            src='/icons/icon_edit.svg'
            alt='수정'
            width={30}
            height={30}
            style={{
              filter: 'invert(1) brightness(2)',
            }}
          />
        </button>
      </div>
      {/* 메뉴 리스트 */}
      <ul className='w-full flex flex-col gap-6'>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.label} className='w-full'>
              {onMenuClick ? (
                <button
                  type='button'
                  onClick={onMenuClick}
                  className={`
                    flex items-center gap-3 w-full rounded-xl md:px-30
                    px-3 h-[54px] cursor-pointer transition-colors
                    ${isActive ? 'bg-blue-100 text-blue-500' : 'text-gray-600'}
                    hover:bg-blue-100 hover:text-blue-500
                  `}
                  style={{ boxSizing: 'border-box' }}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={24}
                    height={24}
                    style={{
                      filter: isActive
                        ? 'invert(41%) sepia(99%) saturate(749%) hue-rotate(181deg) brightness(97%) contrast(101%)'
                        : undefined,
                    }}
                  />
                  <span className='text-16-m'>{item.label}</span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 w-full rounded-xl md:px-30
                    px-3 h-[54px] cursor-pointer transition-colors
                    ${isActive ? 'bg-blue-100 text-blue-500' : 'text-gray-600'}
                    hover:bg-blue-100 hover:text-blue-500
                  `}
                  style={{ boxSizing: 'border-box' }}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={24}
                    height={24}
                    style={{
                      filter: isActive
                        ? 'invert(41%) sepia(99%) saturate(749%) hue-rotate(181deg) brightness(97%) contrast(101%)'
                        : undefined,
                    }}
                  />
                  <span className='text-16-m'>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
