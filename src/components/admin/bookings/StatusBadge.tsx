import { STATUS_CONFIG, type BookingStatus } from "./types";

export function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {cfg.label}
    </span>
  );
}
