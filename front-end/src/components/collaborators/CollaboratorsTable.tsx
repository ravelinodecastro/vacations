'use client';

import { useState, useTransition } from 'react';
import type { Employee } from '@/types';
import { deleteEmployeeAction } from '@/actions/employees';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { CollaboratorForm } from './CollaboratorForm';
import { CollaboratorDetail } from './CollaboratorDetail';

interface Props {
  employees: Employee[];
  fetchError: string | null;
  keycloakUsersUrl: string;
}

export function CollaboratorsTable({ employees, fetchError, keycloakUsersUrl }: Props) {
  const [search, setSearch]          = useState('');
  const [formTarget, setFormTarget]  = useState<Employee | null | 'new'>(null);
  const [detailTarget, setDetailTarget] = useState<Employee | null>(null);
  const [actionError, setActionError]   = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const visible = employees.filter(e => {
    const q = search.toLowerCase();
    return e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
  });

  const potentialManagers = employees;

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Remover "${name}"?`)) return;
    setActionError(null);
    startTransition(async () => {
      const result = await deleteEmployeeAction(id);
      if (result.error) setActionError(result.error);
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Colaboradores</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {visible.length} utilizador{visible.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Link para a consola Keycloak — criar utilizadores com role */}
          <a
            href={keycloakUsersUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Gerir utilizadores e roles no Keycloak"
          >
            <span>🔑</span>
            Gerir no Keycloak
          </a>
          <Button variant="primary" onClick={() => setFormTarget('new')}>
            + Novo Colaborador
          </Button>
        </div>
      </div>

      {/* Aviso: novos utilizadores Keycloak ficam registados automaticamente no primeiro login */}
      <div className="mb-5 px-4 py-3 bg-brand-light border border-brand/20 rounded-lg text-sm text-brand-dark">
        Os utilizadores autenticados via Keycloak são registados automaticamente no primeiro login.
        Use <strong>Gerir no Keycloak</strong> para criar utilizadores e atribuir roles
        (Admin / Manager / Collaborator).
      </div>

      {(fetchError || actionError) && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {fetchError ?? actionError}
        </div>
      )}

      <input
        placeholder="Pesquisar por nome ou email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 mb-5 focus:outline-none focus:ring-1 focus:ring-brand"
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {['Nome', 'Email', 'Manager', 'Ações'].map(h => (
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
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400">
                  {fetchError ? 'Erro ao carregar.' : 'Nenhum colaborador encontrado.'}
                </td>
              </tr>
            ) : (
              visible.map((e, i) => (
                <tr key={e.id} className={i < visible.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={e.name} />
                      <span className="text-sm font-medium text-gray-900">{e.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{e.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{e.managerName ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setDetailTarget(e)}>Ver</Button>
                      <Button size="sm" onClick={() => setFormTarget(e)}>Editar</Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={isPending}
                        onClick={() => handleDelete(e.id, e.name)}
                      >
                        Remover
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formTarget !== null && (
        <CollaboratorForm
          employee={formTarget === 'new' ? null : formTarget}
          potentialManagers={potentialManagers}
          onClose={() => setFormTarget(null)}
        />
      )}

      {detailTarget && (
        <CollaboratorDetail employee={detailTarget} onClose={() => setDetailTarget(null)} />
      )}
    </div>
  );
}
