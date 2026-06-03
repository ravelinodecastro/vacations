'use client';

import type { Employee } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

interface Props {
  employee: Employee;
  onClose: () => void;
}

export function CollaboratorDetail({ employee, onClose }: Props) {
  const rows: [string, string][] = [
    ['Email',   employee.email],
    ['Manager', employee.managerName ?? '—'],
    ['ID',      employee.id],
  ];

  return (
    <Modal title="Detalhe do Colaborador" onClose={onClose}>
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
        <Avatar name={employee.name} size="lg" />
        <div>
          <p className="font-semibold text-gray-900">{employee.name}</p>
          <p className="text-sm text-gray-500">{employee.email}</p>
        </div>
      </div>

      <div>
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900 text-right max-w-64 break-all">
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-5">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </Modal>
  );
}
