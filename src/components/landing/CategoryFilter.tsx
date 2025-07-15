import clsx from 'clsx';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORY_LIST = ['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'];

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className='flex flex-wrap gap-8'>
      {CATEGORY_LIST.map((category) => {
        const isSelected = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(isSelected ? null : category)}
            className={clsx(
              'px-12 py-6 rounded-full border transition-colors duration-200',
              isSelected
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-500 border-gray-300',
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
