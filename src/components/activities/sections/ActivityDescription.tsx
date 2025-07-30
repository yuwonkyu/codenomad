'use client';

interface ActivityDescriptionProps {
  text: string;
}

const ActivityDescription = ({ text }: ActivityDescriptionProps) => {
  return (
    <section className='flex flex-col gap-8 border-b-1 border-gray-100 pb-12'>
      <h2 className='text-18-b text-gray-950'>체험 설명</h2>
      <p className='text-16-body-m mb-20 text-gray-950 md:mb-40'>{text}</p>
    </section>
  );
};

export default ActivityDescription;
