import Image from 'next/image';
import { clsx } from 'clsx';
import type { SubImage } from './Activities.types';

interface PhotoSectionProps {
  bannerImages: string;
  subImages: SubImage[];
}

const PhotoSection = ({ bannerImages, subImages }: PhotoSectionProps) => {
  const renderImageSection = () => {
    const images = subImages.slice(0, 4);
    const length = images.length;

    if (length === 0) return null;

    if (length === 1) {
      return (
        <figure className='relative h-full w-full overflow-hidden rounded-r-3xl'>
          <Image src={images[0].imageUrl} alt='서브 이미지 1' fill className='object-cover' />
        </figure>
      );
    }

    const gridClass = clsx(
      'grid h-full w-full gap-12',
      length === 2 && 'grid-rows-2',
      length >= 3 && 'grid-cols-2 grid-rows-2',
    );

    return (
      <div className={gridClass}>
        {images.map((img, index) => (
          <figure
            key={img.id}
            className={clsx(
              'relative h-full overflow-hidden',
              length === 2 && index === 0 && 'rounded-tr-3xl',
              length === 2 && index === 1 && 'rounded-br-3xl',
              length === 3 && index === 1 && 'rounded-tr-3xl',
              length === 3 && index === 2 && 'col-span-2 rounded-br-3xl',
              length === 4 && index === 1 && 'rounded-tr-3xl',
              length === 4 && index === 3 && 'rounded-br-3xl',
            )}
          >
            <Image
              src={img.imageUrl}
              alt={`서브 이미지 ${index + 1}`}
              fill
              className='object-cover'
            />
          </figure>
        ))}
      </div>
    );
  };

  return (
    <section className='flex h-245 w-auto items-center justify-center gap-12 sm:h-400 lg:h-600'>
      <figure className='relative h-full w-full overflow-hidden rounded-l-3xl'>
        <Image className='object-cover' src={bannerImages} alt='메인 이미지' fill />
      </figure>
      {renderImageSection()}
    </section>
  );
};

export default PhotoSection;
