import Image from 'next/image';

const NoResult = () => {
  return (
    <div className='flex w-full flex-col items-center justify-center py-60 text-center text-gray-400'>
      <Image
        src='/icons/404_kkot.svg'
        alt='검색 결과 없음 꽃 아이콘'
        width={120}
        height={120}
        className='mb-24 h-120 w-120 lg:h-150 lg:w-150'
      />
      <p className='text-24-b'>해당 키워드에 대한 체험이 없어요.</p>
      <p className='text-16-m mt-8 text-gray-500'>다른 키워드로 검색해보세요!</p>
    </div>
  );
};

export default NoResult;
