'use client';

import Input from '@/components/common/Input';
import Image from 'next/image';
import { useState } from 'react';

export default function ExperienceAddPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  // 예약 시간대, 이미지 등은 실제 구현에 맞게 상태 추가 필요

  return (
    <div className='max-w-[420px] mx-auto py-10 flex flex-col gap-8'>
      <h2 className='text-20-b mb-6'>내 체험 등록</h2>

      {/* 제목 */}
      <div>
        <div className='text-16-b mb-2'>제목</div>
        <Input
          placeholder='제목을 입력해 주세요'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 카테고리 */}
      <div>
        <div className='text-16-b mb-2'>카테고리</div>
        <div className='relative'>
          <Input
            placeholder='카테고리를 선택해 주세요'
            value={category}
            readOnly
            // onClick={...} // 카테고리 선택 모달 등 연결
          />
          <Image
            src='/icons/icon_chevron_down.svg'
            alt='카테고리 선택'
            width={24}
            height={24}
            className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'
          />
        </div>
      </div>

      {/* 설명 */}
      <div>
        <div className='text-16-b mb-2'>설명</div>
        <textarea
          className='w-full px-5 py-4 bg-white rounded-[16px] shadow-custom-5 text-gray-950 text-16-m placeholder:text-gray-400 resize-none min-h-[120px] border-none outline-none'
          placeholder='체험에 대한 설명을 입력해 주세요'
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      {/* 가격 */}
      <div>
        <div className='text-16-b mb-2'>가격</div>
        <Input
          placeholder='체험 금액을 입력해 주세요'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* 주소 */}
      <div>
        <div className='text-16-b mb-2'>주소</div>
        <Input
          placeholder='주소를 입력해 주세요'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* 예약 가능한 시간대 */}
      <div>
        <div className='text-16-b mb-2'>예약 가능한 시간대</div>
        {/* 날짜/시간 선택 인풋 예시 */}
        <div className='flex gap-2 mb-2'>
          <Input placeholder='yy/mm/dd' className='w-[120px]' />
          <Input placeholder='00:00' className='w-[80px]' />
          <span className='self-center'>-</span>
          <Input placeholder='00:00' className='w-[80px]' />
          <button className='ml-2 text-brand-blue text-20-b'>+</button>
        </div>
        {/* 아래에 추가된 시간대 리스트 등 구현 */}
        <div className='flex gap-2 mb-2'>
          <Input placeholder='yy/mm/dd' className='w-[120px]' />
          <Input placeholder='00:00' className='w-[80px]' />
          <span className='self-center'>-</span>
          <Input placeholder='00:00' className='w-[80px]' />
          <button className='ml-2 text-gray-400 text-20-b'>-</button>
        </div>
        <div className='flex gap-2'>
          <Input placeholder='yy/mm/dd' className='w-[120px]' />
          <Input placeholder='00:00' className='w-[80px]' />
          <span className='self-center'>-</span>
          <Input placeholder='00:00' className='w-[80px]' />
          <button className='ml-2 text-gray-400 text-20-b'>-</button>
        </div>
      </div>

      {/* 배너 이미지 등록 */}
      <div>
        <div className='text-16-b mb-2'>배너 이미지 등록</div>
        <div className='flex gap-2'>
          <div className='relative w-[96px] h-[96px] bg-gray-100 rounded-[8px] flex items-center justify-center'>
            <Image
              src='/icons/icon_gray_eye_off.svg'
              alt='배너 이미지 없음'
              width={40}
              height={40}
            />
            <span className='absolute bottom-2 left-1/2 -translate-x-1/2 text-12-m text-gray-400'>
              0/4
            </span>
          </div>
          <div className='relative w-[96px] h-[96px] rounded-[8px] overflow-hidden'>
            <Image
              src='https://images.unsplash.com/photo-1519125323398-675f0ddb6308'
              alt='배너'
              fill
              className='object-cover'
            />
            <button className='absolute top-1 right-1 bg-black/60 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs'>
              ×
            </button>
          </div>
        </div>
      </div>

      {/* 소개 이미지 등록 */}
      <div>
        <div className='text-16-b mb-2'>소개 이미지 등록</div>
        <div className='flex gap-2'>
          <div className='relative w-[96px] h-[96px] bg-gray-100 rounded-[8px] flex items-center justify-center'>
            <Image
              src='/icons/icon_gray_eye_off.svg'
              alt='소개 이미지 없음'
              width={40}
              height={40}
            />
            <span className='absolute bottom-2 left-1/2 -translate-x-1/2 text-12-m text-gray-400'>
              0/4
            </span>
          </div>
          <div className='relative w-[96px] h-[96px] rounded-[8px] overflow-hidden'>
            <Image
              src='https://images.unsplash.com/photo-1519125323398-675f0ddb6308'
              alt='소개1'
              fill
              className='object-cover'
            />
            <button className='absolute top-1 right-1 bg-black/60 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs'>
              ×
            </button>
          </div>
          <div className='relative w-[96px] h-[96px] rounded-[8px] overflow-hidden'>
            <Image
              src='https://images.unsplash.com/photo-1506744038136-46273834b3fb'
              alt='소개2'
              fill
              className='object-cover'
            />
            <button className='absolute top-1 right-1 bg-black/60 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs'>
              ×
            </button>
          </div>
          <div className='relative w-[96px] h-[96px] rounded-[8px] overflow-hidden'>
            <Image
              src='https://images.unsplash.com/photo-1465101046530-73398c7f28ca'
              alt='소개3'
              fill
              className='object-cover'
            />
            <button className='absolute top-1 right-1 bg-black/60 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs'>
              ×
            </button>
          </div>
        </div>
      </div>

      {/* 등록하기 버튼 */}
      <button className='w-full h-12 mt-8 bg-brand-blue text-white text-16-b rounded-[8px]'>
        등록하기
      </button>

      {/* 하단 푸터 */}
      <div className='mt-8 text-center text-gray-400 text-14-m'>
        Privacy Policy <span className='mx-2'>·</span> FAQ
        <div className='flex justify-center gap-4 mt-2'>
          <Image src='/icons/icon_facebook.svg' alt='facebook' width={20} height={20} />
          <Image src='/icons/icon_instagram.svg' alt='instagram' width={20} height={20} />
          <Image src='/icons/icon_google.svg' alt='google' width={20} height={20} />
        </div>
        <div className='mt-2 text-12-m'>&copy;codeit - 2023</div>
      </div>
    </div>
  );
}
