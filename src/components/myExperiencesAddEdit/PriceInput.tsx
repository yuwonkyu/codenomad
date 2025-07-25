import Input from '@/components/common/Input';

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PriceInput = ({ value, onChange }: PriceInputProps) => {
  // 숫자만 추출하는 함수
  const extractNumbers = (str: string) => {
    return str.replace(/[^0-9]/g, '');
  };

  // 천 단위 콤마 추가 함수
  const formatPrice = (str: string) => {
    const numbers = extractNumbers(str);
    if (!numbers) return '';
    return `￦${parseInt(numbers).toLocaleString()}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const inputValue = e.target.value;
    const numbersOnly = extractNumbers(inputValue);
    onChange(numbersOnly);
  };

  return (
    <div className='mb-24'>
      <Input
        label='가격'
        labelClassName='text-16-b'
        placeholder='체험 금액을 입력해 주세요'
        value={formatPrice(value)}
        onChange={handleChange}
      />
    </div>
  );
};

export default PriceInput;
