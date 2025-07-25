'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/common/Input';
import ConfirmModal from '@/components/common/ConfirmModal';
import axios from 'axios';
import { signupApi } from '@/lib/api/auth';
import { redirectToKakaoOAuth } from '@/lib/utils/kakao';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const router = useRouter();

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

  // 폼 유효성 상태
  const isFormValid =
    nickname &&
    email &&
    password &&
    confirmPassword &&
    !nicknameError &&
    !emailError &&
    !passwordError &&
    !confirmError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      await signupApi({ email, password, nickname }); // API 요청
      setIsSuccessModalOpen(true); // 성공 모달
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = (error.response?.data as { message?: string })?.message;
        const fallback = '회원가입에 실패했습니다.';
        setErrorMessage(serverMessage ?? fallback);
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }

      setIsModalOpen(true);
    }
  };

  const handleKakaoSignup = () => {
    redirectToKakaoOAuth();
  };

  return (
    <main className='flex min-h-screen justify-center px-1 pt-60 lg:pt-100'>
      {/* 가입 완료 모달 */}
      <ConfirmModal
        isOpen={isSuccessModalOpen}
        message='가입이 완료되었습니다.'
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push('/login');
        }}
      />
      {/* 중복 이메일 모달 */}
      <ConfirmModal
        isOpen={isModalOpen}
        message={errorMessage}
        onClose={() => setIsModalOpen(false)}
      />

      <form
        onSubmit={handleSubmit}
        className='rounded-16 w-full max-w-376 space-y-24 bg-white p-24 md:max-w-640 md:p-32'
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
          autoComplete='password'
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

        {/* 회원가입 버튼 */}
        <button
          type='submit'
          disabled={!isFormValid}
          className='text-16-m bg-primary-500 hover:shadow-brand-blue/60 h-48 w-full cursor-pointer rounded-[12px] py-3 text-white transition-all duration-200 hover:shadow-md disabled:bg-gray-300'
        >
          회원가입 하기
        </button>

        {/* or */}
        <div className='flex w-full items-center justify-center'>
          <hr className='flex-grow border-t border-gray-300' />
          <span className='text-16-m px-16 whitespace-nowrap text-gray-500'>
            sns 계정으로 회원가입하기
          </span>
          <hr className='flex-grow border-t border-gray-300' />
        </div>

        {/* 카카오 회원가입 */}
        <button
          onClick={handleKakaoSignup}
          className='text-16-m flex w-full cursor-pointer items-center justify-center rounded-[12px] border border-gray-300 py-12 text-gray-600 transition-colors duration-200 hover:bg-gray-100'
        >
          <img
            src='/icons/icon_kakao.svg'
            alt='kakaoicon'
            className='text-13-m mr-8 h-20 w-20 text-gray-600'
          />
          카카오 회원가입
        </button>

        {/* 로그인 링크 */}
        <p className='text-13-m text-center text-gray-600'>
          회원이신가요?{' '}
          <Link href='/login' className='text-13-b text-gray-600 underline'>
            로그인하기
          </Link>
        </p>
      </form>
    </main>
  );
};

export default SignupPage;
