import Input from '@/components/common/Input';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TitleInput = ({ value, onChange }: TitleInputProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 30) {
      onChange(inputValue);
    }
  };

  return (
    <div className='mb-24'>
      <Input
        label='제목'
        labelClassName='text-16-b'
        placeholder='제목을 입력해 주세요'
        value={value}
        onChange={handleChange}
        maxLength={30}
      />
      <div className='text-12-m text-right text-gray-400'>{value.length}/30</div>
    </div>
  );
};

export default TitleInput;
