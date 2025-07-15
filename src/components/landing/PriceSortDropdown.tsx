'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface SortDropdownProps {
  selectedSort: string | null;
  onSelectSort: (sort: string) => void;
}

const SORT_OPTIONS = [
  { label: '낮은 가격순', value: 'price_asc' },
  { label: '높은 가격순', value: 'price_desc' },
];

const PriceSortDropdown = ({ selectedSort, onSelectSort }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = SORT_OPTIONS.find((opt) => opt.value === selectedSort)?.label || '가격';

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className='text-14-m text-gray-700 flex items-center gap-4'
      >
        {selectedLabel}
        <img
          src='/icons/icon_alt arrow_down.svg'
          alt='드롭다운 화살표'
          className={clsx('transition-transform', { 'rotate-180': isOpen })}
        />
      </button>

      {isOpen && (
        <ul className='absolute top-full mt-4 right-1/2 translate-x-1/2 bg-white border border-gray-200 shadow-md rounded-md z-10 min-w-[90px] whitespace-nowrap sm:right-0 sm:translate-x-0'>
          {SORT_OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => {
                  onSelectSort(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  'px-16 py-8 w-full text-left text-14-m hover:bg-gray-100 transition-colors duration-150',
                  selectedSort === option.value && 'text-primary font-semibold',
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PriceSortDropdown;
