import type { Role, VacationStatus } from '@/types';

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  manager: 'Manager',
  collaborator: 'Colaborador',
};

export const STATUS_CONFIG: Record<
  VacationStatus,
  { label: string; bgClass: string; textClass: string }
> = {
  pending:   { label: 'Pendente',   bgClass: 'bg-amber-100',   textClass: 'text-amber-800'   },
  approved:  { label: 'Aprovado',   bgClass: 'bg-emerald-100', textClass: 'text-emerald-800' },
  rejected:  { label: 'Rejeitado',  bgClass: 'bg-red-100',     textClass: 'text-red-800'     },
  cancelled: { label: 'Cancelado',  bgClass: 'bg-gray-100',    textClass: 'text-gray-500'    },
};

export const ROLE_BADGE_CONFIG: Record<
  Role,
  { bgClass: string; textClass: string }
> = {
  admin:        { bgClass: 'bg-violet-100', textClass: 'text-violet-700' },
  manager:      { bgClass: 'bg-blue-100',   textClass: 'text-blue-700'   },
  collaborator: { bgClass: 'bg-green-100',  textClass: 'text-green-700'  },
};
