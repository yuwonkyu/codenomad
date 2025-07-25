'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import isEqual from 'lodash/isEqual';
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
import instance from '@/lib/api/axios';
import { uploadImage } from '@/lib/api/experiences';

const categoryOptions = [
  { value: '문화 · 예술', label: '문화 · 예술' },
  { value: '식음료', label: '식음료' },
  { value: '스포츠', label: '스포츠' },
  { value: '투어', label: '투어' },
  { value: '관광', label: '관광' },
  { value: '웰빙', label: '웰빙' },
];

interface ReserveTime {
  id?: number;
  date: string;
  start: string;
  end: string;
}

interface ExperienceData {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages: Array<{
    id: number;
    imageUrl: string;
  }>;
  schedules: Array<{
    id: number;
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

const ExperienceEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id as string;

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 입력값 상태
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
  const [introPreviews, setIntroPreviews] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  // 새로 업로드된 이미지와 미리보기 URL을 매핑하는 Map
  const [imageUrlMap, setImageUrlMap] = useState<Map<string, File>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 수정 여부 상태 관리
  const [isModified, setIsModified] = useState(false);

  // 초기 데이터 저장
  const [initialData, setInitialData] = useState({
    title: '',
    category: '',
    desc: '',
    price: '',
    address: '',
    bannerPreview: '',
    introPreviews: [] as string[],
    reserveTimes: [] as ReserveTime[],
  });

  // 체험 데이터 불러오기
  useEffect(() => {
    const fetchExperienceData = async () => {
      if (!experienceId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await instance.get(`/activities/${experienceId}`);
        const data: ExperienceData = response.data;

        // subImages에서 imageUrl만 추출
        const subImageUrls = data.subImages?.map((img) => img.imageUrl) || [];

        // 상태 업데이트
        setTitle(data.title);
        setCategory(data.category); // API에서 받은 한글 카테고리 직접 사용
        setDesc(data.description);
        setPrice(data.price.toLocaleString() + '원');
        setAddress(data.address);
        setBannerPreview(data.bannerImageUrl);
        setIntroPreviews(subImageUrls);

        // 스케줄 데이터 변환
        const convertedSchedules = data.schedules.map((schedule) => ({
          id: schedule.id,
          date: schedule.date,
          start: schedule.startTime,
          end: schedule.endTime,
        }));

        // 첫 번째 줄은 항상 빈 줄(새로운 시간 추가용), 기존 스케줄들은 두 번째 줄부터
        const reserveTimesWithEmptyFirst =
          convertedSchedules.length > 0
            ? [{ date: '', start: '', end: '' }, ...convertedSchedules]
            : [{ date: '', start: '', end: '' }];

        setReserveTimes(reserveTimesWithEmptyFirst);

        // 초기값 저장 (변경사항 감지용)
        setInitialData({
          title: data.title,
          category: data.category,
          desc: data.description,
          price: data.price.toLocaleString() + '원',
          address: data.address,
          bannerPreview: data.bannerImageUrl,
          introPreviews: subImageUrls,
          reserveTimes: reserveTimesWithEmptyFirst,
        });
      } catch (err: any) {
        console.error('체험 데이터 불러오기 실패:', err);
        setError(
          err.response?.status === 404
            ? '존재하지 않는 체험입니다.'
            : '데이터를 불러오는데 실패했습니다.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExperienceData();
  }, [experienceId]);

  // 변경사항 확인 (깊은 비교)
  useEffect(() => {
    const currentData = {
      title,
      category,
      desc,
      price,
      address,
      bannerPreview,
      introPreviews,
      reserveTimes,
    };

    setIsModified(!isEqual(currentData, initialData));
  }, [
    title,
    category,
    desc,
    price,
    address,
    bannerPreview,
    introPreviews,
    reserveTimes,
    initialData,
  ]);

  // 변경사항 비교 (단순화)
  const hasChanged = () => {
    return isModified && !isSubmitting && !loading;
  };

  // 수정하기
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효한 예약 시간들만 필터링 (첫 번째 항목은 제외 - 새로운 시간 추가용)
    const validReserveTimes = reserveTimes.slice(1).filter((rt) => rt.date && rt.start && rt.end);

    if (
      !title ||
      !category ||
      !desc ||
      !price ||
      !address ||
      !bannerPreview ||
      validReserveTimes.length === 0 || // 최소 하나의 유효한 예약 시간 필요 (첫 번째 제외)
      isDuplicateTime()
    ) {
      alert(
        '필수 항목을 모두 입력해 주세요.\n최소 하나의 예약 시간이 필요하며, 중복된 시간대는 불가능합니다.',
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // 가격에서 숫자만 추출
      const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));

      // 배너 이미지 처리
      let finalBannerUrl = bannerPreview;
      if (banner) {
        // 새로운 배너 이미지가 업로드된 경우
        const bannerUpload = await uploadImage(banner);
        finalBannerUrl = bannerUpload.activityImageUrl;
      }

      // 새로 추가할 소개 이미지 URL들
      const subImageUrlsToAdd: string[] = [];

      for (const preview of introPreviews) {
        if (preview.startsWith('blob:')) {
          // 새로 업로드된 이미지인 경우 서버에 업로드
          const file = imageUrlMap.get(preview);
          if (file) {
            const upload = await uploadImage(file);
            subImageUrlsToAdd.push(upload.activityImageUrl);
          }
        }
      }

      // 제거할 스케줄 ID들과 새로 추가할 스케줄들 계산
      const currentScheduleIds = initialData.reserveTimes.filter((rt) => rt.id).map((rt) => rt.id!);

      const newScheduleIds = reserveTimes.filter((rt) => rt.id).map((rt) => rt.id!);

      const scheduleIdsToRemove = currentScheduleIds.filter((id) => !newScheduleIds.includes(id));

      const schedulesToAdd = reserveTimes
        .filter((rt) => rt.date && rt.start && rt.end && !rt.id) // ID가 없는 새로운 스케줄들
        .map((rt) => ({
          date: rt.date,
          startTime: rt.start,
          endTime: rt.end,
        }));

      // API 스펙에 맞는 데이터 구조
      const updateData = {
        title,
        category,
        description: desc,
        price: numericPrice,
        address,
        bannerImageUrl: finalBannerUrl,
        subImageIdsToRemove: [], // 현재는 제거 기능이 없으므로 빈 배열
        subImageUrlsToAdd,
        scheduleIdsToRemove,
        schedulesToAdd,
      };

      // PATCH 메서드로 요청 (baseURL에 이미 팀ID 포함됨)
      await instance.patch(`/my-activities/${experienceId}`, updateData);
      setModalOpen(true);
    } catch (error: any) {
      console.error('체험 수정 실패:', error);
      alert(error.response?.data?.message || '수정에 실패했습니다. 다시 시도해 주세요.');
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
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanged()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isModified, isSubmitting, loading]);

  // 모달 "네" 클릭
  const handleLeave = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setLeaveModalOpen(false);
  };

  // 예약시간 중복 체크 (첫 번째 항목 제외 - 새로운 시간 추가용)
  const isDuplicateTime = () => {
    const validTimes = reserveTimes
      .slice(1) // 첫 번째 항목 제외
      .filter((rt) => rt.date && rt.start && rt.end) // 빈 값 제외
      .map((rt) => `${rt.date}-${rt.start}-${rt.end}`);
    return new Set(validTimes).size !== validTimes.length;
  };

  // 이미지 핸들러
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (introPreviews.length + files.length > 4) return;

    // 새 파일들의 미리보기 URL 생성
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    // URL과 파일을 매핑
    const newMap = new Map(imageUrlMap);
    files.forEach((file, index) => {
      newMap.set(newPreviews[index], file);
    });
    setImageUrlMap(newMap);

    // 미리보기에 추가
    setIntroPreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
  };

  const handleRemoveIntro = (idx: number) => {
    const removedUrl = introPreviews[idx];

    // blob URL인 경우 메모리 해제 및 매핑에서 제거
    if (removedUrl && removedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(removedUrl);
      const newMap = new Map(imageUrlMap);
      newMap.delete(removedUrl);
      setImageUrlMap(newMap);
    }

    // 미리보기에서 제거
    setIntroPreviews(introPreviews.filter((_, i) => i !== idx));
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-16-m text-gray-500'>체험 정보를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className='flex h-screen flex-col items-center justify-center'>
        <div className='text-16-m mb-4 text-red-500'>{error}</div>
        <button
          onClick={() => router.back()}
          className='bg-primary-500 rounded-lg px-6 py-2 text-white'
        >
          돌아가기
        </button>
      </div>
    );
  }

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
          <h2 className='text-18-b'>내 체험 수정</h2>
        </div>

        <TitleInput value={title} onChange={setTitle} />
        <CategoryInput value={category} onChange={setCategory} options={categoryOptions} />
        <DescriptionInput value={desc} onChange={setDesc} />
        <PriceInput value={price} onChange={setPrice} />
        <AddressInput value={address} onChange={setAddress} />
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
          isEdit={true}
        />
        <BannerImageInput
          bannerPreview={bannerPreview}
          onChange={handleBannerChange}
          onRemove={() => {
            setBanner(null);
            setBannerPreview(null);
          }}
          banner={banner}
          isEdit={true}
        />
        <IntroImagesInput
          introPreviews={introPreviews}
          onChange={handleIntroChange}
          onRemove={handleRemoveIntro}
        />

        {/* 수정 버튼 */}
        <div className='flex justify-center'>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`text-14-b h-41 w-120 rounded-[12px] py-12 text-white ${
              isSubmitting ? 'cursor-not-allowed bg-gray-400' : 'bg-primary-500'
            }`}
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </button>
        </div>
      </form>

      {/* 수정 완료 모달 */}
      <ConfirmModal
        message='수정이 완료되었습니다.'
        isOpen={modalOpen}
        onClose={() => {
          setIsSubmitting(false);
          router.push('/profile/myExperiences');
        }}
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

export default ExperienceEditPage;
