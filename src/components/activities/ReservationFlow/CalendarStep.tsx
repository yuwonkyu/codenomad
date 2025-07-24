import Calendar from '@/components/common/Calendar';
import { Schedule } from '../Activities.types';
import { useMemo } from 'react';

interface CalendarStepProps {
  schedules: Schedule[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const CalendarStep = ({ schedules, selectedDate, onDateSelect }: CalendarStepProps) => {
  // 날짜 변환 함수
  const stringToDate = (dateStr: string): Date => new Date(dateStr + 'T12:00:00.000Z');

  const dateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 예약 가능한 날짜 Set
  const availableDates = useMemo(() => new Set(schedules.map((s) => s.date)), [schedules]);

  // 날짜 변경(예약 가능 날짜만 허용)
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const dateStr = dateToString(date);
      if (availableDates.has(dateStr)) {
        onDateSelect(dateStr);
      }
    }
  };

  return (
    <Calendar
      selectedDate={selectedDate ? stringToDate(selectedDate) : null}
      onClickDay={handleDateChange}
      isDateDisabled={(date) => !availableDates.has(dateToString(date))}
    />
  );
};

export default CalendarStep;
