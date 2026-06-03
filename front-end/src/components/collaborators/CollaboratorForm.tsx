'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ROLE_LABELS } from '@/lib/constants';
import type { Employee, Role } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

interface Props {
  employee: Employee | null;
  onClose: () => void;
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand';

export function CollaboratorForm({ employee, onClose }: Props) {
  const { employees, createEmployee, updateEmployee } = useApp();

  const [form, setForm] = useState({
    name:      employee?.name ?? '',
    email:     employee?.email ?? '',
    role:      (employee?.role ?? 'collaborator') as Role,
    managerId: employee?.managerId?.toString() ?? '',
  });
  const [error, setError] = useState('');

  const managers = employees.filter(e => e.role === 'manager' || e.role === 'admin');

  function handleSubmit() {
    setError('');
    if (!form.name.trim() || !form.email.trim()) {
      setError('Nome e email são obrigatórios.');
      return;
    }
    if (form.role !== 'admin' && !form.managerId) {
      setError('Selecione um manager responsável.');
      return;
    }

    const data = {
      name:      form.name.trim(),
      email:     form.email.trim(),
      role:      form.role,
      managerId: form.managerId ? Number(form.managerId) : null,
    };

    const result = employee ? updateEmployee(employee.id, data) : createEmployee(data);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  }

  return (
    <Modal title={employee ? 'Editar Colaborador' : 'Novo Colaborador'} onClose={onClose}>
      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {error}
        </div>
      )}

      <Field label="Nome completo">
        <input
          className={inputClass}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          className={inputClass}
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </Field>

      <Field label="Função">
        <select
          className={inputClass}
          value={form.role}
          onChange={e =>
            setForm(f => ({ ...f, role: e.target.value as Role, managerId: '' }))
          }
        >
          <option value="collaborator">{ROLE_LABELS.collaborator}</option>
          <option value="manager">{ROLE_LABELS.manager}</option>
          <option value="admin">{ROLE_LABELS.admin}</option>
        </select>
      </Field>

      {form.role !== 'admin' && (
        <Field label="Manager responsável">
          <select
            className={inputClass}
            value={form.managerId}
            onChange={e => setForm(f => ({ ...f, managerId: e.target.value }))}
          >
            <option value="">Selecionar manager...</option>
            {managers.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <div className="flex justify-end gap-2.5 mt-2">
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {employee ? 'Guardar' : 'Criar'}
        </Button>
      </div>
    </Modal>
  );
}
