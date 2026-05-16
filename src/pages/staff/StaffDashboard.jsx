import React, { useState, useEffect } from 'react';
import { getMyComplaints, updateComplaintStatus } from '../../api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { useAuth } from '../../context/AuthContext';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const STATUS_ACTIONS = {
  'Assigned':    [{ label: 'Start Working',  next: 'In-Progress', style: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' }],
  'In-Progress': [
    { label: 'Put On Hold',    next: 'OnHold',     style: 'bg-amber-50  text-amber-700  border-amber-200  hover:bg-amber-100'  },
    { label: 'Mark Complete',  next: 'Completed',  style: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  ],
  'OnHold': [
    { label: 'Resume Work',    next: 'In-Progress', style: 'bg-blue-50  text-blue-700  border-blue-200  hover:bg-blue-100'   },
    { label: 'Mark Complete',  next: 'Completed',   style: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  ],
};

// Left border accent per status
const CARD_ACCENT = {
  'Assigned':    'border-l-blue-500',
  'In-Progress': 'border-l-amber-400',
  'OnHold':      'border-l-orange-400',
  'Completed':   'border-l-emerald-500',
};

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { user } = useAuth();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      // Secure: backend returns ONLY this staff member's complaints via JWT
      const res = await getMyComplaints();
      setComplaints(res.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateComplaintStatus(id, newStatus);
      fetchComplaints();
    } catch {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total:      complaints.length,
    assigned:   complaints.filter(c => c.status === 'Assigned').length,
    inProgress: complaints.filter(c => c.status === 'In-Progress').length,
    onHold:     complaints.filter(c => c.status === 'OnHold').length,
    completed:  complaints.filter(c => c.status === 'Completed').length,
  };

  const statItems = [
    { label: 'Total',       value: stats.total,       style: 'text-slate-800' },
    { label: 'Assigned',    value: stats.assigned,    style: 'text-blue-700'  },
    { label: 'In Progress', value: stats.inProgress,  style: 'text-amber-700' },
    { label: 'On Hold',     value: stats.onHold,      style: 'text-orange-700'},
    { label: 'Completed',   value: stats.completed,   style: 'text-emerald-700'},
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 p-8">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Spinner /> Loading your complaints...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-slate-900">My Complaints</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Welcome back, <span className="font-medium text-slate-700">{user?.name}</span>. Here are your assigned complaints.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {statItems.map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
            <div className={`text-2xl font-bold ${s.style}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Complaint list */}
      {complaints.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-500 font-medium text-sm">No complaints assigned to you yet</p>
          <p className="text-slate-400 text-xs mt-1">When an admin assigns a complaint to you, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => {
            const actions    = STATUS_ACTIONS[c.status] || [];
            const isUpdating = updatingId === c._id;
            const accent     = CARD_ACCENT[c.status] || 'border-l-slate-200';

            return (
              <div
                key={c._id}
                className={`bg-white rounded-xl border border-slate-200 border-l-4 ${accent} shadow-sm p-5 transition-shadow hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {c.code && (
                        <span className="text-xs font-mono text-slate-400">{c.code}</span>
                      )}
                      <span className="text-sm font-semibold text-slate-900">{c.complaintType}</span>
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} />
                    </div>

                    <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {c.block} — Room {c.room}
                    </p>

                    {c.message && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{c.message}</p>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                      <p className="text-xs text-slate-400">
                        By <span className="font-medium text-slate-600">{c.currentUser?.name}</span>
                        {c.currentUser?.dept && ` · ${c.currentUser.dept}`}
                      </p>
                      <span className="text-slate-300 text-xs">•</span>
                      <p className="text-xs text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Right: action buttons */}
                  {actions.length > 0 && (
                    <div className="flex flex-col gap-2 shrink-0">
                      {actions.map(action => (
                        <button
                          key={action.next}
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(c._id, action.next)}
                          className={`text-xs border px-3 py-1.5 rounded-full font-medium transition-colors disabled:opacity-50 ${action.style}`}
                        >
                          {isUpdating ? '...' : action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
