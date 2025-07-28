import instance from '../axios';

// 월별 예약 현황 조회
export async function getReservationDashboard(activityId: number, year: string, month: string) {
  console.log('getReservationDashboard called with:', { activityId, year, month });
  const res = await instance.get(`/my-activities/${activityId}/reservation-dashboard`, {
    params: { year, month },
  });
  console.log('getReservationDashboard response:', res.data);
  return res.data;
}

// 날짜별 예약 스케줄 조회
export async function getReservedSchedule(activityId: number, date: string) {
  console.log('getReservedSchedule called with:', { activityId, date });
  const res = await instance.get(`/my-activities/${activityId}/reserved-schedule`, {
    params: { date },
  });
  console.log('getReservedSchedule response:', res.data);
  return res.data;
}

// 시간대별 예약 내역 조회 (scheduleId 쿼리)
export async function getReservations(
  activityId: number,
  scheduleId: number,
  status: string = 'pending',
) {
  console.log('getReservations called with:', { activityId, scheduleId, status });
  const res = await instance.get(`/my-activities/${activityId}/reservations`, {
    params: {
      scheduleId: scheduleId,
      status: status,
    },
  });
  console.log('getReservations response:', res.data);
  return res.data;
}

// 예약 상태 변경 (승인/거절)
export async function updateReservationStatus(
  activityId: number,
  reservationId: number,
  status: 'confirmed' | 'declined',
) {
  console.log('updateReservationStatus called with:', { activityId, reservationId, status });
  const res = await instance.patch(`/my-activities/${activityId}/reservations/${reservationId}`, {
    status,
  });
  console.log('updateReservationStatus response:', res.data);
  return res.data;
}
