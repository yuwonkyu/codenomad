import { useRef, useState, useCallback, useEffect } from 'react';

interface UseDraggableBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  threshold: number;
}

const DRAG_START_THRESHOLD = 15; // 드래그 시작을 위한 최소 이동 거리

export const useDraggableBottomSheet = ({
  isOpen,
  onClose,
  threshold,
}: UseDraggableBottomSheetProps) => {
  const [isClosing, setIsClosing] = useState(false);

  // 드래그 관련 ref들
  const translateYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isDragStartedRef = useRef(false); // 실제 드래그가 시작되었는지 확인
  const startYRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null); // x축 시작 위치도 저장
  const containerRef = useRef<HTMLDivElement>(null);

  // 모달 열릴 때 초기화 & body 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      translateYRef.current = 0;
      if (containerRef.current) {
        containerRef.current.style.transform = 'translateY(0px)';
        containerRef.current.style.transition = 'transform 300ms';
      }

      // 모바일 새로고침 제스처 방지
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none'; // pull-to-refresh 방지
      document.documentElement.style.overscrollBehavior = 'none'; // html에도 적용
    } else {
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    }

    return () => {
      // cleanup에서 모든 스타일 복구
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, [isOpen]);

  // 애니메이션과 함께 닫기
  const closeWithAnimation = useCallback(() => {
    if (!containerRef.current) return;
    setIsClosing(true);
    containerRef.current.style.transition = 'transform 300ms';
    containerRef.current.style.transform = `translateY(100%)`;

    const handleTransitionEnd = () => {
      containerRef.current?.removeEventListener('transitionend', handleTransitionEnd);
      setIsClosing(false);
      onClose();
    };

    containerRef.current.addEventListener('transitionend', handleTransitionEnd);
  }, [onClose]);

  // 터치 이벤트 핸들러들
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    startYRef.current = e.touches[0].clientY;
    startXRef.current = e.touches[0].clientX; // x축 위치도 저장
    isDraggingRef.current = true;
    isDragStartedRef.current = false; // 아직 실제 드래그 시작 안됨
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || startYRef.current === null || startXRef.current === null) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - startYRef.current;
    const deltaX = currentX - startXRef.current;

    // 아직 드래그가 시작되지 않았다면 시작 조건 확인
    if (!isDragStartedRef.current) {
      const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // 최소 이동 거리를 넘지 않으면 드래그 시작하지 않음
      if (totalDistance < DRAG_START_THRESHOLD) return;

      // y축 이동이 x축 이동보다 클 때만 세로 드래그로 인식
      if (Math.abs(deltaY) <= Math.abs(deltaX)) {
        // 가로 이동이 더 크면 드래그 취소
        isDraggingRef.current = false;
        return;
      }

      // 실제 드래그 시작
      isDragStartedRef.current = true;
      if (containerRef.current) {
        containerRef.current.style.transition = 'none';
      }
    }

    // 아래쪽 드래그만 허용
    if (deltaY > 0) {
      translateYRef.current = deltaY;
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${deltaY}px)`;
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    // 실제 드래그가 시작되지 않았으면 아무것도 하지 않음
    if (!isDragStartedRef.current) {
      isDraggingRef.current = false;
      startYRef.current = null;
      startXRef.current = null;
      return;
    }

    isDraggingRef.current = false;
    isDragStartedRef.current = false;

    if (!containerRef.current) return;

    containerRef.current.style.transition = 'transform 300ms';

    // 동적 threshold 적용

    if (translateYRef.current > threshold) {
      closeWithAnimation();
    } else {
      translateYRef.current = 0;
      containerRef.current.style.transform = 'translateY(0px)';
    }

    startYRef.current = null;
    startXRef.current = null;
  }, [closeWithAnimation, threshold]);

  return {
    containerRef,
    isClosing,
    closeWithAnimation,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
