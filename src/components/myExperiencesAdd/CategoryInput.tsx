import Input from '@/components/common/Input';

interface CategoryInputProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

// 화살표 함수식 및 타입 호환성 문제 해결
const CategoryInput = ({ value, onChange, options }: CategoryInputProps) => {
  return (
    <div className='mb-24'>
      <Input
        label='카테고리'
        labelClassName='text-16-b '
        as='select'
        options={options}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CategoryInput;
