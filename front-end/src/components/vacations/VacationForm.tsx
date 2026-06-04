'use client';

import { useState, useTransition } from 'react';
import { createMyVacationAction } from '@/actions/vacations';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { daysBetween } from '@/lib/utils';

interface Props {
  onClose: () => void;
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand';

export function VacationForm({ onClose }: Props) {
  const [form, setForm]              = useState({ startDate: '', endDate: '' });
  const [error, setError]            = useState('');
  const [isPending, startTransition] = useTransition();

  const showDays = form.startDate && form.endDate && form.startDate <= form.endDate;

  function handleSubmit() {
    setError('');
    if (!form.startDate || !form.endDate) {
      setError('Preencha as datas de início e fim.');
      return;
    }
    if (form.startDate > form.endDate) {
      setError('A data de início deve ser anterior ou igual à data de fim.');
      return;
    }

    startTransition(async () => {
      const result = await createMyVacationAction(form);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  return (
    <Modal title="Novo Pedido de Férias" onClose={onClose}>
      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {error}
        </div>
      )}

      <Field label="Data de início">
        <input
          type="date"
          className={inputClass}
          value={form.startDate}
          onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
        />
      </Field>

      <Field label="Data de fim">
        <input
          type="date"
          className={inputClass}
          value={form.endDate}
          onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
        />
      </Field>

      {showDays && (
        <p className="text-xs text-brand-dark font-medium -mt-2 mb-4">
          {daysBetween(form.startDate, form.endDate)} dia(s) selecionado(s)
        </p>
      )}

      <div className="flex justify-end gap-2.5 mt-2">
        <Button onClick={onClose} disabled={isPending}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
          {isPending ? 'A submeter...' : 'Submeter'}
        </Button>
      </div>
    </Modal>
  );
}
