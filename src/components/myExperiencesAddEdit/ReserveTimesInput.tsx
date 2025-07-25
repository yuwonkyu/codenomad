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
      {reserveTimes.map((rt, idx) => (
        <div key={idx} className='mb-18'>
          <div className='flex flex-col gap-0 md:flex-row md:items-end md:gap-0'>
            <div className='relative flex flex-1 flex-col md:mr-14 md:w-344 md:flex-row'>
              <Input
                label={idx === 0 ? '날짜' : ''}
                placeholder='yyyy/mm/dd'
                className='text-16-m mb-10 w-full md:mb-0'
                type='text'
                value={rt.date}
                readOnly
                dateIcon={isEdit ? true : idx === 0} // edit 페이지에서는 모든 항목에, add 페이지에서는 첫 번째만
                onDateIconClick={
                  isEdit || idx === 0
                    ? () => {
                        setCalendarOpenIdx(idx);
                      }
                    : undefined
                }
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
            {/* 시간 인풋/버튼 */}
            <div className='mt-0 flex flex-1 flex-row items-center'>
              {/* 시작 시간 */}
              <div className='w-128.5 md:w-122'>
                <Input
                  label={
                    idx === 0 ? <span className='text-16-m hidden md:block'>시작 시간</span> : ''
                  }
                  as='select'
                  options={TIME_OPTIONS}
                  className='w-full'
                  value={rt.start}
                  onChange={(e) => onChange(idx, 'start', e.target.value)}
                  hideLabelOnMobile
                />
              </div>
              {/* - 구분선 */}
              <div className='text-20-b mx-10 flex w-8 items-center justify-center text-gray-800 md:mx-9 md:mt-25'>
                -
              </div>
              {/* 종료 시간 */}
              <div className='w-128.5 md:w-122'>
                <Input
                  label={
                    idx === 0 ? <span className='text-16-m hidden md:block'>종료 시간</span> : ''
                  }
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
                      className='ml-14 flex-shrink-0 cursor-pointer md:hidden'
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
                      className='mt-25 ml-14 hidden flex-shrink-0 cursor-pointer items-center justify-center md:flex'
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
                      className='ml-14 flex size-28 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-50 md:hidden'
                      onClick={() => onRemove(idx)}
                    >
                      <Image
                        src='/icons/icon_gray_minus.svg'
                        alt='제거'
                        width={24}
                        height={24}
                        className='cursor-pointer'
                      />
                    </button>
                    <button
                      type='button'
                      className='ml-14 hidden flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-50 md:flex'
                      style={{ width: 42, height: 42 }}
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
          {/* 구분선: 첫 번째와 두 번째 행 사이에만 표시 */}
          {idx === 0 && reserveTimes.length > 1 && <hr className='my-20 border-gray-100' />}
        </div>
      ))}
      {isDuplicateTime() && (
        <div className='text-12-m text-red ml-8'>
          같은 시간대에는 1개의 체험만 생성할 수 있습니다.
        </div>
      )}
    </div>
  );
};

export default ReserveTimesInput;
