'use client';

import { useState, useEffect } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ConfirmModal from '@/components/common/ConfirmModal';
import ModalTrigger from './ModalTrigger';
import DesktopCard from './DesktopCard';
import type { ActivityDetail, ReservationState } from '../Activities.types';

interface ReservationContentProps {
  activity: ActivityDetail;
}

const ReservationContent = ({ activity }: ReservationContentProps) => {
  const breakpoint = useResponsive();

  const [isClient, setIsClient] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reservation, setReservation] = useState<ReservationState>({
    scheduleId: null,
    headCount: 1,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || breakpoint === null) return null;

  const resetReservation = () => {
    setReservation({
      scheduleId: null,
      headCount: 1,
    });
  };

  const handleReservationConfirm = (data: ReservationState) => {
    console.log('예약 확정:', data);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
    resetReservation();
    // TODO: 실제 예약 API 호출
  };

  const handleChangeSchedule = (id: number | null) => {
    setReservation((prev) => ({ ...prev, scheduleId: id }));
  };

  const handleChangeHeadCount = (count: number) => {
    const validCount = Math.max(1, count);
    setReservation((prev) => ({ ...prev, headCount: validCount }));
  };

  // 필요한 데이터만 추출
  const activityData = {
    schedules: activity.schedules,
    price: activity.price,
    title: activity.title,
  };

  const reservationControlProps = {
    scheduleId: reservation.scheduleId,
    headCount: reservation.headCount,
    onChangeSchedule: handleChangeSchedule,
    onChangeHeadCount: handleChangeHeadCount,
  };

  return (
    <>
      {breakpoint === 'lg' ? (
        <DesktopCard 
          {...reservationControlProps} 
          activityData={activityData}
          onReservationSubmit={handleReservationConfirm} 
        />
      ) : (
        <ModalTrigger 
          {...reservationControlProps} 
          activityData={activityData}
          onReservationReset={resetReservation} 
        />
      )}

      <ConfirmModal
        message='예약이 완료되었습니다!'
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
      />
    </>
  );
};

export default ReservationContent;
