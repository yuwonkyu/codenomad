import Input from '@/components/common/Input';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

// 화살표 함수식 및 타입 호환성 문제 해결
const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 1000) {
      onChange(inputValue);
    }
  };

  return (
    <div className='mb-24'>
      <Input
        label='설명'
        labelClassName='text-16-b'
        as='textarea'
        placeholder='체험에 대한 설명을 입력해 주세요'
        value={value}
        onChange={handleChange}
        className='min-h-108 md:min-h-168'
        maxLength={1000}
      />
      <div className='text-12-m text-right text-gray-400'>{value.length}/1000</div>
    </div>
  );
};

export default DescriptionInput;
