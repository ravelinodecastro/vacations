import type { ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

export function Field({ label, children }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
