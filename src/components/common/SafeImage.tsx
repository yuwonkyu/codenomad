'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  onClickImage?: (src: string) => void;
}

const FALLBACK_IMAGE = '/icons/empty.svg';

const SafeImage = ({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  alt,
  onClickImage,
  ...props
}: SafeImageProps) => {
  const [error, setError] = useState(false);
  const imageSrc = error ? fallbackSrc : src;
  const errorAlt = error ? alt : '이미지를 불러오는데 실패하였습니다.';

  return (
    <Image
      {...props}
      onClick={(e) => {
        props.onClick?.(e); // 기본 onClick
        onClickImage?.(imageSrc); // 선택적으로 imgSrc 넘기는 기능
      }}
      src={imageSrc}
      alt={errorAlt}
      onError={() => setError(true)}
    />
  );
};

export default SafeImage;
