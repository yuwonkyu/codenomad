import { Schedule } from '../Activities.types';
import clsx from 'clsx';

interface TimeSelectionStepProps {
  selectedDate: string | null;
  schedules: Schedule[];
  scheduleId: number | null;
  onTimeSelect: (id: number) => void;
}

const TimeSelectionStep = ({
  selectedDate,
  schedules,
  scheduleId,
  onTimeSelect,
}: TimeSelectionStepProps) => {
  const filteredTimes = schedules.filter((s) => s.date === selectedDate);

  return (
    <>
      <p className='text-16-b text-gray-950'>예약 가능한 시간</p>
      {selectedDate ? (
        <div className='flex flex-col gap-8'>
          {filteredTimes.map((s) => (
            <button
              key={s.id}
              onClick={() => onTimeSelect(s.id)}
              className={clsx(
                'text-16-m hover:text-primary-500 hover:border-primary-500 hover:bg-blue-50, h-52 w-full cursor-pointer rounded-[0.6875rem] border-2 text-center text-gray-950',
                scheduleId === s.id
                  ? 'border-primary-500 text-primary-500 bg-blue-50'
                  : 'border-gray-300',
              )}
            >
              {s.startTime} ~ {s.endTime}
            </button>
          ))}
        </div>
      ) : (
        <p className='pt-24 pb-24 text-center text-gray-500'>날짜를 선택해주세요.</p>
      )}
    </>
  );
};

export default TimeSelectionStep;
