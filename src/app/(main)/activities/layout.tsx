import { ReactNode } from 'react';

export default function ActivitiesLayout({ children }: { children: ReactNode }) {
  return (
    <main className='mx-24 my-30 md:mx-30 md:my-34 lg:mx-auto lg:my-88 lg:max-w-1200'>
      {children}
    </main>
  );
}
