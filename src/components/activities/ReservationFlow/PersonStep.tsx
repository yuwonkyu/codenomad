import Image from 'next/image';

interface PersonStepProps {
  headCount: number;
  onChangeHeadCount: (count: number) => void;
  variant?: 'tablet' | 'desktop';
}

const PersonStep = ({ headCount, onChangeHeadCount, variant }: PersonStepProps) => {
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
        'flex items-center justify-around rounded-[0.75rem] border-gray-100 border w-144 h-48',
    },
    tablet: {
      wrapper: 'flex flex-col justify-between',
      title: 'text-16-b mb-20 text-gray-950',
      counterContainer:
        'flex items-center justify-around rounded-[0.75rem] border-gray-100 border w-full h-52',
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
        <label htmlFor='headCount' className={currentStyles.title}>
          참여 인원 수
        </label>
        <div className={currentStyles.counterContainer}>
          <button onClick={handleDecrease} className='relative size-20'>
            <Image src='/icons/icon_minus.svg' alt='인원 감소' fill />
          </button>
          <input
            id='headCount'
            type='number'
            value={headCount}
            onChange={(e) => {
              const value = Number(e.target.value);
              onChangeHeadCount(Math.min(value, 100));
            }}
            className='text-16-b w-32 appearance-none bg-transparent text-center text-[#4b4b4b] outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
            min={1}
            max={100}
          />
          <button onClick={handleIncrease} className='relative size-20'>
            <Image src='/icons/icon_plus.svg' alt='인원 추가' fill />
          </button>
        </div>
      </div>
    </>
  );
};

export default PersonStep;
