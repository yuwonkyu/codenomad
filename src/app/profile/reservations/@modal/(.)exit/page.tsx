'use client';


import CommonModal from '@/components/common/CancelModal';
import { useRouter } from 'next/navigation';


const page = () => {
  const router = useRouter();
  const onDismiss = () => {
    router.back();
  };

  return (
    <CommonModal
      open={true}
      icon={<img src='/icons/icon_alert.svg' alt='경고' className='h-full w-full' />}
      text={'저장되지 않았습니다.<br />정말 뒤로 가시겠습니까?'}
      cancelText='아니오'
      confirmText='네'
      onCancel={onDismiss}
      onConfirm={() => console.log(confirm)}
    />
  );
};

export default page;
