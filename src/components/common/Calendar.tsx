import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Image from 'next/image';
import React, { useState } from 'react';
import ReservationModal from '@/components/profile/ReservationModal';
import { format } from 'date-fns';

type CalendarType = 'default' | 'badge';

interface Badge {
  label: string;
  color: string;
  count?: number;
  nickname: string;
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
}: CalendarProps) => {
  const currentDate = value || new Date();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    onChange(prevMonth);
  };
  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    onChange(nextMonth);
  };

  const weekDays = [
    { label: 'S', key: 'sun' },
    { label: 'M', key: 'mon' },
    { label: 'T', key: 'tue' },
    { label: 'W', key: 'wed' },
    { label: 'T', key: 'thu' },
    { label: 'F', key: 'fri' },
    { label: 'S', key: 'sat' },
  ];

  return (
    <div className="calendar-container items-center">
      {/* 네비게이션 */}
      <div className="calendar-nav">
        <button className="calendar-nav-btn" onClick={handlePrevMonth}>
          <Image src="/icons/icon_alt arrow_left.svg" alt="이전 달" width={24} height={24} />
        </button>
        <span className="calendar-title">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </span>
        <button className="calendar-nav-btn" onClick={handleNextMonth}>
          <Image src="/icons/icon_alt arrow_right.svg" alt="다음 달" width={24} height={24} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="calendar-weekdays">
        {weekDays.map((d, i) => (
          <div key={d.key} className={`calendar-weekday ${i === 0 ? 'calendar-sunday' : i === 6 ? 'calendar-saturday' : ''}`}>{d.label}</div>
        ))}
      </div>

      {/* 캘린더 본문 */}
      <Calendar
        value={currentDate}
        onChange={(value: any) => {
          if (value instanceof Date) {
            onChange(value);
          } else if (Array.isArray(value) && value[0] instanceof Date) {
            onChange(value[0]);
          }
        }}
        className={`react-calendar--${type} calendar-grid`}
        prevLabel={null}
        nextLabel={null}
        prev2Label={null}
        next2Label={null}
        showNavigation={false}
        formatShortWeekday={() => ''}
        formatDay={(_locale: string | undefined, date: Date) =>
          type === 'badge' ? '' : date.getDate().toString()
        }
        tileContent={({ date, view }: { date: Date; view: string }) => {
          if (view !== 'month') return null;
          const dateStr = format(date, 'yyyy-MM-dd');
          const badgeList = type === 'badge' ? badges[dateStr] ?? [] : [];
          const showDot = dots.includes(dateStr);
          const hasBadge = badgeList.length > 0;
          return (
            <div
              className="calendar-cell relative"
              style={{ cursor: hasBadge ? 'pointer' : 'default', opacity: hasBadge ? 1 : 0.6 }}
            >
              {showDot && (
                <div className="calendar-dot absolute top-4 left-[80%] -translate-x-[50%]" />
              )}
              <div className="calendar-date-num">{date.getDate()}</div>
              {hasBadge && (
                <div className="calendar-badges">
                  {badgeList.map((badge, i) => (
                    <div key={i} className={`calendar-badge ${badge.color}`}>
                      {badge.label} {badge.count}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
        tileClassName={() => ''}
        onClickDay={(date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const badgeList = type === 'badge' ? badges[dateStr] ?? [] : [];
          if (badgeList.length > 0) {
            setModalOpen(true);
            setModalDate(dateStr);
          }
          if (onClickDay) onClickDay(date);
        }}
      />

      {/* 예약 내역 모달 컴포넌트 연동 */}
      {modalOpen && modalDate && (
        <ReservationModal
          date={modalDate}
          badges={badges[modalDate] ?? []}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CalendarModal;
