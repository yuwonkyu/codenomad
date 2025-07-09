import Image from 'next/image';

interface IntroImagesInputProps {
  introPreviews: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (idx: number) => void;
}

export default function IntroImagesInput({
  introPreviews,
  onChange,
  onRemove,
}: IntroImagesInputProps) {
  return (
    <div className='mb-24'>
      <div className='text-16-b mb-10'>소개 이미지 등록</div>
      <div className='flex gap-12'>
        {/* 업로드 버튼(항상 왼쪽, 4개가 되어도 비활성화만) */}
        <label
          className={`relative min-w-80 min-h-80 bg-white border border-gray-100 rounded-[8px] flex items-center justify-center cursor-pointer
        ${introPreviews.length >= 4 ? 'pointer-events-none' : ''}`}
        >
          <Image src='/icons/icon_gray_eye_off.svg' alt='소개 이미지 없음' width={40} height={40} />
          <span className='absolute bottom-8 left-1/2 -translate-x-1/2 text-13-m text-gray-600'>
            {introPreviews.length}/4
          </span>
          <input
            type='file'
            accept='image/*'
            multiple
            className='absolute inset-0 opacity-0 cursor-pointer'
            onChange={onChange}
            disabled={introPreviews.length >= 4}
          />
        </label>
        {/* 등록된 이미지들 오른쪽에 나열 */}
        {introPreviews.map((src, idx) => (
          <div
            key={idx}
            className='relative w-80 h-80 rounded-[8px] border border-gray-100 flex-shrink-0'
          >
            <Image
              src={src}
              alt={`소개 이미지 ${idx + 1}`}
              fill
              className='object-cover rounded-[8px]'
            />
            <button
              type='button'
              className='absolute -top-5 -right-5 z-10'
              onClick={() => onRemove(idx)}
            >
              <Image src='/icons/icon_white_delete.svg' alt='삭제' width={20} height={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
