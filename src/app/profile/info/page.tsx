'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/common/Input';
import { ProfileMobileContext } from '../layout';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/api/profile';

const InformationPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Context에서 onCancel 가져오기
  const mobileContext = useContext(ProfileMobileContext);

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const profile = await getUserProfile();
        setEmail(profile.email);
        setNickname(profile.nickname);
      } catch (err) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', err);
        setError('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

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
    !nicknameError &&
    !emailError &&
    (!password || (password && confirmPassword && !passwordError && !confirmError));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // 2. 나머지 정보 업데이트
      const updateData: any = {
        nickname,
        email,
      };

      // 비밀번호가 입력된 경우에만 포함
      if (password) {
        updateData.password = password;
      }

      await updateUserProfile(updateData);

      alert('회원정보가 성공적으로 수정되었습니다.');

      // 비밀번호 필드 초기화
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('회원정보 수정 실패:', err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setEmailError('중복된 이메일입니다.');
      } else {
        setError('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className='w-full max-w-376 md:max-w-640 space-y-24 p-24 md:p-32 bg-white rounded-16'>
        <div className='flex justify-center items-center h-32'>
          <div className='text-gray-500'>로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-376 md:max-w-640 space-y-24 p-24 md:p-32 bg-white rounded-16'
    >
      {/* 모바일: 상단에 Vector.png + 내 정보 (클릭 시 onCancel) */}
      <div
        className='flex items-center gap-2 mb-4 block md:hidden'
        onClick={mobileContext?.onCancel}
        style={{ cursor: 'pointer' }}
      >
        <img src='/icons/Vector.png' alt='vector' width={20} height={20} />
        <span className='text-[20px] font-bold'>내 정보</span>
      </div>
      {/* PC/태블릿: 기존 내 정보 타이틀 */}
      <h2 className='text-18-b my-[5px] hidden md:block'>내 정보</h2>
      <p>닉네임과 비밀번호를 수정하실 수 있습니다.</p>

      {/* 에러 메시지 */}
      {error && <div className='text-red-500 text-sm bg-red-50 p-3 rounded-lg'>{error}</div>}

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
        label='새 비밀번호 (변경 시에만 입력)'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={(e) => validatePassword(e.target.value)}
        placeholder='8자 이상 입력해 주세요'
        error={passwordError}
        type='password'
        autoComplete='new-password'
      />

      <Input
        label='새 비밀번호 확인'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={(e) => validateConfirm(e.target.value)}
        placeholder='비밀번호를 한번 더 입력해 주세요'
        error={confirmError}
        type='password'
        autoComplete='new-password'
        disabled={!password}
      />

      {/* 저장/취소 버튼 (모바일에서만 보임) */}
      <div className='flex justify-center gap-3 block md:hidden'>
        <button
          type='button'
          className='flex-1 h-[41px] py-3 px-[10px] rounded-[12px] border border-gray-300 text-gray-700 text-16-m bg-white'
          onClick={mobileContext?.onCancel}
          disabled={isLoading}
        >
          취소하기
        </button>
        <button
          type='submit'
          className='flex-1 h-[41px] py-3 px-[10px] rounded-[12px] text-white text-16-m bg-blue-500 cursor-pointer hover:shadow-md hover:shadow-brand-blue/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {/* 저장 버튼 (PC에서만 보임) */}
      <div className='flex justify-center hidden md:flex'>
        <button
          type='submit'
          className='w-[120px] h-[41px] py-3 rounded-[12px] text-white text-16-m bg-blue-500 cursor-pointer hover:shadow-md hover:shadow-brand-blue/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </form>
  );
};

export default InformationPage;
