'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Input from '@/components/common/Input';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');

  // 이메일 유효성
  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(isValid ? '' : '잘못된 이메일입니다.');
  };

  // 닉네임 유효성
  const validateNickname = (value: string) => {
    setNicknameError(value.length <= 10 ? '' : '10자 이하로 작성해주세요.');
  };

  // 비밀번호 유효성
  const validatePassword = (value: string) => {
    setPasswordError(value.length >= 8 ? '' : '8자 이상 입력해주세요.');
  };

  const validateConfirm = (value: string) => {
    setConfirmError(value === password ? '' : '비밀번호가 일치하지 않습니다.');
  };

  // 비밀번호 변경하면 다시 확인되게
  useEffect(() => {
    if (confirmPassword) {
      validateConfirm(confirmPassword);
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className='min-h-screen flex justify-center px-1 pt-60 lg:pt-100'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-376 md:max-w-640 space-y-24 p-24 md:p-32 bg-white rounded-16'
      >
        {/* 로고 */}
        <div>
          <Link href='/'>
            <img
              src='/icons/logoHorizon.svg'
              alt='GlobalNomad Logo'
              className='mx-auto mb-32 w-144 md:w-255'
            />
          </Link>
        </div>
        <Input
          label='이메일'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => validateEmail(e.target.value)}
          placeholder='이메일을 입력해 주세요'
          error={emailError}
          type='email'
          autoComplete='email'
        />

        <Input
          label='닉네임'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onBlur={(e) => validateNickname(e.target.value)}
          placeholder='닉네임을 입력해 주세요'
          error={nicknameError}
          autoComplete='username'
        />

        <Input
          label='비밀번호'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => validatePassword(e.target.value)}
          placeholder='8자 이상 입력해 주세요'
          error={passwordError}
          type='password'
          autoComplete='new-password'
        />

        <Input
          label='비밀번호 확인'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={(e) => validateConfirm(e.target.value)}
          placeholder='비밀번호를 한번 더 입력해 주세요'
          error={confirmError}
          type='password'
          autoComplete='new-password'
        />
      </form>
    </main>
  );
};

export default SignupPage;
