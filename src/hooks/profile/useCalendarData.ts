import { useMemo } from 'react';

// 🎨 캘린더용 타입 정의 (캘린더 컴포넌트와 일치)
type CalendarReservationData = {
  status: string; // 한글 상태명 (예약, 승인, 거절, 완료)
  count: number; // 해당 상태의 예약 개수
  nickname: string; // 표시용 (실제로는 사용하지 않음)
};

// 📊 예약 카운트 데이터 타입
interface ReservationCounts {
  pending: number;
  confirmed: number;
  declined: number;
  completed: number;
}

// 📊 대시보드 데이터 타입 (기존과 동일)
interface ScheduleData {
  id: number | string;
  scheduleId?: number | string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  reservations: any[];
  headCount?: number;
}

interface DashboardData {
  [date: string]: ScheduleData[];
}

// 🔧 공통 함수: 예약 카운트를 캘린더 뱃지로 변환
const createReservationBadges = (counts: ReservationCounts): CalendarReservationData[] => {
  const badges: CalendarReservationData[] = [];

  // 📈 각 상태별로 뱃지 생성 (개수가 0보다 클 때만)
  if (counts.pending > 0) {
    badges.push({ status: '예약', count: counts.pending, nickname: 'User' });
  }
  if (counts.confirmed > 0) {
    badges.push({ status: '승인', count: counts.confirmed, nickname: 'User' });
  }
  if (counts.declined > 0) {
    badges.push({ status: '거절', count: counts.declined, nickname: 'User' });
  }
  if (counts.completed > 0) {
    badges.push({ status: '완료', count: counts.completed, nickname: 'User' });
  }

  return badges;
};

// 🎣 캘린더 데이터 변환 커스텀 훅
// 역할: 복잡한 예약 데이터를 캘린더가 이해할 수 있는 형태로 변환
export const useCalendarData = (apiReservationData: DashboardData) => {
  // 🎨 메모이제이션으로 불필요한 재계산 방지
  const calendarData = useMemo(() => {
    // 📊 최종 결과: 날짜별 뱃지 배열을 담는 객체
    const convertedData: Record<string, CalendarReservationData[]> = {};

    // ✨ 우선순위 1: statusBadgeData 사용 (getReservedSchedule 기반의 정확한 데이터)
    // 이 데이터는 loadStatusBadgesWithReservedSchedule에서 생성됨
    const statusBadgeData = (window as any).statusBadgeData;

    if (statusBadgeData) {
      // 🎯 정확한 상태 데이터를 기반으로 캘린더 뱃지 생성
      Object.entries(statusBadgeData as Record<string, ReservationCounts>).forEach(
        ([date, counts]) => {
          convertedData[date] = createReservationBadges(counts);
        },
      );
    } else {
      // 🔄 FALLBACK: 기존 방식 (statusBadgeData가 아직 로드되지 않은 경우)
      // apiReservationData (대시보드 API 응답)를 사용하여 뱃지 생성
      Object.entries(apiReservationData).forEach(([date, schedules]) => {
        const aggregatedCounts: ReservationCounts = {
          pending: 0,
          confirmed: 0,
          declined: 0,
          completed: 0,
        };

        // 📋 스케줄별로 예약 정보 추출 및 집계 (중첩된 구조 처리)
        schedules.forEach((schedule) => {
          if (schedule.reservations && Array.isArray(schedule.reservations)) {
            (schedule.reservations as any[]).forEach((reservationGroup) => {
              if (
                reservationGroup.reservations &&
                typeof reservationGroup.reservations === 'object'
              ) {
                const counts = reservationGroup.reservations;

                // 📊 카운트 집계
                aggregatedCounts.pending += counts.pending || 0;
                aggregatedCounts.confirmed += counts.confirmed || 0;
                aggregatedCounts.declined += counts.declined || 0;
                aggregatedCounts.completed += counts.completed || 0;
              }
            });
          }
        });

        // 🎨 공통 함수를 사용하여 뱃지 생성
        convertedData[date] = createReservationBadges(aggregatedCounts);
      });
    }

    // 🎨 최종 결과 반환: 캘린더가 이해할 수 있는 형태의 데이터
    return convertedData;
  }, [apiReservationData]); // apiReservationData가 변경될 때만 재계산

  return calendarData;
};
