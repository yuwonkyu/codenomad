// ⏳ 로딩 상태 표시 컴포넌트
// 역할: 프로필 페이지들에서 데이터 로딩 중일 때 일관된 로딩 UI 제공
interface LoadingSpinnerProps {
  message?: string; // 로딩 메시지 (기본값: "로딩 중...")
  size?: 'small' | 'medium' | 'large'; // 로딩 스피너 크기
  fullPage?: boolean; // 전체 페이지 중앙 정렬 여부
}

const LoadingSpinner = ({
  message = '로딩 중...',
  size = 'medium',
  fullPage = true,
}: LoadingSpinnerProps) => {
  // 🎨 크기별 스타일 설정
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  // 🎯 컨테이너 스타일 (전체 페이지 vs 인라인)
  const containerClasses = fullPage
    ? 'mx-auto w-full max-w-2xl'
    : 'flex items-center justify-center';

  const innerClasses = fullPage
    ? 'flex items-center justify-center py-20'
    : 'flex items-center gap-2';

  return (
    <section className={containerClasses}>
      <div className={innerClasses}>
        {/* 🔄 스피너 애니메이션 */}
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-500`}
          role='status'
          aria-label='로딩 중'
        />

        {/* 📝 로딩 메시지 */}
        <div className='text-lg text-gray-500'>{message}</div>
      </div>
    </section>
  );
};

export default LoadingSpinner;
