'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

export function NavItem({ href, label, icon, badge }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-brand-light text-brand-dark font-semibold'
          : 'text-gray-600 hover:bg-gray-100 font-normal'
      }`}
    >
      <span className="text-base">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className="bg-brand text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
