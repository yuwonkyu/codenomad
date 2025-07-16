'use client';
import { useState, useContext, useRef, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import CalendarModal from '@/components/common/Calendar';

// Badge 타입 정의
interface Badge {
  label: string; // 상태명
  color: string;
  count: number;
  nickname: string; // 예약자 이름
}

// 예약 상태 뱃지 컴포넌트
const StatusBadge = ({ status, count }: { status: string; count: number }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case '예약':
        return 'bg-blue-100 text-blue-600';
      case '승인':
        return 'bg-yellow-100 text-yellow-600';
      case '거절':
        return 'bg-red-100 text-red-600';
      case '완료':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusStyle(status)}`}>
      {status} {count}
    </span>
  );
};

// 예약 데이터를 배지 형태로 변환하는 함수 (닉네임별로 배지 생성)
const getBadgesForDate = (
  dateStr: string,
  reservationData: Record<string, { status: string; count: number; nickname: string }[]>
): Badge[] => {
  const reservations = reservationData[dateStr] || [];
  const statusColorMap: Record<string, { color: string; label: string }> = {
    '예약': { color: 'bg-blue-100 text-blue-600', label: '예약' },
    '승인': { color: 'bg-yellow-100 text-yellow-600', label: '승인' },
    '거절': { color: 'bg-red-100 text-red-600', label: '거절' },
    '완료': { color: 'bg-gray-100 text-gray-600', label: '완료' },
  };
  // 닉네임별로 개별 배지 생성
  return reservations.map((r) => ({
    label: statusColorMap[r.status]?.label ?? r.status,
    color: statusColorMap[r.status]?.color ?? 'bg-gray-100 text-gray-600',
    count: r.count,
    nickname: r.nickname,
  }));
};

export default function ReservationStatusPage() {
  const [date, setDate] = useState<Date>(new Date());

  // 예약 데이터 (목데이터)
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

  // Calendar 데이터 준비
  const badgeData: { [date: string]: Badge[] } = {};
  const dotDates: string[] = [];

  Object.keys(reservationData).forEach((dateStr) => {
    badgeData[dateStr] = getBadgesForDate(dateStr, reservationData);
    if (reservationData[dateStr].length > 0) {
      dotDates.push(dateStr);
    }
  });

  const handleDayClick = (date: Date) => {
    setDate(date);
  };

  return (
    <section className='w-375  mx-auto'>
      <div className='bg-white rounded-2xl shadow-custom-5 md:p-8 mx-auto flex flex-col gap-4 '>
        <select className='w-full h-54 border border-gray-100 rounded-[16px] px-20 py-16 shadow-custom-5 mb-20'>
          <option>함께 배우면 즐거운 스트릿 댄스</option>
        </select>

        <CalendarModal
          value={date}
          onChange={setDate}
          type='badge'
          badges={badgeData}
          dots={dotDates}
          onClickDay={handleDayClick}
        />
      </div>
    </section>
  );
}
