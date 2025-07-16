'use client';
import { useState, useEffect } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ConfirmModal from '@/components/common/ConfirmModal';
import ModalTrigger from './ModalTrigger';
import DesktopCard from './DesktopCard';

// 임시 활동 데이터 (나중에 props로 받도록 수정 예정)
const activity = {
  id: 7,
  title: '함께 배우면 즐거운 스트릿댄스',
  price: 1231230,
  schedules: [
    {
      id: 1,
      date: '2025-07-20',
      startTime: '12:00',
      endTime: '13:00',
    },
    {
      id: 2,
      date: '2025-07-20',
      startTime: '16:00',
      endTime: '17:00',
    },
    {
      id: 3,
      date: '2025-07-30',
      startTime: '14:00',
      endTime: '15:00',
    },
    {
      id: 4,
      date: '2025-07-25',
      startTime: '10:00',
      endTime: '11:00',
    },
  ],
  rating: 4.74,
  reviewCount: 5,
};

const ReservationContent = () => {
  const breakpoint = useResponsive();

  // 공통 상태 관리
  const [scheduleId, setScheduleId] = useState<number | null>(null);
  const [headCount, setHeadCount] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // or return fallback
  if (breakpoint === null) return null;

  // 공통 상태 초기화 함수
  const resetReservationState = () => {
    setHeadCount(1);
    setScheduleId(null);
  };

  const handleReservationConfirm = (data: { scheduleId: number; headCount: number }) => {
    console.log('예약 확정:', data);
    // ConfirmModal 띄우기
    setIsConfirmModalOpen(true);
  };

  const handleConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
    resetReservationState();
    // 여기서 실제 예약 API 호출 가능
  };

  // 데스크톱: lg 이상
  // 태블릿/모바일: lg 미만 (ModalTrigger에서 자체적으로 태블릿/모바일 구분)
  if (breakpoint === 'lg') {
    return (
      <>
        <DesktopCard
          activity={activity}
          scheduleId={scheduleId}
          setScheduleId={setScheduleId}
          headCount={headCount}
          setHeadCount={setHeadCount}
          onReservationConfirm={handleReservationConfirm}
        />
        <ConfirmModal
          message="예약이 완료되었습니다!"
          isOpen={isConfirmModalOpen}
          onClose={handleConfirmModalClose}
        />
      </>
    );
  }

  return (
    <ModalTrigger
      activity={activity}
      scheduleId={scheduleId}
      setScheduleId={setScheduleId}
      headCount={headCount}
      setHeadCount={setHeadCount}
      onReservationComplete={resetReservationState}
    />
  );
};

export default ReservationContent;
