import type { Employee, Role, VacationRequest } from '@/types';
import { StatCard } from '@/components/ui/StatCard';

interface Props {
  vacations: VacationRequest[];
  employees: Employee[];
  sessionRole: Role;
}

export function StatsGrid({ vacations, employees, sessionRole }: Props) {
  const mainStats = [
    { label: 'Total de Pedidos', value: vacations.length,                                    colorClass: 'text-brand-dark'  },
    { label: 'Pendentes',        value: vacations.filter(r => r.status === 'pending').length,  colorClass: 'text-amber-600'   },
    { label: 'Aprovados',        value: vacations.filter(r => r.status === 'approved').length, colorClass: 'text-emerald-600' },
    { label: 'Rejeitados',       value: vacations.filter(r => r.status === 'rejected').length, colorClass: 'text-red-600'     },
  ];

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {mainStats.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} colorClass={s.colorClass} />
        ))}
      </div>

      {sessionRole === 'admin' && (
        <div className="grid grid-cols-2 gap-3.5">
          <StatCard label="Colaboradores" value={employees.length} />
        </div>
      )}
    </div>
  );
}
