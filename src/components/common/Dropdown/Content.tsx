'use client';

import { ReactNode, useContext } from 'react';
import { DropdownContext } from './Dropdown';

interface ContentProps {
  children: ReactNode;
  className?: string;
}

const Content = ({ children, className }: ContentProps) => {
  const context = useContext(DropdownContext);
  if (!context || !context.isOpen) return null;

  return (
    <div
      className={`flex flex-col border-2 border-[#DFDFDF] z-1 w-95 absolute mt-2 rounded-lg bg-white shadow-md ${
        className ?? ''
      }`}
    >
      {children}
    </div>
  );
};

export default Content;
