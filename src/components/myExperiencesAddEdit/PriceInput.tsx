
import Input from '@/components/common/Input';
import { formatPrice } from '@/utils/formatPrice';
const extractNumbers = (str: string) => str.replace(/[^0-9]/g, '');

interface PriceInputProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

const PriceInput = ({ value, onChange, error }: PriceInputProps) => {
  return (
    <div className='mb-24'>
      <Input
        label='가격'
        labelClassName='text-16-b'
        placeholder='체험 금액을 입력해 주세요'
        error={error}
        value={value}
        onChange={(e) => {
          const onlyNum = extractNumbers(e.target.value);
          onChange(onlyNum);
        }}
        inputMode='numeric'
      />
      {/* 입력값이 있을 때만 포맷된 금액 표시 */}
      {value && extractNumbers(value) && (
        <div className='text-14-r mt-2 text-gray-500'>{formatPrice(Number(value))}</div>
      )}
    </div>
  );
};

export default PriceInput;
