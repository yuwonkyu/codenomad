import Image from 'next/image';
import type { ReactNode } from 'react';

const PhotoSection = () => {
  // 임시로 작성한 함수 : 추후 API를 호출 시에 해당 subImages의 length에 따라서 나오게 바꿀 예정
  const renderImageSection = (length: number): ReactNode => {
    switch (length) {
      case 1:
        return (
          <div className='relative h-full w-full rounded-3xl border border-black'>
            <Image src='/icons/empty.svg' alt='text01' fill />
          </div>
        );
      case 2:
        return (
          <>
            <div className='relative h-full w-full rounded-l-3xl border border-black'>
              <Image src='/icons/empty.svg' alt='text01' fill />
            </div>
            <div className='relative h-full w-full rounded-r-3xl border border-black'>
              <Image src='/icons/empty.svg' alt='text01' fill />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className='relative h-full w-full rounded-l-3xl border border-black'>
              <Image src='/icons/empty.svg' alt='text01' fill />
            </div>
            <div className='grid h-full w-full grid-rows-2 gap-12'>
              <div className='relative h-full overflow-hidden rounded-tr-3xl border border-black'>
                <Image src='/icons/empty.svg' alt='test02' fill className='object-cover' />
              </div>
              <div className='relative h-full rounded-br-3xl border border-black'>
                <Image src='/icons/empty.svg' alt='test03' fill className='object-cover' />
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className='relative h-full w-full rounded-l-3xl border border-black'>
              <Image src='/icons/empty.svg' alt='text01' fill />
            </div>
            <div className='grid h-full w-full grid-cols-2 grid-rows-2 gap-12'>
              <div className='relative grid h-full border border-black'>
                <Image src='/icons/empty.svg' alt='test02' fill className='object-cover' />
              </div>
              <div className='relative h-full rounded-tr-3xl border border-black'>
                <Image src='/icons/empty.svg' alt='test03' fill className='object-cover' />
              </div>
              <div className='relative col-span-2 h-full rounded-br-3xl border border-black'>
                <Image src='/icons/empty.svg' alt='test03' fill className='object-cover' />
              </div>
            </div>
          </>
        );
      default:
        return <div>이미지를 불러오는데 실패했습니다.</div>;
    }
  };

  return (
    <div className='flex h-245 w-auto items-center justify-center gap-12 sm:h-400'>
      {renderImageSection(4)}
    </div>
  );
};

export default PhotoSection;
