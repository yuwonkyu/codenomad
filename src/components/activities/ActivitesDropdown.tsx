'use client';

import { useState } from 'react';
import Image from 'next/image';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import CommonModal from '@/components/common/CancelModal';
import { useRouter } from 'next/navigation';

export default function DropdownMenu() {
  const route = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    // TODO: 실제 삭제 API 호출
    console.log('체험 삭제 확정');
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Trigger>
          <Image src={'/icons/icon_more.svg'} alt='드롭 다운' width={28} height={28} />
        </Dropdown.Trigger>
        <Dropdown.Content className='top-45 right-10'>
          <Dropdown.Item className='py-18' onClick={() => route.push('/experiences/edit')}>
            수정하기
          </Dropdown.Item>
          <Dropdown.Item className='py-18' onClick={handleDeleteClick}>
            삭제하기
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>

      <CommonModal
        open={isDeleteModalOpen}
        icon={
          <Image
            src={'/icons/icon_alert.svg'}
            alt='경고'
            width={49}
            height={49}
            className='md:h-88 md:w-88'
          />
        }
        text='체험을 삭제하시겠습니까?'
        cancelText='아니오'
        confirmText='네'
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
