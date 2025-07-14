import { useEffect, useState } from 'react';

type ScreenSize = 'sm' | 'md' | 'lg';

const getBreakpoint = (width: number): ScreenSize => {
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  return 'sm';
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => {
    // 클라이언트에서만 window 접근 가능
    if (typeof window !== 'undefined') {
      return getBreakpoint(window.innerWidth);
    }
    // SSR 환경이면 기본값 임의로 설정 ('lg' 권장)
    return 'lg';
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getBreakpoint(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};
