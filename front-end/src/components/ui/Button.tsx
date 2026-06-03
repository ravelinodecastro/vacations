import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'danger' | 'success';
type Size = 'sm' | 'md';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-brand text-white hover:bg-brand-dark',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  danger:    'bg-red-100 text-red-800 hover:bg-red-200',
  success:   'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-5 py-2 text-sm',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
