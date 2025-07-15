import { Schedule } from './types';

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
              className={`w-full h-52 text-center rounded-[11px] border-2 text-gray-950 text-16-m cursor-pointer hover:bg-blue-50  hover:text-primary-500 hover:border-primary-500 ${
                scheduleId === s.id
                  ? 'border-primary-500 bg-blue-50 text-primary-500'
                  : 'border-gray-300'
              }`}
            >
              {s.startTime} ~ {s.endTime}
            </button>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-500 pt-24 pb-24'>날짜를 선택해주세요.</p>
      )}
    </>
  );
};

export default TimeSelectionStep;
