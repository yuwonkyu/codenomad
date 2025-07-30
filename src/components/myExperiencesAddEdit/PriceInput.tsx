import Input from '@/components/common/Input';
import { formatPrice } from '@/utils/formatPrice';
import { FieldValues, Path } from 'react-hook-form';
import { PriceInputProps } from './MyExperiences';

const PriceInput = <T extends FieldValues>({
  value,
  error,
  register,
  path,
}: PriceInputProps<T>) => {
  return (
    <div className="mb-24">
      <Input
        label="가격"
        labelClassName="text-16-b"
        placeholder="체험 금액을 입력해 주세요"
        error={error}
        value={value}
        inputMode="numeric"
        {...register(path as Path<T>)}
      />
      {value && (
        <div className="text-14-r mt-2 text-gray-500">
          {formatPrice(Number(value))}
        </div>
      )}
    </div>
  );
};

export default PriceInput;
