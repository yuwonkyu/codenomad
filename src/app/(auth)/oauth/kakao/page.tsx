'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import instance from '@/lib/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import LoadingPage from '@/components/common/LoadingPage';

const KakaoCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchKakaoToken = async () => {
      const code = searchParams.get('code');
      if (!code) return;

      try {
        const loginRes = await instance.post('oauth/sign-in/kakao', {
          token: code,
          redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
        });

        const { accessToken, refreshToken, user } = loginRes.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUser(user);

        router.push('/');
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const error = err as { response?: { status?: number } };
          if ([403, 404].includes(error.response?.status || 0)) {
            router.replace(`/oauth/kakao/signup?code=${code}`);
          } else {
            alert('카카오 로그인 실패');
          }
        } else {
          alert('카카오 로그인 실패');
        }
      }
    };

    fetchKakaoToken();
  }, [router, searchParams, setAccessToken, setRefreshToken, setUser]);

  return <LoadingPage message='카카오 로그인 처리 중입니다...' />;
};

const KakaoCallbackPage = () => {
  return (
    <Suspense fallback={<LoadingPage message='카카오 로그인 처리 중입니다...' />}>
      <KakaoCallbackContent />
    </Suspense>
  );
};

export default KakaoCallbackPage;
