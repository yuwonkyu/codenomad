'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/common/Input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('API 연결 전입니다ㅎㅎ');
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
        />

        {/* 비밀번호 입력 */}
        <Input
          label='비밀번호'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 로그인 버튼 */}
        <button type='submit'>로그인하기</button>

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
