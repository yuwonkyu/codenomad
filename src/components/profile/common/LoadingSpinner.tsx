// ⏳ 로딩 상태 표시 컴포넌트
// 역할: 프로필 페이지들에서 데이터 로딩 중일 때 일관된 로딩 UI 제공
interface LoadingSpinnerProps {
  message?: string; // 로딩 메시지 (기본값: "로딩 중...")
  size?: 'small' | 'medium' | 'large'; // 로딩 스피너 크기
  fullPage?: boolean; // 전체 페이지 중앙 정렬 여부
  useLogo?: boolean; // 로고 스피너 사용 여부 (기본값: false)
}

const LoadingSpinner = ({
  message = '로딩 중...',
  size = 'large',
  fullPage = true,
  useLogo = false,
}: LoadingSpinnerProps) => {
  // 🎨 크기별 스타일 설정
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-20 w-20',
  };

  // 🖼️ 로고 크기 설정 (로고는 가로형이므로 너비를 더 크게)
  const logoSizeClasses = {
    small: 'h-10 w-auto',
    medium: 'h-14 w-auto',
    large: 'h-20 w-auto',
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
        {/* 🔄 스피너/로고 애니메이션 */}
        {useLogo ? (
          <img
            src='/imgs/loading.png'
            alt='로딩 중'
            className={`${logoSizeClasses[size]} animate-spin`}
            role='status'
            aria-label='로딩 중'
          />
        ) : (
          <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-500`}
            role='status'
            aria-label='로딩 중'
          />
        )}

        {/* 📝 로딩 메시지 */}
        <div className='ml-5 text-lg text-gray-500'>{message}</div>
      </div>
    </section>
  );
};

export default LoadingSpinner;
