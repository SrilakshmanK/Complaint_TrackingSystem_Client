import React from 'react';

const PRIORITY_CONFIG = {
  'Low':      { pill: 'bg-slate-100 text-slate-600 ring-slate-200',    pulse: false },
  'Medium':   { pill: 'bg-blue-50  text-blue-700  ring-blue-200',      pulse: false },
  'High':     { pill: 'bg-amber-50 text-amber-700 ring-amber-200',     pulse: false },
  'Critical': { pill: 'bg-red-50   text-red-700   ring-red-200',       pulse: true  },
};

const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['Medium'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${cfg.pill}`}>
      {cfg.pulse ? (
        <span className="relative flex w-1.5 h-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-red-500" />
        </span>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0" />
      )}
      {priority || 'Medium'}
    </span>
  );
};

export default PriorityBadge;
