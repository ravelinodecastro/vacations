'use client';

import { useApp } from '@/contexts/AppContext';
import type { Employee } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Button } from '@/components/ui/Button';
import { formatDate, daysBetween } from '@/lib/utils';

interface Props {
  employee: Employee;
  onClose: () => void;
}

export function CollaboratorDetail({ employee, onClose }: Props) {
  const { vacationRequests } = useApp();
  const requests = vacationRequests.filter(r => r.employeeId === employee.id);

  return (
    <Modal title="Detalhe do Colaborador" onClose={onClose}>
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
        <Avatar name={employee.name} size="lg" />
        <div>
          <p className="font-semibold text-gray-900">{employee.name}</p>
          <p className="text-sm text-gray-500 mb-1.5">{employee.email}</p>
          <RoleBadge role={employee.role} />
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Pedidos de Férias
      </p>

      {requests.length === 0 ? (
        <p className="text-sm text-gray-400 py-2">Nenhum pedido registado.</p>
      ) : (
        <div className="space-y-2">
          {requests.map(r => (
            <div key={r.id} className="border border-gray-200 rounded-lg px-3.5 py-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800">
                  {formatDate(r.startDate)} → {formatDate(r.endDate)}
                </span>
                <Badge status={r.status} />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {daysBetween(r.startDate, r.endDate)} dias
                {r.reason ? ` · ${r.reason}` : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-5">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </Modal>
  );
}
