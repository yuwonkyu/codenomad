// ❌ 에러 메시지 표시 컴포넌트
// 역할: 프로필 페이지들에서 에러 발생 시 일관된 에러 UI 제공
interface ErrorMessageProps {
  message: string; // 에러 메시지
  type?: 'error' | 'warning' | 'info'; // 에러 타입
  fullPage?: boolean; // 전체 페이지 중앙 정렬 여부
  onRetry?: () => void; // 재시도 버튼 클릭 핸들러 (선택적)
}

const ErrorMessage = ({ message, type = 'error', fullPage = true, onRetry }: ErrorMessageProps) => {
  // 🎨 타입별 스타일 설정
  const typeStyles = {
    error: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-500',
      borderColor: 'border-red-200',
      icon: '❌',
    },
    warning: {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      icon: '⚠️',
    },
    info: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      icon: 'ℹ️',
    },
  };

  const styles = typeStyles[type];

  // 🎯 컨테이너 스타일 (전체 페이지 vs 인라인)
  const containerClasses = fullPage ? 'mx-auto w-full max-w-2xl' : 'w-full';

  const innerClasses = fullPage
    ? 'flex flex-col items-center justify-center py-20'
    : 'flex flex-col items-center py-4';

  return (
    <section className={containerClasses}>
      <div className={innerClasses}>
        {/* 📦 에러 메시지 박스 */}
        <div
          className={`w-full max-w-md rounded-lg border p-4 ${styles.bgColor} ${styles.borderColor} `}
        >
          <div className='flex items-center gap-3'>
            {/* 🎯 아이콘 */}
            <span className='text-lg'>{styles.icon}</span>

            {/* 📝 에러 메시지 */}
            <div className={`text-sm font-medium ${styles.textColor}`}>{message}</div>
          </div>
        </div>

        {/* 🔄 재시도 버튼 (onRetry가 있는 경우만 표시) */}
        {onRetry && (
          <button
            onClick={onRetry}
            className='mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600'
          >
            다시 시도
          </button>
        )}
      </div>
    </section>
  );
};

export default ErrorMessage;
