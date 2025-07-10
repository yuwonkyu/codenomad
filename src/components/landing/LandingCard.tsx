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
    <div className='w-155 h-243 md:w-331 md:h-423 lg:w-262 lg:h-366 shadow-card rounded-4xl'>
      <div className='h-290 bg-gray-200 rounded-t-4xl'>
        {imageUrl && <Image src={imageUrl} alt='카드이미지' className='bg-gray-400'></Image>}
      </div>
      <div className='flex flex-col justify-center items-start px-30 rounded-4xl relative bg-white w-full h-100 md:h-136 bottom-60'>
        <h2 className='text-lg/26 font-semibold tex'>{title}</h2>
        <div className='flex gap-2'>
          <div className='relative w-20 h-20 mr-3'>
            <Image src='/icons/icon_star_on.svg' fill alt='별 아이콘' />
          </div>
          <span className='text-12-m md:text-14-m'>{rating}</span>
          <span className='text-12-m md:text-14-m text-gray-400'>({totalReview})</span>
        </div>
        <p className='text-[15px] font-bold lg:text-18-b mt-18'>
          &#8361;{price}
          <strong className='text-xs font-semibold lg:text-lg lg:font-semibold text-gray-400'>
            / 인
          </strong>
        </p>
      </div>
    </div>
  );
};

export default LandingCard;
