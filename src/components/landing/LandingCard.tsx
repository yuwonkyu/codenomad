import Image from 'next/image';
interface LandingCardType {
  imageUrl?: string;
  title: string;
  rating: number;
  totalReview: number;
  price: number;
}

const LandingCard = ({ imageUrl, title, rating, totalReview, price }: LandingCardType) => {
  return (
    <div className='relative shrink-0 w-[132px] h-[242px] sm:w-[332px] sm:h-[423px] lg:w-[262px] lg:h-[366px] shadow-card rounded-[32px] overflow-hidden'>
      {/* 이미지 영역 */}
      <div className='relative h-[132px] sm:h-[290px] lg:h-[240px] rounded-t-4xl overflow-hidden'>
        <Image
          src={imageUrl || '/imgs/thumbnail.jpg'}
          alt='카드 이미지'
          fill
          className='object-cover'
        />
      </div>
      {/* 텍스트 박스 */}
      <div className='absolute bottom-12 rounded-[32px] sm:bottom-20 lg:bottom-16 z-10 flex flex-col justify-center items-start px-12 sm:px-30 bg-white w-full h-[110px] sm:h-[133px] lg:h-[126px]'>
        <h2 className='text-14-b sm:text-18-b mb-4 line-clamp-1'>{title}</h2>
        <div className='flex items-center gap-1'>
          <div className='relative w-16 h-16 mr-2'>
            <Image src='/icons/icon_star_on.svg' fill alt='별 아이콘' />
          </div>
          <span className='text-12-m sm:text-14-m'>{rating}</span>
          <span className='text-12-m text-gray-400 sm:text-14-m'>({totalReview})</span>
        </div>
        <p className='text-14-b sm:text-18-b mt-10'>
          ₩{price.toLocaleString()}
          <strong className='text-12-m sm:text-16-m text-gray-400'> / 인</strong>
        </p>
      </div>
    </div>
  );
};

export default LandingCard;
