import React from 'react';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <h1>Profile Page</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
