import axios from './axios';
import type { ActivityDetail, ReviewResponse } from '@/components/activities/Activities.types';

export const fetchActivitiesDetails = async (activityId: number): Promise<ActivityDetail> => {
  const res = await axios.get<ActivityDetail>(`/activities/${activityId}`);
  return res.data;
};

export const fetchActivityReviews = async (activityId: number, page = 1, size = 3) => {
  const res = await axios.get(`/activities/${activityId}/reviews`, {
    params: { page, size },
  });
  return res.data;
};
