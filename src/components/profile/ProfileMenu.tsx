'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';
import { uploadProfileImage, getUserProfile } from '@/lib/api/profile';

const menuItems = [
  { icon: '/icons/icon_user.svg', label: '내 정보', href: '/profile/info' },
  { icon: '/icons/icon_list.svg', label: '예약내역', href: '/profile/reservations' },
  { icon: '/icons/icon_setting.svg', label: '내 체험 관리', href: '/profile/myExperiences' },
  { icon: '/icons/icon_calendar.svg', label: '예약 현황', href: '/profile/myActivitiesStatus' },
];

interface ProfileMenuProps {
  onMenuClick?: () => void;
}

export default function ProfileMenu({ onMenuClick }: ProfileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('/icons/profile_default.svg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 최초 렌더링 시 프로필 이미지 불러오기
  React.useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile();
        setImageUrl(profile.profileImageUrl || '/icons/profile_default.svg');
      } catch {
        setImageUrl('/icons/profile_default.svg');
      }
    })();
  }, []);

  // 이미지 업로드 핸들러
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const updated = await uploadProfileImage(file);
      // 업로드 후에만 캐시 버스터 쿼리 추가
      const updatedUrl = updated.profileImageUrl
        ? updated.profileImageUrl + '?t=' + Date.now()
        : '/icons/profile_default.svg';
      setImageUrl(updatedUrl);
      alert('프로필 이미지가 변경되었습니다!');
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className='shadow-custom-5 mx-auto mt-20 flex h-453 w-327 flex-col items-center rounded-2xl bg-white px-6 py-8 md:w-[178px] md:px-4 md:py-6 lg:w-[290px] lg:px-8 lg:py-10'>
      {/* 프로필 이미지 */}
      <div className='relative mb-8'>
        <div className='mt-30 mb-20 flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-blue-100'>
          <Image
            src={imageUrl}
            alt='프로필'
            width={120}
            height={120}
            style={{ objectFit: 'cover' }}
            key={imageUrl}
          />
        </div>
        {/* 연필 아이콘 */}
        <button
          className='shadow-custom-5 absolute right-2 bottom-2 mb-15 rounded-full border border-gray-200 bg-gray-300 p-1'
          aria-label='프로필 수정'
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
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
        {/* 실제 파일 input은 숨김 */}
        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
          disabled={isUploading}
        />
        {/* 업로드 중 오버레이 */}
        {isUploading && (
          <div className='absolute inset-0 flex items-center justify-center rounded-full bg-white/60'>
            <span className='font-bold text-blue-500'>업로드 중...</span>
          </div>
        )}
      </div>
      {/* 메뉴 리스트 */}
      <ul className='flex w-full flex-col gap-10'>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          if (onMenuClick) {
            // 모바일: 버튼 클릭 시 onMenuClick + router.push
            return (
              <li key={item.label} className='w-full'>
                <button
                  type='button'
                  onClick={() => {
                    onMenuClick();
                    router.push(item.href);
                  }}
                  className={`flex h-[54px] w-full cursor-pointer items-center gap-3 rounded-xl px-3 transition-colors md:px-30 ${isActive ? 'bg-blue-100 text-blue-500' : 'text-gray-600'} hover:bg-blue-100 hover:text-blue-500`}
                  style={{ boxSizing: 'border-box' }}
                >
                  {/* 내 정보 메뉴에 Vector.png 아이콘 제거 (info/page.tsx에서만 보임) */}
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
              </li>
            );
          }
          // PC/태블릿: 기존 Link 사용
          return (
            <li key={item.label} className='w-full'>
              <Link
                href={item.href}
                className={`flex h-[54px] w-full cursor-pointer items-center gap-3 rounded-xl px-3 transition-colors md:px-30 ${isActive ? 'bg-blue-100 text-blue-500' : 'text-gray-600'} hover:bg-blue-100 hover:text-blue-500`}
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
