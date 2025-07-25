import Image from 'next/image';
import Link from 'next/link';

interface ExperienceCardProps {
  id: number;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  onDelete?: (id: number) => void; // 추가
}

export default function ExperienceCard({
  id,
  title,
  rating,
  reviews,
  price,
  image,
  onDelete,
}: ExperienceCardProps) {
  return (
    <div className='shadow-custom-5 mx-auto flex h-[178px] w-[327px] items-center gap-5 rounded-[20px] bg-white p-5 md:h-[159px] md:w-[476px] lg:h-[202px] lg:w-[640px]'>
      {/* 내용 */}
      <div className='mt-40 ml-30 flex h-full flex-1 flex-col justify-between'>
        <div>
          <div className='mb-5 text-xl leading-tight font-bold break-keep'>{title}</div>
          <div className='text-14-m mb-5 flex items-center gap-1 text-gray-500'>
            <span className='text-[16px] text-yellow-400'>★</span>
            <span>{rating}</span>
            <span className='text-12-m mb-5 text-gray-400'>({reviews})</span>
          </div>
          <div className='mt-1'>
            <span className='text-xl font-bold text-black'>₩{price.toLocaleString()}</span>
            <span className='text-14-m ml-1 text-gray-400'>/ 인</span>
          </div>
        </div>
        <div className='mb-40 flex gap-8'>
          <Link href={`/experiences/edit/${id}`}>
            <button className='text-14-m h-30 w-70 rounded-lg border border-gray-300 bg-white text-black'>
              수정하기
            </button>
          </Link>
          <button
            className='text-14-m h-30 w-70 rounded-lg border border-gray-300 bg-gray-100 text-black'
            onClick={() => onDelete && onDelete(id)}
          >
            삭제하기
          </button>
        </div>
      </div>
      {/* 썸네일 */}
      <div className='mr-30 h-[80px] w-[80px] flex-shrink-0 overflow-hidden rounded-xl md:h-[100px] md:w-[100px] lg:h-[120px] lg:w-[120px]'>
        <Image
          src={image}
          alt='썸네일'
          width={120}
          height={120}
          className='h-full w-full object-cover'
        />
      </div>
    </div>
  );
}
