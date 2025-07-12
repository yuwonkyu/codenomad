'use client';

import { createContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close]);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div ref={dropdownRef} className={`relative ${className ?? ''}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Item = Item;

export default Dropdown;
