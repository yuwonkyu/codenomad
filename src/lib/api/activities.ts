import axios from './axios';
import type { ActivityDetail } from '@/components/activities/Activities.types';

export const fetchActivitiesDetails = async (activityId: number): Promise<ActivityDetail> => {
  const res = await axios.get<ActivityDetail>(`/activities/${activityId}`);
  return res.data;
};
