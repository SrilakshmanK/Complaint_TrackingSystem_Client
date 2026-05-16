import React from 'react';

const STATUS_CONFIG = {
  'Assign':      { label: 'Unassigned',  dot: 'bg-slate-400',  pill: 'bg-slate-100 text-slate-700 ring-slate-200'   },
  'Assigned':    { label: 'Assigned',    dot: 'bg-blue-500',   pill: 'bg-blue-50  text-blue-700  ring-blue-200'     },
  'In-Progress': { label: 'In Progress', dot: 'bg-amber-400',  pill: 'bg-amber-50 text-amber-700 ring-amber-200'   },
  'OnHold':      { label: 'On Hold',     dot: 'bg-orange-400', pill: 'bg-orange-50 text-orange-700 ring-orange-200' },
  'Completed':   { label: 'Completed',   dot: 'bg-emerald-500',pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Assign'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
