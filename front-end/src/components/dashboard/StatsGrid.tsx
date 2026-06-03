import type { Employee, VacationRequest } from '@/types';
import { StatCard } from '@/components/ui/StatCard';

interface Props {
  requests: VacationRequest[];
  employees: Employee[];
  currentUser: Employee;
}

export function StatsGrid({ requests, employees, currentUser }: Props) {
  const mainStats = [
    { label: 'Total de Pedidos', value: requests.length,                                   colorClass: 'text-brand-dark'  },
    { label: 'Pendentes',        value: requests.filter(r => r.status === 'pending').length,  colorClass: 'text-amber-600'   },
    { label: 'Aprovados',        value: requests.filter(r => r.status === 'approved').length, colorClass: 'text-emerald-600' },
    { label: 'Rejeitados',       value: requests.filter(r => r.status === 'rejected').length, colorClass: 'text-red-600'     },
  ];

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {mainStats.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} colorClass={s.colorClass} />
        ))}
      </div>

      {currentUser.role === 'admin' && (
        <div className="grid grid-cols-2 gap-3.5">
          <StatCard label="Colaboradores" value={employees.filter(e => e.role === 'collaborator').length} />
          <StatCard label="Managers"      value={employees.filter(e => e.role === 'manager').length} />
        </div>
      )}
    </div>
  );
}
