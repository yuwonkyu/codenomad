import Image from 'next/image';
import starIcon from '/icon_star_on.svg';
interface LandingCardType {
  imageUrl?: string;
  title: string;
  rating: number;
  totalReview: number;
  price: number;
}

const LandingCard = ({ imageUrl, title, rating, totalReview, price }: LandingCardType) => {
  return (
    <div className='w-1'>
      <Image src={imageUrl} alt='카드이미지' className='bg-gray-400'></Image>
      <div className='rounded-4xl '>
        <h2>{title}</h2>
        <div>
          <Image src={starIcon} alt='별 아이콘' />
          <span>{rating}</span>
          <span>({totalReview})</span>
        </div>
        <p>
          &#8361;{price}
          <strong>/인</strong>
        </p>
      </div>
    </div>
  );
};

export default LandingCard;
