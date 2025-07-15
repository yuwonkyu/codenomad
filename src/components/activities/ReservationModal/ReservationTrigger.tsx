import { useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import TabletModal from './TabletModal';
import MobileModal from './MobileModal';
import { Schedule, ReservationComponentProps, ReservationData } from './types';

const ReservationTrigger = ({
  activity,
  scheduleId,
  setScheduleId,
  headCount,
  setHeadCount,
  onReservationConfirm,
}: ReservationComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const breakpoint = useResponsive();

  const price = '\u20A9' + ' ' + String(activity.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const selectedSchedule = activity.schedules.find((s) => s.id === scheduleId);

  const formatScheduleText = (schedule: Schedule) => {
    const [year, month, day] = schedule.date.split('-');
    const shortYear = year.slice(2);
    return `${shortYear}/${month}/${day} ${schedule.startTime} ~ ${schedule.endTime}`;
  };

  const handleOpenModal = () => {
    // 모달을 열 때 상태 초기화
    setScheduleId(null);
    setHeadCount(1);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // 모달이 닫힐 때 상태 초기화
    setScheduleId(null);
    setHeadCount(1);
  };

  const handleReservationConfirm = (data: ReservationData) => {
    console.log('예약 확정:', data);
    onReservationConfirm(data);
  };

  if (breakpoint === null) return null;

  // 태블릿인지 모바일인지 판단 (md 이상은 태블릿으로 간주)
  const isTablet = breakpoint === 'md' || breakpoint === 'lg';

  return (
    <>
      <div className='fixed bottom-0 left-0 right-0 px-20 py-24 justify-center flex flex-col w-auto h-124 border-t-1 border-[#e6e6e6] gap-12 bg-white'>
        <div className='flex justify-between'>
          <p className='text-18-b text-gray-950'>
            {price} <span className='text-16-b text-[#79747e]'>/ 명</span>
          </p>
          <button
            className='text-primary-500 text-16-b decoration-primary-500 decoration-2 underline cursor-pointer'
            onClick={handleOpenModal}
          >
            {selectedSchedule ? formatScheduleText(selectedSchedule) : '날짜 선택하기'}
          </button>
        </div>
        <button className='py-15 rounded-[14px] w-auto h-50 text-white bg-primary-500'>
          예약하기
        </button>
      </div>

      {/* 태블릿용 모달 */}
      {isTablet ? (
        <TabletModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          schedules={activity.schedules}
          scheduleId={scheduleId}
          setScheduleId={setScheduleId}
          headCount={headCount}
          setHeadCount={setHeadCount}
          onReservationConfirm={handleReservationConfirm}
        />
      ) : (
        /* 모바일용 모달 */
        <MobileModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          schedules={activity.schedules}
          scheduleId={scheduleId}
          setScheduleId={setScheduleId}
          headCount={headCount}
          setHeadCount={setHeadCount}
          onReservationConfirm={handleReservationConfirm}
        />
      )}
    </>
  );
};

export default ReservationTrigger;
