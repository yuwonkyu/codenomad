'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BaseModalProps } from '../Activities.types';
import CalendarStep from './CalendarStep';
import TimeSelectionStep from './TimeSelectionStep';
import PersonStep from './PersonStep';
import { getDateFromScheduleId } from '@/utils/reservation';
import clsx from 'clsx';

type ModalStep = 'calendar' | 'person';

const MobileModal = ({
  isOpen,
  onClose,
  onConfirm,
  schedules,
  scheduleId,
  onChangeSchedule,
  headCount,
  onChangeHeadCount,
}: BaseModalProps) => {
  const [step, setStep] = useState<ModalStep>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // ✅ scheduleId로부터 날짜 계산
  useEffect(() => {
    const date = getDateFromScheduleId(schedules, scheduleId);
    setSelectedDate(date);
  }, [scheduleId, schedules]);

  // ✅ 열릴 때 스텝만 초기화
  useEffect(() => {
    if (isOpen) {
      setStep('calendar');
    }
  }, [isOpen]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    onChangeSchedule(null); // 날짜 변경 시 시간 초기화
  };

  const handleTimeSelect = (id: number) => {
    onChangeSchedule(id);
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
      onConfirm();
    }
  };

  const isConfirmEnabled = scheduleId !== null;

  if (!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0 z-40 bg-black/50' onClick={onClose} />
      {/* 캘린더 부분 추가 시 아래 스타일 수정 예정 */}
      <div className='fixed bottom-0 left-0 z-50 h-auto w-full rounded-t-3xl bg-white p-24'>
        <div className='mb-30'>
          {step === 'calendar' ? (
            <h3 className='text-18-b'>날짜</h3>
          ) : (
            <div className='flex items-center gap-8'>
              <button
                onClick={handleBackStep}
                className='relative size-24 cursor-pointer text-gray-500'
              >
                <Image src={'/icons/icon_back.svg'} alt='뒤로 가기' fill />
              </button>
              <h3 className='text-18-b'>인원</h3>
            </div>
          )}
          {step !== 'calendar' && (
            <p className='text-16-m mt-8 text-[#4b4b4b]'>예약할 인원을 선택해주세요.</p>
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
              className={clsx(
                'text-16-b mt-30 h-50 w-full rounded-[0.875rem] py-15',
                isConfirmEnabled
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'cursor-not-allowed bg-gray-300 text-gray-50',
              )}
              disabled={!isConfirmEnabled}
              onClick={handleNextStep}
            >
              확인
            </button>
          </div>
        ) : (
          <PersonStep
            headCount={headCount}
            onChangeHeadCount={onChangeHeadCount}
            onConfirm={handleReservationConfirm}
            showConfirmButton={true}
          />
        )}
      </div>
    </>
  );
};

export default MobileModal;
