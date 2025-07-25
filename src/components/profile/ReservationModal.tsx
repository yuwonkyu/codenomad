import React from 'react';

interface ReservationType {
  status: string;
  count: number;
  nickname: string;
}

interface ReservationModalProps {
  date: Date;
  tab: '신청' | '승인' | '거절';
  setTab: (tab: '신청' | '승인' | '거절') => void;
  timeOptions: string[];
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  reservations: ReservationType[];
  onClose: () => void;
}

const tabMap: Record<string, string> = { 완료: '완료', 신청: '예약', 승인: '승인', 거절: '거절' };

const ReservationModal = ({
  date,
  tab,
  setTab,
  timeOptions,
  selectedTime,
  setSelectedTime,
  reservations,
  onClose,
}: ReservationModalProps) => {
  const filteredReservations = (reservations ?? []).filter(
    (r: ReservationType) => r.status === tabMap[tab],
  );

  return (
    <div className='mx-auto w-full max-w-[400px] rounded-[24px] bg-white px-5 py-6 shadow-[0_4px_32px_rgba(0,0,0,0.10)]'>
      {/* 날짜 */}
      <div className='mb-6 text-left text-[20px] font-bold'>
        {date.getFullYear().toString().slice(2)}년 {date.getMonth() + 1}월 {date.getDate()}일
      </div>
      {/* 탭 */}
      <div className='mb-6 flex border-b border-[#e5e7eb]'>
        {(['신청', '승인', '거절'] as const).map((t) => (
          <button
            key={t}
            className={`flex-1 border-b-2 py-3 text-center text-[16px] font-semibold transition-colors ${tab === t ? 'border-[#3d9ef2] bg-white text-[#3d9ef2]' : 'border-transparent bg-white text-[#bdbdbd]'}`}
            onClick={() => setTab(t)}
          >
            {t}{' '}
            <span className='font-normal'>
              {reservations.filter((r: ReservationType) => r.status === tabMap[t]).length}
            </span>
          </button>
        ))}
      </div>
      {/* 예약 시간 */}
      <div className='mb-6'>
        <label className='mb-2 block text-[15px] font-semibold text-[#222]'>예약 시간</label>
        <select
          className='w-full rounded-[16px] border border-[#e5e7eb] bg-white px-4 py-4 text-[16px] focus:outline-none'
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          {timeOptions.map((t: string) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      {/* 예약 내역 */}
      <div className='mb-6'>
        <label className='mb-2 block text-[15px] font-semibold text-[#222]'>예약 내역</label>
        <div className='flex max-h-[260px] flex-col gap-4 overflow-y-auto'>
          {filteredReservations.length > 0 ? (
            filteredReservations.map((r: ReservationType, i: number) => (
              <div
                key={i}
                className='flex flex-row items-center justify-between rounded-[16px] bg-[#f7f8fa] px-5 py-4'
              >
                <div className='flex flex-col gap-2'>
                  <div>
                    <span className='mr-2 text-[14px] text-[#84858c]'>닉네임</span>
                    <span className='text-[16px] font-semibold text-[#222]'>{r.nickname}</span>
                  </div>
                  <div>
                    <span className='mr-2 text-[14px] text-[#84858c]'>인원</span>
                    <span className='text-[16px] font-semibold text-[#222]'>{r.count}명</span>
                  </div>
                </div>
                <div className='flex flex-col items-end gap-2'>
                  {tab === '신청' ? (
                    <>
                      <button className='rounded-[8px] border border-[#e5e7eb] bg-blue-100 px-5 py-2 text-[15px] font-semibold text-blue-600 transition-colors hover:bg-[#f7f8fa]'>
                        승인하기
                      </button>
                      <button className='mt-1 rounded-[8px] border border-[#e5e7eb] bg-red-100 px-5 py-2 text-[15px] font-semibold text-red-600 transition-colors hover:bg-[#e5e7eb]'>
                        거절하기
                      </button>
                    </>
                  ) : tab === '승인' ? (
                    <span className='rounded-[8px] bg-[#e5f3ff] px-5 py-2 text-[15px] font-semibold text-[#3d9ef2]'>
                      예약 승인
                    </span>
                  ) : tab === '거절' ? (
                    <span className='rounded-[8px] bg-[#f7f8fa] px-5 py-2 text-[15px] font-semibold text-[#84858c]'>
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
        className='mt-8 w-full rounded-[16px] bg-[#f7f8fa] py-3 text-[16px] font-semibold text-[#222]'
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  );
};

export default ReservationModal;
