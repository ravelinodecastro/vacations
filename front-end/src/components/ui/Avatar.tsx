import { initials } from '@/lib/utils';

interface Props {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-12 h-12 text-sm',
};

export function Avatar({ name, size = 'md' }: Props) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-brand-light text-brand-dark flex items-center justify-center font-semibold shrink-0`}
    >
      {initials(name)}
    </div>
  );
}
