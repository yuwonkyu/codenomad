'use client';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 클래스 병합 유틸리티
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

// 예약 상태 뱃지 컴포넌트
function StatusBadge({ status, count }: { status: string; count: number }) {
  const colorMap: Record<string, string> = {
    완료: 'bg-gray-100 text-gray-600',
    예약: 'bg-blue-100 text-blue-600',
    승인: 'bg-yellow-100 text-yellow-700',
    거절: 'bg-red-100 text-red-600',
  };
  
  return (
    <span
      className={cn(
        'w-full text-center rounded px-1 py-0.5 font-medium leading-tight',
        'text-[8px] md:text-[9px] lg:text-[10px]',
        colorMap[status] || 'bg-gray-100 text-gray-600'
      )}
    >
      {status} {count}
    </span>
  );
}

interface ReservationData {
  status: string;
  count: number;
  nickname: string;
}

interface ReservationCalendarProps {
  /** 선택된 날짜 */
  selectedDate: Date | null;
  /** 날짜 변경 콜백 */
  onDateChange: (date: Date) => void;
  /** 날짜 클릭 콜백 (예약이 있는 날짜만) */
  onDayClick: (date: Date, event?: React.MouseEvent) => void;
  /** 예약 데이터 */
  reservationData: Record<string, ReservationData[]>;
  /** 체험 목록 */
  experiences?: Array<{ id: string; title: string }>;
  /** 선택된 체험 ID */
  selectedExperienceId?: string;
  /** 체험 변경 콜백 */
  onExperienceChange?: (experienceId: string) => void;
}

export default function ReservationCalendar({
  selectedDate,
  onDateChange,
  onDayClick,
  reservationData,
  experiences = [{ id: 'default', title: '함께 배우면 즐거운 스트릿 댄스' }],
  selectedExperienceId = 'default',
  onExperienceChange,
}: ReservationCalendarProps) {
  const [date, setDate] = useState<Date | null>(selectedDate || new Date());

  // 날짜를 yyyy-mm-dd 문자열로 변환
  const formatDate = (date: Date | null) => (date ? date.toISOString().split('T')[0] : '');

  // 날짜 변경 핸들러
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  // 날짜 클릭 핸들러
  const handleDayClick = (clickedDate: Date, event?: React.MouseEvent) => {
    const key = formatDate(clickedDate);
    if (reservationData[key] && reservationData[key].length > 0) {
      onDayClick(clickedDate, event);
    }
  };

  return (
    <div className='shadow-custom-5 mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl bg-white p-4 md:p-8'>
      {/* 체험 선택 드롭다운 */}
      <select 
        className='shadow-custom-5 mb-5 h-14 w-full rounded-xl border border-gray-200 px-4 py-2 text-base focus:border-blue-500 focus:outline-none'
        value={selectedExperienceId}
        onChange={(e) => onExperienceChange?.(e.target.value)}
      >
        {experiences.map((experience) => (
          <option key={experience.id} value={experience.id}>
            {experience.title}
          </option>
        ))}
      </select>

      {/* 캘린더 - Tailwind CSS 클래스 사용 */}
      <div className="w-full">
        <Calendar
          value={date}
          onChange={(value) => handleDateChange(value as Date)}
          calendarType='gregory'
          className={cn(
            // 기본 캘린더 스타일
            "!w-full !max-w-full !bg-transparent !border-none text-lg",
            "!font-['Pretendard',sans-serif]",
            
            // 네비게이션 스타일
            "[&_.react-calendar__navigation]:!flex [&_.react-calendar__navigation]:!justify-center",
            "[&_.react-calendar__navigation]:!items-center [&_.react-calendar__navigation]:!gap-7",
            "[&_.react-calendar__navigation]:!mb-2 [&_.react-calendar__navigation]:!h-11",
            
            // 네비게이션 화살표
            "[&_.react-calendar__navigation__arrow]:!text-2xl [&_.react-calendar__navigation__arrow]:!font-semibold",
            "[&_.react-calendar__navigation__arrow]:!bg-none [&_.react-calendar__navigation__arrow]:!border-none",
            "[&_.react-calendar__navigation__arrow]:!cursor-pointer [&_.react-calendar__navigation__arrow]:!text-gray-800",
            "[&_.react-calendar__navigation__arrow]:!w-6 [&_.react-calendar__navigation__arrow]:!h-6",
            "[&_.react-calendar__navigation__arrow]:!flex [&_.react-calendar__navigation__arrow]:!items-center",
            "[&_.react-calendar__navigation__arrow]:!justify-center",
            
            // 요일 헤더
            "[&_.react-calendar__month-view__weekdays]:!border-b-2 [&_.react-calendar__month-view__weekdays]:!border-gray-200",
            "[&_.react-calendar__month-view__weekdays]:!mb-2.5 [&_.react-calendar__month-view__weekdays]:!flex",
            "[&_.react-calendar__month-view__weekdays]:!justify-between [&_.react-calendar__month-view__weekdays]:!pb-3",
            
            // 개별 요일
            "[&_.react-calendar__month-view__weekdays__weekday]:!flex-1 [&_.react-calendar__month-view__weekdays__weekday]:!min-w-12",
            "[&_.react-calendar__month-view__weekdays__weekday]:!text-base [&_.react-calendar__month-view__weekdays__weekday]:!font-bold",
            "[&_.react-calendar__month-view__weekdays__weekday]:!text-gray-800 [&_.react-calendar__month-view__weekdays__weekday]:!text-center",
            "[&_.react-calendar__month-view__weekdays__weekday]:!py-2 [&_.react-calendar__month-view__weekdays__weekday]:!font-['Pretendard',sans-serif]",
            
            // 일요일, 토요일 색상
            "[&_.react-calendar__month-view__weekdays__weekday:first-child_abbr]:!text-red-500",
            "[&_.react-calendar__month-view__weekdays__weekday:last-child_abbr]:!text-blue-500"
          )}
          tileClassName={cn(
            // 기본 타일 스타일
            "!w-14 !h-30 !min-w-12 !p-0 !flex !flex-col !items-center !justify-start",
            "!border !border-gray-100 !bg-white !rounded-2xl !relative !m-0.5 !box-border !gap-1",
            
            // 반응형 크기
            "md:!w-17 md:!h-31 lg:!w-23",
            "max-[744px]:!w-14 max-[744px]:!h-24 max-[744px]:!rounded-xl",
            "max-[744px]:!gap-0.5 max-[744px]:!px-0.5",
            
            // abbr 숨기기
            "[&_abbr]:!hidden"
          )}
          navigationLabel={({ date }) => (
            <span className={cn(
              "text-xl font-bold text-center w-full inline-block tracking-tight text-gray-800",
              "font-['Pretendard',sans-serif] max-[744px]:text-base"
            )}>
              {date.getFullYear()}년 {date.getMonth() + 1}월
            </span>
          )}
          prev2Label={null}
          next2Label={null}
          formatShortWeekday={(_, date) => {
            const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return week[date.getDay()];
          }}
          tileContent={({ date }: { date: Date }) => {
            const key = formatDate(date);
            const reservations = reservationData[key] || [];
            const hasStatus = reservations.length > 0;
            const statusList = ['예약', '승인', '거절', '완료'];
            
            return (
              <div className='flex flex-col items-center w-full h-full'>
                <div className='flex items-center justify-center relative w-full'>
                  <span className="text-xs font-medium text-gray-600 absolute top-1 left-1">
                    {date.getDate()}
                  </span>
                  {hasStatus && (
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-0.5 right-1" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 mt-4 w-full px-1">
                  {statusList.map((status) => {
                    const count = reservations.filter((r) => r.status === status).length;
                    return count > 0 ? (
                      <StatusBadge key={status} status={status} count={count} />
                    ) : null;
                  })}
                </div>
              </div>
            );
          }}
          onClickDay={(date, event) => handleDayClick(date, event)}
        />
      </div>
    </div>
  );
}
