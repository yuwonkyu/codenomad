import Calendar from '@/components/common/Calendar';
import { Schedule } from '../Activities.types';
import { useMemo, useCallback, useEffect } from 'react';
import { 
  stringToDate, 
  checkDateDisabled, 
  handleDateSelection,
  getInitialSelectedDate
} from '@/utils/reservation';

interface CalendarStepProps {
  schedules: Schedule[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const CalendarStep = ({ schedules, selectedDate, onDateSelect }: CalendarStepProps) => {
  // 예약 가능한 날짜 Set
  const availableDates = useMemo(() => new Set(schedules.map((s) => s.date)), [schedules]);

  // 오늘 날짜 자동 선택 로직
  useEffect(() => {
    const initialDate = getInitialSelectedDate(availableDates, selectedDate);
    if (initialDate && !selectedDate) {
      onDateSelect(initialDate);
    }
  }, [availableDates, selectedDate, onDateSelect]);

  // 날짜 비활성화 체크 함수
  const isDateDisabled = useCallback(
    (date: Date) => checkDateDisabled(date, availableDates),
    [availableDates],
  );

  // 날짜 선택 핸들러
  const handleDateChange = useCallback(
    (date: Date | null) => handleDateSelection(date, availableDates, onDateSelect),
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
