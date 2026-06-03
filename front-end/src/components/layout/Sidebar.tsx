'use client';

import { useApp } from '@/contexts/AppContext';
import { ROLE_LABELS } from '@/lib/constants';
import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { NavItem } from './NavItem';

export function Sidebar() {
  const { employees, vacationRequests, currentUser, currentUserId, setCurrentUserId } = useApp();

  const pendingCount = vacationRequests.filter(r => {
    if (r.status !== 'pending') return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'manager') {
      return employees.find(e => e.id === r.employeeId)?.managerId === currentUser.id;
    }
    return false;
  }).length;

  const navItems = [
    { href: '/dashboard',      label: 'Dashboard',      icon: '⊞' },
    { href: '/vacations',      label: 'Férias',         icon: '🗓' },
    ...(currentUser.role !== 'collaborator'
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

      {/* User switcher */}
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
          Atuar como
        </p>
        <select
          value={currentUserId}
          onChange={e => setCurrentUserId(Number(e.target.value))}
          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-800 bg-gray-50 cursor-pointer focus:outline-none"
        >
          {employees.map(e => (
            <option key={e.id} value={e.id}>
              {e.name} ({ROLE_LABELS[e.role]})
            </option>
          ))}
        </select>
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
      <div className="px-4 py-3.5 border-t border-gray-200 flex items-center gap-2.5">
        <Avatar name={currentUser.name} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
          <RoleBadge role={currentUser.role} />
        </div>
      </div>
    </aside>
  );
}
