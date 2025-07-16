import { twMerge } from 'tailwind-merge';

interface BadgeType {
  children: React.ReactNode;
  setFilter: () => void;
  selected: boolean;
}
const Badge = ({ children, setFilter, selected }: BadgeType) => {
  const selectedStyle = 'bg-black text-white';
  return (
    <span
      className={twMerge(
        `text-16-m cursor-pointer rounded-full border-1 border-[#d8d8d8] bg-white px-16 py-10 text-gray-950 hover:bg-black hover:text-white ${
          selected && selectedStyle
        }`,
      )}
      onClick={() => setFilter()}
    >
      {children}
    </span>
  );
};

export default Badge;
