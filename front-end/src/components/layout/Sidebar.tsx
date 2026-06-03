'use client';

import { useApp } from '@/contexts/AppContext';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Avatar } from '@/components/ui/Avatar';
import { NavItem } from './NavItem';
import type { Role } from '@/types';

interface SessionUser {
  name: string;
  email: string;
  role: Role;
}

interface Props {
  sessionUser: SessionUser;
  onSignOut: () => Promise<void>;
}

export function Sidebar({ sessionUser, onSignOut }: Props) {
  const { employees, vacationRequests, currentUser } = useApp();

  const pendingCount = vacationRequests.filter(r => {
    if (r.status !== 'pending') return false;
    if (sessionUser.role === 'admin') return true;
    if (sessionUser.role === 'manager') {
      return employees.find(e => e.id === r.employeeId)?.managerId === currentUser.id;
    }
    return false;
  }).length;

  const navItems = [
    { href: '/dashboard',      label: 'Dashboard',      icon: '⊞' },
    { href: '/vacations',      label: 'Férias',         icon: '🗓' },
    ...(sessionUser.role !== 'collaborator'
      ? [{ href: '/collaborators', label: 'Colaboradores', icon: '👥' }]
      : []),
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-base">T</span>
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">TaskFlow</p>
            <p className="text-[11px] text-gray-400">Gestão de Férias</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2.5 space-y-0.5">
        {navItems.map(item => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            badge={item.href === '/vacations' && pendingCount > 0 ? pendingCount : undefined}
          />
        ))}
      </nav>

      {/* Current user footer */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-3.5 flex items-center gap-2.5">
          <Avatar name={sessionUser.name} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{sessionUser.name}</p>
            <RoleBadge role={sessionUser.role} />
          </div>
        </div>

        {/* Sign out */}
        <form action={onSignOut} className="px-4 pb-4">
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            ↩ Terminar sessão
          </button>
        </form>
      </div>
    </aside>
  );
}
