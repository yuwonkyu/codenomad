import Input from '@/components/common/Input';
import { Path } from 'react-hook-form';
import type { PriceInputProps } from './types';
import type { FieldValues } from 'react-hook-form';

const extractNumbers = (str: string) => str.replace(/[^0-9]/g, '');

const formatPrice = (str: string) => {
  const numbers = extractNumbers(str);
  if (!numbers) return '';
  return `￦${parseInt(numbers).toLocaleString()}`;
};

const PriceInput = <T extends FieldValues>({ register, error, value }: PriceInputProps<T>) => (
  <div className='mb-24'>
    <Input
      label='가격'
      labelClassName='text-16-b'
      placeholder='체험 금액을 입력해 주세요'
      {...register('price' as Path<T>, {
        onChange: (e) => {
          e.target.value = extractNumbers(e.target.value);
        },
      })}
      error={error}
      value={formatPrice(value)}
    />
  </div>
);

export default PriceInput;
