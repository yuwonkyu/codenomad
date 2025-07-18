
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
  const filteredReservations = (reservations ?? []).filter((r: ReservationType) => r.status === tabMap[tab]);

  return (
    <div className="w-full max-w-[400px] rounded-[24px] bg-white shadow-[0_4px_32px_rgba(0,0,0,0.10)] px-5 py-6 mx-auto">
      {/* 날짜 */}
      <div className="text-[20px] font-bold mb-6 text-left">
        {date.getFullYear().toString().slice(2)}년 {date.getMonth() + 1}월 {date.getDate()}일
      </div>
      {/* 탭 */}
      <div className="flex border-b border-[#e5e7eb] mb-6">
        {(['신청', '승인', '거절'] as const).map((t) => (
          <button
            key={t}
            className={`flex-1 py-3 text-center font-semibold text-[16px] border-b-2 transition-colors
          ${tab === t ? 'text-[#3d9ef2] border-[#3d9ef2] bg-white' : 'text-[#bdbdbd] border-transparent bg-white'}`}
            onClick={() => setTab(t)}
          >
            {t} <span className="font-normal">{reservations.filter((r: ReservationType) => r.status === tabMap[t]).length}</span>
          </button>
        ))}
      </div>
      {/* 예약 시간 */}
      <div className="mb-6">
        <label className="block text-[15px] font-semibold mb-2 text-[#222]">예약 시간</label>
        <select
          className="w-full border border-[#e5e7eb] rounded-[16px] px-4 py-4 text-[16px] bg-white focus:outline-none"
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
      <div className="mb-6">
        <label className="block text-[15px] font-semibold mb-2 text-[#222]">예약 내역</label>
        <div className="flex flex-col gap-4 max-h-[260px] overflow-y-auto">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((r: ReservationType, i: number) => (
              <div
                key={i}
                className="bg-[#f7f8fa] rounded-[16px] px-5 py-4 flex flex-row justify-between items-center"
              >
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-[#84858c] text-[14px] mr-2">닉네임</span>
                    <span className="text-[#222] font-semibold text-[16px]">{r.nickname}</span>
                  </div>
                  <div>
                    <span className="text-[#84858c] text-[14px] mr-2">인원</span>
                    <span className="text-[#222] font-semibold text-[16px]">{r.count}명</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {tab === '신청' ? (
                    <>
                      <button className="rounded-[8px] border border-[#e5e7eb] bg-white text-[#84858c] font-semibold text-[15px] px-5 py-2 hover:bg-[#f7f8fa] transition-colors">
                        승인하기
                      </button>
                      <button className="rounded-[8px] border border-[#e5e7eb] bg-[#f7f8fa] text-[#84858c] font-semibold text-[15px] px-5 py-2 mt-1 hover:bg-[#e5e7eb] transition-colors">
                        거절하기
                      </button>
                    </>
                  ) : tab === '승인' ? (
                    <span className="rounded-[8px] bg-[#e5f3ff] text-[#3d9ef2] font-semibold text-[15px] px-5 py-2">
                      예약 승인
                    </span>
                  ) : tab === '거절' ? (
                    <span className="rounded-[8px] bg-[#f7f8fa] text-[#84858c] font-semibold text-[15px] px-5 py-2">
                      예약 거절
                    </span>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-4">예약 내역이 없습니다.</div>
          )}
        </div>
      </div>
      {/* 닫기 버튼 */}
      <button
        className="mt-8 w-full py-3 rounded-[16px] bg-[#f7f8fa] text-[#222] font-semibold text-[16px]"
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  );
};

export default ReservationModal;
