'use client';
import { useState, useContext, useEffect, MouseEvent } from 'react';
import { ProfileMobileContext } from '@/app/(main)/profile/layout';
import ReservationCalendar from '@/components/common/ReservationCalendar';
import {
  getReservationDashboard,
  getReservedSchedule,
  getReservations,
  updateReservationStatus,
} from '@/lib/api/profile/myActivitiesStatus';
import { getMyActivities, MyActivity } from '@/lib/api/profile/myActivities';

interface ReservationData {
  id: number;
  status: 'pending' | 'confirmed' | 'declined';
  headCount: number;
  nickname: string;
  scheduleId: number | string;
  timeSlot: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface ScheduleData {
  id: number | string;
  scheduleId?: number | string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  reservations: ReservationData[];
  headCount?: number;
}

interface DashboardData {
  [date: string]: ScheduleData[];
}

export default function ReservationStatusPage() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState<'신청' | '승인' | '거절'>('신청');
  const [selectedTime, setSelectedTime] = useState('14:00 - 15:00');
  const [, setVisibleCount] = useState(2);
  const mobileContext = useContext(ProfileMobileContext);
  const [calendarCellRect, setCalendarCellRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const [apiReservationData, setApiReservationData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myActivities, setMyActivities] = useState<MyActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<MyActivity | null>(null);
  const [reservationDetails, setReservationDetails] = useState<ReservationData[]>([]);
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleData[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<ReservationData[]>([]);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    // 로컬 시간대 기준으로 YYYY-MM-DD 형식 생성
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadReservationDashboard = async (activityId: number, year: number, month: number) => {
    try {
      setLoading(true);
      setError(null);
      const paddedMonth = month.toString().padStart(2, '0');
      const responseData = await getReservationDashboard(activityId, String(year), paddedMonth);
      const reservations: ReservationData[] = Array.isArray(responseData)
        ? responseData
        : responseData.reservations || [];

      const groupedByDateAndSchedule = reservations.reduce(
        (acc, r) => {
          const dateKey = r.date;
          if (!acc[dateKey]) {
            acc[dateKey] = {};
          }
          const scheduleKey = String(r.scheduleId);
          if (!acc[dateKey][scheduleKey]) {
            acc[dateKey][scheduleKey] = {
              id: r.scheduleId,
              timeSlot: `${r.startTime} - ${r.endTime}`,
              startTime: r.startTime,
              endTime: r.endTime,
              reservations: [r],
              headCount: r.headCount,
            };
          } else {
            const schedule = acc[dateKey][scheduleKey];
            if (schedule) {
              schedule.reservations.push(r);
              schedule.headCount = (schedule.headCount || 0) + r.headCount;
            }
          }
          return acc;
        },
        {} as { [date: string]: { [scheduleId: string]: ScheduleData } },
      );

      const finalGroupedData: DashboardData = Object.entries(groupedByDateAndSchedule).reduce(
        (acc, [date, schedulesById]) => {
          acc[date] = Object.values(schedulesById);
          return acc;
        },
        {} as DashboardData,
      );

      setApiReservationData(finalGroupedData);
    } catch (err) {
      setError('예약 현황을 불러오는데 실패했습니다.');
      console.error('Failed to load reservation dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReservedSchedule = async (activityId: number, date: string) => {
    try {
      setLoading(true);
      setError(null);
      const schedulesFromApi = await getReservedSchedule(activityId, date);

      const transformedSchedules = schedulesFromApi.map((s: any) => ({
        ...s,
        timeSlot: `${s.startTime} - ${s.endTime}`,
      }));

      setScheduleDetails(transformedSchedules || []);
    } catch (err) {
      setError('예약 스케줄을 불러오는데 실패했습니다.');
      console.error('Failed to load reserved schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReservations = async (activityId: number, scheduleId: number | string) => {
    try {
      const numericScheduleId = parseInt(String(scheduleId), 10);
      if (isNaN(numericScheduleId)) {
        console.error('Invalid scheduleId:', scheduleId);
        setError('잘못된 스케줄 ID입니다.');
        return;
      }

      console.log('loadReservations called with:', { activityId, scheduleId, numericScheduleId });

      setLoading(true);
      setError(null);

      // 모든 상태의 예약을 한 번에 가져오기 (pending, confirmed, declined)
      const allReservations = [];

      // 각 상태별로 예약을 가져와서 합치기
      const statuses = ['pending', 'confirmed', 'declined'];
      for (const status of statuses) {
        try {
          const data = await getReservations(activityId, numericScheduleId, status);
          if (data.reservations && data.reservations.length > 0) {
            allReservations.push(...data.reservations);
          }
        } catch (err) {
          console.warn(`Failed to load reservations for status ${status}:`, err);
        }
      }

      console.log('All reservations loaded:', allReservations);
      setReservationDetails(allReservations);
    } catch (err) {
      setError('예약 내역을 불러오는데 실패했습니다.');
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationStatusUpdate = async (
    activityId: number,
    reservationId: number,
    scheduleId: number | string,
    status: 'confirmed' | 'declined',
  ) => {
    try {
      setLoading(true);
      setError(null);
      await updateReservationStatus(activityId, reservationId, status);

      // 상태 업데이트 후 모든 예약을 다시 불러오기
      if (selectedDate && selectedActivity) {
        const dateStr = formatDate(selectedDate);
        const schedule = scheduleDetails.find((s) => s.timeSlot === selectedTime);
        if (schedule && (schedule.scheduleId !== undefined || schedule.id !== undefined)) {
          const scheduleIdToUse = schedule.scheduleId || schedule.id;
          await loadReservations(selectedActivity.id, scheduleIdToUse);
        }
      }
    } catch (err) {
      setError('예약 상태 변경에 실패했습니다.');
      console.error('Failed to update reservation status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMyActivities = async () => {
      try {
        setLoading(true);
        const data = await getMyActivities();
        if (data.activities && data.activities.length > 0) {
          setMyActivities(data.activities);
          setSelectedActivity(data.activities[0]);
        } else {
          setError('등록된 체험이 없습니다.');
        }
      } catch (err) {
        setError('체험 목록을 불러오는데 실패했습니다.');
        console.error('Failed to load my activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyActivities();
  }, []);

  useEffect(() => {
    if (selectedActivity && date) {
      loadReservationDashboard(selectedActivity.id, date.getFullYear(), date.getMonth() + 1);
    }
  }, [selectedActivity, date]);

  useEffect(() => {
    if (selectedDate && selectedActivity) {
      const dateStr = formatDate(selectedDate);
      loadReservedSchedule(selectedActivity.id, dateStr);
    }
  }, [selectedDate, selectedActivity]);

  useEffect(() => {
    // 날짜에 대한 스케줄이 로드되면, 첫 번째 시간을 기본 선택값으로 설정
    if (scheduleDetails.length > 0 && scheduleDetails[0].timeSlot) {
      setSelectedTime(scheduleDetails[0].timeSlot);
    } else {
      setReservationDetails([]); // 스케줄이 없으면 예약 내역도 비움
    }
  }, [scheduleDetails]);

  useEffect(() => {
    if (selectedDate && selectedActivity && selectedTime) {
      const dateStr = formatDate(selectedDate);
      console.log('selectedTime:', selectedTime);
      console.log('scheduleDetails:', scheduleDetails);

      // selectedTime과 일치하는 스케줄 찾기
      const schedule = scheduleDetails.find((s) => s.timeSlot === selectedTime);

      console.log('Found schedule:', schedule);
      console.log('Schedule ID:', schedule?.scheduleId || schedule?.id);

      if (schedule && (schedule.scheduleId !== undefined || schedule.id !== undefined)) {
        const scheduleId = schedule.scheduleId || schedule.id;
        console.log('Calling loadReservations with scheduleId:', scheduleId);
        loadReservations(selectedActivity.id, scheduleId);
      } else {
        console.warn('No matching schedule found for selectedTime:', selectedTime);
        console.warn(
          'Available schedules:',
          scheduleDetails.map((s) => ({
            id: s.id,
            scheduleId: s.scheduleId,
            timeSlot: s.timeSlot,
          })),
        );
      }
    }
  }, [selectedDate, selectedActivity, selectedTime, scheduleDetails]);

  useEffect(() => {
    const newFiltered = reservationDetails.filter((r) => r.status === tabMap[selectedTab]);
    setFilteredReservations(newFiltered);
  }, [reservationDetails, selectedTab]);

  const handleDayClick = (clickedDate: Date, event?: MouseEvent) => {
    if (!selectedActivity) return;
    const key = formatDate(clickedDate);

    if (apiReservationData[key]) {
      setSelectedDate(clickedDate);
      setSelectedTab('신청');
      setSelectedTime('14:00 - 15:00');
      loadReservedSchedule(selectedActivity.id, key);

      if (window.innerWidth >= 1024 && event?.target) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setCalendarCellRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  };

  const closeModal = () => setSelectedDate(null);

  const handleApproveReservation = (reservationId: number, scheduleId: number) => {
    if (!selectedActivity) return;
    handleReservationStatusUpdate(selectedActivity.id, reservationId, scheduleId, 'confirmed');
  };

  const handleDeclineReservation = (reservationId: number, scheduleId: number) => {
    if (!selectedActivity) return;
    handleReservationStatusUpdate(selectedActivity.id, reservationId, scheduleId, 'declined');
  };

  const timeOptions = scheduleDetails.map((s) => s.timeSlot);
  const tabMap = { 신청: 'pending', 승인: 'confirmed', 거절: 'declined' };
  const API_STATUS_TO_KOREAN: Record<string, string> = {
    pending: '예약',
    confirmed: '승인',
    declined: '거절',
  };

  if (loading && !selectedActivity) {
    return (
      <section className='mx-auto w-full max-w-2xl'>
        <div className='flex items-center justify-center py-20'>
          <div className='text-lg'>로딩 중...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='mx-auto w-full max-w-2xl'>
        <div className='flex items-center justify-center py-20'>
          <div className='text-lg text-red-500'>{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className='mx-auto w-full max-w-2xl'>
      <div className='mb-6 w-full'>
        <button
          type='button'
          className='mb-1 flex items-center gap-2 md:hidden'
          onClick={mobileContext?.onCancel}
          style={{ cursor: 'pointer' }}
        >
          <img src='/icons/Vector.png' alt='vector' width={20} height={20} />
          <span className='text-xl font-bold'>예약 현황</span>
        </button>
        <h1 className='mb-1 hidden text-xl font-bold md:block'>예약 현황</h1>
        <p className='mb-4 text-sm text-gray-500'>
          내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.
        </p>
      </div>

      <ReservationCalendar
        selectedDate={date}
        onDateChange={setDate}
        onDayClick={handleDayClick}
        onMonthChange={(newDate) => setDate(newDate)}
        reservationData={(() => {
          // 캘린더용 타입 정의 (캘린더 컴포넌트와 일치)
          type CalendarReservationData = {
            status: string;
            count: number;
            nickname: string;
          };

          const convertedData: Record<string, CalendarReservationData[]> = {};

          Object.entries(apiReservationData).forEach(([date, schedules]) => {
            const dateReservations: CalendarReservationData[] = [];

            schedules.forEach((schedule) => {
              if (schedule.reservations) {
                if (Array.isArray(schedule.reservations)) {
                  // 배열 형태의 reservations (기존 구조)
                  schedule.reservations.forEach((r) => {
                    dateReservations.push({
                      status: API_STATUS_TO_KOREAN[r.status] || r.status,
                      count: r.headCount,
                      nickname: r.nickname,
                    });
                  });
                } else {
                  // 객체 형태의 reservations (새로운 구조)
                  const reservationCounts = schedule.reservations as any;

                  // pending -> 예약
                  if (reservationCounts.pending > 0) {
                    dateReservations.push({
                      status: '예약',
                      count: reservationCounts.pending,
                      nickname: 'Unknown',
                    });
                  }

                  // confirmed -> 승인
                  if (reservationCounts.confirmed > 0) {
                    dateReservations.push({
                      status: '승인',
                      count: reservationCounts.confirmed,
                      nickname: 'Unknown',
                    });
                  }

                  // completed/declined -> 거절
                  const declinedCount =
                    (reservationCounts.completed || 0) + (reservationCounts.declined || 0);
                  if (declinedCount > 0) {
                    dateReservations.push({
                      status: '거절',
                      count: declinedCount,
                      nickname: 'Unknown',
                    });
                  }
                }
              }
            });

            convertedData[date] = dateReservations;
          });

          console.log('Original API data:', apiReservationData);
          console.log('API date keys:', Object.keys(apiReservationData));
          console.log('Converted reservation data for calendar:', convertedData);
          console.log('Calendar date keys:', Object.keys(convertedData));
          console.log('Has any data?', Object.keys(convertedData).length > 0);

          // 각 날짜별 상세 정보 출력
          Object.entries(convertedData).forEach(([dateKey, reservations]) => {
            if (reservations.length > 0) {
              console.log(`Date key: ${dateKey}, reservations:`, reservations);
            }
          });

          return convertedData;
        })()}
        experiences={myActivities.map((act) => ({ ...act, id: act.id.toString() }))}
        selectedExperienceId={selectedActivity?.id.toString()}
        onExperienceChange={(experienceId) => {
          const newSelected = myActivities.find((act) => act.id.toString() === experienceId);
          if (newSelected) {
            setSelectedActivity(newSelected);
          }
        }}
      />
      {selectedDate && (
        <>
          <div
            className='fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:hidden'
            onClick={closeModal}
          >
            <div
              className='flex max-h-[90vh] w-full translate-y-0 flex-col items-center overflow-y-auto rounded-t-3xl bg-white p-[20px] shadow-xl transition-transform duration-300'
              style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.10)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200' />
              <div className='mb-6 w-full text-center text-lg font-bold'>
                {selectedDate.getFullYear().toString().slice(2)}년 {selectedDate.getMonth() + 1}월{' '}
                {selectedDate.getDate()}일
              </div>
              <div className='mb-6 flex w-full border-b'>
                {(['신청', '승인', '거절'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 border-b-2 py-2 text-center font-semibold transition-colors ${
                      selectedTab === tab
                        ? 'border-blue-500 text-blue-500'
                        : 'border-transparent text-gray-400'
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab} {reservationDetails.filter((r) => r.status === tabMap[tab]).length}
                  </button>
                ))}
              </div>
              <div className='mb-6 w-full'>
                <label className='mb-2 block text-sm font-semibold'>예약 시간</label>
                <select
                  className='h-[54px] w-full rounded-xl border bg-white px-10 text-base'
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-6 w-full'>
                <label className='mb-2 block text-sm font-semibold'>예약 내역</label>
                <div className='flex max-h-[260px] flex-col gap-4 overflow-y-auto'>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((r, i) => (
                      <div
                        key={i}
                        className='flex h-[94px] max-h-[94px] min-h-[94px] flex-row items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white px-20 shadow-sm'
                      >
                        <div className='flex flex-col gap-2'>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-500'>닉네임</span>
                            <span className='font-semibold text-gray-900'>{r.nickname}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-500'>인원</span>
                            <span className='font-semibold text-gray-900'>{r.headCount}명</span>
                          </div>
                        </div>
                        <div className='ml-4 flex flex-col items-end gap-2'>
                          {selectedTab === '신청' ? (
                            <>
                              <button
                                className='flex-1 rounded-lg border border-gray-300 bg-white px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50'
                                onClick={() =>
                                  handleApproveReservation(r.id, parseInt(String(r.scheduleId), 10))
                                }
                              >
                                승인하기
                              </button>
                              <button
                                className='mt-2 flex-1 rounded-lg border border-gray-300 bg-gray-100 px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-200'
                                onClick={() =>
                                  handleDeclineReservation(r.id, parseInt(String(r.scheduleId), 10))
                                }
                              >
                                거절하기
                              </button>
                            </>
                          ) : selectedTab === '승인' ? (
                            <span className='rounded-lg bg-blue-50 px-[20px] py-[8px] text-sm font-semibold text-blue-500'>
                              예약 승인
                            </span>
                          ) : selectedTab === '거절' ? (
                            <span className='rounded-lg bg-red-50 px-[20px] py-[8px] text-sm font-semibold text-red-500'>
                              예약 거절
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='py-4 text-center text-gray-400'>예약 내역이 없습니다.</div>
                  )}
                </div>
              </div>
              <button
                className='mt-10 w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700'
                onClick={closeModal}
              >
                닫기
              </button>
            </div>
          </div>
          <div className='hidden lg:block'>
            {calendarCellRect && (
              <div
                className='fixed z-50 flex flex-col items-center rounded-3xl bg-white p-[20px] shadow-xl transition-transform duration-300'
                style={{
                  top: `${calendarCellRect.top + window.scrollY}px`,
                  left: `${calendarCellRect.left + calendarCellRect.width + 16}px`,
                  width: '420px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                }}
              >
                <button
                  className='absolute top-6 right-6 text-2xl font-bold text-gray-400 hover:text-gray-700'
                  onClick={closeModal}
                  aria-label='닫기'
                  type='button'
                >
                  ×
                </button>
                <div className='mb-4 w-full text-left text-lg font-bold'>
                  {selectedDate.getFullYear().toString().slice(2)}년 {selectedDate.getMonth() + 1}월{' '}
                  {selectedDate.getDate()}일
                </div>
                <div className='mb-4 flex w-full border-b'>
                  {(['신청', '승인', '거절'] as const).map((tab) => (
                    <button
                      key={tab}
                      className={`flex-1 border-b-2 py-2 text-center font-semibold transition-colors ${
                        selectedTab === tab
                          ? 'border-blue-500 text-blue-500'
                          : 'border-transparent text-gray-400'
                      }`}
                      onClick={() => setSelectedTab(tab)}
                    >
                      {tab} {reservationDetails.filter((r) => r.status === tabMap[tab]).length}
                    </button>
                  ))}
                </div>
                <div className='mb-4 w-full'>
                  <label className='mb-2 block text-sm font-semibold'>예약 시간</label>
                  <select
                    className='h-[54px] w-full rounded border bg-white px-10 py-3 text-base'
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='mb-4 w-full'>
                  <label className='mb-2 block text-sm font-semibold'>예약 내역</label>
                  <div className='flex max-h-[260px] flex-col gap-4 overflow-y-auto'>
                    {filteredReservations.length > 0 ? (
                      filteredReservations.map((r, i) => (
                        <div
                          key={i}
                          className='flex h-[94px] max-h-[94px] min-h-[94px] flex-row items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-4 px-20 shadow-sm'
                        >
                          <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-500'>닉네임</span>
                              <span className='font-semibold text-gray-900'>{r.nickname}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-500'>인원</span>
                              <span className='font-semibold text-gray-900'>{r.headCount}명</span>
                            </div>
                          </div>
                          <div className='ml-4 flex flex-col items-end gap-2'>
                            {selectedTab === '신청' ? (
                              <>
                                <button
                                  className='flex-1 rounded-lg border border-gray-300 bg-white px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50'
                                  onClick={() =>
                                    handleApproveReservation(
                                      r.id,
                                      parseInt(String(r.scheduleId), 10),
                                    )
                                  }
                                >
                                  승인하기
                                </button>
                                <button
                                  className='mt-2 flex-1 rounded-lg border border-gray-300 bg-gray-100 px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-200'
                                  onClick={() =>
                                    handleDeclineReservation(
                                      r.id,
                                      parseInt(String(r.scheduleId), 10),
                                    )
                                  }
                                >
                                  거절하기
                                </button>
                              </>
                            ) : selectedTab === '승인' ? (
                              <span className='rounded-lg bg-blue-50 px-[20px] py-[8px] text-sm font-semibold text-blue-500'>
                                예약 승인
                              </span>
                            ) : selectedTab === '거절' ? (
                              <span className='rounded-lg bg-red-50 px-[20px] py-[8px] text-sm font-semibold text-red-500'>
                                예약 거절
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='py-4 text-center text-gray-400'>예약 내역이 없습니다.</div>
                    )}
                  </div>
                </div>
                <button
                  className='mt-10 w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700'
                  onClick={closeModal}
                >
                  닫기
                </button>
              </div>
            )}
          </div>
          <div
            className='fixed inset-0 z-50 hidden items-end justify-center bg-black/40 md:flex lg:hidden'
            onClick={closeModal}
          >
            <div
              className='flex max-h-[80vh] w-full translate-y-0 flex-col items-center overflow-y-auto rounded-t-3xl bg-white p-[20px] shadow-xl transition-transform duration-300 md:w-full'
              style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.10)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className='absolute top-6 right-6 text-2xl font-bold text-gray-400 hover:text-gray-700'
                onClick={closeModal}
                aria-label='닫기'
                type='button'
              >
                ×
              </button>
              <div className='mb-4 w-full text-left text-lg font-bold'>
                {selectedDate.getFullYear().toString().slice(2)}년 {selectedDate.getMonth() + 1}월{' '}
                {selectedDate.getDate()}일
              </div>
              <div className='mb-4 flex w-full border-b'>
                {(['신청', '승인', '거절'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 border-b-2 py-2 text-center font-semibold transition-colors ${
                      selectedTab === tab
                        ? 'border-blue-500 text-blue-500'
                        : 'border-transparent text-gray-400'
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab} {reservationDetails.filter((r) => r.status === tabMap[tab]).length}
                  </button>
                ))}
              </div>
              <div className='flex w-full flex-col gap-4 md:flex-row md:gap-6'>
                <div className='mb-4 w-full md:mb-0 md:w-1/2'>
                  <label className='mb-2 block text-sm font-semibold'>예약 시간</label>
                  <select
                    className='h-[54px] w-full rounded border bg-white px-10 py-3 text-base'
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex w-full flex-col md:w-1/2'>
                  <label className='mb-2 block text-sm font-semibold'>예약 내역</label>
                  <div className='flex max-h-[260px] flex-col gap-4 overflow-y-auto'>
                    {filteredReservations.length > 0 ? (
                      filteredReservations.map((r, i) => (
                        <div
                          key={i}
                          className='flex h-[94px] max-h-[94px] min-h-[94px] flex-row items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-4 px-20 shadow-sm'
                        >
                          <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-500'>닉네임</span>
                              <span className='font-semibold text-gray-900'>{r.nickname}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-500'>인원</span>
                              <span className='font-semibold text-gray-900'>{r.headCount}명</span>
                            </div>
                          </div>
                          <div className='ml-4 flex flex-col items-end gap-2'>
                            {selectedTab === '신청' ? (
                              <>
                                <button
                                  className='flex-1 rounded-lg border border-gray-300 bg-white px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50'
                                  onClick={() =>
                                    handleApproveReservation(
                                      r.id,
                                      parseInt(String(r.scheduleId), 10),
                                    )
                                  }
                                >
                                  승인하기
                                </button>
                                <button
                                  className='mt-2 flex-1 rounded-lg border border-gray-300 bg-gray-100 px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-200'
                                  onClick={() =>
                                    handleDeclineReservation(
                                      r.id,
                                      parseInt(String(r.scheduleId), 10),
                                    )
                                  }
                                >
                                  거절하기
                                </button>
                              </>
                            ) : selectedTab === '승인' ? (
                              <span className='rounded-lg bg-blue-50 px-[20px] py-[8px] text-sm font-semibold text-blue-500'>
                                예약 승인
                              </span>
                            ) : selectedTab === '거절' ? (
                              <span className='rounded-lg bg-red-50 px-[20px] py-[8px] text-sm font-semibold text-red-500'>
                                예약 거절
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='py-4 text-center text-gray-400'>예약 내역이 없습니다.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
