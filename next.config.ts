import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['sprint-fe-project.s3.ap-northeast-2.amazonaws.com'],
  },
  // API 라우트 설정
  api: {
    bodyParser: {
      sizeLimit: '10mb', // API 라우트 크기 제한 증가
    },
  },
  // 실험적 기능 (Next.js 15)
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
