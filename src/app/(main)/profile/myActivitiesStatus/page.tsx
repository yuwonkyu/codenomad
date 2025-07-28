'use client';
import { useState, useContext, useEffect, MouseEvent } from 'react';
// 🔗 모바일 Context: 메뉴로 돌아가기 기능
import { ProfileMobileContext } from '@/app/(main)/profile/layout';
import ReservationCalendar from '@/components/common/ReservationCalendar';
import {
  getReservationDashboard,
  getReservedSchedule,
  getReservations,
  updateReservationStatus,
} from '@/lib/api/profile/myActivitiesStatus';
import { getMyActivities, MyActivity } from '@/lib/api/profile/myActivities';
// 🆕 공통 컴포넌트 import (파일명 변경: index.ts → components.ts)
import {
  MobilePageHeader,
  LoadingSpinner,
  ErrorMessage,
} from '@/components/profile/common/components';
// 🎯 새로 분리한 모달 컴포넌트 import
import ReservationModal from '@/components/profile/reservationStatus/ReservationModal';
// 🎣 커스텀 훅 import (파일명 변경: index.ts → hooks.ts)
import { useCalendarData } from '@/hooks/profile/hooks';

// 📋 예약 데이터 타입 정의
interface ReservationData {
  id: number;
  status: 'pending' | 'confirmed' | 'declined'; // 예약 상태
  headCount: number; // 예약 인원
  nickname: string; // 예약자 닉네임
  scheduleId: number | string; // 스케줄 ID
  timeSlot: string; // 시간대 (예: "14:00 - 15:00")
  date: string; // 예약 날짜
  startTime: string; // 시작 시간
  endTime: string; // 종료 시간
}

// 📅 스케줄 데이터 타입 정의 (특정 시간대의 모든 예약 포함)
interface ScheduleData {
  id: number | string;
  scheduleId?: number | string;
  timeSlot: string; // 시간대 표시용
  startTime: string;
  endTime: string;
  reservations: ReservationData[]; // 해당 시간대의 모든 예약들
  headCount?: number;
}

// 🗓️ 대시보드 데이터 타입 정의 (날짜별로 스케줄들을 그룹화)
interface DashboardData {
  [date: string]: ScheduleData[]; // "2024-01-15": [스케줄1, 스케줄2, ...]
}

export default function ReservationStatusPage() {
  // 📅 날짜 관련 상태
  const [date, setDate] = useState<Date | null>(new Date()); // 캘린더에서 선택된 월
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 모달에서 보여줄 특정 날짜

  // 🎯 모달 내 필터링 상태
  const [selectedTab, setSelectedTab] = useState<'신청' | '승인' | '거절'>('신청'); // 모달 탭
  const [selectedTime, setSelectedTime] = useState('14:00 - 15:00'); // 선택된 시간대
  const [, setVisibleCount] = useState(2); // 표시할 예약 개수 (미사용)

  // 🔗 모바일 Context 연결: 뒤로가기 기능
  const mobileContext = useContext(ProfileMobileContext);

  // 🎨 모달 위치 계산을 위한 상태
  const [calendarCellRect, setCalendarCellRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    modalTop?: number; // 계산된 모달 위치
    modalLeft?: number;
  } | null>(null);

  // 📊 데이터 상태들
  const [apiReservationData, setApiReservationData] = useState<DashboardData>({}); // 캘린더용 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [myActivities, setMyActivities] = useState<MyActivity[]>([]); // 내 체험 목록
  const [selectedActivity, setSelectedActivity] = useState<MyActivity | null>(null); // 선택된 체험
  const [reservationDetails, setReservationDetails] = useState<ReservationData[]>([]); // 모달에 표시할 예약 상세
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleData[]>([]); // 선택된 날짜의 시간대 목록
  const [filteredReservations, setFilteredReservations] = useState<ReservationData[]>([]); // 탭별 필터링된 예약

  // 🛠️ 유틸리티 함수: Date 객체를 YYYY-MM-DD 문자열로 변환
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    // 로컬 시간대 기준으로 YYYY-MM-DD 형식 생성
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 🎣 캘린더 데이터 변환 훅 사용
  const calendarReservationData = useCalendarData(apiReservationData);

  // 🗓️ 캘린더용 예약 대시보드 데이터 로드 (월별 예약 현황)
  // 역할: 선택된 월의 모든 날짜별 예약 개요 정보를 가져와서 캘린더에 뱃지 표시
  const loadReservationDashboard = async (activityId: number, year: number, month: number) => {
    try {
      setLoading(true);
      setError(null);

      // 📅 API 요청을 위한 월 형식 맞추기 (01, 02, ... 12)
      const paddedMonth = month.toString().padStart(2, '0');
      const responseData = await getReservationDashboard(activityId, String(year), paddedMonth);

      // 🔄 API 응답을 캘린더가 이해할 수 있는 형태로 변환
      const dashboardData: DashboardData = {};

      if (Array.isArray(responseData)) {
        responseData.forEach((item: any) => {
          if (item.date && item.reservations) {
            // 📊 이미 집계된 데이터를 그대로 사용 (pending, confirmed, declined 개수)
            dashboardData[item.date] = [
              {
                id: 'dashboard', // 임시 ID (실제 스케줄 ID 아님)
                timeSlot: '시간 미정', // 대시보드에서는 구체적 시간 정보 없음
                startTime: '시간',
                endTime: '미정',
                reservations: [item], // 📈 집계 데이터 보존
                headCount: 0,
              },
            ];
          }
        });
      }

      setApiReservationData(dashboardData);

      // 🎯 추가 작업: 각 날짜별로 정확한 상태 정보 로드 (fallback 포함)
      // getReservationDashboard는 개요만 제공하므로, 정확한 뱃지를 위해 추가 API 호출
      await loadStatusBadgesWithReservedSchedule(
        activityId,
        Object.keys(dashboardData),
        dashboardData,
      );
    } catch (err) {
      setError('예약 현황을 불러오는데 실패했습니다.');
      console.error('Failed to load reservation dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✨ 핵심 함수: 각 날짜별 정확한 예약 상태 뱃지 정보 로드 (복잡한 fallback 로직 포함)
  // 역할: getReservedSchedule API로 정확한 상태를 가져오되, 실패시 dashboardData를 fallback으로 사용
  // 추가 기능: 시간 경과에 따른 승인→완료 상태 자동 변환
  const loadStatusBadgesWithReservedSchedule = async (
    activityId: number,
    dates: string[], // 처리할 날짜 목록 (예: ["2024-01-15", "2024-01-16"])
    dashboardData: DashboardData, // fallback용 대시보드 데이터
  ) => {
    try {
      // 📊 날짜별 상태 집계를 저장할 객체
      const statusBadgeData: { [date: string]: { [status: string]: number } } = {};

      // 🔄 각 날짜별로 상태 정보 처리
      for (const date of dates) {
        try {
          // 🎯 주 API 호출: 해당 날짜의 상세 스케줄 정보 가져오기
          const schedules = await getReservedSchedule(activityId, date);

          // 📈 날짜별 상태 카운트 초기화
          const dateCounts = { pending: 0, confirmed: 0, declined: 0, completed: 0 };

          // 🔄 FALLBACK 로직 1: getReservedSchedule이 빈 배열이면 dashboardData 사용
          if (schedules.length === 0) {
            // 📋 fallback 데이터에서 해당 날짜 정보 추출
            const fallbackData = dashboardData[date];
            if (fallbackData && fallbackData.length > 0) {
              // 🔍 fallback 데이터에서 상태 정보 추출 (중첩된 구조 처리)
              fallbackData.forEach((schedule) => {
                if (schedule.reservations && Array.isArray(schedule.reservations)) {
                  (schedule.reservations as any[]).forEach((reservationGroup) => {
                    if (
                      reservationGroup.reservations &&
                      typeof reservationGroup.reservations === 'object'
                    ) {
                      const counts = reservationGroup.reservations;
                      dateCounts.pending += counts.pending || 0;
                      dateCounts.confirmed += counts.confirmed || 0;
                      dateCounts.declined += counts.declined || 0;
                      dateCounts.completed += counts.completed || 0; // fallback에서 completed 필드도 처리
                    }
                  });
                }
              });
            }
          } else {
            // ✅ 정상 응답인 경우: API 응답에서 상태 집계
            schedules.forEach((schedule: any) => {
              if (schedule.count) {
                dateCounts.pending += schedule.count.pending || 0;
                dateCounts.confirmed += schedule.count.confirmed || 0;
                dateCounts.declined += schedule.count.declined || 0;
                // completed는 API에 없을 수 있으므로 기본값 0
              }
            });
          }

          // 🕐 시간 기반 상태 변환 로직: 승인된 예약이 시간 지났으면 완료로 변환
          const now = new Date();

          // 🔄 시간 체크를 위한 데이터 소스 선택 (API 응답 우선, 없으면 fallback)
          const schedulesToCheck = schedules.length > 0 ? schedules : dashboardData[date] || [];

          schedulesToCheck.forEach((schedule: any) => {
            // 📊 confirmed 예약이 있는지 확인 (API 응답과 fallback 구조가 다를 수 있음)
            const hasConfirmed =
              schedules.length > 0
                ? schedule.count && schedule.count.confirmed > 0 // API 응답 구조
                : dateCounts.confirmed > 0; // fallback 구조

            if (hasConfirmed) {
              // ⏰ 예약 종료 시간 계산
              const endTime = schedule.endTime || '23:59'; // fallback의 경우 endTime이 없을 수 있음
              const scheduleEndDateTime = new Date(`${date} ${endTime}`);

              // 🔄 현재 시간이 예약 종료 시간을 지났으면 완료 처리
              if (now > scheduleEndDateTime) {
                const confirmedCount =
                  schedules.length > 0 ? schedule.count.confirmed || 0 : dateCounts.confirmed;

                // 📈 confirmed에서 completed로 상태 이동
                dateCounts.confirmed -= confirmedCount;
                dateCounts.completed += confirmedCount;
              }
            }
          });

          statusBadgeData[date] = dateCounts;
        } catch (err) {
          console.warn(`Failed to load status for ${date}:`, err);
        }
      }

      // 🌐 전역 변수에 저장 (기존 방식과 호환성 유지)
      // 캘린더 컴포넌트에서 이 데이터를 참조하여 뱃지 표시
      (window as any).statusBadgeData = statusBadgeData;

      // 🔄 캘린더 리렌더링 트리거
      if (Object.keys(statusBadgeData).length > 0) {
        setApiReservationData((prev) => ({ ...prev }));
      }
    } catch (err) {
      console.error('Failed to load status badges:', err);
    }
  };

  // 📅 특정 날짜의 시간대별 스케줄 정보 로드 (모달 표시용)
  // 역할: 선택된 날짜의 모든 시간대와 각 시간대별 예약 정보 가져오기
  // fallback: API 응답이 유효하지 않으면 캘린더 데이터를 대체 사용
  const loadReservedSchedule = async (activityId: number, date: string) => {
    try {
      setLoading(true);
      setError(null);

      // 🎯 주 API 호출: 특정 날짜의 스케줄 목록 가져오기
      const schedulesFromApi = await getReservedSchedule(activityId, date);

      // 🔄 API 응답을 UI에서 사용할 형태로 변환 (timeSlot 필드 생성)
      const transformedSchedules = schedulesFromApi.map((s: any) => ({
        ...s,
        timeSlot: `${s.startTime} - ${s.endTime}`, // "14:00 - 15:00" 형태로 변환
      }));

      // 🔄 FALLBACK 로직 2: API 응답이 비어있거나 timeSlot이 제대로 생성되지 않은 경우
      if (
        transformedSchedules.length === 0 ||
        transformedSchedules[0].timeSlot.includes('undefined') // startTime 또는 endTime이 undefined인 경우
      ) {
        // 📋 캘린더 데이터에서 해당 날짜의 스케줄 정보 생성
        const calendarData = apiReservationData[date];
        if (calendarData && calendarData.length > 0) {
          // 🛠️ fallback 스케줄 생성: 캘린더 데이터를 모달용 형태로 변환
          const fallbackSchedules = calendarData.map((schedule) => ({
            id: schedule.id,
            scheduleId: schedule.id,
            timeSlot: schedule.timeSlot || '시간 미정', // 안전한 기본값 제공
            startTime: schedule.startTime || '시간',
            endTime: schedule.endTime || '미정',
            reservations: schedule.reservations || [], // 🔗 기존 예약 정보 유지
          }));
          setScheduleDetails(fallbackSchedules);
        } else {
          // 📭 fallback 데이터도 없는 경우: 빈 배열로 설정
          setScheduleDetails([]);
        }
      } else {
        // ✅ 정상 API 응답인 경우: 변환된 스케줄 사용
        setScheduleDetails(transformedSchedules);
      }
    } catch (err) {
      setError('예약 스케줄을 불러오는데 실패했습니다.');
      console.error('Failed to load reserved schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReservations = async (activityId: number, scheduleId: number | string) => {
    try {
      // 🔄 'dashboard' 같은 임시 ID는 무시
      if (
        scheduleId === 'dashboard' ||
        scheduleId === '시간' ||
        String(scheduleId).includes('undefined')
      ) {
        setReservationDetails([]);
        return;
      }

      const numericScheduleId = parseInt(String(scheduleId), 10);
      if (isNaN(numericScheduleId)) {
        console.error('Invalid scheduleId:', scheduleId);
        setError('잘못된 스케줄 ID입니다.');
        return;
      }

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

      // selectedTime과 일치하는 스케줄 찾기
      const schedule = scheduleDetails.find((s) => s.timeSlot === selectedTime);

      if (schedule && (schedule.scheduleId !== undefined || schedule.id !== undefined)) {
        const scheduleId = schedule.scheduleId || schedule.id;
        loadReservations(selectedActivity.id, scheduleId);
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

      // 🎯 캘린더 영역 내에서 모달 위치 계산
      if (event?.target) {
        const clickedElement = event.target as HTMLElement;
        const cellRect = clickedElement.getBoundingClientRect();

        // 캘린더 컨테이너 찾기 (가장 가까운 캘린더 부모 요소)
        const calendarContainer = clickedElement.closest('.react-calendar') as HTMLElement;
        if (!calendarContainer) return;

        const calendarRect = calendarContainer.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 모달 크기
        const modalWidth = 420;
        const modalHeight = 600;

        let modalLeft = cellRect.left + cellRect.width + 16; // 기본: 오른쪽
        let modalTop = cellRect.top + window.scrollY;

        // 🔄 오른쪽으로 나가는 경우: 왼쪽에 표시
        if (modalLeft + modalWidth > calendarRect.right) {
          modalLeft = cellRect.left - modalWidth - 16;
        }

        // 🔄 왼쪽으로도 나가는 경우: 캘린더 내부로 조정
        if (modalLeft < calendarRect.left) {
          modalLeft = calendarRect.left + 16;
        }

        // 🔄 아래쪽으로 나가는 경우: 위로 조정
        if (modalTop + modalHeight > calendarRect.bottom + window.scrollY) {
          modalTop = calendarRect.bottom + window.scrollY - modalHeight - 16;
        }

        // 🔄 위쪽으로 나가는 경우: 아래로 조정
        if (modalTop < calendarRect.top + window.scrollY) {
          modalTop = calendarRect.top + window.scrollY + 16;
        }

        // 🔄 그래도 화면 밖으로 나가는 경우: 최종 보정
        if (modalLeft + modalWidth > viewportWidth) {
          modalLeft = viewportWidth - modalWidth - 16;
        }
        if (modalLeft < 16) {
          modalLeft = 16;
        }
        if (modalTop + modalHeight > viewportHeight + window.scrollY) {
          modalTop = viewportHeight + window.scrollY - modalHeight - 16;
        }
        if (modalTop < window.scrollY + 16) {
          modalTop = window.scrollY + 16;
        }

        setCalendarCellRect({
          top: cellRect.top,
          left: cellRect.left,
          width: cellRect.width,
          height: cellRect.height,
          modalTop: modalTop,
          modalLeft: modalLeft,
        });
      }
    } else {
      // 🎯 예약이 없는 날짜 클릭시 모달 닫기
      closeModal();
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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className='mx-auto w-full max-w-2xl'>
      {/* 🆕 공통 MobilePageHeader 컴포넌트 사용 */}
      <MobilePageHeader
        title='예약 현황'
        description='내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.'
      />

      <ReservationCalendar
        selectedDate={date}
        onDateChange={setDate}
        onDayClick={handleDayClick}
        onMonthChange={(newDate) => setDate(newDate)}
        reservationData={calendarReservationData}
        experiences={myActivities.map((act) => ({ ...act, id: act.id.toString() }))}
        selectedExperienceId={selectedActivity?.id.toString()}
        onExperienceChange={(experienceId) => {
          const newSelected = myActivities.find((act) => act.id.toString() === experienceId);
          if (newSelected) {
            setSelectedActivity(newSelected);
          }
        }}
      />
      {selectedDate && calendarCellRect && (
        <ReservationModal
          selectedDate={selectedDate}
          calendarCellRect={calendarCellRect}
          selectedTab={selectedTab}
          selectedTime={selectedTime}
          timeOptions={timeOptions}
          reservationDetails={reservationDetails}
          filteredReservations={filteredReservations}
          onTabChange={setSelectedTab}
          onTimeChange={setSelectedTime}
          onClose={closeModal}
          onApprove={handleApproveReservation}
          onDecline={handleDeclineReservation}
        />
      )}
    </section>
  );
}
