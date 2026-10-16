// frontend/src/components/auth/PasswordInput.jsx
import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({
  value,
  onChange,
  placeholder = 'Enter your password',
  required    = true,
  accent      = '#4F46E5',
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Lock
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2
                   text-neutral-400 pointer-events-none z-10"
      />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          '--tw-ring-color': `${accent}20`,
        }}
        className="w-full pl-11 pr-12 py-3 rounded-xl text-sm
                   bg-white dark:bg-neutral-800
                   text-neutral-900 dark:text-neutral-100
                   border border-neutral-200 dark:border-neutral-700
                   placeholder-neutral-400
                   focus:outline-none focus:ring-2
                   transition-all duration-200"
        onFocus={(e) => {
          e.target.style.borderColor = accent;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '';
        }}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2
                   text-neutral-400 hover:text-neutral-600
                   dark:hover:text-neutral-300 transition-colors z-10"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

export default PasswordInput;