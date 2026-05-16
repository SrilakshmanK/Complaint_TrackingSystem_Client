import React, { useState, useEffect } from 'react';
import { getComplaints } from '../../api';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';

// ── Inline SVG icon set ────────────────────────────────────────────────────────
const Icons = {
  total:      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
  unassigned: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />,
  assigned:   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
  progress:   <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5" />,
  onhold:     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />,
  completed:  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

const StatCard = ({ icon, label, value, valueClass, bgClass, borderClass }) => (
  <div className={`${bgClass} ${borderClass} border rounded-xl p-5 flex items-center gap-4`}>
    <div className="flex-shrink-0">
      <svg className="w-6 h-6 text-current opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {icon}
      </svg>
    </div>
    <div>
      <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
      <div className="text-xs font-medium text-slate-500 mt-0.5">{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getComplaints()
      .then(res => setComplaints(res.data))
      .catch(err => console.error('Failed to fetch:', err))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:      complaints.length,
    assign:     complaints.filter(c => c.status === 'Assign').length,
    assigned:   complaints.filter(c => c.status === 'Assigned').length,
    inProgress: complaints.filter(c => c.status === 'In-Progress').length,
    onHold:     complaints.filter(c => c.status === 'OnHold').length,
    completed:  complaints.filter(c => c.status === 'Completed').length,
  };

  const statCards = [
    { key: 'total',      label: 'Total',       value: stats.total,       icon: Icons.total,      valueClass: 'text-slate-800', bgClass: 'bg-white',       borderClass: 'border-slate-200' },
    { key: 'assign',     label: 'Unassigned',  value: stats.assign,      icon: Icons.unassigned, valueClass: 'text-slate-700', bgClass: 'bg-slate-50',    borderClass: 'border-slate-200' },
    { key: 'assigned',   label: 'Assigned',    value: stats.assigned,    icon: Icons.assigned,   valueClass: 'text-blue-700',  bgClass: 'bg-blue-50',     borderClass: 'border-blue-200'  },
    { key: 'inProgress', label: 'In Progress', value: stats.inProgress,  icon: Icons.progress,   valueClass: 'text-amber-700', bgClass: 'bg-amber-50',    borderClass: 'border-amber-200' },
    { key: 'onHold',     label: 'On Hold',     value: stats.onHold,      icon: Icons.onhold,     valueClass: 'text-orange-700',bgClass: 'bg-orange-50',   borderClass: 'border-orange-200'},
    { key: 'completed',  label: 'Completed',   value: stats.completed,   icon: Icons.completed,  valueClass: 'text-emerald-700',bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200'},
  ];

  const recent = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-slate-400">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of all complaints in the system</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {statCards.map(card => (
          <StatCard key={card.key} {...card} />
        ))}
      </div>

      {/* Recent complaints table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Recent Activity</h2>
          <Link to="/admin/complaints" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            View all complaints →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 text-sm">
            No complaints in the system yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50">
                  {['Code', 'Type', 'Location', 'Submitted By', 'Priority', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recent.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-xs font-mono text-slate-500">{c.code || '—'}</td>
                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{c.complaintType}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{c.block} — Rm {c.room}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">
                      {c.currentUser?.name || '—'}
                      <span className="block text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </td>
                    <td className="px-5 py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
