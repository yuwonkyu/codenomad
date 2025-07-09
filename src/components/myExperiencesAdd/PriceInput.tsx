import Input from '@/components/common/Input';

interface PriceInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PriceInput({ value, onChange }: PriceInputProps) {
  return (
    <div className='mb-24'>
      <Input
        label='가격'
        labelClassName='text-16-b'
        placeholder='체험 금액을 입력해 주세요'
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
