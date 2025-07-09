import Input from '@/components/common/Input';

interface AddressInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AddressInput({ value, onChange }: AddressInputProps) {
  return (
    <div className='mb-30'>
      <Input
        label='주소'
        labelClassName='text-16-b'
        placeholder='주소를 입력해 주세요'
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
