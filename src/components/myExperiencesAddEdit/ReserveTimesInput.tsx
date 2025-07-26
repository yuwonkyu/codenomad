import Input from '@/components/common/Input';
import Image from 'next/image';
import CalendarComponent from '@/components/common/Calendar';
import { useState } from 'react';

const TIME_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

interface ReserveTime {
  date: string;
  start: string;
  end: string;
}

interface ReserveTimesInputProps {
  reserveTimes: ReserveTime[];
  onChange: (idx: number, key: keyof ReserveTime, value: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  isDuplicateTime: () => boolean;
  isEdit?: boolean; // edit 페이지인지 구분하는 prop
}

// 시간 문자열을 분(minute) 단위로 변환
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// 유효성 검사 함수
const isValidTime = (start: string, end: string) => {
  if (!start || !end) return true;
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  // 종료가 시작보다 늦으면 true (같으면 false)
  return endMin > startMin;
};

// 다음날 여부 판단 함수
const isNextDay = (start: string, end: string) => {
  if (!start || !end) return false;
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  // 종료가 시작보다 빠르면 다음날
  return endMin <= startMin;
};

const newReserveTime: ReserveTime = {
  date: '',
  start: '00:00',
  end: '01:00',
};

const ReserveTimesInput = ({
  reserveTimes,
  onChange,
  onAdd,
  onRemove,
  isDuplicateTime,
  isEdit = false, // 기본값은 false (add 페이지)
}: ReserveTimesInputProps) => {
  const [calendarOpenIdx, setCalendarOpenIdx] = useState<number | null>(null);

  return (
    <div className='mb-30'>
      <div className='text-16-b mb-18'>예약 가능한 시간대</div>
      {/* 라벨: 테블릿 이상에서만 보임 */}
      <div className='text-16-m mb-8 hidden items-center md:mb-10 md:flex'>
        <span className='lg:w-356.79 w-360'>날짜</span>
        <span className='lg:w-134.21 w-145 text-start'>시작 시간</span>
        <span className='w-122 text-start lg:w-122'>종료 시간</span>
      </div>
      {reserveTimes.map((rt, idx) => (
        <div key={idx} className='mb-18'>
          {/* 모바일: 세로, 테블릿 이상: 가로 */}
          <div className='flex flex-col items-center gap-4 md:flex-row md:gap-8'>
            {/* 날짜 인풋 */}
            <div className='w-327 md:w-344 lg:w-360'>
              <Input
                label='' // 모바일에서는 label 숨김
                placeholder='yyyy/mm/dd'
                className='text-16-m mb-10 w-full md:mb-0'
                type='text'
                value={rt.date}
                readOnly
                dateIcon={isEdit ? true : idx === 0} // edit 페이지에서는 모든 항목에, add 페이지에서는 첫 번째만
                onDateIconClick={isEdit || idx === 0 ? () => setCalendarOpenIdx(idx) : undefined}
              />
              {/* 달력 아이콘 클릭 시 CalendarModal 노출 */}
              {calendarOpenIdx === idx && (isEdit || idx === 0) && (
                <div
                  className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50'
                  onClick={(e) => {
                    // 배경 클릭 시 모달 닫기
                    if (e.target === e.currentTarget) {
                      setCalendarOpenIdx(null);
                    }
                  }}
                >
                  <div
                    className='relative z-[10000] flex w-375 flex-col items-center rounded-lg bg-white p-24 shadow-lg md:w-407 lg:w-398'
                    onClick={(e) => {
                      // 모달 내부 클릭 시 이벤트 전파 중단
                      e.stopPropagation();
                    }}
                  >
                    <div className='mb-8 w-full'>
                      <h3 className='text-18-b text-left'>날짜</h3>
                    </div>
                    <div className='flex w-full justify-center'>
                      <CalendarComponent
                        selectedDate={rt.date ? new Date(rt.date) : null}
                        onChange={(date: Date | null) => {
                          if (date) {
                            // YYYY-MM-DD 형식으로 변환
                            const year = date.getFullYear();
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const day = date.getDate().toString().padStart(2, '0');
                            const dateString = `${year}-${month}-${day}`;
                            onChange(idx, 'date', dateString);
                            setCalendarOpenIdx(null); // 날짜 선택 후 모달 닫기
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        setCalendarOpenIdx(null);
                      }}
                      className='text-14-m mt-16 w-full rounded-[12px] bg-gray-100 py-10 text-gray-700 transition-colors hover:bg-gray-200'
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* 시작시간,종료시간 인풋 */}
            <div className='flex items-center gap-14 md:gap-10'>
              {/* 시작 시간 인풋 */}
              <div className='w-124.5 md:w-122'>
                <Input
                  label='' // 모바일에서는 label 숨김
                  as='select'
                  options={TIME_OPTIONS}
                  className='w-full'
                  value={rt.start ?? '00:00'}
                  onChange={(e) => onChange(idx, 'start', e.target.value)}
                  hideLabelOnMobile
                />
              </div>
              {/* - 구분선 */}
              <div className='text-20-b w-8 text-gray-800'>-</div>
              {/* 종료 시간 인풋 */}
              <div className='w-124.5 md:w-122'>
                <Input
                  label='' // 모바일에서는 label 숨김
                  as='select'
                  options={TIME_OPTIONS}
                  className='w-full'
                  value={rt.end}
                  onChange={(e) => onChange(idx, 'end', e.target.value)}
                  hideLabelOnMobile
                />
              </div>
              {/* + 또는 - 버튼 */}
              <div className='ml-8 flex items-center'>
                {idx === 0 ? (
                  <>
                    <button
                      type='button'
                      className='flex-shrink-0 cursor-pointer md:hidden'
                      onClick={onAdd}
                    >
                      <Image
                        src='/icons/icon_blue_plus.svg'
                        alt='추가'
                        width={28}
                        height={28}
                        className='cursor-pointer'
                      />
                    </button>
                    <button
                      type='button'
                      className='hidden flex-shrink-0 cursor-pointer items-center justify-center md:flex'
                      onClick={onAdd}
                    >
                      <Image
                        src='/icons/icon_blue_plus.svg'
                        alt='추가'
                        width={42}
                        height={42}
                        className='cursor-pointer'
                      />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type='button'
                      className='flex flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-50 md:hidden'
                      onClick={() => onRemove(idx)}
                    >
                      <Image
                        src='/icons/icon_gray_minus.svg'
                        alt='제거'
                        width={28}
                        height={28}
                        className='cursor-pointer'
                      />
                    </button>
                    <button
                      type='button'
                      className='hidden flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-50 md:flex'
                      onClick={() => onRemove(idx)}
                    >
                      <Image
                        src='/icons/icon_gray_minus.svg'
                        alt='제거'
                        width={42}
                        height={42}
                        className='cursor-pointer'
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* 유효성 검사 메시지 */}
          {!isValidTime(rt.start, rt.end) && (
            <div className='text-8 ml-8 text-gray-400'>
              종료 시간은 시작 시간보다 늦거나, 다음날로 간주됩니다.
            </div>
          )}
        </div>
      ))}
      {isDuplicateTime() && (
        <div className='text-8 text-red ml-8'>같은 시간대에는 1개의 체험만 생성할 수 있습니다.</div>
      )}
    </div>
  );
};

export default ReserveTimesInput;
