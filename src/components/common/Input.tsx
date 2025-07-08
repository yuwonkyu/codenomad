'use client';

import React, { useState, InputHTMLAttributes, forwardRef } from 'react';
import Image from 'next/image';

// Input 컴포넌트의 props 타입 정의
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // 인풋 상단 라벨
  error?: string; // 에러 메시지
  className?: string; // 추가 클래스
}

// Input 컴포넌트 정의 (forwardRef로 ref 전달)
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label = 'title', className = '', type = 'text', ...props }, ref) => {
    // 비밀번호 표시/숨김 토글 상태
    const [show, setShow] = useState(false);

    // type이 password면 눈 아이콘 표시
    const isPassword = type === 'password';
    // 눈 아이콘 클릭 시 type 변경
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
      <div className='flex flex-col justify-start items-start '>
        {/* 라벨 */}
        <div className='text-gray-950 pb-2.5 text-16-m'>{label}</div>
        {/* 인풋+아이콘 영역 */}
        <div className='w-full px-5 py-4 bg-white rounded-[16px] shadow-custom-5 outline-1 outline-offset-[-1px] outline-gray-100 flex justify-between items-center'>
          {/* 실제 입력창 */}
          <input
            ref={ref}
            type={inputType}
            className='flex-1 border-none outline-none text-gray-950 text-16-m placeholder:text-gray-400'
            placeholder={props.placeholder}
            {...props}
          />
          {/* 오른쪽 아이콘 영역: 비밀번호 인풋일 때만 표시 */}
          {isPassword && (
            <div className='flex items-center justify-center '>
              <Image
                src={show ? '/icons/icon_eye_on.svg' : '/icons/icon_eye_off.svg'}
                alt='비밀번호 표시'
                width={24}
                height={24}
                onClick={() => setShow((v) => !v)}
                className='cursor-pointer '
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
