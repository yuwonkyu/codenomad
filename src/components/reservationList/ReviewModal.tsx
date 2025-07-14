'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
interface ReviewModalType {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  headCount: number;
  reservationId: number;
}

const ReviewModal = ({
  title,
  date,
  startTime,
  endTime,
  headCount,
  reservationId,
}: ReviewModalType) => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false); // ✅ 마운트 상태 추가

  useEffect(() => {
    setMounted(true);
    document.body.style = 'overflow: hidden;';
  }, []);

  function onDismiss() {
    router.back();
  }

  return (
    <div className='bg-black/50 w-screen h-screen fixed z-50 left-0 top-0'>
      <dialog
        open
        ref={dialogRef}
        className='inset-0 m-auto py-20 px-24 flex flex-col rounded-[30px] w-327 md:w-385'
        onClose={onDismiss}
      >
        <div className='text-right'>
          <button onClick={onDismiss} className='close-button'>
            <Image src='/icons/icon_delete.svg' width={24} height={24} alt='exit_icon'></Image>
          </button>
        </div>
        <h1 className='text-14-b md:text-16-b text-gray-950 text-center truncate'>title</h1>
        <div className='text-13-m md:text-14-m text-gray-500 text-center'>
          <span>0000. 00. 00 /</span>
          <span>11:00 - 12:30 (10명)</span>
        </div>
        <div className='mt-14 mb-20'>별점구간</div>
        <h2 className='text-16-b md:text-18-b text-gray-950 mb-12'>소중한 경험을 들려주세요</h2>
        <textarea
          className='text-14-body-m md:text-16-m p-20 border-1 border-gray-100 rounded-xl h-179 resize-none text-gray-950 placeholder:text-gray-400'
          placeholder='체험에서 느낀 경험을 자유롭게 남겨주세요'
        ></textarea>
        <p className='text-13-m md:text-14-m text-gray-600 text-right mt-8 mb-20'>{}/100</p>
        <button className='md:text-16-b bg-primary-500 rounded-xl text-white text-14-b py-12 md:py-17'>
          작성하기
        </button>
      </dialog>
    </div>
  );
};

export default ReviewModal;
