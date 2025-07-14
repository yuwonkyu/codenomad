'use client';

import { useContext, MouseEventHandler, ReactNode, Children } from 'react';
import { DropdownContext } from './Dropdown';

interface ItemProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const Item = ({ children, onClick, className }: ItemProps) => {
  const context = useContext(DropdownContext);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick?.(e);
    context?.close();
  };

  return (
    <button
      type='button'
      className={`text-16-m text-center hover:bg-gray-100 ${className ?? ''}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Item;
