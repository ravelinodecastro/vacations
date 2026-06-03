import type { Employee, VacationRequest } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface Props {
  requests: VacationRequest[];
  employees: Employee[];
}

export function RecentRequests({ requests, employees }: Props) {
  const recent = [...requests].sort((a, b) => b.id - a.id).slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-8 text-center text-sm text-gray-400">
        Sem pedidos ainda.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {recent.map((r, i) => {
        const employee = employees.find(e => e.id === r.employeeId);
        return (
          <div
            key={r.id}
            className={`flex justify-between items-center px-4 py-3 ${i < recent.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <Avatar name={employee?.name ?? '?'} size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-900">{employee?.name ?? 'Desconhecido'}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(r.startDate)} → {formatDate(r.endDate)}
                </p>
              </div>
            </div>
            <Badge status={r.status} />
          </div>
        );
      })}
    </div>
  );
}
