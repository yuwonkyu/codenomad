import Input from '@/components/common/Input';

interface CategoryInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

export default function CategoryInput({ value, onChange, options }: CategoryInputProps) {
  return (
    <div className='mb-24'>
      <Input
        label='카테고리'
        labelClassName='text-16-b '
        as='select'
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
