import axios from 'axios'; // 프록시용 별도 인스턴스

// 프록시용 axios 인스턴스 (baseURL 없음)
const proxyApi = axios.create({
  // Content-Type 헤더를 기본으로 설정하지 않음 (FormData 사용 시 자동 설정됨)
});

// 프록시용 인터셉터 - 토큰 자동 추가
proxyApi.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // JSON 요청에만 Content-Type 설정
    if (config.data && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 이미지 압축 함수 (매우 보수적 압축)
const compressImage = (
  file: File,
  maxSizeMB: number = 2,
  quality: number = 0.95,
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      // 원본 크기 계산
      const { width, height } = img;

      // 해상도는 거의 그대로 유지 (매우 큰 경우만 축소)
      let maxWidth = 3840; // 4K 해상도까지 허용
      let maxHeight = 2160;

      // 정말 큰 이미지만 축소
      const originalSizeMB = file.size / 1024 / 1024;
      if (originalSizeMB > 15) {
        maxWidth = 2560;
        maxHeight = 1440;
      } else if (originalSizeMB > 10) {
        maxWidth = 3200;
        maxHeight = 1800;
      }

      let newWidth = width;
      let newHeight = height;

      // 비율 유지하면서 크기 조정 (필요한 경우만)
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        newWidth = Math.floor(width * ratio);
        newHeight = Math.floor(height * ratio);
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      // 최고 품질 렌더링 설정
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // 원본 확장자에 따른 MIME 타입 결정
      const extension = file.name.split('.').pop()?.toLowerCase();
      let outputMimeType = 'image/jpeg';

      // PNG나 WebP는 원본 포맷 유지
      if (extension === 'png') {
        outputMimeType = 'image/png';
      } else if (extension === 'webp') {
        outputMimeType = 'image/webp';
      }

      // 단일 품질로 압축 (반복 압축 제거)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // 파일명 설정
            let fileName = file.name.replace(/\.[^/.]+$/, '.jpg');

            if (extension === 'png') {
              fileName = file.name; // PNG는 원본 이름 유지
            } else if (extension === 'webp') {
              fileName = file.name; // WebP는 원본 이름 유지
            }

            const compressedFile = new File([blob], fileName, {
              type: outputMimeType,
              lastModified: Date.now(),
            });

            const compressedSizeMB = compressedFile.size / 1024 / 1024;

            resolve(compressedFile);
          } else {
            console.error('압축 실패, 원본 파일 사용');
            resolve(file); // 압축 실패 시 원본 반환
          }
        },
        outputMimeType, // 원본 포맷 유지 (PNG, WebP 등)
        quality,
      );
    };

    img.onerror = () => {
      console.error('이미지 로드 실패, 원본 파일 사용');
      resolve(file); // 로드 실패 시 원본 반환
    };

    img.src = URL.createObjectURL(file);
  });
};

// 체험 등록 요청 타입
export interface CreateExperienceRequest {
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  schedules: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  bannerImageUrl: string;
  subImageUrls: string[];
}

// 체험 등록 응답 타입
export interface CreateExperienceResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImageUrls: string[];
  schedules: Array<{
    id: number;
    date: string;
    startTime: string;
    endTime: string;
  }>;
  reviewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// 이미지 업로드 함수 (프록시 사용 + 압축)
export const uploadImage = async (file: File): Promise<{ activityImageUrl: string }> => {
  // 파일 유효성 검사
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('지원하지 않는 파일 형식입니다. JPEG, PNG, WebP 파일만 업로드 가능합니다.');
  }

  // 파일 크기 검사 (10MB 제한)
  const maxSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error('파일 크기가 10MB를 초과합니다.');
  }

  // 큰 파일은 압축 적용
  let uploadFile = file;
  const fileSizeMB = file.size / 1024 / 1024;

  if (fileSizeMB > 2) {
    uploadFile = await compressImage(file, 2, 0.8);
  }

  const formData = new FormData();
  formData.append('image', uploadFile);

  try {
    const response = await proxyApi.post('/api/proxy/activities/image', formData);

    return response.data;
  } catch (error: any) {
    console.error('이미지 업로드 실패:', error);

    // axios 에러 처리
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      console.error('업로드 실패 상세:', {
        status,
        statusText: error.response.statusText,
        data: errorData,
        headers: error.response.headers,
      });

      if (status === 413) {
        throw new Error('파일 크기가 너무 큽니다. 더 작은 이미지를 선택해주세요.');
      }

      if (status === 401) {
        throw new Error('로그인이 필요합니다.');
      }

      if (status === 400) {
        // 400 에러의 구체적인 메시지 확인
        const message = errorData?.message || errorData?.error || '잘못된 요청입니다.';
        throw new Error(`업로드 실패: ${message}`);
      }

      throw new Error(`업로드 실패: ${status} - ${errorData?.message || '알 수 없는 오류'}`);
    }

    throw error;
  }
};

// 체험 등록 함수 (프록시 사용)
export const createExperience = async (
  data: CreateExperienceRequest,
): Promise<CreateExperienceResponse> => {
  try {
    const response = await proxyApi.post('/api/proxy/activities', data);

    console.log('체험 등록 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('체험 등록 실패:', error);

    // axios 에러 처리
    if (error.response) {
      const status = error.response.status;
      console.error('체험 등록 실패:', status, error.response.data);

      if (status === 401) {
        throw new Error('로그인이 필요합니다.');
      }

      throw new Error(`체험 등록 실패: ${status}`);
    }

    throw error;
  }
};

// API 연결 테스트 함수 (필요시에만 사용)
export const testApiConnection = async () => {
  try {
    const response = await proxyApi.get('/api/proxy/activities', {
      params: {
        method: 'cursor',
        size: 1,
      },
    });

    console.log('API 연결 테스트 성공:', response.data);
    return true;
  } catch (error: any) {
    console.error('API 연결 테스트 실패:', error);

    if (error.response) {
      console.error('응답 상태:', error.response.status);
    }

    return false;
  }
};
