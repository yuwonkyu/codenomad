import Input from '@/components/common/Input';

interface DescriptionInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  return (
    <div className='mb-24'>
      <Input
        label='설명'
        labelClassName='text-16-b'
        as='textarea'
        placeholder='체험에 대한 설명을 입력해 주세요'
        value={value}
        onChange={onChange}
        className='min-h-108'
      />
    </div>
  );
}
