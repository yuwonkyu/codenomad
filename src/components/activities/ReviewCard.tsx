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
    <div className='rounded-3xl p-20 flex flex-col gap-12 max-w-327 h-auto bg-white shadow-custom-5 sm:max-w-684'>
      <div className='flex flex-col justify-center gap-4'>
        <div className='flex gap-8 items-center'>
          <p className='text-gray-950 text-16-b'>{nickname}</p>
          <p className='text 16-b text-[#A4A1AA]'>{viewDate}</p>
        </div>
        <StarRatingDisplay rating={rating} />
      </div>
      <p className='text-gray-950 text-14-body-m sm:text-16-body-m break-keep'>{content}</p>
    </div>
  );
};

export default ReviewCard;
