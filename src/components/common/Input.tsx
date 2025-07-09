'use client';

import { useState, InputHTMLAttributes } from 'react';
import Image from 'next/image';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input = ({ label = '', error, className = '', type = 'text', ...props }: InputProps) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  // 에러 상태일 때 테두리 클래스
  const baseOutline = 'outline outline-1 outline-offset-[-1px] transition-all duration-150';
  const outlineColor = error
    ? 'outline-red'
    : 'focus-within:outline-brand-blue focus-within:outline-1.5 outline-gray-200';

  return (
    <div className={`flex flex-col items-start w-full ${className}`}>
      <label className='text-gray-950 pb-10 text-16-m'>{label}</label>

      <div
        className={`w-full px-20 py-16 bg-white rounded-[16px] shadow-custom-5 flex justify-between items-center ${baseOutline} ${outlineColor}`}
      >
        <input
          type={inputType}
          className='flex-1 border-none outline-none text-gray-950 text-16-m placeholder:text-gray-400 bg-transparent'
          placeholder={props.placeholder}
          {...props}
        />
        {isPassword && (
          <div className='ml-8 flex items-center justify-center'>
            <Image
              src={show ? '/icons/icon_gray_eye_on.svg' : '/icons/icon_gray_eye_off.svg'}
              alt='비밀번호 표시'
              width={24}
              height={24}
              onClick={() => setShow((v) => !v)}
              className='cursor-pointer'
            />
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && <p className='mt-6 ml-8 text-12-m text-red'>{error}</p>}
    </div>
  );
};

export default Input;
