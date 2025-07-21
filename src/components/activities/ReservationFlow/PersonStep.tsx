import Image from 'next/image';

interface PersonStepProps {
  headCount: number;
  onChangeHeadCount: (count: number) => void;
  onConfirm?: () => void;
  showConfirmButton?: boolean;
  variant?: 'tablet' | 'desktop';
}

const PersonStep = ({
  headCount,
  onChangeHeadCount,
  onConfirm,
  showConfirmButton = true,
  variant,
}: PersonStepProps) => {
  const handleDecrease = () => {
    onChangeHeadCount(headCount - 1); // 보정 없음
  };

  const handleIncrease = () => {
    onChangeHeadCount(headCount + 1); // 보정 없음
  };
  // 통합 스타일 객체
  const styles = {
    mobile: {
      wrapper: 'flex items-center justify-between',
      title: 'text-16-b text-gray-950',
      counterContainer:
        'flex items-center justify-around rounded-[12px] border-gray-100 border w-144 h-48',
    },
    tablet: {
      wrapper: 'flex flex-col justify-between',
      title: 'text-16-b mb-20 text-gray-950',
      counterContainer:
        'flex items-center justify-around rounded-[12px] border-gray-100 border w-full h-52',
    },
    desktop: {
      wrapper: 'flex items-center justify-between',
      title: 'text-16-b text-gray-950',
      counterContainer:
        'flex items-center justify-around rounded-3xl border-gray-100 border w-144 h-48',
    },
  };

  // 현재 variant에 맞는 스타일 가져오기
  const currentStyles = styles[variant || 'mobile'];

  return (
    <>
      <div className={currentStyles.wrapper}>
        <span className={currentStyles.title}>참여 인원 수</span>
        <div className={currentStyles.counterContainer}>
          <button onClick={handleDecrease} className='relative size-20 cursor-pointer'>
            <Image src='/icons/icon_minus.svg' alt='인원 감소' fill />
          </button>
          <span className='text-16-b text-[#4b4b4b]'>{headCount}</span>
          <button onClick={handleIncrease} className='relative size-20 cursor-pointer'>
            <Image src='/icons/icon_plus.svg' alt='인원 추가' fill />
          </button>
        </div>
      </div>
      {showConfirmButton && onConfirm && (
        <button
          className='bg-primary-500 text-16-b hover:bg-primary-600 mt-30 h-50 w-full cursor-pointer rounded-[14px] py-15 text-white'
          onClick={onConfirm}
        >
          확인
        </button>
      )}
    </>
  );
};

export default PersonStep;
