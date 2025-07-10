'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/common/Input';
import { ProfileMobileContext } from '../layout'; // 경로는 실제 구조에 맞게 조정

const InformationPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const router = useRouter();

  // Context에서 onCancel 가져오기
  const mobileContext = useContext(ProfileMobileContext);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === 'duplicate@email.com') {
      setEmailError('중복된 이메일입니다.');
      return;
    }

    if (isFormValid) {
      alert('API 연결 전입니다->회원가입이 완료되었습니다 모달 구현 예정');
      router.push('/login');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-376 md:max-w-640 space-y-24 p-24 md:p-32 bg-white rounded-16'
    >
      <h2 className='text-18-b my-[5px]'>내 정보</h2>
      <p>닉네임과 비밀번호를 수정하실 수 있습니다.</p>

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

      {/* 저장/취소 버튼 (모바일에서만 보임) */}
      <div className='flex justify-center gap-3 block md:hidden'>
        <button
          type='button'
          className='w-[120px] h-[41px] py-3 rounded-[12px] border border-gray-300 text-gray-700 text-16-m bg-white'
          onClick={mobileContext?.onCancel}
        >
          취소하기
        </button>
        <button
          type='submit'
          className='w-[120px] h-[41px] py-3 rounded-[12px] text-white text-16-m bg-blue-500 cursor-pointer hover:shadow-md hover:shadow-brand-blue/60 transition-all duration-200'
        >
          저장하기
        </button>
      </div>

      {/* 저장 버튼 (PC에서만 보임) */}
      <div className='flex justify-center hidden md:flex'>
        <button
          type='submit'
          className='w-[120px] h-[41px] py-3 rounded-[12px] text-white text-16-m bg-blue-500 cursor-pointer hover:shadow-md hover:shadow-brand-blue/60 transition-all duration-200'
        >
          저장하기
        </button>
      </div>
    </form>
  );
};

export default InformationPage;
