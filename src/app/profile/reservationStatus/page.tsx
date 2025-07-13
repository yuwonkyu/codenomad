'use client';
import { useState, useContext, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ProfileMobileContext } from '../layout';
// import axios from '@/lib/api/axios'; // axios.ts가 default export라면 그대로, 아니면 { axios }로 변경 필요

// 예약 상태 뱃지 컴포넌트
function StatusBadge({ status, count }: { status: string; count: number }) {
  const colorMap: Record<string, string> = {
    완료: 'bg-gray-100 text-gray-500',
    예약: 'bg-blue-100 text-blue-500',
    승인: 'bg-yellow-100 text-yellow-600',
    거절: 'bg-red-100 text-red-500',
  };
  return (
    <span
      className={`w-fill h-21 px-2 py-0.5 rounded text-xs font-semibold mr-1 mb-3 ${
        colorMap[status] || ''
      }`}
    >
      {status} {count}
    </span>
  );
}

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

// API 연동 예시 (axios)
// import axios from '@/lib/api/axios'; // 만약 default export가 아니면 { axios }로 변경
// async function fetchReservations() {
//   const res = await axios.get('/api/reservations');
//   return res.data;
// }

export default function ReservationStatusPage() {
  const [date, setDate] = useState<Date | null>(new Date()); // 항상 오늘 날짜(현재 월)로 시작
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState<'신청' | '승인' | '거절'>('신청');
  const [selectedTime, setSelectedTime] = useState('14:00 - 15:00');
  const [visibleCount, setVisibleCount] = useState(2);
  const mobileContext = useContext(ProfileMobileContext);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [calendarCellRect, setCalendarCellRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // 날짜를 yyyy-mm-dd 문자열로 변환
  const formatDate = (date: Date | null) => (date ? date.toISOString().split('T')[0] : '');

  // 예약이 있는 날짜만 클릭 시 모달 오픈
  const handleDayClick = (clickedDate: Date, event?: React.MouseEvent) => {
    const key = formatDate(clickedDate);
    if (reservationData[key]) {
      setSelectedDate(clickedDate);
      setSelectedTab('신청');
      setSelectedTime('14:00 - 15:00');
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

  // 모달 예약 정보 (예시)
  const selectedKey = formatDate(selectedDate);
  const allReservations = reservationData[selectedKey] || [];
  // 예시: 예약 시간별로 그룹핑 (여기선 단일 시간)
  const timeOptions = ['14:00 - 15:00'];
  // 상태별 분류
  const tabMap = { 완료: '완료', 신청: '예약', 승인: '승인', 거절: '거절' };
  const filteredReservations = allReservations.filter((r) => r.status === tabMap[selectedTab]);

  return (
    <section className='w-full max-w-2xl mx-auto'>
      {/* 상단 타이틀/설명 */}
      <div className='w-full mb-30'>
        {/* 모바일: 아이콘+텍스트, 클릭 시 onCancel */}
        <button
          type='button'
          className='flex items-center gap-2 mb-1 block md:hidden'
          onClick={mobileContext?.onCancel}
          style={{ cursor: 'pointer' }}
        >
          <img src='/icons/Vector.png' alt='vector' width={20} height={20} />
          <span className='text-xl font-bold'>예약 현황</span>
        </button>
        {/* PC/테블릿: 텍스트만 */}
        <h1 className='text-xl font-bold mb-1 hidden md:block'>예약 현황</h1>
        <p className='text-gray-500 text-sm mb-4'>
          내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.
        </p>
      </div>
      {/* 드롭다운 + 캘린더를 같은 컨테이너로 묶고, w-full/max-w-2xl 적용 */}
      <div className='bg-white rounded-2xl shadow-custom-5 p-4 md:p-8 w-full max-w-2xl mx-auto flex flex-col gap-4'>
        <select className='w-full h-54 border rounded px-10 py-2 shadow-custom-5 mb-20'>
          <option>함께 배우면 즐거운 스트릿 댄스</option>
          {/* 추후 체험 목록 동적 렌더링 */}
        </select>
        <Calendar
          value={date}
          onChange={(value) => setDate(value as Date)}
          calendarType='gregory'
          className='w-full'
          formatShortWeekday={(_, date) => {
            const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return week[date.getDay()];
          }}
          formatDay={() => ''}
          tileContent={({ date }: { date: Date }) => {
            const key = formatDate(date);
            const reservations = reservationData[key] || [];
            const hasStatus = reservations.length > 0;
            const statusList = ['예약', '승인', '거절', '완료'];
            return (
              <div className='flex flex-col items-center mt-1 calendar-badge-scroll'>
                <div className='flex items-center justify-center'>
                  <span>{date.getDate()}</span>
                  {hasStatus && <div className='calendar-dot ml-5' />}
                </div>
                {statusList.map((status) => {
                  const count = reservations.filter((r) => r.status === status).length;
                  return count > 0 ? (
                    <StatusBadge key={status} status={status} count={count} />
                  ) : null;
                })}
              </div>
            );
          }}
          prev2Label={null}
          next2Label={null}
          onClickDay={(date, event) => handleDayClick(date, event)}
        />
      </div>
      {/* 모바일 바텀시트 모달 (이미지 시안 스타일) */}
      {selectedDate && (
        <>
          {/* 모바일 모달 */}
          <div
            className='fixed inset-0 z-50 flex items-end justify-center bg-black/40 block md:hidden'
            onClick={closeModal}
          >
            <div
              className='w-full rounded-t-3xl bg-white max-h-[90vh] overflow-y-auto shadow-xl transition-transform duration-300 translate-y-0 flex flex-col items-center p-[20px]'
              style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.10)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 상단 드래그바 */}
              <div className='w-12 h-1.5 bg-gray-200 rounded-full mb-4 mx-auto' />
              {/* 상단 날짜 */}
              <div className='text-lg font-bold mb-6 w-full text-center'>
                {selectedDate.getFullYear().toString().slice(2)}년 {selectedDate.getMonth() + 1}월{' '}
                {selectedDate.getDate()}일
              </div>
              {/* 탭 */}
              <div className='flex border-b mb-6 w-full'>
                {(['신청', '승인', '거절'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-2 text-center font-semibold border-b-2 transition-colors ${
                      selectedTab === tab
                        ? 'text-blue-500 border-blue-500'
                        : 'text-gray-400 border-transparent'
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab} {allReservations.filter((r) => r.status === tabMap[tab]).length}
                  </button>
                ))}
              </div>
              {/* 예약 시간 드롭다운 */}
              <div className='w-full mb-6'>
                <label className='block text-sm font-semibold mb-2'>예약 시간</label>
                <select className='w-full border rounded-xl text-base bg-white h-[54px] px-10'>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {/* 예약 내역 */}
              <div className='w-full mb-6'>
                <label className='block text-sm font-semibold mb-2'>예약 내역</label>
                <div className='flex flex-col gap-4 max-h-[260px] overflow-y-auto'>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((r, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-xl flex flex-row justify-between items-center border border-gray-200 shadow-sm h-[94px] min-h-[94px] max-h-[94px] overflow-hidden px-20'
                      >
                        {/* 왼쪽: 닉네임/인원 */}
                        <div className='flex flex-col gap-2'>
                          <div className='flex gap-2 items-center'>
                            <span className='text-gray-500 text-sm'>닉네임</span>
                            <span className='text-gray-900 font-semibold'>{r.nickname}</span>
                          </div>
                          <div className='flex gap-2 items-center'>
                            <span className='text-gray-500 text-sm'>인원</span>
                            <span className='text-gray-900 font-semibold'>{r.count}명</span>
                          </div>
                        </div>
                        {/* 오른쪽: 신청탭은 버튼, 승인/거절탭은 뱃지 */}
                        <div className='flex flex-col gap-2 ml-4 items-end'>
                          {selectedTab === '신청' ? (
                            <>
                              <button className='flex-1 px-[20px] py-[8px] rounded-lg border text-gray-500 bg-white border-gray-300 font-semibold text-sm hover:bg-gray-50 transition-colors'>
                                승인하기
                              </button>
                              <button className='flex-1 px-[20px] py-[8px] rounded-lg border text-gray-500 bg-gray-100 border-gray-300 font-semibold text-sm hover:bg-gray-200 transition-colors mt-2'>
                                거절하기
                              </button>
                            </>
                          ) : selectedTab === '승인' ? (
                            <span className='px-[20px] py-[8px] rounded-lg bg-blue-50 text-blue-500 font-semibold text-sm'>
                              예약 승인
                            </span>
                          ) : selectedTab === '거절' ? (
                            <span className='px-[20px] py-[8px] rounded-lg bg-red-50 text-red-500 font-semibold text-sm'>
                              예약 거절
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-gray-400 text-center py-4'>예약 내역이 없습니다.</div>
                  )}
                </div>
              </div>
              {/* 닫기 버튼 */}
              <button
                className='mt-10 w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold'
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
                className='fixed z-50 rounded-3xl bg-white shadow-xl flex flex-col items-center transition-transform duration-300 p-[20px]'
                style={{
                  top: `${calendarCellRect.top + window.scrollY}px`,
                  left: `${calendarCellRect.left + calendarCellRect.width + 16}px`, // 16px 오른쪽 여백
                  width: '420px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                }}
              >
                {/* 닫기(X) 버튼 */}
                <button
                  className='absolute right-6 top-6 text-gray-400 hover:text-gray-700 text-2xl font-bold'
                  onClick={closeModal}
                  aria-label='닫기'
                  type='button'
                >
                  ×
                </button>
                {/* 상단 날짜 */}
                <div className='text-lg font-bold mb-4 w-full text-left'>
                  {selectedDate.getFullYear().toString().slice(2)}년 {selectedDate.getMonth() + 1}월{' '}
                  {selectedDate.getDate()}일
                </div>
                {/* 탭 */}
                <div className='flex border-b mb-4 w-full'>
                  {(['신청', '승인', '거절'] as const).map((tab) => (
                    <button
                      key={tab}
                      className={`flex-1 py-2 text-center font-semibold border-b-2 transition-colors ${
                        selectedTab === tab
                          ? 'text-blue-500 border-blue-500'
                          : 'text-gray-400 border-transparent'
                      }`}
                      onClick={() => setSelectedTab(tab)}
                    >
                      {tab} {allReservations.filter((r) => r.status === tabMap[tab]).length}
                    </button>
                  ))}
                </div>
                {/* 예약 시간 드롭다운 */}
                <div className='w-full mb-4'>
                  <label className='block text-sm font-semibold mb-2'>예약 시간</label>
                  <select className='w-full border rounded px-10 py-3 text-base bg-white h-[54px]'>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                {/* 예약 내역 */}
                <div className='w-full mb-4'>
                  <label className='block text-sm font-semibold mb-2'>예약 내역</label>
                  <div className='flex flex-col gap-4 max-h-[260px] overflow-y-auto'>
                    {filteredReservations.length > 0 ? (
                      filteredReservations.map((r, i) => (
                        <div
                          key={i}
                          className='bg-white rounded-xl p-4 flex flex-row justify-between items-center border border-gray-200 shadow-sm h-[94px] min-h-[94px] max-h-[94px] overflow-hidden px-20'
                        >
                          {/* 왼쪽: 닉네임/인원 */}
                          <div className='flex flex-col gap-2'>
                            <div className='flex gap-2 items-center'>
                              <span className='text-gray-500 text-sm'>닉네임</span>
                              <span className='text-gray-900 font-semibold'>{r.nickname}</span>
                            </div>
                            <div className='flex gap-2 items-center'>
                              <span className='text-gray-500 text-sm'>인원</span>
                              <span className='text-gray-900 font-semibold'>{r.count}명</span>
                            </div>
                          </div>
                          {/* 오른쪽: 신청탭은 버튼, 승인/거절탭은 뱃지 */}
                          <div className='flex flex-col gap-2 ml-4 items-end'>
                            {selectedTab === '신청' ? (
                              <>
                                <button className='flex-1 px-[20px] py-[8px] rounded-lg border text-gray-500 bg-white border-gray-300 font-semibold text-sm hover:bg-gray-50 transition-colors'>
                                  승인하기
                                </button>
                                <button className='flex-1 px-[20px] py-[8px] rounded-lg border text-gray-500 bg-gray-100 border-gray-300 font-semibold text-sm hover:bg-gray-200 transition-colors mt-2'>
                                  거절하기
                                </button>
                              </>
                            ) : selectedTab === '승인' ? (
                              <span className='px-[20px] py-[8px] rounded-lg bg-blue-50 text-blue-500 font-semibold text-sm'>
                                예약 승인
                              </span>
                            ) : selectedTab === '거절' ? (
                              <span className='px-[20px] py-[8px] rounded-lg bg-red-50 text-red-500 font-semibold text-sm'>
                                예약 거절
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='text-gray-400 text-center py-4'>예약 내역이 없습니다.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* 테블릿 모달: 중앙/하단에 꽉 찬 스타일 */}
          <div
            className='hidden md:flex lg:hidden fixed inset-0 z-50 items-end justify-center bg-black/40'
            onClick={closeModal}
          >
            <div
              className='w-full md:w-full rounded-t-3xl bg-white max-h-[80vh] overflow-y-auto shadow-xl transition-transform duration-300 translate-y-0 flex flex-col items-center p-[20px]'
              style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.10)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기(X) 버튼 */}
              <button
                className='absolute right-6 top-6 text-gray-400 hover:text-gray-700 text-2xl font-bold'
                onClick={closeModal}
                aria-label='닫기'
                type='button'
              >
                ×
              </button>
              {/* 상단 날짜 */}
              <div className='text-lg font-bold mb-4 w-full text-left'>
                {selectedDate.getFullYear().toString().slice(2)}년 {selectedDate.getMonth() + 1}월{' '}
                {selectedDate.getDate()}일
              </div>
              {/* 탭 */}
              <div className='flex border-b mb-4 w-full'>
                {(['신청', '승인', '거절'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-2 text-center font-semibold border-b-2 transition-colors ${
                      selectedTab === tab
                        ? 'text-blue-500 border-blue-500'
                        : 'text-gray-400 border-transparent'
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab} {allReservations.filter((r) => r.status === tabMap[tab]).length}
                  </button>
                ))}
              </div>
              {/* 예약 시간 + 예약 내역: 테블릿에서 가로 배치 */}
              <div className='w-full flex flex-col md:flex-row gap-4 md:gap-6'>
                {/* 예약 시간 */}
                <div className='w-full md:w-1/2 mb-4 md:mb-0'>
                  <label className='block text-sm font-semibold mb-2'>예약 시간</label>
                  <select className='w-full border rounded px-10 py-3 text-base bg-white h-[54px]'>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                {/* 예약 내역 */}
                <div className='w-full md:w-1/2 flex flex-col'>
                  <label className='block text-sm font-semibold mb-2'>예약 내역</label>
                  <div className='flex flex-col gap-4 max-h-[260px] overflow-y-auto'>
                    {filteredReservations.length > 0 ? (
                      filteredReservations.map((r, i) => (
                        <div
                          key={i}
                          className='bg-white rounded-xl p-4 flex flex-row justify-between items-center border border-gray-200 shadow-sm h-[94px] min-h-[94px] max-h-[94px] overflow-hidden px-20'
                        >
                          {/* 왼쪽: 닉네임/인원 */}
                          <div className='flex flex-col gap-2'>
                            <div className='flex gap-2 items-center'>
                              <span className='text-gray-500 text-sm'>닉네임</span>
                              <span className='text-gray-900 font-semibold'>{r.nickname}</span>
                            </div>
                            <div className='flex gap-2 items-center'>
                              <span className='text-gray-500 text-sm'>인원</span>
                              <span className='text-gray-900 font-semibold'>{r.count}명</span>
                            </div>
                          </div>
                          {/* 오른쪽: 신청탭은 버튼, 승인/거절탭은 뱃지 */}
                          <div className='flex flex-col gap-2 ml-4 items-end'>
                            {selectedTab === '신청' ? (
                              <>
                                <button className='flex-1 px-[20px] py-[8px] rounded-lg border text-gray-500 bg-white border-gray-300 font-semibold text-sm hover:bg-gray-50 transition-colors'>
                                  승인하기
                                </button>
                                <button className='flex-1 px-[20px] py-[8px] rounded-lg border text-gray-500 bg-gray-100 border-gray-300 font-semibold text-sm hover:bg-gray-200 transition-colors mt-2'>
                                  거절하기
                                </button>
                              </>
                            ) : selectedTab === '승인' ? (
                              <span className='px-[20px] py-[8px] rounded-lg bg-blue-50 text-blue-500 font-semibold text-sm'>
                                예약 승인
                              </span>
                            ) : selectedTab === '거절' ? (
                              <span className='px-[20px] py-[8px] rounded-lg bg-red-50 text-red-500 font-semibold text-sm'>
                                예약 거절
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='text-gray-400 text-center py-4'>예약 내역이 없습니다.</div>
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
