'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  onClickImage?: (src: string) => void;
}

const SafeImage = ({
  src,
  fallbackSrc = '/icons/empty.svg',
  alt,
  onClickImage,
  ...props
}: SafeImageProps) => {
  const [error, setError] = useState(false);
  const imageSrc = error ? fallbackSrc : src;

  return (
    <Image
      {...props}
      onClick={(e) => {
        props.onClick?.(e); // 기본 onClick
        onClickImage?.(imageSrc); // 선택적으로 imgSrc 넘기는 기능
      }}
      src={imageSrc}
      alt={alt}
      onError={() => setError(true)}
    />
  );
};

export default SafeImage;
