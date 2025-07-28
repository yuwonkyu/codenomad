import { StatusType } from '@/components/reservationList/StatusBadge';
import instance from '@/lib/api/axios';

export interface ReviewDataType {
  rating: number;
  content: string;
}

export const getReservationList = async (
  cursorId: number | null = null,
  status: StatusType | null = null,
) => {
  const cursorQuery = cursorId !== null ? `&cursorId=${cursorId}` : '';
  const statusQuery = status !== null ? `&status=${status}` : '';
  const res = await instance.get(`my-reservations?size=2&${cursorQuery + statusQuery}`);
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
