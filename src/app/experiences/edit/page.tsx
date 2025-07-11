'use client';

import { useState, useRef, useEffect } from 'react';
import TitleInput from '@/components/myExperiencesAddEdit/TitleInput';
import CategoryInput from '@/components/myExperiencesAddEdit/CategoryInput';
import DescriptionInput from '@/components/myExperiencesAddEdit/DescriptionInput';
import PriceInput from '@/components/myExperiencesAddEdit/PriceInput';
import AddressInput from '@/components/myExperiencesAddEdit/AddressInput';
import BannerImageInput from '@/components/myExperiencesAddEdit/BannerImageInput';
import IntroImagesInput from '@/components/myExperiencesAddEdit/IntroImagesInput';
import ReserveTimesInput from '@/components/myExperiencesAddEdit/ReserveTimesInput';
import ConfirmModal from '@/components/common/ConfirmModal';
import CommonModal from '@/components/common/CancelModal';
import { useRouter } from 'next/navigation';

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

// 예약 시간대 타입
interface ReserveTime {
  date: string;
  start: string;
  end: string;
}

const ExperienceEditPage = () => {
  // 입력값 상태 관리
  const [title, setTitle] = useState('mr.Wonkyu와 함께하는 그림교실');
  const [category, setCategory] = useState('culture');
  const [desc, setDesc] = useState(
    '안녕하세요! 저희 프리드로잉 백드롭페인팅 체험을 소개합니다. 저희는 신나는 그림 기법으로 그림을 그리며 그동안 지치고 힘들었던 심신을 회복합니다, 그리고 그림을 그리며 자신을 돌아보는 시간을 가지며 바쁘고 지친 일상에서 벗어나 스스로에게 몰입 할 수 있는 특별한 시간을 만들어 드립니다, 마지막으로 ....',
  );
  const [price, setPrice] = useState('34,900원');
  const [address, setAddress] = useState('연남동244-22, 프리드로잉');
  const [reserveTimes, setReserveTimes] = useState<ReserveTime[]>([
    { date: '', start: '', end: '' },
    { date: '22/11/04', start: '12:00', end: '15:00' },
    { date: '22/11/14', start: '12:00', end: '15:00' },
  ]);
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null); // 초기값 없음
  const [introImages, setIntroImages] = useState<File[]>([]);
  const [introPreviews, setIntroPreviews] = useState<string[]>([]); // 초기값 없음
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const router = useRouter();

  // 1. 최초 입력값 저장 (useRef로 한 번만 저장)
  const initialValues = useRef({
    title,
    category,
    desc,
    price,
    address,
    bannerPreview,
    introPreviews,
    reserveTimes: JSON.stringify(reserveTimes),
  });

  // 2. 변경사항 비교 함수
  const hasChanged = () =>
    title !== initialValues.current.title ||
    category !== initialValues.current.category ||
    desc !== initialValues.current.desc ||
    price !== initialValues.current.price ||
    address !== initialValues.current.address ||
    bannerPreview !== initialValues.current.bannerPreview ||
    JSON.stringify(introPreviews) !== JSON.stringify(initialValues.current.introPreviews) ||
    JSON.stringify(reserveTimes) !== initialValues.current.reserveTimes;

  // 수정하기 버튼 클릭 시
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title ||
      !category ||
      !desc ||
      !price ||
      !address ||
      !bannerPreview ||
      reserveTimes.some((rt) => !rt.date || !rt.start || !rt.end) ||
      isDuplicateTime()
    ) {
      alert('필수 항목을 모두 입력해 주세요.\n(중복된 예약 시간대도 확인)');
      return;
    }
    setModalOpen(true);
  };

  // 3. 뒤로가기 버튼 클릭 시
  const handleBackClick = () => {
    if (hasChanged()) {
      setPendingAction(() => () => router.back());
      setLeaveModalOpen(true); // 변경사항 있으면 경고 모달
    } else {
      router.back(); // 변경사항 없으면 바로 뒤로가기
    }
  };

  // 브라우저 새로고침/닫기/뒤로가기 방지 (변경사항 있을 때만)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanged()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, category, desc, price, address, bannerPreview, introPreviews, reserveTimes]);

  // 네비게이션(예: 페이지 이동) 버튼 클릭 시
  const handleNavigate = (href: string) => {
    if (hasChanged()) {
      setPendingAction(() => () => router.push(href));
      setLeaveModalOpen(true);
    } else {
      router.push(href);
    }
  };

  // 모달에서 "네" 클릭 시 실제 이동
  const handleLeave = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setLeaveModalOpen(false);
  };

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
  // 예약 시간대 중복 체크
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

  return (
    <div className='flex justify-center items-center'>
      <form
        className='w-375 md:w-744 lg:w-700 px-24 md:px-30 lg:px-0 py-30 md:pt-40 md:pb-53 lg:pb-102 flex flex-col'
        onSubmit={handleSubmit}
        autoComplete='off'
      >
        {/* 모바일에서만 뒤로가기 아이콘 */}
        <div className='flex items-center mb-24'>
          <button
            type='button'
            className='mr-8 md:hidden'
            onClick={handleBackClick}
            aria-label='뒤로가기'
          >
            <img src='/icons/icon_back.svg' alt='뒤로가기' width={24} height={24} />
          </button>
          <h2 className='text-18-b'>내 체험 수정</h2>
        </div>
        {/* 제목 */}
        <TitleInput value={title} onChange={setTitle} />
        {/* 카테고리 */}
        <CategoryInput value={category} onChange={setCategory} options={categoryOptions} />
        {/* 설명 */}
        <DescriptionInput value={desc} onChange={setDesc} />
        {/* 가격 */}
        <PriceInput value={price} onChange={setPrice} />
        {/* 주소 */}
        <AddressInput value={address} onChange={setAddress} />
        {/* 예약 가능한 시간대 */}
        <ReserveTimesInput
          reserveTimes={reserveTimes}
          onChange={handleReserveChange}
          onAdd={handleAddReserveTime}
          onRemove={handleRemoveReserveTime}
          isDuplicateTime={isDuplicateTime}
        />
        {/* 배너 이미지 등록 */}
        <BannerImageInput
          bannerPreview={bannerPreview}
          onChange={handleBannerChange}
          onRemove={() => {
            setBanner(null);
            setBannerPreview(null);
          }}
          banner={banner}
        />
        {/* 소개 이미지 등록 */}
        <IntroImagesInput
          introPreviews={introPreviews}
          onChange={handleIntroChange}
          onRemove={handleRemoveIntro}
        />
        {/* 수정 버튼 */}
        <div className='flex justify-center'>
          <button
            type='submit'
            className='w-120 h-41 py-12 bg-primary-500 text-white text-14-b rounded-[12px]'
          >
            수정하기
          </button>
        </div>
      </form>
      {/* 수정 완료 모달 */}
      <ConfirmModal
        message='수정이 완료되었습니다.'
        isOpen={modalOpen}
        onClose={() => router.push('/myExperiences')}
      />
      {/* 나가기 확인 모달 */}
      <CommonModal
        open={leaveModalOpen}
        icon={<img src='/icons/icon_alert.svg' alt='경고' className='w-full h-full' />}
        text={'저장되지 않았습니다.<br />정말 뒤로 가시겠습니까?'}
        cancelText='아니오'
        confirmText='네'
        onCancel={() => setLeaveModalOpen(false)}
        onConfirm={handleLeave}
      />
    </div>
  );
};

export default ExperienceEditPage;
