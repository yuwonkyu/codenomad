/**
 * 공통 모달 컴포넌트
 * - open: 모달 표시 여부
 * - icon: 상단 아이콘(이미지 등)
 * - text: 안내/경고 텍스트 (줄바꿈은 <br />)
 * - cancelText, confirmText: 버튼 텍스트
 * - onCancel, onConfirm: 버튼 클릭 핸들러
 */
interface CommonModalProps {
  open: boolean;
  icon?: React.ReactNode;
  text: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const CommonModal = ({
  open,
  icon,
  text,
  cancelText = '아니오',
  confirmText = '취소하기',
  onCancel,
  onConfirm,
}: CommonModalProps) => {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white rounded-[24px] md:rounded-[30px] shadow-custom-5 w-320 md:w-400 h-216 md:h-285 flex flex-col items-center justify-center px-43 md:px-59 pt-[30px] pb-[24px] md:py-30'>
        {/* 아이콘: 모바일 49x49, 테블릿 88x88 */}
        {icon && (
          <div className='mb-2 flex items-center justify-center'>
            <span className='size-49 md:size-88 flex items-center justify-center'>{icon}</span>
          </div>
        )}
        {/* 텍스트: <br />로 줄바꿈 */}
        <div
          className='text-18-body-b md:text-20-body-b mb-20 md:mb-24 text-center'
          dangerouslySetInnerHTML={{ __html: text }}
        />
        {/* 버튼 */}
        <div className='flex gap-8 md:gap-12 w-full justify-center'>
          <button
            type='button'
            className='flex-1 h-41 md:h-47 rounded-[12px] md:rounded-[14px] border border-gray-200 bg-white text-14-m md:text-16-m text-gray-600'
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type='button'
            className='flex-1 h-41 md:h-47 rounded-[12px] md:rounded-[14px] bg-primary-500 text-white text-14-b md:text-16-m'
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
