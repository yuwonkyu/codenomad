'use client';
import ConfirmModal from '@/components/common/ConfirmModal';
import { cancelReservation } from '@/lib/api/profile/reservationList';
import { useRouter, useParams } from 'next/navigation';

const ConfirmModalPage = () => {
  const router = useRouter();
  const params = useParams();
  const reservationId = params.reservationId;

  if (!reservationId || isNaN(Number(reservationId))) {
    throw new Error('올바르지 않은 예약 ID 입니다.');
  }
  const onDismiss = async () => {
    try {
      const res = await cancelReservation(Number(reservationId));
      router.back();
    } catch (err) {}
  };
  return (
    <>
      <ConfirmModal isOpen={true} message='예약을 취소하시겠습니까?' onClose={onDismiss} />
    </>
  );
};

export default ConfirmModalPage;
