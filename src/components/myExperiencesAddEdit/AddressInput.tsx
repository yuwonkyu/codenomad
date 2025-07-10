import Input from '@/components/common/Input';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
}

// 화살표 함수식으로 변경 및 onChange 타입 호환성 문제 해결
const AddressInput = ({ value, onChange }: AddressInputProps) => {
  return (
    <div className='mb-30'>
      <Input
        label='주소'
        labelClassName='text-16-b'
        placeholder='주소를 입력해 주세요'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default AddressInput;
