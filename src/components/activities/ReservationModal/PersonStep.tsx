import Image from 'next/image';

interface PersonStepProps {
  headCount: number;
  setHeadCount: (count: number) => void;
  onConfirm?: () => void; // 태블릿에서는 확인 버튼이 필요 없을 수 있음
  showConfirmButton?: boolean;
  variant?: 'tablet' | 'desktop'; // mobile은 기본 동작이므로 제외
}

const PersonStep = ({
  headCount,
  setHeadCount,
  onConfirm,
  showConfirmButton = true,
  variant, // 기본값 undefined = mobile 동작
}: PersonStepProps) => {
  const handleDecrease = () => {
    setHeadCount(Math.max(1, headCount - 1));
  };

  const handleIncrease = () => {
    setHeadCount(headCount + 1);
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
        'flex items-center justify-around rounded-[12px] border-gray-100 border w-144 h-48',
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
            <Image src={'/icons/icon_minus.svg'} alt={'인원 감소'} fill />
          </button>
          <span className='text-16-b text-[#4b4b4b]'>{headCount}</span>
          <button onClick={handleIncrease} className='relative size-20 cursor-pointer'>
            <Image src={'/icons/icon_plus.svg'} alt={'인원 추가'} fill />
          </button>
        </div>
      </div>

      {showConfirmButton && onConfirm && (
        <button
          className='w-full h-50 bg-primary-500 text-white text-16-b rounded-[14px] py-15 hover:bg-primary-600 mt-30 cursor-pointer'
          onClick={onConfirm}
        >
          확인
        </button>
      )}
    </>
  );
};

export default PersonStep;
