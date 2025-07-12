'use client';

import Image from 'next/image';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import { useRouter } from 'next/navigation';

export default function DropdownMenu() {
  const route = useRouter();
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Image src={'/icons/icon_more.svg'} alt='드롭 다운' width={28} height={28} />
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item className='py-18' onClick={() => route.push('/experiences/edit')}>
          수정하기
        </Dropdown.Item>
        {/* 추후 API 추가 예정 */}
        <Dropdown.Item className='py-18' onClick={() => console.log('2번')}>
          삭제하기
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}
