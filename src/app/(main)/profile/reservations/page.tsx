'use client';
import Badge from '@/components/reservationList/Badge';
import ReservationCard from '@/components/reservationList/ReservationCard';
import { StatusType } from '@/components/reservationList/StatusBadge';
import { getReservationList } from '@/lib/api/profile/reservationList';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface reservationsType {
  activity: {
    bannerImageUrl: string;
    id: number;
    title: string;
  };
  createdAt: string;
  date: string;
  endTime: string;
  headCount: number;
  id: number;
  reviewSubmitted: boolean;
  scheduleId: number;
  startTime: string;
  status: StatusType;
  teamId: string;
  totalPrice: number;
  updatedAt: string;
  userId: number;
}

const Page = () => {
  const [filter, setFilter] = useState<StatusType | null>(null);
  const [reservationList, setReservationList] = useState([]);
  const statusList: { text: string; value: StatusType }[] = [
    { text: '예약 신청', value: 'pending' },
    { text: '예약 취소', value: 'canceled' },
    { text: '예약 승인', value: 'confirmed' },
    { text: '예약 거절', value: 'declined' },
    { text: '체험 완료', value: 'completed' },
  ];
  useEffect(() => {
    const getData = async () => {
      const data = await getReservationList();
      console.log(data.reservations);

      setReservationList(data.reservations);
    };
    getData();
  }, []);
  return (
    <div className='mx-auto flex w-full flex-col justify-center p-24'>
      <h1 className='text-18-b text-gray-950'>예약 내역</h1>
      <h2 className='text-14-m my-10 text-gray-500'>예약 내역을 변경 및 취소 할 수 있습니다.</h2>
      {reservationList.length === 0 && (
        <div className='mt-40 flex flex-col items-center justify-center'>
          <div className='flex justify-center'>
            <Image src={'/imgs/earth.svg'} width={122} height={122} alt='우는 지구 이미지' />
          </div>
          <p className='text-18-m my-30 text-center text-gray-600'>아직 예약한 체험이 없어요</p>
          <Link
            href={'/'}
            className='bg-primary-500 text-16-b h-54 w-182 grow-0 rounded-2xl px-63 py-17 text-white'
          >
            둘러보기
          </Link>
        </div>
      )}
      {reservationList.length !== 0 ? (
        <div className='scrollbar-hide overflow-x-scroll'>
          <div className='my-14 flex w-max grow-0 gap-8'>
            {statusList.map((item) => {
              return (
                <Badge
                  key={item.value}
                  setFilter={() => setFilter(item.value)}
                  selected={filter === item.value}
                >
                  {item.text}
                </Badge>
              );
            })}
          </div>
        </div>
      ) : null}
      {reservationList.map((item: reservationsType) => {
        return (
          <ReservationCard
            status={item.status}
            title={item?.activity?.title}
            startTime={item.startTime}
            date={item.date}
            endTime={item.endTime}
            price={item.totalPrice}
            headCount={item.headCount}
            bannerUrl={item.activity.bannerImageUrl}
          />
        );
      })}
    </div>
  );
};

export default Page;
