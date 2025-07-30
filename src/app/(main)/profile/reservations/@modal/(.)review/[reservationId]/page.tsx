import ReviewModal from '@/components/reservationList/ReviewModal';

type Props = {
  params: {
    reservationId: string;
  };
  searchParams: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    headCount: string;
  };
};

export default async function page({ params, searchParams }: Props) {
  const { reservationId } = params;
  const { title, date, startTime, endTime, headCount } = searchParams;

  if (!reservationId || isNaN(Number(reservationId))) {
    throw new Error('올바르지 않은 예약 ID입니다.');
  }

  if (!title || !date || !startTime || !endTime || !headCount) {
    throw new Error('필수 예약 정보가 누락되었습니다.');
  }

  const numericHeadCount = Number(headCount);
  const numericReservationId = Number(reservationId);

  if (isNaN(numericHeadCount) || isNaN(numericReservationId)) {
    throw new Error('올바르지 않은 숫자 형식입니다.');
  }

  return (
    <>
      <ReviewModal
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
        headCount={numericHeadCount}
        reservationId={numericReservationId}
      />
    </>
  );
}
