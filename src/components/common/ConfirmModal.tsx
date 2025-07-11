'use client';

import React from 'react';

interface ConfirmModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmModal = ({ message, isOpen, onClose }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white rounded-[20px] shadow-custom-5 text-center px-24 py-24 w-320  sm:w-400 flex flex-col items-center '>
        <p
          className='mb-20 text-black break-keep'
          style={{
            fontSize: 'var(--text-16-b)',
            fontWeight: 'var(--text-16-b--font-weight)',
          }}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className='w-200 h-44 rounded-xl text-white cursor-pointer'
          style={{
            backgroundColor: 'var(--color-primary-500)',
            fontSize: 'var(--text-16-m)',
            fontWeight: 'var(--text-16-m--font-weight)',
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
