'use client';

import { useApp } from '@/contexts/AppContext';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentRequests } from '@/components/dashboard/RecentRequests';

export default function DashboardPage() {
  const { employees, vacationRequests, currentUser } = useApp();

  const visibleRequests = (() => {
    if (currentUser.role === 'collaborator') {
      return vacationRequests.filter(r => r.employeeId === currentUser.id);
    }
    if (currentUser.role === 'manager') {
      return vacationRequests.filter(
        r => employees.find(e => e.id === r.employeeId)?.managerId === currentUser.id,
      );
    }
    return vacationRequests;
  })();

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-7">Bem-vindo(a), {currentUser.name}</p>

      <StatsGrid
        requests={visibleRequests}
        employees={employees}
        currentUser={currentUser}
      />

      <h2 className="text-base font-semibold text-gray-900 mt-8 mb-3.5">Pedidos recentes</h2>
      <RecentRequests requests={visibleRequests} employees={employees} />
    </div>
  );
}
