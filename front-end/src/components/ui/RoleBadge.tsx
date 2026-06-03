import { ROLE_BADGE_CONFIG, ROLE_LABELS } from '@/lib/constants';
import type { Role } from '@/types';

interface Props {
  role: Role;
}

export function RoleBadge({ role }: Props) {
  const { bgClass, textClass } = ROLE_BADGE_CONFIG[role];
  return (
    <span
      className={`${bgClass} ${textClass} text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
