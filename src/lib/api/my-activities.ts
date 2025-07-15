import axios from '../api/axios';

// 내 체험 목록 응답 타입
export interface MyActivitiesResponse {
  cursorId: number;
  totalCount: number;
  activities: MyActivity[];
}

// 내 체험 타입
export interface MyActivity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// 내 체험 목록 조회
// 페이지네이션을 위해 cursorId와 size를 받을 수 있도록 수정
export const getMyActivities = async (
  cursorId?: number,
  size: number = 5,
): Promise<MyActivitiesResponse> => {
  const token = localStorage.getItem('accessToken');
  const params = new URLSearchParams();
  if (cursorId) {
    params.append('cursorId', String(cursorId));
  }
  params.append('size', String(size));

  const response = await axios.get('/my-activities', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};
