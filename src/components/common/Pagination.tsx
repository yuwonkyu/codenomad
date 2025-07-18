'use client';

import Image from 'next/image';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let end = start + maxPagesToShow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className='flex items-center justify-center gap-12 mt-40 mb-40'>
      {/* 왼쪽 화살표 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='w-40 h-40 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-default'
      >
        <Image src='/icons/icon_chevron_left.svg' alt='이전 페이지' width={40} height={40} />
      </button>

      {/* 페이지 번호 */}
      <div className='flex gap-8'>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-40 h-40 rounded-xl text-14-m flex items-center justify-center cursor-pointer transition-colors ${
              page === currentPage
                ? 'bg-primary-500 text-white font-bold'
                : 'text-gray-400 hover:text-gray-950'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* 오른쪽 화살표 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='w-40 h-40 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-default'
      >
        <Image src='/icons/icon_chevron_right.svg' alt='이전 페이지' width={40} height={40} />
      </button>
    </div>
  );
};

export default Pagination;
