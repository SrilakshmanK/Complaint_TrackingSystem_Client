import React, { useState, useEffect, useCallback } from 'react';
import { getComplaints, getRoles, assignComplaint, getUsersByRole } from '../../api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';

// ── Small helpers ──────────────────────────────────────────────────────────────
const Row = ({ label, value }) => (
  <div className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400 w-28 shrink-0 pt-0.5 uppercase tracking-wide">{label}</span>
    <span className="text-sm text-slate-700 font-medium">{value}</span>
  </div>
);

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const STATUSES   = ['Assign', 'Assigned', 'In-Progress', 'OnHold', 'Completed'];
const TYPES      = ['PC Hardware', 'PC Software', 'Application Issues', 'Network', 'Electronics', 'Plumbing'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

// ── Main Component ─────────────────────────────────────────────────────────────
const Complaints = () => {
  const [complaints, setComplaints]             = useState([]);
  const [roles, setRoles]                       = useState([]);
  const [loading, setLoading]                   = useState(true);

  // Filters
  const [statusFilter, setStatusFilter]         = useState('');
  const [typeFilter, setTypeFilter]             = useState('');
  const [priorityFilter, setPriorityFilter]     = useState('');
  const [searchQuery, setSearchQuery]           = useState('');

  // Detail drawer
  const [detailComplaint, setDetailComplaint]   = useState(null);

  // Assign modal
  const [isModalOpen, setIsModalOpen]           = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedRoleId, setSelectedRoleId]     = useState('');
  const [staffList, setStaffList]               = useState([]);
  const [selectedUserId, setSelectedUserId]     = useState('');
  const [staffLoading, setStaffLoading]         = useState(false);
  const [assigning, setAssigning]               = useState(false);
  const [assignError, setAssignError]           = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [compRes, rolesRes] = await Promise.all([getComplaints(), getRoles()]);
      setComplaints(compRes.data);
      setRoles(rolesRes.data.filter(r => r.role !== 'Student' && r.role !== 'Super Admin'));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Assign Modal Logic ───────────────────────────────────────────────────────
  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setSelectedRoleId('');
    setSelectedUserId('');
    setStaffList([]);
    setAssignError('');
    setIsModalOpen(true);
  };

  const closeAssignModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
    setSelectedRoleId('');
    setSelectedUserId('');
    setStaffList([]);
    setAssignError('');
  };

  // Step 1 → Role selected: fetch staff under that role
  const handleRoleChange = async (roleId) => {
    setSelectedRoleId(roleId);
    setSelectedUserId('');
    setStaffList([]);
    setAssignError('');
    if (!roleId) return;
    setStaffLoading(true);
    try {
      const res = await getUsersByRole(roleId);
      setStaffList(res.data);
      if (res.data.length === 0) {
        setAssignError('No staff members found under this role.');
      }
    } catch {
      setAssignError('Failed to load staff. Please try again.');
    } finally {
      setStaffLoading(false);
    }
  };

  // Step 2 → Staff selected + confirm
  const submitAssign = async () => {
    if (!selectedRoleId || !selectedUserId || !selectedComplaint) return;
    setAssigning(true);
    setAssignError('');
    try {
      await assignComplaint(selectedComplaint._id, {
        roleId:     selectedRoleId,
        assignedTo: selectedUserId,
      });
      closeAssignModal();
      fetchData();
    } catch (err) {
      setAssignError('Failed to assign: ' + (err.response?.data?.error || err.message));
    } finally {
      setAssigning(false);
    }
  };

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filtered = complaints.filter(c => {
    if (statusFilter   && c.status        !== statusFilter)   return false;
    if (typeFilter     && c.complaintType !== typeFilter)     return false;
    if (priorityFilter && c.priority      !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCode = c.code?.toLowerCase().includes(q);
      const matchType = c.complaintType?.toLowerCase().includes(q);
      const matchName = c.currentUser?.name?.toLowerCase().includes(q);
      if (!matchCode && !matchType && !matchName) return false;
    }
    return true;
  });

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Spinner /> Loading complaints...
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Complaints</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search code, type, name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
          />
          <select value={statusFilter}   onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s === 'Assign' ? 'Unassigned' : s}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={typeFilter}     onChange={e => setTypeFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No complaints match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  {['Code', 'Type', 'Location', 'Submitted By', 'Priority', 'Status', 'Assigned To', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">{c.code || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-slate-800">{c.complaintType}</div>
                      {c.message && (
                        <div className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{c.message}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500 whitespace-nowrap">
                      {c.block} — Rm {c.room}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-slate-800">{c.currentUser?.name || '—'}</div>
                      <div className="text-xs text-slate-400">{c.currentUser?.gmail}</div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-5 py-3 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">
                      {c.assignedTo?.name
                        ? <span className="font-medium">{c.assignedTo.name}</span>
                        : <span className="text-slate-400">—</span>
                      }
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetailComplaint(c)}
                          className="text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md text-xs font-medium transition"
                        >
                          View
                        </button>
                        {(c.status === 'Assign' || c.status === 'Assigned') && (
                          <button
                            onClick={() => openAssignModal(c)}
                            className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md text-xs font-medium transition"
                          >
                            {c.status === 'Assigned' ? 'Reassign' : 'Assign'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Detail Drawer ── */}
      {detailComplaint && (
        <div className="fixed inset-0 z-30 flex justify-end" aria-modal="true">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDetailComplaint(null)} />
          <div className="relative bg-white w-full max-w-md shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Complaint Details</h3>
                {detailComplaint.code && (
                  <span className="text-xs font-mono text-slate-400">{detailComplaint.code}</span>
                )}
              </div>
              <button onClick={() => setDetailComplaint(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-1 flex-1">
              <Row label="Type"     value={detailComplaint.complaintType} />
              <Row label="Status"   value={<StatusBadge   status={detailComplaint.status}   />} />
              <Row label="Priority" value={<PriorityBadge priority={detailComplaint.priority} />} />
              <Row label="Block"    value={detailComplaint.block} />
              <Row label="Room"     value={detailComplaint.room} />
              <Row label="Message"  value={detailComplaint.message || '—'} />
              <Row label="Date"     value={new Date(detailComplaint.createdAt).toLocaleString('en-IN')} />

              <div className="pt-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Submitted By</p>
                <Row label="Name"      value={detailComplaint.currentUser?.name || '—'} />
                <Row label="Email"     value={detailComplaint.currentUser?.gmail || '—'} />
                <Row label="Dept"      value={detailComplaint.currentUser?.dept || '—'} />
                <Row label="Programme" value={detailComplaint.currentUser?.programme || '—'} />
              </div>

              {detailComplaint.assignedTo?.name && (
                <div className="pt-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Assigned To</p>
                  <Row label="Name"  value={detailComplaint.assignedTo.name} />
                  <Row label="Email" value={detailComplaint.assignedTo.gmail || '—'} />
                </div>
              )}

              {/* Assignment History */}
              {detailComplaint.assignedHistory?.length > 0 && (
                <div className="pt-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Assignment History</p>
                  <div className="space-y-2">
                    {[...detailComplaint.assignedHistory].reverse().map((h, i) => (
                      <div key={i} className="flex gap-3 text-xs">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1 flex-shrink-0" />
                          {i < detailComplaint.assignedHistory.length - 1 && (
                            <div className="w-px flex-1 bg-slate-200 mt-1" />
                          )}
                        </div>
                        <div className="pb-2">
                          <p className="text-slate-700 font-medium">Assigned</p>
                          <p className="text-slate-400">{new Date(h.assignedAt).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailComplaint.media && detailComplaint.media !== '/uploads/default.png' && (
                <div className="pt-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Attached Photo</p>
                  <img
                    src={`http://localhost:5000${detailComplaint.media}`}
                    alt="Complaint media"
                    className="rounded-lg max-h-60 w-full object-cover border border-slate-100"
                  />
                </div>
              )}
            </div>

            {(detailComplaint.status === 'Assign' || detailComplaint.status === 'Assigned') && (
              <div className="px-6 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
                <button
                  onClick={() => { setDetailComplaint(null); openAssignModal(detailComplaint); }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
                >
                  {detailComplaint.status === 'Assigned' ? 'Reassign Complaint' : 'Assign Complaint'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Assign Modal (Two-Step) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAssignModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal header */}
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Assign Complaint</h3>
                  {selectedComplaint?.code && (
                    <span className="text-xs font-mono text-slate-400">{selectedComplaint.code}</span>
                  )}
                </div>
                <button onClick={closeAssignModal} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                <span className="font-medium text-slate-700">{selectedComplaint?.complaintType}</span>
                {' · '}{selectedComplaint?.block} — Rm {selectedComplaint?.room}
              </p>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">

              {/* Step 1 — Select Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Step 1 — Select Department / Role
                </label>
                <select
                  value={selectedRoleId}
                  onChange={e => handleRoleChange(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Choose a role...</option>
                  {roles.map(r => (
                    <option key={r._id} value={r._id}>{r.role}</option>
                  ))}
                </select>
              </div>

              {/* Step 2 — Select Staff (dynamic, only appears after role chosen) */}
              {selectedRoleId && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Step 2 — Select Staff Member
                  </label>
                  {staffLoading ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                      <Spinner /> Loading staff...
                    </div>
                  ) : staffList.length > 0 ? (
                    <select
                      value={selectedUserId}
                      onChange={e => setSelectedUserId(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="">Choose a staff member...</option>
                      {staffList.map(u => (
                        <option key={u._id} value={u._id}>{u.name} — {u.gmail}</option>
                      ))}
                    </select>
                  ) : null}
                </div>
              )}

              {/* Error message */}
              {assignError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {assignError}
                </p>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={closeAssignModal}
                className="flex-1 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitAssign}
                disabled={!selectedRoleId || !selectedUserId || assigning}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
              >
                {assigning ? <><Spinner /> Assigning...</> : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
