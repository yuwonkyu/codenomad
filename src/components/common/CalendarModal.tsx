import { useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarModalProps {
  open: boolean;
  value: Date | null;
  onChange: (date: Date) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

const CalendarModal = ({ open, value, onChange, onClose, position }: CalendarModalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className='absolute z-50 bg-white rounded-[16px] shadow-custom-5 p-8'
      style={position ? { top: position.top, left: position.left } : {}}
    >
      <Calendar
        onChange={(date) => {
          onChange(date as Date);
          onClose();
        }}
        value={value ?? new Date()}
      />
    </div>
  );
};

export default CalendarModal;
