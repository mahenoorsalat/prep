import { type SelectHTMLAttributes, forwardRef } from 'react';
import './Select.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder = 'Choose from Drop-down', className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`select-group ${error ? 'select-group--error' : ''} ${className}`}>
        {label && (
          <label htmlFor={selectId} className="select-group__label">
            {label}
          </label>
        )}
        <div className="select-group__wrapper">
          <select
            ref={ref}
            id={selectId}
            className="select-group__select"
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg className="select-group__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {error && <span className="select-group__error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
