'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import { createExperience, uploadImage, CreateExperienceRequest } from '@/lib/api/experiences';

const categoryOptions = [
  { value: '문화 · 예술', label: '문화 · 예술' },
  { value: '식음료', label: '식음료' },
  { value: '스포츠', label: '스포츠' },
  { value: '투어', label: '투어' },
  { value: '관광', label: '관광' },
  { value: '웰빙', label: '웰빙' },
];

interface ReserveTime {
  date: string;
  start: string;
  end: string;
}

const ExperienceAddPage = () => {
  // 입력값 상태
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [reserveTimes, setReserveTimes] = useState<ReserveTime[]>([
    { date: '', start: '', end: '' },
  ]);
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [introImages, setIntroImages] = useState<File[]>([]);
  const [introPreviews, setIntroPreviews] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const router = useRouter();

  // 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    // 토큰 확인
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.warn('로그인 토큰이 없습니다. 로그인이 필요할 수 있습니다.');
      // alert('체험 등록을 위해 로그인이 필요합니다.');
      // router.push('/login');
      // return;
    }

    // API 연결 테스트 제거 (등록이 잘 작동하므로 불필요)
  }, []);

  // 최초 입력값 저장
  const initialValues = useRef({
    title: '',
    category: '',
    desc: '',
    price: '',
    address: '',
    detailAddress: '',
    bannerPreview: null,
    introPreviews: [],
    reserveTimes: JSON.stringify([{ date: '', start: '', end: '' }]),
  });

  // 변경사항 비교
  const hasChanged = () => {
    if (isSubmitting) return false;
    return (
      title !== initialValues.current.title ||
      category !== initialValues.current.category ||
      desc !== initialValues.current.desc ||
      price !== initialValues.current.price ||
      address !== initialValues.current.address ||
      detailAddress !== initialValues.current.detailAddress ||
      bannerPreview !== initialValues.current.bannerPreview ||
      JSON.stringify(introPreviews) !== JSON.stringify(initialValues.current.introPreviews) ||
      JSON.stringify(reserveTimes) !== initialValues.current.reserveTimes
    );
  };

  // 등록하기
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentTime = Date.now();

    // 이미 제출 중이거나 제출 완료된 경우 중복 제출 방지
    if (isSubmitting || isSubmitted) {
      return;
    }

    // 디바운싱: 1초 이내 연속 클릭 방지
    if (currentTime - lastSubmitTime < 1000) {
      return;
    }

    setLastSubmitTime(currentTime);

    // 입력된 예약 시간만 필터링 (빈 값은 제외)
    const validReserveTimes = reserveTimes.filter((rt) => rt.date && rt.start && rt.end);

    if (
      !title ||
      !category ||
      !desc ||
      !price ||
      !address ||
      !banner ||
      validReserveTimes.length === 0 || // 최소 하나의 유효한 예약 시간 필요
      isDuplicateTime()
    ) {
      alert('필수 항목을 모두 입력해 주세요.\n또는 예약 시간이 중복되었습니다.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. 배너 이미지 업로드
      const bannerUpload = await uploadImage(banner);

      // 2. 소개 이미지들 업로드
      const subImageUploads = await Promise.all(introImages.map((image) => uploadImage(image)));

      // 3. 체험 등록 데이터 준비
      const experienceData: CreateExperienceRequest = {
        title,
        category,
        description: desc,
        price: parseInt(price),
        address, // 기본 주소만 전송, 상세주소는 제외
        schedules: validReserveTimes.map((rt) => ({
          date: rt.date,
          startTime: rt.start,
          endTime: rt.end,
        })),
        bannerImageUrl: bannerUpload.activityImageUrl,
        subImageUrls: subImageUploads.map((upload) => upload.activityImageUrl),
      };

      // 4. 체험 등록 API 호출
      await createExperience(experienceData);

      setIsSubmitted(true);
      setModalOpen(true);
    } catch (error) {
      console.error('체험 등록 실패:', error);
      setSubmitError(error instanceof Error ? error.message : '체험 등록에 실패했습니다.');
      alert('체험 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 뒤로가기
  const handleBackClick = () => {
    if (hasChanged()) {
      setPendingAction(() => () => router.back());
      setLeaveModalOpen(true);
    } else {
      router.back();
    }
  };

  // 새로고침/닫기/뒤로가기 경고
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (hasChanged()) {
        e.preventDefault();
        e.returnValue = '';
      }
    },
    [title, category, desc, price, address, bannerPreview, introPreviews, reserveTimes],
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [
    handleBeforeUnload,
    title,
    category,
    desc,
    price,
    address,
    bannerPreview,
    introPreviews,
    reserveTimes,
  ]);

  // 모달 "네" 클릭
  const handleLeave = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setLeaveModalOpen(false);
  };

  // 등록 완료 모달 "확인" 클릭 시
  const handleConfirm = () => {
    setModalOpen(false);
    // beforeunload 이벤트 제거하여 경고창 방지
    window.removeEventListener('beforeunload', handleBeforeUnload);
    router.push('/profile/myExperiences');
  };

  // 예약시간 중복 체크 (빈 값은 제외)
  const isDuplicateTime = () => {
    const validTimes = reserveTimes
      .filter((rt) => rt.date && rt.start && rt.end) // 빈 값 제외
      .map((rt) => `${rt.date}-${rt.start}-${rt.end}`);
    return new Set(validTimes).size !== validTimes.length;
  };

  return (
    <div className='flex items-center justify-center'>
      <form
        className='flex w-375 flex-col px-24 py-30 md:w-744 md:px-30 md:pt-40 md:pb-53 lg:w-700 lg:px-0 lg:pb-102'
        onSubmit={handleSubmit}
        autoComplete='off'
      >
        {/* 뒤로가기 */}
        <div className='mb-24 flex items-center'>
          <button
            type='button'
            className='mr-8 md:hidden'
            onClick={handleBackClick}
            aria-label='뒤로가기'
          >
            <img src='/icons/icon_back.svg' alt='뒤로가기' width={24} height={24} />
          </button>
          <h2 className='text-18-b'>내 체험 등록</h2>
        </div>
        <TitleInput value={title} onChange={setTitle} />
        <CategoryInput
          value={category}
          onChange={(newCategory) => {
            setCategory(newCategory);
          }}
          options={categoryOptions}
        />
        <DescriptionInput value={desc} onChange={setDesc} />
        <PriceInput value={price} onChange={setPrice} />
        <AddressInput
          value={address}
          onChange={setAddress}
          detailAddress={detailAddress}
          onDetailAddressChange={setDetailAddress}
        />
        <ReserveTimesInput
          reserveTimes={reserveTimes}
          onChange={(idx, key, value) =>
            setReserveTimes(
              reserveTimes.map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
            )
          }
          onAdd={() => setReserveTimes([{ date: '', start: '', end: '' }, ...reserveTimes])}
          onRemove={(idx) => setReserveTimes(reserveTimes.filter((_, i) => i !== idx))}
          isDuplicateTime={isDuplicateTime}
        />
        <BannerImageInput
          bannerPreview={bannerPreview}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBanner(file);
            setBannerPreview(URL.createObjectURL(file));
          }}
          onRemove={() => {
            setBanner(null);
            setBannerPreview(null);
          }}
          banner={banner}
        />
        <IntroImagesInput
          introPreviews={introPreviews}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (introImages.length + files.length > 4) return;
            setIntroImages((prev) => [...prev, ...files].slice(0, 4));
            setIntroPreviews((prev) =>
              [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 4),
            );
          }}
          onRemove={(idx) => {
            setIntroImages(introImages.filter((_, i) => i !== idx));
            setIntroPreviews(introPreviews.filter((_, i) => i !== idx));
          }}
        />
        {/* 등록 버튼 */}
        <div className='flex justify-center'>
          <button
            type='submit'
            disabled={isSubmitting || isSubmitted}
            className={`text-14-b h-41 w-120 rounded-[12px] py-12 text-white ${
              isSubmitting || isSubmitted
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-primary-500 hover:bg-primary-600'
            }`}
          >
            {isSubmitted ? '등록 완료' : isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>
      {/* 등록 완료 모달 */}
      <ConfirmModal
        message='체험 등록이 완료되었습니다.'
        isOpen={modalOpen}
        onClose={handleConfirm}
      />
      {/* 나가기 확인 모달 */}
      <CommonModal
        open={leaveModalOpen}
        icon={<img src='/icons/icon_alert.svg' alt='경고' className='h-full w-full' />}
        text={'저장되지 않았습니다.<br />정말 뒤로 가시겠습니까?'}
        cancelText='아니오'
        confirmText='네'
        onCancel={() => setLeaveModalOpen(false)}
        onConfirm={handleLeave}
      />
    </div>
  );
};

export default ExperienceAddPage;
