import Input from '@/components/common/Input';
import Image from 'next/image';

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
}

export default function ReserveTimesInput({
  reserveTimes,
  onChange,
  onAdd,
  onRemove,
  isDuplicateTime,
}: ReserveTimesInputProps) {
  return (
    <div className='mb-30'>
      <div className='text-16-b mb-18'>예약 가능한 시간대</div>
      <p className='mb-9 text-14-m text-gray-950'>날짜</p>
      {reserveTimes.map((rt, idx) => (
        <div key={idx} className='mb-18'>
          {/* 날짜 인풋 */}
          <Input
            placeholder='yy/mm/dd'
            className='w-full mb-10 rounded-[12px] text-20-m text-gray-400'
            type='date'
            value={rt.date}
            onChange={(e) => onChange(idx, 'date', e.target.value)}
            dateIcon
          />

          {/* 시간 인풋 2개 +/– 버튼 */}
          <div className='flex items-center w-327'>
            <Input
              as='select'
              options={[
                { value: '', label: '00:00' },
                { value: '09:00', label: '09:00' },
                { value: '10:00', label: '10:00' },
                { value: '11:00', label: '11:00' },
                { value: '12:00', label: '12:00' },
                // ...
              ]}
              className='flex-1'
              value={rt.start}
              onChange={(e) => onChange(idx, 'start', e.target.value)}
            />
            <div className='w-12 mx-10 text-center text-gray-800 text-20-b'>-</div>
            <Input
              as='select'
              options={[
                { value: '', label: '00:00' },
                { value: '09:00', label: '09:00' },
                { value: '10:00', label: '10:00' },
                { value: '11:00', label: '11:00' },
                { value: '12:00', label: '12:00' },
                // ...
              ]}
              className='flex-1'
              value={rt.end}
              onChange={(e) => onChange(idx, 'end', e.target.value)}
            />
            {idx === 0 ? (
              <button type='button' className='ml-14 flex-shrink-0' onClick={onAdd}>
                <Image src='/icons/icon_blue_plus.svg' alt='추가' width={28} height={28} />
              </button>
            ) : (
              <button
                type='button'
                className='ml-8 w-44 h-44 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0'
                onClick={() => onRemove(idx)}
              >
                <Image src='/icons/icon_minus.svg' alt='제거' width={24} height={24} />
              </button>
            )}
          </div>
          {/* 구분선 */}
          {idx < reserveTimes.length - 1 && <hr className='my-24 border-gray-200' />}
        </div>
      ))}
      {isDuplicateTime() && (
        <div className='text-red-500 text-14-m ml-8'>
          같은 시간대에는 1개의 체험만 생성할 수 있습니다.
        </div>
      )}
    </div>
  );
}
