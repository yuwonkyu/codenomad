'use client';
import { toast } from 'sonner';
const Page = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      <button
        className='text-16-b h-50 w-300 rounded-2xl border-2 border-gray-200 bg-green-400 text-gray-800'
        onClick={() => toast.success('성공')}
      >
        성공
      </button>
      <button
        className='text-16-b h-50 w-300 rounded-2xl border-2 border-gray-200 bg-red-400 text-gray-800'
        onClick={() => toast.error('실패')}
      >
        실패
      </button>
      <button
        className='text-16-b h-50 w-300 rounded-2xl border-2 border-gray-200 bg-orange-400 text-gray-800'
        onClick={() => toast.warning('경고')}
      >
        경고
      </button>
      <button
        className='text-16-b h-50 w-300 rounded-2xl border-2 border-gray-200 bg-blue-400 text-gray-800'
        onClick={() => toast.info('정보')}
      >
        정보
      </button>
    </div>
  );
};

export default Page;
