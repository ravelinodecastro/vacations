import type { VacationRequest } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface Props {
  vacations: VacationRequest[];
}

export function RecentRequests({ vacations }: Props) {
  const recent = [...vacations].sort((a, b) => (a.startDate < b.startDate ? 1 : -1)).slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-8 text-center text-sm text-gray-400">
        Sem pedidos ainda.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {recent.map((r, i) => (
        <div
          key={r.id}
          className={`flex justify-between items-center px-4 py-3 ${i < recent.length - 1 ? 'border-b border-gray-100' : ''}`}
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{r.employeeName}</p>
            <p className="text-xs text-gray-500">
              {formatDate(r.startDate)} → {formatDate(r.endDate)}
            </p>
          </div>
          <Badge status={r.status} />
        </div>
      ))}
    </div>
  );
}
