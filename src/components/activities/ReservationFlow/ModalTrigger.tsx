import { useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import ConfirmModal from '@/components/common/ConfirmModal';
import TabletModal from './TabletModal';
import MobileModal from './MobileModal';
import { Schedule, ModalTriggerProps } from './types';

const ModalTrigger = ({
  activity,
  scheduleId,
  setScheduleId,
  headCount,
  setHeadCount,
  onReservationComplete,
}: ModalTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const breakpoint = useResponsive();

  const price = '\u20A9' + ' ' + String(activity.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const selectedSchedule = activity.schedules.find((s) => s.id === scheduleId);

  const formatScheduleText = (schedule: Schedule) => {
    const [year, month, day] = schedule.date.split('-');
    const shortYear = year.slice(2);
    return `${shortYear}/${month}/${day} ${schedule.startTime} ~ ${schedule.endTime}`;
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // 모달을 중간에 닫을 때 상태 초기화
    onReservationComplete?.();
  };

  const handleModalConfirm = () => {
    // 확인 버튼으로 모달 닫을 때는 상태 유지
    setIsOpen(false);
  };

  const handleTriggerReservation = () => {
    if (selectedSchedule) {
      console.log('ModalTrigger 예약 확정:', {
        scheduleId: selectedSchedule.id,
        headCount: headCount,
      });
      // ConfirmModal 띄우기
      setIsConfirmModalOpen(true);
    } else {
      handleOpenModal();
    }
  };

  const handleConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
    onReservationComplete?.(); // 상태 초기화
    // 실제 예약 처리 (나중에 API 호출로 대체)
    if (selectedSchedule) {
      console.log('예약 완료:', {
        scheduleId: selectedSchedule.id,
        headCount: headCount,
      });
      // TODO: 실제 예약 API 호출
    }
  };

  if (breakpoint === null) return null;

  // 태블릿인지 모바일인지 판단 (md 이상은 태블릿으로 간주)
  const isTablet = breakpoint === 'md' || breakpoint === 'lg';

  return (
    <>
      <div className='fixed right-0 bottom-0 left-0 flex h-124 w-auto flex-col justify-center gap-12 border-t-1 border-[#e6e6e6] bg-white px-20 py-24'>
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
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleTriggerReservation}
          disabled={!selectedSchedule}
        >
          예약하기
        </button>
      </div>

      {/* 태블릿용 모달 */}
      {isTablet ? (
        <TabletModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          onConfirm={handleModalConfirm}
          schedules={activity.schedules}
          scheduleId={scheduleId}
          setScheduleId={setScheduleId}
          headCount={headCount}
          setHeadCount={setHeadCount}
        />
      ) : (
        /* 모바일용 모달 */
        <MobileModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          onConfirm={handleModalConfirm}
          schedules={activity.schedules}
          scheduleId={scheduleId}
          setScheduleId={setScheduleId}
          headCount={headCount}
          setHeadCount={setHeadCount}
        />
      )}

      {/* ConfirmModal */}
      <ConfirmModal
        message="예약이 완료되었습니다!"
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
      />
    </>
  );
};

export default ModalTrigger;
