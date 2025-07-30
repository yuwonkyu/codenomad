import { parse, format, parseISO, startOfDay, isBefore } from 'date-fns';
import type { Schedule } from '@/components/activities/Activities.types';

// ========== 날짜 변환 유틸리티 ==========

// 문자열을 Date 객체로 변환 (ISO 형식)
export const stringToDate = (dateStr: string): Date => parseISO(dateStr);

// Date 객체를 YYYY-MM-DD 형식 문자열로 변환 (로컬 시간 기준)
export const dateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ========== 날짜 검증 유틸리티 ==========

//특정 날짜가 비활성화되어야 하는지 체크
export const checkDateDisabled = (date: Date, availableDates: Set<string>): boolean => {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const isPast = isBefore(target, today);
  const isUnavailable = !availableDates.has(dateToString(target));
  return isPast || isUnavailable;
};

// 날짜 선택을 처리하는 함수
export const handleDateSelection = (
  date: Date | null,
  availableDates: Set<string>,
  onDateSelect: (date: string) => void,
): void => {
  if (!date) return;
  const dateStr = dateToString(date);
  if (availableDates.has(dateStr)) {
    onDateSelect(dateStr);
  }
};

// 초기 선택 날짜를 결정하는 함수 (오늘 날짜가 가능하면 오늘, 아니면 null)
export const getInitialSelectedDate = (
  availableDates: Set<string>,
  selectedDate: string | null,
): string | null => {
  // 이미 선택된 날짜가 있다면 그대로 유지
  if (selectedDate) return selectedDate;

  // 오늘 날짜가 예약 가능하다면 자동 선택
  const today = dateToString(new Date());
  if (availableDates.has(today)) {
    return today;
  }

  return null;
};

// ========== 기존 스케줄 관련 유틸리티 ==========

//스케줄 정보를 읽기 쉬운 날짜 형식으로 포맷팅
export const formatScheduleText = (schedule: Schedule): string => {
  const dateObj = parse(schedule.date, 'yyyy-MM-dd', new Date());
  return `${format(dateObj, 'yy/MM/dd')} ${schedule.startTime} ~ ${schedule.endTime}`;
};

//스케줄 ID로 해당하는 스케줄 찾기
export const findScheduleById = (
  schedules: Schedule[],
  scheduleId: number | null,
): Schedule | undefined => {
  if (!scheduleId) return undefined;
  return schedules.find((s) => s.id === scheduleId);
};

//스케줄 ID로 해당하는 날짜 찾기
export const getDateFromScheduleId = (
  schedules: Schedule[],
  scheduleId: number | null,
): string | null => {
  const schedule = findScheduleById(schedules, scheduleId);
  return schedule ? schedule.date : null;
};
