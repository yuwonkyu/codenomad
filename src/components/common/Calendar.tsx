'use client';
import { useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
// 기본 스타일 제거 - 커스텀 스타일만 사용
// import 'react-calendar/dist/Calendar.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

// 클래스 병합 유틸리티
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

// 캘린더 타입 정의
type CalendarValue = Date | null;

export interface CalendarProps {
  selectedDate?: Date | null;
  onChange?: (date: Date | null) => void;
  className?: string;
}

const CalendarComponent = ({ selectedDate, onChange, className }: CalendarProps) => {
  const calendarRef = useRef<HTMLDivElement>(null);

  // 완전 커스텀 스타일링 적용
  useEffect(() => {
    if (!calendarRef.current) return;

    const calendarElement = calendarRef.current;

    // 모든 react-calendar 요소에 대한 커스텀 스타일 적용
    const style = document.createElement('style');
    style.textContent = `
      /* 캘린더 컨테이너 기본 스타일 리셋 */
      .react-calendar {
        background: white !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        font-family: inherit !important;
        line-height: 1.125em !important;
        width: 410px !important;
      }
      
      /* 네비게이션 스타일 */
      .react-calendar__navigation {
        display: flex !important;
        height: 44px !important;
        margin-bottom: 1em !important;
        padding: 0 12px !important;
        align-items: center !important;
        justify-content: space-between !important;
        background: transparent !important;
        border: none !important;
      }
      
      .react-calendar__navigation button {
        background: none !important;
        border: none !important;
        cursor: pointer !important;
        outline: none !important;
        padding: 8px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 4px !important;
        transition: background-color 0.2s !important;
      }
      
      .react-calendar__navigation button:hover {
        background-color: #f3f4f6 !important;
      }
      
      .react-calendar__navigation__label {
        flex-grow: 1 !important;
        text-align: center !important;
        font-weight: 600 !important;
        color: #000000 !important;
        font-size: 16px !important;
      }
      
      /* 월/연 뷰 스타일 */
      .react-calendar__viewContainer {
        padding: 0 12px 12px 12px !important;
      }
      
      /* 월 뷰 스타일 */
      .react-calendar__month-view {
        padding: 0 !important;
      }
      
      /* 요일 헤더 스타일 */
      .react-calendar__month-view__weekdays {
        text-align: center !important;
        text-transform: uppercase !important;
        font-weight: bold !important;
        font-size: 0.75em !important;
        margin-bottom: 8px !important;
        padding: 0 !important;
      }
      
      .react-calendar__month-view__weekdays__weekday {
        padding: 8px 0 !important;
        color: #6b7280 !important;
        background: transparent !important;
        border: none !important;
      }
      
      /* 날짜 타일 컨테이너 */
      .react-calendar__month-view__days {
        display: grid !important;
        grid-template-columns: repeat(7, 1fr) !important;
        gap: 2px !important;
      }
      
      /* 날짜 타일 기본 스타일 */
      .react-calendar__tile {
        max-width: 100% !important;
        padding: 12px 0 !important;
        background: none !important;
        border: none !important;
        text-align: center !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 6px !important;
        transition: all 0.2s !important;
        color: #374151 !important;
        font-size: 14px !important;
        height: 40px !important;
      }
      
      /* 날짜 타일 호버 효과 */
      .react-calendar__tile:hover {
        background-color: #f3f4f6 !important;
      }
      
      /* 선택된 날짜 스타일 */
      .react-calendar__tile--active {
        background-color: #3b82f6 !important;
        color: white !important;
      }
      
      .react-calendar__tile--active:hover {
        background-color: #2563eb !important;
      }
      
      /* 오늘 날짜 스타일 */
      .react-calendar__tile--now {
        background-color: #eff6ff !important;
        color: #3b82f6 !important;
        font-weight: 600 !important;
      }
      
      .react-calendar__tile--now:hover {
        background-color: #dbeafe !important;
      }
      
      /* 다른 월의 날짜 스타일 */
      .react-calendar__month-view__days__day--neighboringMonth {
        color: #d1d5db !important;
      }
      
      /* 주말 스타일 */
      .react-calendar__month-view__days__day--weekend {
        color: #dc2626 !important;
      }
      
      /* 비활성화된 날짜 */
      .react-calendar__tile:disabled {
        background-color: #f9fafb !important;
        color: #d1d5db !important;
        cursor: not-allowed !important;
      }
      
      .react-calendar__tile:disabled:hover {
        background-color: #f9fafb !important;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      // 시간대 문제를 방지하기 위해 로컬 시간 기준으로 처리
      const localDate = new Date(value.getFullYear(), value.getMonth(), value.getDate());
      onChange?.(localDate);
    }
  };

  return (
    <div 
      ref={calendarRef}
      className={cn(
        "inline-block",
        className
      )}
    >
      <Calendar
        value={selectedDate}
        onChange={handleDateChange}
        locale="ko-KR"
        calendarType="gregory"
        showNeighboringMonth={true}
        selectRange={false}
        returnValue="start"
        navigationLabel={({ date }) => (
          <span className="font-semibold text-center text-black text-lg">
            {date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </span>
        )}
        prev2Label={null}
        next2Label={null}
        prevLabel={
          <Image 
            src="/icons/icon_alt arrow_left.svg" 
            alt="previous month" 
            width={20} 
            height={20}
          />
        }
        nextLabel={
          <Image 
            src="/icons/icon_alt arrow_right.svg" 
            alt="next month" 
            width={20} 
            height={20}
          />
        }
        formatShortWeekday={(_, date) => {
          const week = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
          return week[date.getDay()];
        }}
      />
    </div>
  );
};

export default CalendarComponent;