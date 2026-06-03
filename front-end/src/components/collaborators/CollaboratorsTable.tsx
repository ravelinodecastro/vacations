'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import type { Employee } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Button } from '@/components/ui/Button';
import { CollaboratorForm } from './CollaboratorForm';
import { CollaboratorDetail } from './CollaboratorDetail';

export function CollaboratorsTable() {
  const { employees, currentUser, deleteEmployee } = useApp();
  const [search, setSearch] = useState('');
  const [formTarget, setFormTarget] = useState<Employee | null | 'new'>(null);
  const [detailTarget, setDetailTarget] = useState<Employee | null>(null);

  const isAdmin = currentUser.role === 'admin';

  const visible = employees.filter(e => {
    if (currentUser.role === 'collaborator') return e.id === currentUser.id;
    if (currentUser.role === 'manager') {
      return e.managerId === currentUser.id || e.id === currentUser.id;
    }
    const q = search.toLowerCase();
    return e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
  });

  function handleDelete(id: number) {
    if (window.confirm('Remover este colaborador? Os seus pedidos de férias também serão removidos.')) {
      deleteEmployee(id);
    }
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
        {isAdmin && (
          <Button variant="primary" onClick={() => setFormTarget('new')}>
            + Novo Colaborador
          </Button>
        )}
      </div>

      {isAdmin && (
        <input
          placeholder="Pesquisar por nome ou email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 mb-5 focus:outline-none focus:ring-1 focus:ring-brand"
        />
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {['Nome', 'Email', 'Função', 'Manager', 'Ações'].map(h => (
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
                  Nenhum colaborador encontrado.
                </td>
              </tr>
            ) : (
              visible.map((e, i) => {
                const manager = employees.find(m => m.id === e.managerId);
                return (
                  <tr key={e.id} className={i < visible.length - 1 ? 'border-b border-gray-100' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={e.name} />
                        <span className="text-sm font-medium text-gray-900">{e.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{e.email}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={e.role} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{manager?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setDetailTarget(e)}>Ver</Button>
                        {isAdmin && (
                          <>
                            <Button size="sm" onClick={() => setFormTarget(e)}>Editar</Button>
                            {e.id !== currentUser.id && (
                              <Button size="sm" variant="danger" onClick={() => handleDelete(e.id)}>
                                Remover
                              </Button>
                            )}
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
        <CollaboratorForm
          employee={formTarget === 'new' ? null : formTarget}
          onClose={() => setFormTarget(null)}
        />
      )}

      {detailTarget && (
        <CollaboratorDetail employee={detailTarget} onClose={() => setDetailTarget(null)} />
      )}
    </div>
  );
}
