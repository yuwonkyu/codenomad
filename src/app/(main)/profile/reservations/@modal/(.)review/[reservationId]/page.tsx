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
  return (
    <>
      <ReviewModal
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
        headCount={Number(headCount)}
        reservationId={Number(reservationId)}
      />
    </>
  );
}
