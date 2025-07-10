import Image from 'next/image';

interface StarRatingDisplayProps {
  rating: number;
}

export default function StarRatingDisplay({ rating }: StarRatingDisplayProps) {
  const MAX = 5;
  return (
    <div className='flex'>
      {Array.from({ length: MAX }).map((_, index) => {
        const isFilled = index < rating;

        return (
          <Image
            key={index}
            src={isFilled ? '/icons/icon_star_on.svg' : '/icons/icon_star_off.svg'}
            alt={isFilled ? '채워진 별' : '빈 별'}
            width={16}
            height={16}
          />
        );
      })}
    </div>
  );
}
