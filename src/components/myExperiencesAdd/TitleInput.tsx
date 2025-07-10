import Input from '@/components/common/Input';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TitleInput = ({ value, onChange }: TitleInputProps) => {
  return (
    <div className='mb-24'>
      <Input
        label='제목'
        labelClassName='text-16-b'
        placeholder='제목을 입력해 주세요'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TitleInput;
