'use client';

import { useState } from 'react';
import Link from 'next/link';

const SignupPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className='min-h-screen flex justify-center px-1 pt-60 lg:pt-100'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-376 md:max-w-640 space-y-24 p-24 md:p-32 bg-white rounded-16'
      >
        {/* 로고 */}
        <div>
          <Link href='/'>
            <img
              src='/icons/logoHorizon.svg'
              alt='GlobalNomad Logo'
              className='mx-auto mb-32 w-144 md:w-255'
            />
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignupPage;
