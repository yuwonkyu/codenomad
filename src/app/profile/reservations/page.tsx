import LandingCard from '@/components/landing/LandingCard';

const page = () => {
  return (
    <div className='p-19'>
      <LandingCard title='title' rating={4.5} totalReview={10} price={1000} />
    </div>
  );
};

export default page;
