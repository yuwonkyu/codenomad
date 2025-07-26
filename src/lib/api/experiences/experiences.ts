import instance from '../axios';
import axios from 'axios';
import type {
  ExperienceDetail,
  CreateExperienceRequest,
  CreateExperienceResponse,
  UpdateExperienceRequest,
} from './experiences.types';

// ================== 체험 상세 조회 ==================
export const getExperienceDetail = async (id: string | number): Promise<ExperienceDetail> => {
  try {
    const response = await instance.get(`/activities/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 404) throw new Error('존재하지 않는 체험입니다.');
      if (status === 401) throw new Error('로그인이 필요합니다.');
      throw new Error(error.response.data?.message || '체험 정보를 불러오지 못했습니다.');
    }
    throw error;
  }
};

// ================== 이미지 압축 함수 ==================
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
      const { width, height } = img;
      let maxWidth = 1920;
      let maxHeight = 1080;
      const originalSizeMB = file.size / 1024 / 1024;
      if (originalSizeMB > maxSizeMB * 4) {
        maxWidth = 1280;
        maxHeight = 720;
      } else if (originalSizeMB > maxSizeMB * 2.5) {
        maxWidth = 1600;
        maxHeight = 900;
      } else if (originalSizeMB > maxSizeMB * 1.5) {
        maxWidth = 1920;
        maxHeight = 1080;
      } else {
        maxWidth = 2560;
        maxHeight = 1440;
      }
      let newWidth = width;
      let newHeight = height;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        newWidth = Math.floor(width * ratio);
        newHeight = Math.floor(height * ratio);
      }
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const extension = file.name.split('.').pop()?.toLowerCase();
      let outputMimeType = 'image/jpeg';
      if (extension === 'png') outputMimeType = 'image/png';
      else if (extension === 'webp') outputMimeType = 'image/webp';
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const baseFileName = file.name.replace(/\.[^/.]+$/, '');
            let fileName = `${baseFileName}.jpg`;
            if (extension === 'png') fileName = `${baseFileName}.png`;
            else if (extension === 'webp') fileName = `${baseFileName}.webp`;
            const compressedFile = new File([blob], fileName, {
              type: outputMimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        outputMimeType,
        quality,
      );
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
};

// ================== 이미지 업로드 함수 ==================
export const uploadImage = async (file: File): Promise<{ activityImageUrl: string }> => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('지원하지 않는 파일 형식입니다. JPEG, PNG, WebP 파일만 업로드 가능합니다.');
  }
  const maxSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error('파일 크기가 10MB를 초과합니다.');
  }
  let uploadFile = file;
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > 2) uploadFile = await compressImage(file, 2, 0.8);
  const compressedSizeMB = uploadFile.size / 1024 / 1024;
  if (compressedSizeMB > 1.5) uploadFile = await compressImage(uploadFile, 1, 0.6);
  const finalSizeMB = uploadFile.size / 1024 / 1024;
  if (finalSizeMB > 1) uploadFile = await compressImage(uploadFile, 0.8, 0.5);
  const fieldNames = ['imageFile', 'image', 'file', 'activityImage', 'upload'];
  for (const fieldName of fieldNames) {
    const formData = new FormData();
    formData.append(fieldName, uploadFile);
    try {
      const response = await instance.post('/activities/image', formData);
      return response.data;
    } catch (error: unknown) {
      if (fieldName !== fieldNames[fieldNames.length - 1]) continue;
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        if (status === 413)
          throw new Error('파일 크기가 너무 큽니다. 더 작은 이미지를 선택해주세요.');
        if (status === 401) throw new Error('로그인이 필요합니다.');
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

// ================== 체험 등록 ==================
export const createExperience = async (
  data: CreateExperienceRequest,
): Promise<CreateExperienceResponse> => {
  try {
    const response = await instance.post('/activities', data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401) throw new Error('로그인이 필요합니다.');
      throw new Error(error.response.data?.message || `체험 등록 실패: ${status}`);
    }
    throw error;
  }
};

// ================== 체험 수정 ==================
export const updateExperience = async (
  experienceId: number | string,
  data: UpdateExperienceRequest,
): Promise<CreateExperienceResponse> => {
  try {
    const res = await instance.patch(`/my-activities/${experienceId}`, data);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401) throw new Error('로그인이 필요합니다.');
      throw new Error(error.response.data?.message || `체험 수정 실패: ${status}`);
    }
    throw error;
  }
};
