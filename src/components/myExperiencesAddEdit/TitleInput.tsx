import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import Input from '@/components/common/Input';

interface TitleInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  error?: string;
  value: string;
}

const TitleInput = <T extends FieldValues>({ register, error, value }: TitleInputProps<T>) => (
  <div className='mb-24'>
    <Input
      label='제목'
      labelClassName='text-16-b'
      placeholder='제목을 입력해 주세요'
      maxLength={30}
      {...register('title as Path<T>)}')}
      error={error}
      value={value}
    />
    <div className='text-12-m text-right text-gray-400'>{value.length}/30</div>
  </div>
);

export default TitleInput;
