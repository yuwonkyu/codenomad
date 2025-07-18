import StatusBadge, { StatusType } from './StatusBadge';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const openReviewModal = () => {
    router.push('/profile/reservations/review');
  };
  return (
    <div className='static mb-20 md:w-640'>
      <h1 className='text-16-b mb-12 text-gray-800 lg:hidden'>{date}</h1>
      <div className='shadow-card h-136 lg:h-181'>
        <div className='shadow-card absolute inline-block h-136 w-229 rounded-3xl bg-white p-20 md:w-360 lg:h-181 lg:w-485'>
          <StatusBadge status={status} />
          <h2 className='text-14-b lg:text-18-b mt-8 mb-4 text-shadow-gray-950 lg:mt-12 lg:mb-10'>
            {title}
          </h2>
          <div>
            <span className='text-13-m lg:text-16-m hidden text-gray-500 lg:inline'>{date} • </span>
            <span className='text-13-m lg:text-16-m text-gray-500'>
              {startTime} - {endTime}
            </span>
          </div>
          <div className='flex justify-between'>
            <p className='text-14-m lg:text-16-m text-gray-400'>
              <strong className='text-16-b lg:text-18-b text-gray-950'>&#8361; {price}</strong>{' '}
              {headCount}명
            </p>
            <div className='hidden lg:block'>
              {status === 'completed' && (
                <button
                  onClick={openReviewModal}
                  className='bg-primary-500 text-14-m rounded-lg px-10 py-6 text-white'
                >
                  후기 작성
                </button>
              )}

              {status === 'confirmed' && (
                <div className='flex w-160 gap-8'>
                  <button className='text-14-m w-full rounded-lg border-1 border-gray-50 bg-white px-10 py-6 text-gray-600'>
                    예약 변경
                  </button>
                  <button className='text-14-m w-full rounded-lg bg-gray-50 px-10 py-6 text-gray-600'>
                    예약 취소
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='h-full rounded-3xl bg-gray-400'></div>
      </div>
      <div className='mt-12 lg:hidden'>
        {status === 'completed' && (
          <button
            onClick={openReviewModal}
            className='bg-primary-500 text-14-m w-full rounded-lg p-10 text-white'
          >
            후기 작성
          </button>
        )}

        {status === 'confirmed' && (
          <div className='flex gap-8'>
            <button className='w-full rounded-lg border-1 border-gray-50 bg-white py-10 text-gray-600'>
              예약 변경
            </button>
            <button className='w-full rounded-lg bg-gray-50 py-10 text-gray-600'>예약 취소</button>
          </div>
        )}
      </div>
      <hr className='mt-30 border-1 border-t border-gray-50'></hr>
    </div>
  );
};

export default ReservationCard;
