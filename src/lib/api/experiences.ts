import instance from './axios'; // 직접 API 호출로 변경

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

      // 해상도 적극적 축소 - 파일 크기에 따른 단계적 축소
      let maxWidth = 1920; // 기본 FHD 해상도
      let maxHeight = 1080;

      // 파일 크기에 따른 해상도 제한
      const originalSizeMB = file.size / 1024 / 1024;
      if (originalSizeMB > 8) {
        maxWidth = 1280; // HD 해상도
        maxHeight = 720;
      } else if (originalSizeMB > 5) {
        maxWidth = 1600; // 중간 해상도
        maxHeight = 900;
      } else if (originalSizeMB > 3) {
        maxWidth = 1920; // FHD 해상도
        maxHeight = 1080;
      } else {
        maxWidth = 2560; // 큰 해상도 허용 (작은 파일)
        maxHeight = 1440;
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
            // 압축 실패 시 원본 반환
            resolve(file);
          }
        },
        outputMimeType, // 원본 포맷 유지 (PNG, WebP 등)
        quality,
      );
    };

    img.onerror = () => {
      // 이미지 로드 실패 시 원본 반환
      resolve(file);
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

// 이미지 업로드 함수 (직접 API 호출 + 압축)
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

  // 적극적인 압축 적용 - 단계적 압축
  let uploadFile = file;
  const fileSizeMB = file.size / 1024 / 1024;

  // 1단계: 기본 압축 (2MB 이상)
  if (fileSizeMB > 2) {
    uploadFile = await compressImage(file, 2, 0.8);
  }

  // 2단계: 압축 후에도 여전히 큰 경우 추가 압축
  const compressedSizeMB = uploadFile.size / 1024 / 1024;
  if (compressedSizeMB > 1.5) {
    uploadFile = await compressImage(uploadFile, 1, 0.6); // 더 강한 압축
  }

  // 3단계: 최종 안전장치 - 1MB 이상이면 최대 압축
  const finalSizeMB = uploadFile.size / 1024 / 1024;
  if (finalSizeMB > 1) {
    uploadFile = await compressImage(uploadFile, 0.8, 0.5); // 최대 압축
  }

  // 다양한 필드명으로 시도
  const fieldNames = ['imageFile', 'image', 'file', 'activityImage', 'upload'];

  for (const fieldName of fieldNames) {
    const formData = new FormData();
    formData.append(fieldName, uploadFile);

    try {
      const response = await instance.post('/activities/image', formData);
      return response.data;
    } catch (error: any) {
      // 마지막 필드명이 아니면 다음 필드명 시도
      if (fieldName !== fieldNames[fieldNames.length - 1]) {
        continue;
      }

      // 마지막 시도도 실패하면 에러 처리
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 413) {
          throw new Error('파일 크기가 너무 큽니다. 더 작은 이미지를 선택해주세요.');
        }

        if (status === 401) {
          throw new Error('로그인이 필요합니다.');
        }

        if (status === 400) {
          const message = errorData?.message || errorData?.error || '잘못된 요청입니다.';
          throw new Error(`업로드 실패: ${message}`);
        }

        throw new Error(`업로드 실패: ${status} - ${errorData?.message || '알 수 없는 오류'}`);
      }

      throw error;
    }
  }

  throw new Error('모든 필드명 시도 실패');
};

// 체험 등록 함수 (프록시 사용)
export const createExperience = async (
  data: CreateExperienceRequest,
): Promise<CreateExperienceResponse> => {
  try {
    const response = await instance.post('/activities', data);

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;

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
    const response = await instance.get('/activities', {
      params: {
        method: 'cursor',
        size: 1,
      },
    });

    return true;
  } catch (error: any) {
    if (error.response) {
      // 응답 에러 상태코드만 확인
    }

    return false;
  }
};
