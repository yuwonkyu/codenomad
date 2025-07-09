'use client';

import { useState } from 'react';
import TitleInput from '@/components/myExperiencesAdd/TitleInput';
import CategoryInput from '@/components/myExperiencesAdd/CategoryInput';
import DescriptionInput from '@/components/myExperiencesAdd/DescriptionInput';
import PriceInput from '@/components/myExperiencesAdd/PriceInput';
import AddressInput from '@/components/myExperiencesAdd/AddressInput';
import BannerImageInput from '@/components/myExperiencesAdd/BannerImageInput';
import IntroImagesInput from '@/components/myExperiencesAdd/IntroImagesInput';
import ReserveTimesInput from '@/components/myExperiencesAdd/ReserveTimesInput';

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
    <div className='flex justify-center items-center h-full'>
      <form className='w-375 py-30 flex flex-col px-24' onSubmit={handleSubmit} autoComplete='off'>
        <h2 className='text-18-b mb-24'>내 체험 등록</h2>

        <TitleInput value={title} onChange={(e) => setTitle(e.target.value)} />

        <CategoryInput
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
        />

        <DescriptionInput value={desc} onChange={(e) => setDesc(e.target.value)} />

        <PriceInput value={price} onChange={(e) => setPrice(e.target.value)} />

        <AddressInput value={address} onChange={(e) => setAddress(e.target.value)} />

        <ReserveTimesInput
          reserveTimes={reserveTimes}
          onChange={handleReserveChange}
          onAdd={handleAddReserveTime}
          onRemove={handleRemoveReserveTime}
          isDuplicateTime={isDuplicateTime}
        />

        <BannerImageInput
          bannerPreview={bannerPreview}
          onChange={handleBannerChange}
          onRemove={() => {
            setBanner(null);
            setBannerPreview(null);
          }}
          banner={banner}
        />

        <IntroImagesInput
          introPreviews={introPreviews}
          onChange={handleIntroChange}
          onRemove={handleRemoveIntro}
        />

        <div className='flex justify-center'>
          <button className='w-120 py-12 mb-30 bg-brand-blue text-white text-14-b rounded-[12px]'>
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}
