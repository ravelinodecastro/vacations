'use client';

import { useState, useTransition } from 'react';
import type { Employee, Role, VacationRequest, VacationStatus } from '@/types';
import {
  approveVacationAction,
  cancelVacationAction,
  rejectVacationAction,
} from '@/actions/vacations';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VacationDetail } from './VacationDetail';
import { VacationForm } from './VacationForm';
import { formatDate, daysBetween } from '@/lib/utils';

type FilterStatus = VacationStatus | 'all';

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all',      label: 'Todos'      },
  { value: 'pending',  label: 'Pendentes'  },
  { value: 'approved', label: 'Aprovados'  },
  { value: 'rejected', label: 'Rejeitados' },
];

interface Props {
  vacations: VacationRequest[];
  /** Colaboradores disponíveis — preenchido para admin; vazio para manager/collaborator. */
  employees: Employee[];
  sessionRole: Role;
  fetchError: string | null;
}

export function VacationsTable({ vacations, employees, sessionRole, fetchError }: Props) {
  const [filter, setFilter]              = useState<FilterStatus>('all');
  const [detailTarget, setDetailTarget]  = useState<VacationRequest | null>(null);
  const [showForm, setShowForm]          = useState(false);
  const [actionError, setActionError]    = useState<string | null>(null);
  const [isSubmitting, startTransition]  = useTransition();

  const canCreate  = sessionRole === 'collaborator' || sessionRole === 'admin';
  const canApprove = sessionRole === 'manager'      || sessionRole === 'admin';

  const visible = vacations
    .filter(r => filter === 'all' || r.status === filter)
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

  function act(fn: () => Promise<{ error?: string }>) {
    setActionError(null);
    startTransition(async () => {
      const result = await fn();
      if (result.error) setActionError(result.error);
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pedidos de Férias</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {visible.length} pedido{visible.length !== 1 ? 's' : ''}
          </p>
        </div>
        {/* O botão é mostrado sempre que o utilizador pode criar — independente de ter ID pré-carregado */}
        {canCreate && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            + Novo Pedido
          </Button>
        )}
      </div>

      {(fetchError || actionError) && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {fetchError ?? actionError}
        </div>
      )}

      {sessionRole === 'collaborator' && (
        <div className="mb-5 px-4 py-3 bg-brand-light border border-brand/20 rounded-lg text-sm text-brand-dark">
          A listagem de pedidos requer permissão de admin ou manager. Para criar um pedido,
          necessita do seu <strong>ID de colaborador</strong> (UUID disponibilizado pelo administrador).
        </div>
      )}

      {/* Filtros de estado */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs border transition-colors cursor-pointer ${
              filter === f.value
                ? 'bg-brand-light text-brand-dark border-brand font-semibold'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {['Colaborador', 'Período', 'Dias', 'Estado', 'Ações'].map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              visible.map((r, i) => {
                const days         = daysBetween(r.startDate, r.endDate);
                const rowIsPending = r.status === 'pending';

                return (
                  <tr
                    key={r.id}
                    className={i < visible.length - 1 ? 'border-b border-gray-100' : ''}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {r.employeeName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-brand-dark">{days}d</td>
                    <td className="px-4 py-3">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        <Button size="sm" onClick={() => setDetailTarget(r)}>Ver</Button>

                        {rowIsPending && canApprove && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              disabled={isSubmitting}
                              onClick={() => act(() => approveVacationAction(r.id))}
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              disabled={isSubmitting}
                              onClick={() => act(() => rejectVacationAction(r.id))}
                            >
                              Rejeitar
                            </Button>
                          </>
                        )}

                        {rowIsPending && sessionRole === 'collaborator' && (
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={isSubmitting}
                            onClick={() => act(() => cancelVacationAction(r.id))}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <VacationForm
          employees={employees}
          onClose={() => setShowForm(false)}
        />
      )}

      {detailTarget && (
        <VacationDetail request={detailTarget} onClose={() => setDetailTarget(null)} />
      )}
    </div>
  );
}
