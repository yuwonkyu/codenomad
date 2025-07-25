import instance from '../axios';

// 사용자 정보 타입 정의
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  profileImageUrl?: string;
}

// 사용자 정보 수정 요청 타입
export interface UpdateProfileRequest {
  nickname?: string;
  email?: string;
  password?: string;
}

// 사용자 정보 조회
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await instance.get('/users/me', {});
  return response.data;
};

// 사용자 정보 수정
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const response = await instance.patch('/users/me', data);
  return response.data;
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (file: File): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await instance.post('/users/me/image', formData);
  return response.data;
};
