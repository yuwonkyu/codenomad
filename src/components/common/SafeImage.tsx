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
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      onClick={(e) => {
        props.onClick?.(e); // 기본 onClick
        onClickImage?.(imgSrc); // 선택적으로 imgSrc 넘기는 기능
      }}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc!)}
    />
  );
};

export default SafeImage;
