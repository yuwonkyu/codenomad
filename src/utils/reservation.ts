import { parse, format } from 'date-fns';
import type { Schedule } from '@/components/activities/Activities.types';

//스케줄 정보를 읽기 쉬운 날짜 형식으로 포맷팅
export const formatScheduleText = (schedule: Schedule): string => {
  const dateObj = parse(schedule.date, 'yyyy-MM-dd', new Date());
  return `${format(dateObj, 'yy/MM/dd')} ${schedule.startTime} ~ ${schedule.endTime}`;
};

//스케줄 ID로 해당하는 스케줄 찾기
export const findScheduleById = (schedules: Schedule[], scheduleId: number | null): Schedule | undefined => {
  if (!scheduleId) return undefined;
  return schedules.find((s) => s.id === scheduleId);
};

//스케줄 ID로 해당하는 날짜 찾기
export const getDateFromScheduleId = (schedules: Schedule[], scheduleId: number | null): string | null => {
  const schedule = findScheduleById(schedules, scheduleId);
  return schedule ? schedule.date : null;
}; 