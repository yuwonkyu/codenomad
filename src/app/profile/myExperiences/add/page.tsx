'use client';

import Input from '@/components/common/Input';
import Image from 'next/image';
import { useState } from 'react';

// 카테고리 옵션
const categoryOptions = [
  { value: '', label: '카테고리를 선택해 주세요' },
  { value: 'culture', label: '문화 · 예술' },
  { value: 'food', label: '식음료' },
  { value: 'sports', label: '스포츠' },
  { value: 'tour', label: '투어' },
  { value: 'sightseeing', label: '관광' },
  { value: 'wellbeing', label: '웰빙' },
];

interface ReserveTime {
  date: string;
  start: string;
  end: string;
}

export default function ExperienceAddPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [reserveTimes, setReserveTimes] = useState<ReserveTime[]>([
    { date: '', start: '', end: '' },
  ]);
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [introImages, setIntroImages] = useState<File[]>([]);
  const [introPreviews, setIntroPreviews] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // 예약 시간대 추가
  const handleAddReserveTime = () => {
    setReserveTimes([...reserveTimes, { date: '', start: '', end: '' }]);
  };

  // 예약 시간대 삭제
  const handleRemoveReserveTime = (idx: number) => {
    setReserveTimes(reserveTimes.filter((_, i) => i !== idx));
  };

  // 예약 시간대 변경
  const handleReserveChange = (idx: number, key: keyof ReserveTime, value: string) => {
    setReserveTimes(reserveTimes.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  // 같은 시간대 중복 체크
  const isDuplicateTime = () => {
    const set = new Set();
    for (const { date, start, end } of reserveTimes) {
      if (!date || !start || !end) continue;
      const key = `${date}_${start}_${end}`;
      if (set.has(key)) return true;
      set.add(key);
    }
    return false;
  };

  // 배너 이미지 업로드
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  // 소개 이미지 업로드
  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (introImages.length + files.length > 4) return;
    setIntroImages((prev) => [...prev, ...files].slice(0, 4));
    setIntroPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 4));
  };

  // 소개 이미지 삭제
  const handleRemoveIntro = (idx: number) => {
    setIntroImages(introImages.filter((_, i) => i !== idx));
    setIntroPreviews(introPreviews.filter((_, i) => i !== idx));
  };

  // 등록하기
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title ||
      !category ||
      !desc ||
      !price ||
      !address ||
      !banner ||
      reserveTimes.some((rt) => !rt.date || !rt.start || !rt.end) ||
      isDuplicateTime()
    ) {
      alert('필수 항목을 모두 입력해 주세요.\n(중복된 예약 시간대도 확인)');
      return;
    }
    setModalOpen(true);
    // 실제 등록 로직은 필요시 추가
  };

  return (
    <form className='w-375 py-30 flex flex-col px-24' onSubmit={handleSubmit} autoComplete='off'>
      <h2 className='text-18-b mb-24'>내 체험 등록</h2>

      {/* 제목 */}
      <div className='mb-24'>
        <Input
          label='제목'
          labelClassName='text-16-b'
          placeholder='제목을 입력해 주세요'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 카테고리 */}
      <div className='mb-24'>
        <Input
          label='카테고리'
          labelClassName='text-16-b '
          as='select'
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      {/* 설명 */}
      <div className='mb-24'>
        <Input
          label='설명'
          labelClassName='text-16-b'
          as='textarea'
          placeholder='체험에 대한 설명을 입력해 주세요'
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className='min-h-108'
        />
      </div>

      {/* 가격 */}
      <div className='mb-24'>
        <Input
          label='가격'
          labelClassName='text-16-b '
          placeholder='체험 금액을 입력해 주세요'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* 주소 */}
      <div className='mb-30'>
        <Input
          label='주소'
          labelClassName='text-16-b '
          placeholder='주소를 입력해 주세요'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* 예약 가능한 시간대 */}
      <div className='mb-30'>
        <div className='text-16-b mb-18'>예약 가능한 시간대</div>
        <p className='mb-9 text-14-m text-gray-950'>날짜</p>
        {reserveTimes.map((rt, idx) => (
          <div key={idx} className='mb-18'>
            {/* 날짜 인풋 */}
            <Input
              placeholder='yy/mm/dd'
              className='w-full mb-10 rounded-[20px] border border-gray-200 px-24 py-18 bg-white text-20-m text-gray-400'
              type='date'
              value={rt.date}
              onChange={(e) => handleReserveChange(idx, 'date', e.target.value)}
            />

            {/* 시간 인풋 2개 + 버튼 */}
            <div className='flex items-center gap-8'>
              <Input
                placeholder='00:00'
                className='w-full rounded-[20px] border border-gray-200 px-24 py-18 bg-white text-20-m text-gray-400'
                type='time'
                value={rt.start}
                onChange={(e) => handleReserveChange(idx, 'start', e.target.value)}
              />
              <div className='mx-10 w-8 h-2 text-gray-800 flex items-center justify-center text-20-b'>
                -
              </div>
              <Input
                placeholder='00:00'
                className='w-full rounded-[20px] border border-gray-200 px-24 py-18 bg-white text-20-m text-gray-400'
                type='time'
                value={rt.end}
                onChange={(e) => handleReserveChange(idx, 'end', e.target.value)}
              />
              {reserveTimes.length === 1 ? (
                <button
                  type='button'
                  className='ml-8 w-32 h-32 flex items-center justify-center rounded-full bg-brand-blue text-white text-20-b'
                  onClick={handleAddReserveTime}
                >
                  +
                </button>
              ) : (
                <button
                  type='button'
                  className='ml-8 w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 text-20-b'
                  onClick={() => handleRemoveReserveTime(idx)}
                >
                  -
                </button>
              )}
            </div>
            {/* 구분선 */}
            {idx < reserveTimes.length - 1 && <hr className='my-24 border-gray-200' />}
          </div>
        ))}
        {isDuplicateTime() && (
          <div className='text-red-500 text-14-m ml-8'>
            같은 시간대에는 1개의 체험만 생성할 수 있습니다.
          </div>
        )}
      </div>

      {/* 배너 이미지 등록 */}
      <div className='mb-30'>
        <div className='text-16-b mb-10'>배너 이미지 등록</div>
        <div className='flex gap-12'>
          {/* 업로드 버튼(항상 왼쪽, 1개가 되어도 비활성화만) */}
          <label
            className={`relative w-80 h-80 bg-white border border-gray-100 rounded-[8px] flex items-center justify-center cursor-pointer
        ${bannerPreview ? 'pointer-events-none' : ''}`}
          >
            <Image
              src='/icons/icon_gray_eye_off.svg'
              alt='배너 이미지 없음'
              width={40}
              height={40}
            />
            <span className='absolute bottom-8 left-1/2 -translate-x-1/2 text-13-m text-gray-600'>
              {bannerPreview ? '1/1' : '0/1'}
            </span>
            <input
              type='file'
              accept='image/*'
              className='absolute inset-0 opacity-0 cursor-pointer'
              onChange={handleBannerChange}
              disabled={!!banner}
              required
            />
          </label>
          {/* 등록된 배너 이미지 오른쪽에 나열 */}
          {bannerPreview && (
            <div className='relative w-80 h-80 rounded-[8px] border border-gray-100 flex-shrink-0'>
              <Image
                src={bannerPreview}
                alt='배너 이미지 미리보기'
                fill
                className='object-cover rounded-[8px]'
              />
              <button
                type='button'
                className='absolute -top-5 -right-5 z-10'
                onClick={() => {
                  setBanner(null);
                  setBannerPreview(null);
                }}
              >
                <Image src='/icons/icon_white_delete.svg' alt='삭제' width={20} height={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 소개 이미지 등록 */}
      <div className='mb-24'>
        <div className='text-16-b mb-10'>소개 이미지 등록</div>
        <div className='flex gap-12'>
          {/* 업로드 버튼(항상 왼쪽, 4개가 되어도 비활성화만) */}
          <label
            className={`relative min-w-80 min-h-80 bg-white border border-gray-100 rounded-[8px] flex items-center justify-center cursor-pointer
        ${introPreviews.length >= 4 ? 'pointer-events-none' : ''}`}
          >
            <Image
              src='/icons/icon_gray_eye_off.svg'
              alt='소개 이미지 없음'
              width={40}
              height={40}
            />
            <span className='absolute bottom-8 left-1/2 -translate-x-1/2 text-13-m text-gray-600'>
              {introPreviews.length}/4
            </span>
            <input
              type='file'
              accept='image/*'
              multiple
              className='absolute inset-0 opacity-0 cursor-pointer'
              onChange={handleIntroChange}
              disabled={introPreviews.length >= 4}
            />
          </label>
          {/* 등록된 이미지들 오른쪽에 나열 */}
          {introPreviews.map((src, idx) => (
            <div
              key={idx}
              className='relative w-80 h-80 rounded-[8px] border border-gray-100 flex-shrink-0'
            >
              <Image
                src={src}
                alt={`소개 이미지 ${idx + 1}`}
                fill
                className='object-cover rounded-[8px]'
              />
              <button
                type='button'
                className='absolute -top-5 -right-5 z-10'
                onClick={() => {
                  setIntroImages((prev) => prev.filter((_, i) => i !== idx));
                  setIntroPreviews((prev) => prev.filter((_, i) => i !== idx));
                }}
              >
                <Image src='/icons/icon_white_delete.svg' alt='삭제' width={20} height={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 등록하기 버튼 */}
      <div className='flex justify-center'>
        <button className='w-120 py-12 mb-30 bg-brand-blue text-white text-14-b rounded-[12px]'>
          등록하기
        </button>
      </div>
    </form>
  );
}
