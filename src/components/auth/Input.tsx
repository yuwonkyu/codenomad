'use client';

import {
  useState,
  useRef,
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from 'react';
import Image from 'next/image';

type InputTypes = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> &
  SelectHTMLAttributes<HTMLSelectElement>;

interface InputProps extends InputTypes {
  label?: string | ReactNode;
  hideLabelOnMobile?: boolean;
  hideLabelOnDesktop?: boolean;
  error?: string;
  className?: string;
  labelClassName?: string;
  as?: 'input' | 'textarea' | 'select';
  options?: { value: string; label: ReactNode }[];
  dateIcon?: boolean;
  onDateIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, InputProps>(
  (
    {
      label = '',
      hideLabelOnMobile = false,
      hideLabelOnDesktop = false,
      error,
      className = '',
      labelClassName = '',
      type = 'text',
      as = 'input',
      options = [],
      dateIcon = false,
      onDateIconClick,
      ...rest
    },
    ref,
  ) => {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    const baseOutline = 'outline outline-1 outline-offset-[-1px] transition-all duration-150';
    const outlineColor = error
      ? 'outline-red'
      : 'focus-within:outline-primary-500 focus-within:outline-[1.5px] outline-gray-200';

    return (
      <div className={`flex w-full flex-col items-start ${className}`}>
        {/* 라벨 */}
        {label && (
          <label
            className={`pb-10 ${labelClassName} ${hideLabelOnMobile ? 'hidden md:block' : ''} ${
              hideLabelOnDesktop ? 'block md:hidden' : ''
            }`}
          >
            {label}
          </label>
        )}

        {/* 인풋 영역 */}
        <div
          className={`shadow-custom-5 flex w-full items-center justify-between rounded-[16px] bg-white px-20 py-16 ${baseOutline} ${outlineColor} ${
            rest.onClick ? 'cursor-pointer' : 'cursor-text'
          }`}
        >
          {as === 'textarea' ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={`text-16-m flex-1 resize-none border-none bg-transparent text-gray-950 outline-none placeholder:text-gray-400`}
              {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : as === 'select' ? (
            <div className='relative w-full'>
              <select
                ref={ref as React.Ref<HTMLSelectElement>}
                className={`text-16-m w-full flex-1 appearance-none border-none bg-transparent outline-none ${
                  rest.value === '' ? 'text-gray-400' : 'text-gray-950'
                }`}
                {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
              >
                {options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className={opt.value === '' ? 'text-gray-400' : 'text-gray-900'}
                    disabled={opt.value === ''}
                    hidden={opt.value === ''}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className='pointer-events-none absolute top-1/2 right-0 -translate-y-1/2'>
                <Image src='/icons/icon_alt arrow_down.svg' alt='드롭다운' width={24} height={24} />
              </span>
            </div>
          ) : (
            <div className='relative flex w-full items-center'>
              <input
                ref={ref as React.Ref<HTMLInputElement>}
                type={inputType}
                className='text-16-m flex-1 border-none bg-transparent text-gray-950 outline-none placeholder:text-gray-400'
                {...(rest as InputHTMLAttributes<HTMLInputElement>)}
              />

              {dateIcon && (
                <button
                  type='button'
                  className='ml-8 flex cursor-pointer items-center justify-center'
                  tabIndex={-1}
                  onClick={onDateIconClick}
                >
                  <Image src='/icons/icon_calendar.svg' alt='달력' width={24} height={24} />
                </button>
              )}

              {isPassword && (
                <div className='ml-8 flex items-center justify-center'>
                  <Image
                    src={show ? '/icons/icon_gray_eye_on.svg' : '/icons/icon_gray_eye_off.svg'}
                    alt='비밀번호 표시'
                    width={24}
                    height={24}
                    onClick={() => setShow((v) => !v)}
                    className='cursor-pointer'
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && <p className='text-12-m text-red mt-6 ml-8'>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
