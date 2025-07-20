import axios from '@/lib/api/axios';

// 월별 예약 현황 조회
export async function getReservationDashboard(activityId: number) {
  const res = await axios.get(`/my-activities/${activityId}/reservation-dashboard`);
  return res.data;
}

// 날짜별 예약 스케줄 조회
export async function getReservedSchedule(activityId: number) {
  const res = await axios.get(`/my-activities/${activityId}/reserved-schedule`);
  return res.data;
}

// 시간대별 예약 내역 조회 (date, scheduleId 쿼리)
export async function getReservations(activityId: number, date: string, scheduleId: number) {
  const res = await axios.get(`/my-activities/${activityId}/reservations`, {
    params: { date, scheduleId },
  });
  return res.data;
}

// 예약 상태 변경 (승인/거절)
export async function updateReservationStatus(
  activityId: number,
  reservationId: number,
  status: 'confirmed' | 'declined',
) {
  const res = await axios.patch(`/my-activities/${activityId}/reservations/${reservationId}`, {
    status,
  });
  return res.data;
}
