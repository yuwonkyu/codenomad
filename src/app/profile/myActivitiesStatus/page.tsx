'use client';
import { useState, useContext, useEffect } from 'react';
import { ProfileMobileContext } from '../layout';
import ReservationCalendar from '@/components/common/ReservationCalendar';
// API 연결 시 사용할 import (현재는 주석 처리)
// import { getReservationDashboard, getReservedSchedule, getReservations, updateReservationStatus } from '@/lib/api/profile/myActivitiesStatus';

// 하드코딩 예약 데이터 (예시)
const reservationData: Record<string, { status: string; count: number; nickname: string }[]> = {
  '2025-07-01': [{ status: '완료', count: 10, nickname: '정만철' }],
  '2025-07-10': [
    { status: '예약', count: 12, nickname: '정만철' },
    { status: '예약', count: 8, nickname: '홍길동' },
    { status: '예약', count: 5, nickname: '김철수' },
    { status: '예약', count: 7, nickname: '이영희' },
    { status: '예약', count: 3, nickname: '박민수' },
    { status: '예약', count: 2, nickname: '최지우' },
    { status: '예약', count: 4, nickname: '한가람' },
    { status: '예약', count: 6, nickname: '서준호' },
    { status: '예약', count: 9, nickname: '이수진' },
    { status: '예약', count: 1, nickname: '정다은' },
    { status: '예약', count: 2, nickname: '김민재' },
  ],
  '2025-07-11': [
    { status: '완료', count: 3, nickname: '김철수' },
    { status: '예약', count: 2, nickname: '정만철' },
    { status: '승인', count: 8, nickname: '홍길동' },
    { status: '거절', count: 3, nickname: '김철수' },
  ],
  '2025-07-12': [
    { status: '승인', count: 10, nickname: '정만철' },
    { status: '거절', count: 3, nickname: '김철수' },
  ],
};

// API 연결 시 사용할 타입 정의 (현재는 주석 처리)
/*
interface ReservationData {
  id: number;
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
  count: number;
  nickname: string;
  scheduleId: number;
  timeSlot: string;
}

interface ScheduleData {
  id: number;
  timeSlot: string;
  reservations: ReservationData[];
}

interface DashboardData {
  [date: string]: ScheduleData[];
}
*/

export default function ReservationStatusPage() {
  const [date, setDate] = useState<Date | null>(new Date()); // 항상 오늘 날짜(현재 월)로 시작
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

  // API 연결 시 사용할 상태들 (현재는 주석 처리)
  /*
  const [apiReservationData, setApiReservationData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activityId, setActivityId] = useState<number>(1); // 실제로는 props나 context에서 받아올 예정
  */

  // 날짜를 yyyy-mm-dd 문자열로 변환
  const formatDate = (date: Date | null) => (date ? date.toISOString().split('T')[0] : '');

  // API 연결 시 사용할 함수들 (현재는 주석 처리)
  /*
  // 월별 예약 현황 데이터 로드
  const loadReservationDashboard = async (activityId: number, year: number, month: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservationDashboard(activityId);
      setApiReservationData(data);
    } catch (err) {
      setError('예약 현황을 불러오는데 실패했습니다.');
      console.error('Failed to load reservation dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // 날짜별 예약 스케줄 데이터 로드
  const loadReservedSchedule = async (activityId: number, date: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservedSchedule(activityId);
      // 데이터 처리 로직
      console.log('Reserved schedule data:', data);
    } catch (err) {
      setError('예약 스케줄을 불러오는데 실패했습니다.');
      console.error('Failed to load reserved schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  // 시간대별 예약 내역 데이터 로드
  const loadReservations = async (activityId: number, date: string, scheduleId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservations(activityId, date, scheduleId);
      // 데이터 처리 로직
      console.log('Reservations data:', data);
    } catch (err) {
      setError('예약 내역을 불러오는데 실패했습니다.');
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  // 예약 상태 변경 (승인/거절)
  const handleReservationStatusUpdate = async (
    activityId: number,
    reservationId: number,
    status: 'confirmed' | 'declined'
  ) => {
    try {
      setLoading(true);
      setError(null);
      await updateReservationStatus(activityId, reservationId, status);
      // 상태 변경 후 데이터 새로고침
      if (selectedDate) {
        const dateStr = formatDate(selectedDate);
        // 선택된 날짜의 데이터를 다시 로드
        // loadReservations(activityId, dateStr, selectedScheduleId);
      }
    } catch (err) {
      setError('예약 상태 변경에 실패했습니다.');
      console.error('Failed to update reservation status:', err);
    } finally {
      setLoading(false);
    }
  };
  */

  // API 연결 시 사용할 useEffect (현재는 주석 처리)
  /*
  // 컴포넌트 마운트 시 월별 데이터 로드
  useEffect(() => {
    if (date) {
      loadReservationDashboard(activityId, date.getFullYear(), date.getMonth() + 1);
    }
  }, [date, activityId]);

  // 선택된 날짜 변경 시 해당 날짜의 스케줄 데이터 로드
  useEffect(() => {
    if (selectedDate) {
      const dateStr = formatDate(selectedDate);
      loadReservedSchedule(activityId, dateStr);
    }
  }, [selectedDate, activityId]);
  */

  // 예약이 있는 날짜만 클릭 시 모달 오픈
  const handleDayClick = (clickedDate: Date, event?: React.MouseEvent) => {
    const key = formatDate(clickedDate);
    if (reservationData[key]) {
      setSelectedDate(clickedDate);
      setSelectedTab('신청');
      setSelectedTime('14:00 - 15:00');

      // API 연결 시 사용할 코드 (현재는 주석 처리)
      /*
      // 선택된 날짜의 스케줄 데이터 로드
      loadReservedSchedule(activityId, key);
      */

      // PC: 달력 셀 위치 저장
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

  // 탭/시간 변경 시 visibleCount 리셋
  useEffect(() => {
    setVisibleCount(2);
  }, [selectedTab, selectedTime, selectedDate]);

  // 모달 닫기
  const closeModal = () => setSelectedDate(null);

  // API 연결 시 사용할 예약 승인/거절 핸들러 (현재는 주석 처리)
  /*
  const handleApproveReservation = (reservationId: number) => {
    handleReservationStatusUpdate(activityId, reservationId, 'confirmed');
  };

  const handleDeclineReservation = (reservationId: number) => {
    handleReservationStatusUpdate(activityId, reservationId, 'declined');
  };
  */

  // 모달 예약 정보 (예시)
  const selectedKey = formatDate(selectedDate);
  const allReservations = reservationData[selectedKey] || [];
  // 예시: 예약 시간별로 그룹핑 (여기선 단일 시간)
  const timeOptions = ['14:00 - 15:00'];
  // 상태별 분류
  const tabMap = { 완료: '완료', 신청: '예약', 승인: '승인', 거절: '거절' };
  const filteredReservations = allReservations.filter((r) => r.status === tabMap[selectedTab]);

  // API 연결 시 사용할 로딩/에러 상태 렌더링 (현재는 주석 처리)
  /*
  if (loading) {
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
  */

  return (
    <section className='mx-auto w-full max-w-2xl'>
      {/* 상단 타이틀/설명 */}
      <div className='mb-30 w-full'>
        {/* 모바일: 아이콘+텍스트, 클릭 시 onCancel */}
        <button
          type='button'
          className='mb-1 flex items-center gap-2 md:hidden'
          onClick={mobileContext?.onCancel}
          style={{ cursor: 'pointer' }}
        >
          <img src='/icons/Vector.png' alt='vector' width={20} height={20} />
          <span className='text-xl font-bold'>예약 현황</span>
        </button>
        {/* PC/테블릿: 텍스트만 */}
        <h1 className='mb-1 hidden text-xl font-bold md:block'>예약 현황</h1>
        <p className='mb-4 text-sm text-gray-500'>
          내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.
        </p>
      </div>
      {/* 드롭다운 + 캘린더를 같은 컨테이너로 묶고, w-full/max-w-2xl 적용 */}
      <ReservationCalendar
        selectedDate={date}
        onDateChange={setDate}
        onDayClick={handleDayClick}
        reservationData={reservationData}
      />
      {/* 모바일 바텀시트 모달 (이미지 시안 스타일) */}
      {selectedDate && (
        <>
          {/* 모바일 모달 */}
          <div
            className='fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:hidden'
            onClick={closeModal}
          >
            <div
              className='flex max-h-[90vh] w-full translate-y-0 flex-col items-center overflow-y-auto rounded-t-3xl bg-white p-[20px] shadow-xl transition-transform duration-300'
              style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.10)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 상단 드래그바 */}
              <div className='mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200' />
              {/* 상단 날짜 */}
              <div className='mb-6 w-full text-center text-lg font-bold'>
                {selectedDate.getFullYear().toString().slice(2)}년 {selectedDate.getMonth() + 1}월{' '}
                {selectedDate.getDate()}일
              </div>
              {/* 탭 */}
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
                    {tab} {allReservations.filter((r) => r.status === tabMap[tab]).length}
                  </button>
                ))}
              </div>
              {/* 예약 시간 드롭다운 */}
              <div className='mb-6 w-full'>
                <label className='mb-2 block text-sm font-semibold'>예약 시간</label>
                <select className='h-[54px] w-full rounded-xl border bg-white px-10 text-base'>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {/* 예약 내역 */}
              <div className='mb-6 w-full'>
                <label className='mb-2 block text-sm font-semibold'>예약 내역</label>
                <div className='flex max-h-[260px] flex-col gap-4 overflow-y-auto'>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((r, i) => (
                      <div
                        key={i}
                        className='flex h-[94px] max-h-[94px] min-h-[94px] flex-row items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white px-20 shadow-sm'
                      >
                        {/* 왼쪽: 닉네임/인원 */}
                        <div className='flex flex-col gap-2'>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-500'>닉네임</span>
                            <span className='font-semibold text-gray-900'>{r.nickname}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-500'>인원</span>
                            <span className='font-semibold text-gray-900'>{r.count}명</span>
                          </div>
                        </div>
                        {/* 오른쪽: 신청탭은 버튼, 승인/거절탭은 뱃지 */}
                        <div className='ml-4 flex flex-col items-end gap-2'>
                          {selectedTab === '신청' ? (
                            <>
                              <button
                                className='flex-1 rounded-lg border border-gray-300 bg-white px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50'
                                onClick={() => {
                                  // API 연결 시 사용할 코드 (현재는 주석 처리)
                                  /*
                                  handleApproveReservation(r.id);
                                  */
                                  console.log('승인하기 클릭:', r.nickname);
                                }}
                              >
                                승인하기
                              </button>
                              <button
                                className='mt-2 flex-1 rounded-lg border border-gray-300 bg-gray-100 px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-200'
                                onClick={() => {
                                  // API 연결 시 사용할 코드 (현재는 주석 처리)
                                  /*
                                  handleDeclineReservation(r.id);
                                  */
                                  console.log('거절하기 클릭:', r.nickname);
                                }}
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
              {/* 닫기 버튼 */}
              <button
                className='mt-10 w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700'
                onClick={closeModal}
              >
                닫기
              </button>
            </div>
          </div>
          {/* PC 모달: 달력 셀 옆에 카드형 */}
          <div className='hidden lg:block'>
            {calendarCellRect && (
              <div
                className='fixed z-50 flex flex-col items-center rounded-3xl bg-white p-[20px] shadow-xl transition-transform duration-300'
                style={{
                  top: `${calendarCellRect.top + window.scrollY}px`,
                  left: `${calendarCellRect.left + calendarCellRect.width + 16}px`, // 16px 오른쪽 여백
                  width: '420px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                }}
              >
                {/* 닫기(X) 버튼 */}
                <button
                  className='absolute top-6 right-6 text-2xl font-bold text-gray-400 hover:text-gray-700'
                  onClick={closeModal}
                  aria-label='닫기'
                  type='button'
                >
                  ×
                </button>
                {/* 상단 날짜 */}
                <div className='mb-4 w-full text-left text-lg font-bold'>
                  {selectedDate.getFullYear().toString().slice(2)}년 {selectedDate.getMonth() + 1}월{' '}
                  {selectedDate.getDate()}일
                </div>
                {/* 탭 */}
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
                      {tab} {allReservations.filter((r) => r.status === tabMap[tab]).length}
                    </button>
                  ))}
                </div>
                {/* 예약 시간 드롭다운 */}
                <div className='mb-4 w-full'>
                  <label className='mb-2 block text-sm font-semibold'>예약 시간</label>
                  <select className='h-[54px] w-full rounded border bg-white px-10 py-3 text-base'>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                {/* 예약 내역 */}
                <div className='mb-4 w-full'>
                  <label className='mb-2 block text-sm font-semibold'>예약 내역</label>
                  <div className='flex max-h-[260px] flex-col gap-4 overflow-y-auto'>
                    {filteredReservations.length > 0 ? (
                      filteredReservations.map((r, i) => (
                        <div
                          key={i}
                          className='flex h-[94px] max-h-[94px] min-h-[94px] flex-row items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-4 px-20 shadow-sm'
                        >
                          {/* 왼쪽: 닉네임/인원 */}
                          <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-500'>닉네임</span>
                              <span className='font-semibold text-gray-900'>{r.nickname}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-500'>인원</span>
                              <span className='font-semibold text-gray-900'>{r.count}명</span>
                            </div>
                          </div>
                          {/* 오른쪽: 신청탭은 버튼, 승인/거절탭은 뱃지 */}
                          <div className='ml-4 flex flex-col items-end gap-2'>
                            {selectedTab === '신청' ? (
                              <>
                                <button
                                  className='flex-1 rounded-lg border border-gray-300 bg-white px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50'
                                  onClick={() => {
                                    // API 연결 시 사용할 코드 (현재는 주석 처리)
                                    /*
                                    handleApproveReservation(r.id);
                                    */
                                    console.log('승인하기 클릭:', r.nickname);
                                  }}
                                >
                                  승인하기
                                </button>
                                <button
                                  className='mt-2 flex-1 rounded-lg border border-gray-300 bg-gray-100 px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-200'
                                  onClick={() => {
                                    // API 연결 시 사용할 코드 (현재는 주석 처리)
                                    /*
                                    handleDeclineReservation(r.id);
                                    */
                                    console.log('거절하기 클릭:', r.nickname);
                                  }}
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
                {/* 닫기 버튼 */}
                <button
                  className='mt-10 w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700'
                  onClick={closeModal}
                >
                  닫기
                </button>
              </div>
            )}
          </div>
          {/* 테블릿 모달: 중앙/하단에 꽉 찬 스타일 */}
          <div
            className='fixed inset-0 z-50 hidden items-end justify-center bg-black/40 md:flex lg:hidden'
            onClick={closeModal}
          >
            <div
              className='flex max-h-[80vh] w-full translate-y-0 flex-col items-center overflow-y-auto rounded-t-3xl bg-white p-[20px] shadow-xl transition-transform duration-300 md:w-full'
              style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.10)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기(X) 버튼 */}
              <button
                className='absolute top-6 right-6 text-2xl font-bold text-gray-400 hover:text-gray-700'
                onClick={closeModal}
                aria-label='닫기'
                type='button'
              >
                ×
              </button>
              {/* 상단 날짜 */}
              <div className='mb-4 w-full text-left text-lg font-bold'>
                {selectedDate.getFullYear().toString().slice(2)}년 {selectedDate.getMonth() + 1}월{' '}
                {selectedDate.getDate()}일
              </div>
              {/* 탭 */}
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
                    {tab} {allReservations.filter((r) => r.status === tabMap[tab]).length}
                  </button>
                ))}
              </div>
              {/* 예약 시간 + 예약 내역: 테블릿에서 가로 배치 */}
              <div className='flex w-full flex-col gap-4 md:flex-row md:gap-6'>
                {/* 예약 시간 */}
                <div className='mb-4 w-full md:mb-0 md:w-1/2'>
                  <label className='mb-2 block text-sm font-semibold'>예약 시간</label>
                  <select className='h-[54px] w-full rounded border bg-white px-10 py-3 text-base'>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                {/* 예약 내역 */}
                <div className='flex w-full flex-col md:w-1/2'>
                  <label className='mb-2 block text-sm font-semibold'>예약 내역</label>
                  <div className='flex max-h-[260px] flex-col gap-4 overflow-y-auto'>
                    {filteredReservations.length > 0 ? (
                      filteredReservations.map((r, i) => (
                        <div
                          key={i}
                          className='flex h-[94px] max-h-[94px] min-h-[94px] flex-row items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-4 px-20 shadow-sm'
                        >
                          {/* 왼쪽: 닉네임/인원 */}
                          <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-500'>닉네임</span>
                              <span className='font-semibold text-gray-900'>{r.nickname}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-500'>인원</span>
                              <span className='font-semibold text-gray-900'>{r.count}명</span>
                            </div>
                          </div>
                          {/* 오른쪽: 신청탭은 버튼, 승인/거절탭은 뱃지 */}
                          <div className='ml-4 flex flex-col items-end gap-2'>
                            {selectedTab === '신청' ? (
                              <>
                                <button
                                  className='flex-1 rounded-lg border border-gray-300 bg-white px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50'
                                  onClick={() => {
                                    // API 연결 시 사용할 코드 (현재는 주석 처리)
                                    /*
                                    handleApproveReservation(r.id);
                                    */
                                    console.log('승인하기 클릭:', r.nickname);
                                  }}
                                >
                                  승인하기
                                </button>
                                <button
                                  className='mt-2 flex-1 rounded-lg border border-gray-300 bg-gray-100 px-[20px] py-[8px] text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-200'
                                  onClick={() => {
                                    // API 연결 시 사용할 코드 (현재는 주석 처리)
                                    /*
                                    handleDeclineReservation(r.id);
                                    */
                                    console.log('거절하기 클릭:', r.nickname);
                                  }}
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
