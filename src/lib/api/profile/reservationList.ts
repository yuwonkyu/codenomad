import axios from '@/lib/api/axios';

interface getReservationListType {
  cursorId: null | number;
}

export const getReservationList = async () => {
  const res = await axios.get('my-reservations');
  return res.data;
};
