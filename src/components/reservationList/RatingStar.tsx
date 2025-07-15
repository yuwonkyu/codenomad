import Image from 'next/image';

interface RatingType {
  rating: number;
}

const RatingStar = ({ rating }: RatingType) => {
  const starOn = '/icons/icon_star_on.svg';
  const starOff = '/icons/icon_star_off.svg';

  return (
    <div className='flex justify-center gap-6'>
      {[...Array(5)].map((item, idx) => {
        return (
          <div className='w-36 h-36 md:w-42 md:h-42 relative'>
            <Image
              src={idx < rating ? starOn : starOff}
              key={`star-${idx}`}
              fill
              alt='rating_star'
            />
          </div>
        );
      })}
    </div>
  );
};

export default RatingStar;
