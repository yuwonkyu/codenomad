import { useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ConfirmModal from '@/components/common/ConfirmModal';
import TabletModal from './TabletModal';
import MobileModal from './MobileModal';
import type { Schedule, ReservationControlProps, ActivityDetail } from '@/components/activities/Activities.types';
import { createPortal } from 'react-dom';
import { parse, format } from 'date-fns';

interface ModalTriggerProps extends ReservationControlProps {
  activity: ActivityDetail;
  onReservationReset?: () => void;
}

const ModalTrigger = ({
  activity,
  scheduleId,
  onChangeSchedule,
  headCount,
  onChangeHeadCount,
  onReservationReset,
}: ModalTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const breakpoint = useResponsive();

  const price = '\u20A9' + ' ' + String(activity.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const selectedSchedule = activity.schedules.find((s) => s.id === scheduleId);

  // date-fns로 날짜 포맷팅
  const formatScheduleText = (schedule: Schedule) => {
    const dateObj = parse(schedule.date, 'yyyy-MM-dd', new Date());
    return `${format(dateObj, 'yy/MM/dd')} ${schedule.startTime} ~ ${schedule.endTime}`;
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // 모달 중간에 닫을 때 예약 상태 초기화
    onReservationReset?.();
  };

  const handleModalConfirm = () => {
    // 모달 내 확인 버튼: 상태는 유지
    setIsOpen(false);
  };

  const handleTriggerReservation = () => {
    if (selectedSchedule) {
      console.log('ModalTrigger 예약 확정:', {
        scheduleId: selectedSchedule.id,
        headCount: headCount,
      });
      setIsConfirmModalOpen(true);
    } else {
      handleOpenModal();
    }
  };

  const handleConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
    onReservationReset?.(); // 상태 초기화
    if (selectedSchedule) {
      console.log('예약 완료:', {
        scheduleId: selectedSchedule.id,
        headCount: headCount,
      });
      // TODO: 실제 예약 API 호출
    }
  };

  if (breakpoint === null) return null;

  const isTablet = breakpoint === 'md' || breakpoint === 'lg';

  return createPortal(
    <>
      <div className='sticky right-0 bottom-0 left-0 z-10 flex h-124 w-auto flex-col justify-center gap-12 border-t-1 border-[#e6e6e6] bg-white px-20 py-24'>
        <div className='flex justify-between'>
          <p className='text-18-b text-gray-950'>
            {price} <span className='text-16-b text-[#79747e]'>/ 명</span>
          </p>
          <button
            className='text-primary-500 text-16-b decoration-primary-500 cursor-pointer underline decoration-2'
            onClick={handleOpenModal}
          >
            {selectedSchedule ? formatScheduleText(selectedSchedule) : '날짜 선택하기'}
          </button>
        </div>
        <button
          className={`h-50 w-auto rounded-[14px] py-15 text-white transition-colors ${
            selectedSchedule
              ? 'bg-primary-500 hover:bg-primary-600 cursor-pointer'
              : 'cursor-not-allowed bg-gray-300'
          }`}
          onClick={handleTriggerReservation}
          disabled={!selectedSchedule}
        >
          예약하기
        </button>
      </div>

      {isTablet ? (
        <TabletModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          onConfirm={handleModalConfirm}
          schedules={activity.schedules}
          scheduleId={scheduleId}
          onChangeSchedule={onChangeSchedule}
          headCount={headCount}
          onChangeHeadCount={onChangeHeadCount}
        />
      ) : (
        <MobileModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          onConfirm={handleModalConfirm}
          schedules={activity.schedules}
          scheduleId={scheduleId}
          onChangeSchedule={onChangeSchedule}
          headCount={headCount}
          onChangeHeadCount={onChangeHeadCount}
        />
      )}

      <ConfirmModal
        message='예약이 완료되었습니다!'
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
      />
    </>,
    document.body,
  );
};

export default ModalTrigger;
