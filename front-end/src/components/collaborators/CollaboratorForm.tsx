'use client';

import { useState, useTransition } from 'react';
import type { Employee } from '@/types';
import { createEmployeeAction, updateEmployeeAction } from '@/actions/employees';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

interface Props {
  employee: Employee | null;
  potentialManagers: Employee[];
  onClose: () => void;
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand';

export function CollaboratorForm({ employee, potentialManagers, onClose }: Props) {
  const [form, setForm] = useState({
    name:      employee?.name      ?? '',
    email:     employee?.email     ?? '',
    managerId: employee?.managerId ?? '',
    sub:       '',
  });
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError('');
    if (!form.name.trim() || !form.email.trim()) {
      setError('Nome e email são obrigatórios.');
      return;
    }

    const body = {
      name:      form.name.trim(),
      email:     form.email.trim(),
      managerId: form.managerId || undefined,
      sub:       form.sub.trim() || undefined,
    };

    startTransition(async () => {
      const result = employee
        ? await updateEmployeeAction(employee.id, body)
        : await createEmployeeAction(body);

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
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

      <Field label="Manager responsável">
        <select
          className={inputClass}
          value={form.managerId}
          onChange={e => setForm(f => ({ ...f, managerId: e.target.value }))}
        >
          <option value="">Sem manager</option>
          {potentialManagers
            .filter(m => m.id !== employee?.id)
            .map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
        </select>
      </Field>

      <Field label="Keycloak Subject (sub)">
        <input
          className={inputClass}
          placeholder="UUID do utilizador no Keycloak (opcional)"
          value={form.sub}
          onChange={e => setForm(f => ({ ...f, sub: e.target.value }))}
        />
        <p className="mt-1 text-xs text-gray-400">
          Liga este colaborador a uma conta Keycloak para login.
        </p>
      </Field>

      <div className="flex justify-end gap-2.5 mt-2">
        <Button onClick={onClose} disabled={isPending}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
          {isPending ? 'A guardar...' : employee ? 'Guardar' : 'Criar'}
        </Button>
      </div>
    </Modal>
  );
}
