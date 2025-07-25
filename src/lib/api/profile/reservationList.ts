import { StatusType } from '@/components/reservationList/StatusBadge';
import instance from '@/lib/api/axios';

export interface ReviewDataType {
  rating: number;
  content: string;
}

export const getReservationList = async () => {
  const res = await instance.get('my-reservations');
  return res.data;
};

export const getReservationListStatus = async (status: StatusType) => {
  const res = await instance.get(`my-reservations?status=${status}`);
  return res.data;
};

export const cancelReservation = async (reservationId: number) => {
  const res = await instance.patch(`my-reservations/${reservationId}`, {
    status: 'canceled',
  });
  return res;
};

export const postReview = async (reservationId: number, data: ReviewDataType) => {
  const res = await instance.post(`my-reservations/${reservationId}/reviews`, data);
  return res.data;
};
