import Input from '@/components/common/Input';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface DescriptionInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  error?: string;
  value: string;
}

const DescriptionInput = <T extends FieldValues>({
  register,
  error,
  value,
}: DescriptionInputProps<T>) => (
  <div className='mb-24'>
    <Input
      label='설명'
      labelClassName='text-16-b'
      as='textarea'
      placeholder='체험에 대한 설명을 입력해 주세요'
      maxLength={1000}
      {...register('description' as Path<T>)}
      error={error}
      value={value}
      className='min-h-108 md:min-h-168'
    />
    <div className='text-12-m text-right text-gray-400'>{value.length}/1000</div>
  </div>
);

export default DescriptionInput;
