import { STATUS_CONFIG } from '@/lib/constants';
import type { VacationStatus } from '@/types';

interface Props {
  status: VacationStatus;
}

export function Badge({ status }: Props) {
  const { label, bgClass, textClass } = STATUS_CONFIG[status];
  return (
    <span
      className={`${bgClass} ${textClass} text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap`}
    >
      {label}
    </span>
  );
}
