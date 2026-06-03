'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import type { VacationRequest, VacationStatus } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VacationForm } from './VacationForm';
import { VacationDetail } from './VacationDetail';
import { formatDate, daysBetween } from '@/lib/utils';

type FilterStatus = VacationStatus | 'all';

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all',      label: 'Todos'      },
  { value: 'pending',  label: 'Pendentes'  },
  { value: 'approved', label: 'Aprovados'  },
  { value: 'rejected', label: 'Rejeitados' },
];

export function VacationsTable() {
  const {
    employees,
    vacationRequests,
    currentUser,
    approveRequest,
    rejectRequest,
    cancelRequest,
  } = useApp();

  const [filter, setFilter]           = useState<FilterStatus>('all');
  const [formTarget, setFormTarget]   = useState<VacationRequest | null | 'new'>(null);
  const [detailTarget, setDetailTarget] = useState<VacationRequest | null>(null);

  const canCreate  = currentUser.role === 'collaborator' || currentUser.role === 'admin';
  const canApprove = currentUser.role === 'manager' || currentUser.role === 'admin';

  const myTeamIds = employees
    .filter(e => e.managerId === currentUser.id)
    .map(e => e.id);

  const visible = vacationRequests
    .filter(r => {
      if (currentUser.role === 'collaborator') return r.employeeId === currentUser.id;
      if (currentUser.role === 'manager')      return myTeamIds.includes(r.employeeId);
      return true;
    })
    .filter(r => filter === 'all' || r.status === filter)
    .sort((a, b) => b.id - a.id);

  function handleCancel(id: number) {
    if (window.confirm('Cancelar este pedido de férias?')) cancelRequest(id);
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
        {canCreate && (
          <Button variant="primary" onClick={() => setFormTarget('new')}>
            + Novo Pedido
          </Button>
        )}
      </div>

      {/* Status filters */}
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
              {['Colaborador', 'Período', 'Dias', 'Motivo', 'Estado', 'Ações'].map(h => (
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
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              visible.map((r, i) => {
                const employee = employees.find(e => e.id === r.employeeId);
                const days     = daysBetween(r.startDate, r.endDate);
                const isPending = r.status === 'pending';
                const isOwner   = r.employeeId === currentUser.id;
                const canActOnThis =
                  canApprove &&
                  (currentUser.role === 'admin' || myTeamIds.includes(r.employeeId));

                return (
                  <tr
                    key={r.id}
                    className={i < visible.length - 1 ? 'border-b border-gray-100' : ''}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={employee?.name ?? '?'} size="sm" />
                        <span className="text-sm font-medium text-gray-900">
                          {employee?.name ?? 'Desconhecido'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-brand-dark">{days}d</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-36 truncate">
                      {r.reason || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        <Button size="sm" onClick={() => setDetailTarget(r)}>Ver</Button>

                        {isOwner && isPending && (
                          <Button size="sm" onClick={() => setFormTarget(r)}>Editar</Button>
                        )}
                        {isOwner && isPending && (
                          <Button size="sm" variant="danger" onClick={() => handleCancel(r.id)}>
                            Cancelar
                          </Button>
                        )}
                        {canActOnThis && isPending && (
                          <>
                            <Button size="sm" variant="success" onClick={() => approveRequest(r.id)}>
                              Aprovar
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => rejectRequest(r.id)}>
                              Rejeitar
                            </Button>
                          </>
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

      {formTarget !== null && (
        <VacationForm
          request={formTarget === 'new' ? null : formTarget}
          onClose={() => setFormTarget(null)}
        />
      )}

      {detailTarget && (
        <VacationDetail request={detailTarget} onClose={() => setDetailTarget(null)} />
      )}
    </div>
  );
}
