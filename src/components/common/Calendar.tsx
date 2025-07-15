import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type CalendarType = 'default' | 'badge';

interface Badge {
  label: string;
  color: string;
  count?: number;
}
interface CalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  type?: CalendarType;
  badges?: { [date: string]: Badge[] };
  dots?: string[];
  className?: string;
  onClickDay?: (date: Date, event?: React.MouseEvent) => void;
}

const CalendarModal = ({
  value,
  onChange,
  type = 'default',
  badges = {},
  dots = [],
  className = '',
  onClickDay,
}: CalendarProps) => (
  <Calendar
    value={value ?? new Date()}
    onChange={(date) => onChange(date as Date)}
    className={`w-full text-center border-none ${className}`}
    navigationLabel={({ date }) => (
      <div className='flex items-center justify-center'>
        <span className='calendar-title text-xl font-bold'>
          {date.getFullYear()}년 {date.getMonth() + 1}월
        </span>
      </div>
    )}
    prevLabel={null}
    nextLabel={null}
    prev2Label={null}
    next2Label={null}
    formatShortWeekday={(locale, date) =>
      type === 'badge'
        ? ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
        : ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]
    }
    tileContent={({ date, view }) => {
      if (view !== 'month') return null;
      const dateStr = date.toISOString().slice(0, 10);
      const badgeList = type === 'badge' ? badges[dateStr] ?? [] : [];
      const showDot = dots.includes(dateStr);

      return (
        <div
          className='
            relative flex flex-col items-center justify-start
            w-[53.57px] h-[104px] px-[4px] pt-2 pb-2
            md:w-[91.43px] md:h-[124px] md:px-[12px] md:pt-[10px] md:pb-[10px]
          '
        >
          <span className='text-neutral-600 text-xs font-medium font-pretendard'>
            {date.getDate()}
          </span>
          {badgeList.length > 0 && (
            <div className='flex flex-col gap-1 w-full items-center mt-1'>
              {badgeList.map((badge, i) => (
                <span
                  key={i}
                  className={`w-full min-w-[36px] px-2 py-0.5 rounded inline-flex justify-center items-center gap-1 ${badge.color}`}
                >
                  <span className='text-[10px] font-medium font-pretendard'>{badge.label}</span>
                  {badge.count !== undefined && (
                    <span className='text-[10px] font-medium font-pretendard'>{badge.count}</span>
                  )}
                </span>
              ))}
            </div>
          )}
          {showDot && (
            <span className='w-1 h-1 bg-red-600 rounded-full absolute top-[9px] left-1/2 -translate-x-1/2' />
          )}
        </div>
      );
    }}
    tileClassName={() => 'bg-white'}
    onClickDay={onClickDay}
  />
);

export default CalendarModal;
