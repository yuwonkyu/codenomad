import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Schedule } from '../Activities.types';

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

  const availableDates = new Set(schedules.map((s) => s.date));

  const handleDayClick = (value: Date) => {
    const dateStr = dateToString(value);
    if (availableDates.has(dateStr)) {
      onDateSelect(dateStr);
    }
  };

  return (
    <>
      {/* 임시 캘린더 UI 깨질 수 있음 */}
      <Calendar
        value={selectedDate ? stringToDate(selectedDate) : null}
        onClickDay={handleDayClick}
        tileDisabled={({ date }) => !availableDates.has(dateToString(date))}
        tileClassName={({ date }) =>
          dateToString(date) === selectedDate ? 'bg-blue-100 rounded-full' : ''
        }
      />
    </>
  );
};

export default CalendarStep;
