interface Props {
  label: string;
  value: number;
  colorClass?: string;
}

export function StatCard({ label, value, colorClass = 'text-gray-900' }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}
