'use client';

import { createContext, useState, useCallback, ReactNode } from 'react';
import Trigger from './Trigger';
import Content from './Content';
import Item from './Item';

interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

export const DropdownContext = createContext<DropdownContextType | null>(null);

const Dropdown = ({ children, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div className={`relative ${className ?? ''}`}>{children}</div>
    </DropdownContext.Provider>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Item = Item;

export default Dropdown;
