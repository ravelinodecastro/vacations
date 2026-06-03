'use client';

import { useApp } from '@/contexts/AppContext';
import type { VacationRequest } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, daysBetween } from '@/lib/utils';

interface Props {
  request: VacationRequest;
  onClose: () => void;
}

export function VacationDetail({ request, onClose }: Props) {
  const { employees } = useApp();
  const employee = employees.find(e => e.id === request.employeeId);
  const manager  = employees.find(e => e.id === employee?.managerId);

  const rows: [string, string][] = [
    ['Período',       `${formatDate(request.startDate)} → ${formatDate(request.endDate)}`],
    ['Total de dias', `${daysBetween(request.startDate, request.endDate)} dias`],
    ['Motivo',        request.reason || 'Não especificado'],
    ['Manager',       manager?.name ?? '—'],
    ['Criado em',     formatDate(request.createdAt)],
  ];

  return (
    <Modal title="Detalhe do Pedido" onClose={onClose}>
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar name={employee?.name ?? '?'} />
          <div>
            <p className="font-semibold text-gray-900 text-sm">{employee?.name ?? 'Desconhecido'}</p>
            <p className="text-xs text-gray-500">{employee?.email}</p>
          </div>
        </div>
        <Badge status={request.status} />
      </div>

      <div>
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900 text-right max-w-48">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-5">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </Modal>
  );
}
