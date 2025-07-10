'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/common/Input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 유효성 검사 함수
  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(isValid ? '' : '이메일 형식으로 작성해 주세요.');
  };

  const validatePassword = (value: string) => {
    setPasswordError(value.length >= 8 ? '' : '8자 이상 작성해 주세요.');
  };

  // 폼 유효성 상태
  const isFormValid = email && password && !emailError && !passwordError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isFormValid && alert('API 연결 전입니다ㅎㅎ');
  };

  return (
    <main className='min-h-screen flex justify-center px-1 pt-[60px] lg:pt-[100px]'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-[376px] md:max-w-[640px] space-y-4 md:space-y-6 
                 bg-white p-6 md:p-8 rounded-[16px]'
      >
        {/* 로고 */}
        <div>
          <Link href='/'>
            <img
              src='/icons/logoHorizon.svg'
              alt='GlobalNomad Logo'
              className='mx-auto mb-8 w-[144px] md:w-[255px]'
            />
          </Link>
        </div>

        {/* 이메일 입력 */}
        <Input
          label='이메일'
          type='email'
          placeholder='이메일을 입력해 주세요'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => validateEmail(e.target.value)}
          error={emailError}
          autoComplete='email'
        />

        {/* 비밀번호 입력 */}
        <Input
          label='비밀번호'
          type='password'
          placeholder='비밀번호를 입력해 주세요'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => validatePassword(e.target.value)}
          error={passwordError}
          autoComplete='current-password'
        />

        {/* 로그인 버튼 */}
        <button
          className='w-full mt-2 py-3 rounded-[12px] text-white text-16-m bg-brand-blue disabled:bg-gray-300 cursor-pointer'
          disabled={!isFormValid}
          type='submit'
        >
          로그인하기
        </button>

        {/* or */}
        <div className='flex items-center justify-center w-full my-6'>
          <hr className='flex-grow border-t border-gray-300' />
          <span className='px-4 text-16-m text-gray-500 whitespace-nowrap'>or</span>
          <hr className='flex-grow border-t border-gray-300' />
        </div>

        {/* 카카오 로그인 */}
        <button className='w-full py-3 border border-gray-300 rounded-[12px] flex justify-center items-center text-gray-600 text-16-m'>
          <img src='/icons/icon_kakao.svg' alt='kakaoicon' className='w-5 h-5 mr-2' />
          카카오 로그인
        </button>

        {/* 회원가입 링크 */}
        <p className='text-center text-13-m text-gray-600'>
          회원이 아니신가요?{' '}
          <Link href='/signup' className='text-13-b text-gray-600 underline'>
            회원가입하기
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
