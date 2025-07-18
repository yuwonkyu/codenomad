import { ReactNode } from 'react';

export default function ActivitiesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className='mx-24 my-30 flex flex-col gap-20 md:mx-30 md:my-34 md:gap-30 lg:mx-12 lg:my-88 lg:items-center'>
        {children}
      </div>
    </>
  );
}
