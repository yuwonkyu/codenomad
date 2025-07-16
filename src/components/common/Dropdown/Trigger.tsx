'use client';

import { useContext, ReactNode } from 'react';
import { DropdownContext } from './Dropdown';

interface TriggerProps {
  children: ReactNode;
  className?: string;
}

const Trigger = ({ children, className }: TriggerProps) => {
  const context = useContext(DropdownContext);
  if (!context) return null;

  return (
    <button
      type='button'
      onClick={context.toggle}
      className={className}
      aria-haspopup='menu'
      aria-expanded={context.isOpen}
    >
      {children}
    </button>
  );
};

export default Trigger;
