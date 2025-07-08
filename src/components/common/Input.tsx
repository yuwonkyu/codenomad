import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <input {...props} />
  </div>
);

export default Input;
