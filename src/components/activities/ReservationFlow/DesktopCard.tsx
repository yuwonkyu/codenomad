'use client';

import { useState, useEffect } from 'react';
import CalendarStep from './CalendarStep';
import TimeSelectionStep from './TimeSelectionStep';
import PersonStep from './PersonStep';
import { ReservationComponentProps, ReservationData } from './types';

const DesktopCard = ({
  activity,
  scheduleId,
  setScheduleId,
  headCount,
  setHeadCount,
  onReservationConfirm,
}: ReservationComponentProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 선택된 스케줄 ID에 해당하는 날짜 찾기
  useEffect(() => {
    if (scheduleId) {
      const selectedSchedule = activity.schedules.find((s) => s.id === scheduleId);
      if (selectedSchedule) {
        setSelectedDate(selectedSchedule.date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [scheduleId, activity.schedules]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setScheduleId(null); // 날짜 변경 시 선택된 시간 초기화
  };

  const handleTimeSelect = (id: number) => {
    setScheduleId(id);
  };

  const handleReservationConfirm = () => {
    if (scheduleId) {
      onReservationConfirm({ scheduleId, headCount });
    }
  };

  // 가격 포맷팅 함수
  const formatPrice = (amount: number): string => {
    return '₩ ' + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const isConfirmEnabled = scheduleId !== null;
  const price = formatPrice(activity.price);
  const totalAmount = formatPrice(activity.price * headCount);

  return (
    <div className='shadow-custom-5 max-w-410 rounded-3xl bg-white p-30'>
      {/* 헤더 */}

      <p className='text-24-b mb-24 text-gray-950'>
        {price} <span className='text-20-m text-gray-600'>/ 인</span>
      </p>

      {/* 캘린더 섹션 */}
      <div className='mb-24'>
        <h4 className='text-16-b mb-8 text-gray-950'>날짜</h4>
        <CalendarStep
          schedules={activity.schedules}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

      <div className='mb-24'>
        <PersonStep
          variant='desktop'
          headCount={headCount}
          setHeadCount={setHeadCount}
          showConfirmButton={false}
        />
      </div>

      {/* 시간 선택 섹션 */}
      <div className='mb-24 flex flex-col gap-16'>
        <TimeSelectionStep
          selectedDate={selectedDate}
          schedules={activity.schedules}
          scheduleId={scheduleId}
          onTimeSelect={handleTimeSelect}
        />
      </div>
      {/* 하단 예약 확정 버튼 */}
      <div className='flex items-center justify-between border-t-1 border-gray-200 pt-20'>
        <p className='text-16-b text-gray-950'>총 금액 : {totalAmount}</p>
        <button
          className={`text-16-b h-50 w-135 cursor-pointer rounded-[14px] py-15 ${
            isConfirmEnabled
              ? 'bg-primary-500 hover:bg-primary-600 text-white'
              : 'cursor-not-allowed bg-gray-300 text-gray-50'
          }`}
          disabled={!isConfirmEnabled}
          onClick={handleReservationConfirm}
        >
          예약하기
        </button>
      </div>
    </div>
  );
};

export default DesktopCard;
