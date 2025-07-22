import { StatusType } from '@/components/reservationList/StatusBadge';
import axios from '@/lib/api/axios';

interface getReservationListType {
  cursorId: null | number;
}

export const getReservationList = async () => {
  const res = await axios.get('my-reservations');
  return res.data;
};

export const getReservationListStatus = async (status: StatusType) => {
  const res = await axios.get(`my-reservations?status=${status}`);
  return res.data;
};
