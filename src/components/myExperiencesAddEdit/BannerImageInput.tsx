import Image from 'next/image';

interface BannerImageInputProps {
  bannerPreview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  banner: File | null;
}

const BannerImageInput = ({ bannerPreview, onChange, onRemove, banner }: BannerImageInputProps) => {
  return (
    <div className='mb-30'>
      <div className='text-16-b mb-10'>배너 이미지 등록</div>
      <div className='flex gap-12 md:gap-14'>
        <label
          className={`relative size-80 md:size-126 lg:size-128 bg-white border border-gray-100 rounded-[8px] flex items-center justify-center cursor-pointer
        ${bannerPreview ? 'pointer-events-none' : ''}`}
        >
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 md:gap-10'>
            <Image src='/icons/icon_gray_plus.svg' alt='배너 이미지 없음' width={40} height={40} />
            <span className='text-13-m text-gray-600'>{bannerPreview ? '1/1' : '0/1'}</span>
          </div>
          <input
            type='file'
            accept='image/*'
            className='absolute inset-0 opacity-0 cursor-pointer'
            onChange={onChange}
            disabled={!!banner}
            required
          />
        </label>
        {bannerPreview && (
          <div className='relative size-80 md:size-126 lg:size-128 rounded-[8px] border border-gray-100 flex-shrink-0'>
            <Image
              src={bannerPreview}
              alt='배너 이미지 미리보기'
              fill
              className='object-cover rounded-[8px]'
            />
            <button type='button' className='absolute -top-5 -right-5 z-10' onClick={onRemove}>
              <Image
                src='/icons/icon_white_delete.svg'
                alt='삭제'
                width={20}
                height={20}
                className='md:w-[26px] md:h-[26px] w-[20px] h-[20px]'
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerImageInput;
