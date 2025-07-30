'use client';

import MapView from '@/components/activities/MapView';
import { toast } from 'sonner';

interface ActivityMapSectionProps {
  address: string;
  category: string;
}

const ActivityMapSection = ({ address, category }: ActivityMapSectionProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('주소가 복사되었습니다.');
    } catch {
      toast.error('주소 복사에 실패하였습니다.');
    }
  };

  return (
    <section className='flex flex-col gap-8 border-b-1 border-gray-100'>
      <h2 className='text-18-b text-gray-950'>오시는 길</h2>
      <div className='flex items-center gap-8'>
        <p className='text-[0.875rem] font-semibold text-gray-950'>{address}</p>
        <button onClick={() => handleCopy()} className='size-20'>
          <svg
            width='100%'
            height='100%'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M8 16V18.8C8 19.9201 8 20.4802 8.21799 20.908C8.40973 21.2843 8.71569 21.5903 9.09202 21.782C9.51984 22 10.0799 22 11.2 22H18.8C19.9201 22 20.4802 22 20.908 21.782C21.2843 21.5903 21.5903 21.2843 21.782 20.908C22 20.4802 22 19.9201 22 18.8V11.2C22 10.0799 22 9.51984 21.782 9.09202C21.5903 8.71569 21.2843 8.40973 20.908 8.21799C20.4802 8 19.9201 8 18.8 8H16M5.2 16H12.8C13.9201 16 14.4802 16 14.908 15.782C15.2843 15.5903 15.5903 15.2843 15.782 14.908C16 14.4802 16 13.9201 16 12.8V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.71569 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.07989 2 5.2V12.8C2 13.9201 2 14.4802 2.21799 14.908C2.40973 15.2843 2.71569 15.5903 3.09202 15.782C3.51984 16 4.07989 16 5.2 16Z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
      <MapView address={address} category={category} />
    </section>
  );
};

export default ActivityMapSection;
