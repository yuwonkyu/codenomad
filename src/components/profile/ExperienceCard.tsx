import Image from 'next/image';

interface ExperienceCardProps {
  title: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
}

export default function ExperienceCard({
  title,
  rating,
  reviews,
  price,
  image,
}: ExperienceCardProps) {
  return (
    <div
      className='bg-white rounded-[20px] shadow-custom-5 flex items-center
      w-[327px] h-[178px]
      md:w-[476px] md:h-[159px]
      lg:w-[640px] lg:h-[202px]
      mx-auto p-5 gap-5'
    >
      {/* 내용 */}
      <div className='flex flex-col flex-1 justify-between h-full'>
        <div>
          <div className='text-16-b mb-1 leading-tight break-keep'>{title}</div>
          <div className='flex items-center text-14-m text-gray-500 mb-1 gap-1'>
            <span className='text-yellow-400 text-[16px]'>★</span>
            <span>{rating}</span>
            <span className='text-gray-400 text-12-m'>({reviews})</span>
          </div>
          <div className='text-16-b mt-1'>
            <span className='text-black'>₩{price.toLocaleString()}</span>
            <span className='text-gray-400 text-14-m ml-1'>/ 인</span>
          </div>
        </div>
        <div className='flex gap-2 mt-3'>
          <button className='w-68 h-29 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-14-m border border-gray-300'>
            수정하기
          </button>
          <button className='w-68 h-29 px-3 py-1 rounded-lg bg-gray-200 text-gray-600 text-14-m border border-gray-300'>
            삭제하기
          </button>
        </div>
      </div>
      {/* 썸네일 */}
      <div className='flex-shrink-0 w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] rounded-xl overflow-hidden'>
        <Image
          src={image}
          alt='썸네일'
          width={120}
          height={120}
          className='object-cover w-full h-full'
        />
      </div>
    </div>
  );
}
