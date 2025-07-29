import Calendar from '@/components/common/Calendar';
import { Schedule } from '../Activities.types';
import { useMemo, useCallback } from 'react';
import { parseISO, startOfDay, isBefore } from 'date-fns';

interface CalendarStepProps {
  schedules: Schedule[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const CalendarStep = ({ schedules, selectedDate, onDateSelect }: CalendarStepProps) => {
  // 날짜 변환 함수
  const stringToDate = (dateStr: string): Date => parseISO(dateStr);

  const dateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 예약 가능한 날짜 Set
  const availableDates = useMemo(() => new Set(schedules.map((s) => s.date)), [schedules]);

  // 선택 가능한 날짜인지 체크
  const isDateDisabled = useCallback(
    (date: Date) => {
      const today = startOfDay(new Date());
      const target = startOfDay(date);
      const isPast = isBefore(target, today);
      const isUnavailable = !availableDates.has(dateToString(target));
      return isPast || isUnavailable;
    },
    [availableDates],
  );

  // 날짜 선택 핸들러
  const handleDateChange = useCallback(
    (date: Date | null) => {
      if (!date) return;
      const dateStr = dateToString(date);
      if (availableDates.has(dateStr)) {
        onDateSelect(dateStr);
      }
    },
    [availableDates, onDateSelect],
  );

  return (
    <Calendar
      selectedDate={selectedDate ? stringToDate(selectedDate) : null}
      onClickDay={handleDateChange}
      isDateDisabled={isDateDisabled}
    />
  );
};

export default CalendarStep;
