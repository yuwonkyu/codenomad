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
    if (isFormValid) {
      alert('API 연결 전입니다ㅎㅎ');
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div>
          <Link href='/'>
            <img src='/icons/logoHorizon.svg' alt='GlobalNomad Logo' />
          </Link>
        </div>

        {/* 이메일 입력 */}
        <Input
          label='이메일'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => validateEmail(e.target.value)}
          error={emailError}
          placeholder='이메일을 입력해 주세요.'
          autoComplete='email'
        />

        {/* 비밀번호 입력 */}
        <Input
          label='비밀번호'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => validateEmail(e.target.value)}
          error={passwordError}
          placeholder='비밀번호를 입력해 주세요.'
          autoComplete='current-password'
        />

        {/* 로그인 버튼 */}
        <button type='submit' disabled={!isFormValid}>
          로그인하기
        </button>

        {/* 카카오 로그인 */}
        <button>
          <img src='/icons/icon_kakao.svg' alt='kakaoicon' />
          카카오 로그인
        </button>

        {/* 회원가입 링크 */}
        <p>
          회원이 아니신가요? <Link href='/signup'>회원가입하기</Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
