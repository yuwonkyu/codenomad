import Input from '@/components/common/Input';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

// 화살표 함수식 및 타입 호환성 문제 해결
const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
  return (
    <div className='mb-24'>
      <Input
        label='설명'
        labelClassName='text-16-b'
        as='textarea'
        placeholder='체험에 대한 설명을 입력해 주세요'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='min-h-108 md:min-h-168'
      />
    </div>
  );
};

export default DescriptionInput;
