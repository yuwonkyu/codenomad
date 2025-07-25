'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NotiItemProps {
  id: number;
  content: string;
  createdAt: string;
  onDelete: () => void;
  onClick: () => void;
}

const renderContent = (content: string) => {
  const highlight = (word: string, className: string) => {
    const [before, after] = content.split(word);
    return (
      <>
        {before}
        <span className={className}>{word}</span>
        {after}
      </>
    );
  };

  if (content.includes('승인')) return highlight('승인', 'text-primary-500');
  if (content.includes('거절')) return highlight('거절', 'text-red');
  return content;
};

const NotiItem = ({ content, createdAt, onDelete, onClick }: NotiItemProps) => {
  return (
    <div
      className='flex w-full cursor-pointer items-start justify-between px-12 py-12 sm:px-16 sm:py-20'
      onClick={onClick}
    >
      {/* 왼쪽: 내용 + 시간 */}
      <div className='flex min-w-0 flex-grow flex-col gap-4'>
        <span className='text-14-m break-words'>{renderContent(content)}</span>
        <span className='text-12-m text-gray-400'>
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale: ko,
          })}
        </span>
      </div>

      {/* 오른쪽: 삭제 아이콘 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className='ml-8 shrink-0'
      >
        <Image src='/icons/icon_delete.svg' alt='삭제' width={24} height={24} />
      </button>
    </div>
  );
};

export default NotiItem;
