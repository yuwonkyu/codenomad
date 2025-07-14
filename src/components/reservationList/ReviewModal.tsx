'use client';
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

  document.body.style = 'overflow-y: hidden;';
  useEffect(() => {
    setMounted(true);
  }, []);

  function onDismiss() {
    router.back();
  }

  return (
    <div className='bg-black/50 w-screen h-screen fixed z-50 left-0 top-0'>
      <dialog open ref={dialogRef} className='inset-0 m-auto' onClose={onDismiss}>
        <button onClick={onDismiss} className='close-button'>
          x
        </button>
        <h1>title</h1>
        <div>
          <span>0000. 00. 00 /</span>
          <span>11:00 - 12:30 (10명)</span>
        </div>
        <div>별점구간</div>
        <h2>소중한 경험을 들려주세요</h2>
        <textarea placeholder='체험에서 느낀 경험을 자유롭게 남겨주세요'></textarea>
        <p>{}/100</p>
      </dialog>
    </div>
  );
};

export default ReviewModal;
