import Calendar from '@/components/common/Calendar';
import { Schedule } from '../Activities.types';
import { useMemo } from 'react';
interface CalendarStepProps {
  schedules: Schedule[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const CalendarStep = ({ schedules, selectedDate, onDateSelect }: CalendarStepProps) => {
  // UTC 명시적 지정으로 날짜 밀림 방지
  const stringToDate = (dateStr: string): Date => {
    return new Date(dateStr + 'T12:00:00.000Z'); // UTC 정오로 변환
  };

  // Date → String 변환 (로컬 시간 기준으로 UTC 밀림 방지)
  const dateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const availableDates = useMemo(() => new Set(schedules.map((s) => s.date)), [schedules]);
  console.log(availableDates);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const dateStr = dateToString(date);
      onDateSelect(dateStr);
    }
  };

  return (
    <>
      {/* 기존 캘린더에서 사용할 수 있는 속성이 누락 되어 있어서 누락된 부분 적용 X */}
      <Calendar
        selectedDate={selectedDate ? stringToDate(selectedDate) : null}
        onChange={handleDateChange}
      />
    </>
  );
};

export default CalendarStep;
