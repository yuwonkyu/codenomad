import { StatusType } from './StatusBadge';

interface BadgeType {
  children: React.ReactNode;
  setFilter: () => void;
  selected: boolean;
}
const Badge = ({ children, setFilter, selected }: BadgeType) => {
  return (
    <span
      className='text-16-m text-gray-950 bg-white px-16 py-10 rounded-full border-1 border-[#d8d8d8]'
      onClick={() => setFilter()}
    >
      {children}
    </span>
  );
};

export default Badge;
