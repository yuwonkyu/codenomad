import { useEffect } from 'react';
import StatusBadge, { StatusType } from './StatusBadge';
import { useResponsive } from '@/hooks/useResponsive';

interface ReservationCardType {
  status: StatusType;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  headCount: number;
}

const ReservationCard = ({
  status,
  title,
  date,
  startTime,
  endTime,
  price,
  headCount,
}: ReservationCardType) => {
  const breakpoint = useResponsive();

  return (
    <div className='static md:w-640 mb-20'>
      <div className='h-136 lg:h-181 shadow-card'>
        <div className='bg-white inline-block absolute h-136 rounded-3xl p-20 w-229 md:w-360 lg:w-485 lg:h-181 shadow-card'>
          <StatusBadge status={status} />
          <h2 className='text-shadow-gray-950 text-14-b mt-8 mb-4 lg:mt-12 lg:mb-10 lg:text-18-b'>
            {title}
          </h2>
          <div>
            {breakpoint !== 'sm' && (
              <span className='text-gray-500 text-13-m lg:text-16-m'>{date} • </span>
            )}
            <span className='text-gray-500 text-13-m lg:text-16-m'>
              {startTime} - {endTime}
            </span>
          </div>
          <div className='flex justify-between'>
            <p className='text-14-m text-gray-400 lg:text-16-m'>
              <strong className='text-16-b text-gray-950 lg:text-18-b '>&#8361; {price}</strong>{' '}
              {headCount}명
            </p>
            {breakpoint === 'lg' && (
              <div>
                {status === 'completed' && (
                  <button className='bg-primary-500 text-white text-14-m py-6 px-10 rounded-lg'>
                    후기 작성
                  </button>
                )}

                {status === 'confirmed' && (
                  <div className='flex gap-8 w-160'>
                    <button className='text-14-m bg-white border-1 border-gray-50 rounded-lg w-full py-6 px-10 text-gray-600'>
                      예약 변경
                    </button>
                    <button className='text-14-m rounded-lg w-full py-6 px-10 text-gray-600 bg-gray-50'>
                      예약 취소
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className='bg-gray-400 h-full rounded-3xl'></div>
      </div>
      {breakpoint !== 'lg' && (
        <div className='mt-12'>
          {status === 'completed' && (
            <button className='w-full bg-primary-500 p-10 rounded-lg text-white text-14-m'>
              후기 작성
            </button>
          )}

          {status === 'confirmed' && (
            <div className='flex gap-8'>
              <button className='bg-white border-1 border-gray-50 rounded-lg w-full py-10 text-gray-600'>
                예약 변경
              </button>
              <button className='rounded-lg w-full py-10 text-gray-600 bg-gray-50'>
                예약 취소
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
