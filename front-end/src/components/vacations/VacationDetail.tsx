'use client';

import type { VacationRequest } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, daysBetween } from '@/lib/utils';

interface Props {
  request: VacationRequest;
  onClose: () => void;
}

export function VacationDetail({ request, onClose }: Props) {
  const rows: [string, string][] = [
    ['Colaborador',   request.employeeName],
    ['Período',       `${formatDate(request.startDate)} → ${formatDate(request.endDate)}`],
    ['Total de dias', `${daysBetween(request.startDate, request.endDate)} dias`],
  ];

  return (
    <Modal title="Detalhe do Pedido" onClose={onClose}>
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">{request.employeeName}</span>
        <Badge status={request.status} />
      </div>

      <div>
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-5">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </Modal>
  );
}
