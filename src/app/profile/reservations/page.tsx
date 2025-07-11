'use client';
import LandingCard from '@/components/landing/LandingCard';
import ReservationCard from '@/components/reservationList/ReservationCard';

const page = () => {
  return (
    <div className='p-19'>
      {/* <LandingCard title='title' rating={4.5} totalReview={10} price={1000} /> */}
      <ReservationCard
        status='pending'
        title='title'
        date='0000.00.00'
        startTime='11:00'
        endTime='12:00'
        price={35000}
        headCount={30}
      />
      <ReservationCard
        status='completed'
        title='title'
        date='0000.00.00'
        startTime='11:00'
        endTime='12:00'
        price={35000}
        headCount={30}
      />
      <ReservationCard
        status='confirmed'
        title='title'
        date='0000.00.00'
        startTime='11:00'
        endTime='12:00'
        price={35000}
        headCount={30}
      />
    </div>
  );
};

export default page;
