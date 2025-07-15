'use client';

import { useState, useEffect } from 'react';
import { BaseModalProps } from './types';
import CalendarStep from './CalendarStep';
import TimeSelectionStep from './TimeSelectionStep';
import PersonStep from './PersonStep';

const TabletModal = ({
  isOpen,
  onClose,
  schedules,
  scheduleId,
  setScheduleId,
  headCount,
  setHeadCount,
  onReservationConfirm,
}: BaseModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 선택된 스케줄 ID에 해당하는 날짜 찾기
  useEffect(() => {
    if (scheduleId) {
      const selectedSchedule = schedules.find((s) => s.id === scheduleId);
      if (selectedSchedule) {
        setSelectedDate(selectedSchedule.date);
      }
    } else {
      // scheduleId가 null이면 selectedDate도 초기화
      setSelectedDate(null);
    }
  }, [scheduleId, schedules]);

  // 모달 상태에 따른 초기화
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 내부 상태 초기화
      setSelectedDate(null);
    } else {
      // 모달이 닫힐 때도 내부 상태 초기화
      setSelectedDate(null);
    }
  }, [isOpen]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setScheduleId(null); // 날짜 변경 시 선택된 시간 초기화
  };

  const handleTimeSelect = (id: number) => {
    setScheduleId(id);
  };

  const handleReservationConfirm = () => {
    if (scheduleId) {
      onReservationConfirm?.({ scheduleId, headCount });
      onClose();
    }
  };

  const isConfirmEnabled = scheduleId !== null;

  if (!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0 bg-black/50 z-40' onClick={onClose} />
      <div className='fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-3xl px-30 py-24 max-h-675'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-18-b'>날짜</h3>
        </div>

        {/* 태블릿 2열 레이아웃 */}
        <div className='flex justify-center gap-24 max-h-492'>
          {/* 왼쪽: 캘린더 ※UI 부터 구성 중에 있어 임시로 overflow-hidden 추가 */}
          <div className='w-full overflow-hidden'>
            <CalendarStep
              schedules={schedules}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* 오른쪽: 시간 선택 + 인원 선택 (날짜 선택 후에만 표시) */}
          <div className='w-full h-492 p-24 shadow-custom-5 flex flex-col gap-32 rounded-3xl'>
            <TimeSelectionStep
              selectedDate={selectedDate}
              schedules={schedules}
              scheduleId={scheduleId}
              onTimeSelect={handleTimeSelect}
            />

            {/* 날짜를 선택했을 때만 인원 수 표시 */}
            {selectedDate && (
              <PersonStep
                variant='tablet'
                headCount={headCount}
                setHeadCount={setHeadCount}
                showConfirmButton={false}
              />
            )}
          </div>
        </div>

        {/* 하단 예약 확정 버튼 ※ 추후 hover 색상 추가*/}
        <button
          className={`w-full h-50 text-16-b rounded-[14px] py-15 mt-30 ${
            isConfirmEnabled
              ? 'bg-primary-500 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-50 cursor-not-allowed'
          }`}
          disabled={!isConfirmEnabled}
          onClick={handleReservationConfirm}
        >
          확인
        </button>
      </div>
    </>
  );
};

export default TabletModal;
