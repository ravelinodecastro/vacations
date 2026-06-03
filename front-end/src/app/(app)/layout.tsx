import { AppProvider } from '@/contexts/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 px-10 py-9 overflow-y-auto min-w-0">{children}</main>
      </div>
    </AppProvider>
  );
}
