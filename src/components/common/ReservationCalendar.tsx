'use client';
import { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

// 클래스 병합 유틸리티
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

// 예약 상태 뱃지 컴포넌트
const StatusBadge = ({ status, count }: { status: string; count: number }) => {
  const colorMap: Record<string, string> = {
    완료: 'bg-gray-100 text-gray-600',
    예약: 'bg-blue-100 text-blue-600',
    승인: 'bg-yellow-100 text-yellow-700',
    거절: 'bg-red-100 text-red-600',
  };
  
  return (
    <span
      className={cn(
        'w-full text-center rounded px-1 py-px font-medium leading-tight',
        'text-[10px] md:text-[11px] lg:text-xs',
        colorMap[status] || 'bg-gray-100 text-gray-600'
      )}
    >
      {status} {count}
    </span>
  );
};

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

const ReservationCalendar = ({
  selectedDate,
  onDateChange,
  onDayClick,
  reservationData,
  experiences = [{ id: 'default', title: '함께 배우면 즐거운 스트릿 댄스' }],
  selectedExperienceId = 'default',
  onExperienceChange,
}: ReservationCalendarProps) => {
  const [date, setDate] = useState<Date | null>(selectedDate || new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // 캘린더 스타일 적용을 위한 useEffect
  useEffect(() => {
    if (calendarRef.current) {
      const weekdaysElement = calendarRef.current.querySelector('.react-calendar__month-view__weekdays');
      if (weekdaysElement) {
        const element = weekdaysElement as HTMLElement;
        element.style.borderBottom = '1px solid #d1d5db';
        element.style.marginBottom = '12px';
        // element.style.paddingBottom = window.innerWidth >= 640 ? '48px' : '16px';
      }
    }
  }, [date]); // date가 변경될 때마다 다시 적용

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
    <div className='shadow-custom-5 mx-auto flex w-375 lg:w-640 flex-col gap-30 rounded-2xl bg-white '>
      {/* 체험 선택 드롭다운 */}
      <div className="relative">
        <select 
          className={cn(
            'h-54 w-full rounded-[16px] border border-gray-100 px-20 text-16-m text-gray-950',
            'bg-white focus:border-blue-500 focus:outline-none',
            'appearance-none'
          )}
          value={selectedExperienceId}
          onChange={(e) => onExperienceChange?.(e.target.value)}
        >
          {experiences.map((experience) => (
            <option key={experience.id} value={experience.id}>
              {experience.title}
            </option>
          ))}
        </select>
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Image 
            src="/icons/icon_alt arrow_down.svg" 
            alt="dropdown" 
            width={24} 
            height={24}
          />
        </div>
      </div>

      {/* 캘린더 - Tailwind CSS 클래스 사용 */}
      <div 
        ref={calendarRef}
        className="w-full"
      >
        <Calendar
          value={date}
          onChange={(value) => handleDateChange(value as Date)}
          calendarType='gregory'
          className={cn(
            // 이 부분이 캘린더 전체 컨테이너를 제어
            "!w-full !max-w-full !bg-transparent !border-none",
            
            // 캘린더 그리드 레이아웃 (날짜 셀들의 배치)
            "[&_.react-calendar__month-view__days]:!grid [&_.react-calendar__month-view__days]:!grid-cols-7 grid-rows-auto",
            "[&_.react-calendar__month-view__days]:!gap-1",
            
            // 네비게이션 스타일
            "[&_.react-calendar__navigation]:!flex",
            "[&_.react-calendar__navigation]:!justify-center",
            "[&_.react-calendar__navigation]:!items-center [&_.react-calendar__navigation]:!gap-10",
            "[&_.react-calendar__navigation]:!mb-4 [&_.react-calendar__navigation]:!h-12",
            
            // 네비게이션 화살표
            "[&_.react-calendar__navigation__arrow]:!text-2xl [&_.react-calendar__navigation__arrow]:!font-semibold",
            "[&_.react-calendar__navigation__arrow]:!bg-none [&_.react-calendar__navigation__arrow]:!border-none",
            "[&_.react-calendar__navigation__arrow]:!cursor-pointer [&_.react-calendar__navigation__arrow]:!text-gray-800",
            "[&_.react-calendar__navigation__arrow]:!w-6 [&_.react-calendar__navigation__arrow]:!h-6",
            "[&_.react-calendar__navigation__arrow]:!flex [&_.react-calendar__navigation__arrow]:!items-center",
            "[&_.react-calendar__navigation__arrow]:!justify-center",
            
            // 요일 헤더
            "[&_.react-calendar__month-view__weekdays]:!flex",
            "[&_.react-calendar__month-view__weekdays]:!justify-between",
            "[&_.react-calendar__month-view__weekdays]:!h-55",
            
            // 개별 요일
            "[&_.react-calendar__month-view__weekdays__weekday]:!flex-1 [&_.react-calendar__month-view__weekdays__weekday]:!min-w-12",
            "[&_.react-calendar__month-view__weekdays__weekday]:!w-[53.57px] sm:[&_.react-calendar__month-view__weekdays__weekday]:!w-[68px] lg:[&_.react-calendar__month-view__weekdays__weekday]:!w-[91.43px]",
            "[&_.react-calendar__month-view__weekdays__weekday]:!h-[40px] sm:[&_.react-calendar__month-view__weekdays__weekday]:!h-[43px] lg:[&_.react-calendar__month-view__weekdays__weekday]:!h-[43px]",
            "[&_.react-calendar__month-view__weekdays__weekday]:!flex [&_.react-calendar__month-view__weekdays__weekday]:!items-center [&_.react-calendar__month-view__weekdays__weekday]:!justify-center",
            "[&_.react-calendar__month-view__weekdays__weekday]:!text-[13px] sm:[&_.react-calendar__month-view__weekdays__weekday]:!text-[16px]",
            "[&_.react-calendar__month-view__weekdays__weekday]:!font-bold",
            "[&_.react-calendar__month-view__weekdays__weekday]:!text-gray-700",
            "[&_.react-calendar__month-view__weekdays__weekday]:!font-['Pretendard',sans-serif]",
            
            // 일요일, 토요일 색상
            "[&_.react-calendar__month-view__weekdays__weekday:first-child_abbr]:!text-red-500",
            "[&_.react-calendar__month-view__weekdays__weekday:last-child_abbr]:!text-blue-500",
            
            // abbr 태그 점선 밑줄 제거
            "[&_abbr]:!no-underline",
            "[&_abbr]:!border-none",
            "[&_abbr]:!text-decoration-none"
          )}
          tileClassName={cn(
            // 이 부분이 각 날짜 셀의 크기와 모양을 제어
            "!w-53.57 !md-w-68 !lg:w-91.43 !h-104 !md:h-124 !lg:h-124 !min-w-12 !p-0",  // 크기
            "!flex !flex-col !items-center !justify-start", // 레이아웃
            "!border !border-gray-200 !bg-white !rounded-lg", // 스타일
          )}
          navigationLabel={({ date }) => (
            <span className={cn(
              "text-16-b md:text-20-b text-center w-full inline-block text-black",
              "font-['Pretendard',sans-serif] max-[744px]:text-base"
            )}>
              {date.getFullYear()}년 {date.getMonth() + 1}월
            </span>
          )}
          prev2Label={null}
          next2Label={null}
          prevLabel={
            <Image 
              src="/icons/icon_alt arrow_left.svg" 
              alt="previous month" 
              width={24} 
              height={24}
            />
          }
          nextLabel={
            <Image 
              src="/icons/icon_alt arrow_right.svg" 
              alt="next month" 
              width={24} 
              height={24}
            />
          }
          formatShortWeekday={(_, date) => {
            const week = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            return week[date.getDay()];
          }}
          tileContent={({ date }: { date: Date }) => {
            const key = formatDate(date);
            const reservations = reservationData[key] || [];
            const hasStatus = reservations.length > 0;
            const statusList = ['예약', '승인', '거절', '완료'];
            
            return (
              <div className='flex flex-col items-center w-full h-full relative'>
                {/* 날짜 숫자 */}
                <div className='w-full flex justify-start pt-18'>
                  <span className="text-16-m text-gray-800">
                    {date.getDate()}
                  </span>
                  {hasStatus && (
                    <div className="w-5 h-5 bg-red-500 rounded-full ml-auto mr-1" />
                  )}
                </div>
                
                {/* 예약 상태 뱃지들 */}
                <div className="flex flex-col gap-px mt-1 w-full px-1">
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
};

export default ReservationCalendar;
