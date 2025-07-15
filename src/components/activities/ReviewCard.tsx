import StarRatingDisplay from './StarRatingDisplay';

// 임시 타입 작성 API 요청 시 변경될 수 있습니다.
interface ReviewCardProps {
  nickname: string;
  rating: number;
  content: string;
  createdAt: string;
}

const ReviewCard = ({ nickname, rating, content, createdAt }: ReviewCardProps) => {
  const date = new Date(createdAt);
  const viewDate = date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
    .replace(/\.$/, '');
  return (
    <div className='shadow-custom-5 flex h-auto w-auto flex-col gap-12 rounded-3xl bg-white p-20'>
      <div className='flex flex-col justify-center gap-4'>
        <div className='flex items-center gap-8'>
          <p className='text-16-b text-gray-950'>{nickname}</p>
          <p className='text 16-b text-[#A4A1AA]'>{viewDate}</p>
        </div>
        <StarRatingDisplay rating={rating} />
      </div>
      <p className='text-14-body-m sm:text-16-body-m break-keep text-gray-950'>{content}</p>
    </div>
  );
};

export default ReviewCard;
