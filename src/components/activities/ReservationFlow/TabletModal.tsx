'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BaseModalProps } from '../Activities.types';
import CalendarStep from './CalendarStep';
import TimeSelectionStep from './TimeSelectionStep';
import PersonStep from './PersonStep';

type ModalStep = 'calendar' | 'person';

const TabletModal = ({
  isOpen,
  onClose,
  onConfirm,
  schedules,
  scheduleId,
  onChangeSchedule,
  headCount,
  onChangeHeadCount,
}: BaseModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (scheduleId) {
      const selectedSchedule = schedules.find((s) => s.id === scheduleId);
      if (selectedSchedule) {
        setSelectedDate(selectedSchedule.date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [scheduleId, schedules]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
    }
  }, [isOpen]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    onChangeSchedule(null);
  };

  const handleTimeSelect = (id: number) => {
    onChangeSchedule(id);
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
      <div className='fixed bottom-0 left-0 z-50 max-h-675 w-full rounded-t-3xl bg-white px-30 py-24'>
        <div className='mb-6 flex items-center justify-between'>
          <h3 className='text-18-b'>날짜</h3>
        </div>
        <div className='flex max-h-492 justify-center gap-24'>
          <div className='w-full overflow-hidden'>
            <CalendarStep
              schedules={schedules}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
          <div className='shadow-custom-5 flex h-492 w-full flex-col gap-32 rounded-3xl p-24'>
            <TimeSelectionStep
              selectedDate={selectedDate}
              schedules={schedules}
              scheduleId={scheduleId}
              onTimeSelect={handleTimeSelect}
            />
            {selectedDate && (
              <PersonStep
                variant='tablet'
                headCount={headCount}
                onChangeHeadCount={onChangeHeadCount}
                showConfirmButton={false}
              />
            )}
          </div>
        </div>
        <button
          className={`text-16-b mt-30 h-50 w-full rounded-[14px] py-15 ${
            isConfirmEnabled
              ? 'bg-primary-500 cursor-pointer text-white'
              : 'cursor-not-allowed bg-gray-300 text-gray-50'
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
