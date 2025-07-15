'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BaseModalProps } from './types';

type ModalStep = 'calendar' | 'person';
import CalendarStep from './CalendarStep';
import TimeSelectionStep from './TimeSelectionStep';
import PersonStep from './PersonStep';

const MobileModal = ({
  isOpen,
  onClose,
  schedules,
  scheduleId,
  setScheduleId,
  headCount,
  setHeadCount,
  onReservationConfirm,
}: BaseModalProps) => {
  const [step, setStep] = useState<ModalStep>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 선택된 스케줄 ID에 해당하는 날짜 찾기 (scheduleId가 있을 때만)
  useEffect(() => {
    if (scheduleId) {
      const selectedSchedule = schedules.find((s) => s.id === scheduleId);
      if (selectedSchedule) {
        setSelectedDate(selectedSchedule.date);
      }
    }
    // scheduleId가 null이어도 selectedDate는 유지 (날짜 변경 시 시간만 초기화)
  }, [scheduleId, schedules]);

  // 모달 상태에 따른 초기화
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 내부 상태 초기화
      setStep('calendar');
      setSelectedDate(null);
    } else {
      // 모달이 닫힐 때도 내부 상태 초기화 (혹시 모를 상황 대비)
      setStep('calendar');
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

  const handleNextStep = () => {
    if (scheduleId) {
      setStep('person');
    }
  };

  const handleBackStep = () => {
    setStep('calendar');
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
      {/* 캘린더 부분 추가 시 아래 스타일 수정 예정 */}
      <div className='fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-3xl p-24 max-h-699 overflow-y-auto'>
        <div className='mb-30'>
          {step === 'calendar' ? (
            <h3 className='text-18-b'>날짜</h3>
          ) : (
            <div className='flex items-center gap-8'>
              <button
                onClick={handleBackStep}
                className='relative size-24 text-gray-500 cursor-pointer'
              >
                <Image src={'/icons/icon_back.svg'} alt='뒤로 가기' fill />
              </button>
              <h3 className='text-18-b'>인원</h3>
            </div>
          )}
          {step !== 'calendar' && (
            <p className='mt-8 text-16-m text-[#4b4b4b]'>예약할 인원을 선택해주세요.</p>
          )}
        </div>

        {step === 'calendar' ? (
          <div className='flex flex-col gap-24'>
            <CalendarStep
              schedules={schedules}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />

            <TimeSelectionStep
              selectedDate={selectedDate}
              schedules={schedules}
              scheduleId={scheduleId}
              onTimeSelect={handleTimeSelect}
            />

            <button
              className={`w-full h-50 text-16-b rounded-[14px] py-15 mt-30 ${
                isConfirmEnabled
                  ? 'bg-primary-500 text-white hover:bg-primary-600 cursor-pointer'
                  : 'bg-gray-300 text-gray-50 cursor-not-allowed'
              }`}
              disabled={!isConfirmEnabled}
              onClick={handleNextStep}
            >
              확인
            </button>
          </div>
        ) : (
          <PersonStep
            headCount={headCount}
            setHeadCount={setHeadCount}
            onConfirm={handleReservationConfirm}
            showConfirmButton={true}
          />
        )}
      </div>
    </>
  );
};

export default MobileModal;
