'use client';
import ConfirmModal from '@/components/common/ConfirmModal';
import { cancelReservation } from '@/lib/api/profile/reservationList';
import { useRouter, useParams } from 'next/navigation';

const ConfirmModalPage = () => {
  const router = useRouter();
  const params = useParams();
  const reservationId = params.reservationId;
  const onDismiss = async () => {
    const res = await cancelReservation(Number(reservationId));
    router.back();
  };
  return (
    <>
      <ConfirmModal isOpen={true} message='예약을 취소하시겠습니까?' onClose={onDismiss} />
    </>
  );
};

export default ConfirmModalPage;
