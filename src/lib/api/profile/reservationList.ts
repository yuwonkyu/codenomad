import { StatusType } from '@/components/reservationList/StatusBadge';
import axios from '@/lib/api/axios';

export interface ReviewDataType {
  rating: number;
  content: string;
}

export const getReservationList = async () => {
  const res = await axios.get('my-reservations');
  return res.data;
};

export const getReservationListStatus = async (status: StatusType) => {
  const res = await axios.get(`my-reservations?status=${status}`);
  return res.data;
};

export const postReview = async (reservationId: number, data: ReviewDataType) => {
  const res = await axios.post(`my-reservations/${reservationId}/reviews`, data);
  return res.data;
};
