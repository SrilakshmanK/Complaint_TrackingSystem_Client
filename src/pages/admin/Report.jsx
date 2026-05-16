import React, { useState, useEffect } from 'react';
import { getComplaintReport, getDepartments, getProgrammes, getRoles } from '../../api';
import StatusBadge from '../../components/StatusBadge';

const COMPLAINT_TYPES = ['PC Hardware', 'PC Software', 'Application Issues', 'Network', 'Electronics', 'Plumbing'];
const STATUSES        = ['Assign', 'Assigned', 'In-Progress', 'OnHold', 'Completed'];

const Report = () => {
  const [reportData, setReportData]   = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const [dept, setDept]               = useState('');
  const [programme, setProgramme]     = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [status, setStatus]           = useState('');
  const [assignee, setAssignee]       = useState('');

  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes]   = useState([]);
  const [roles, setRoles]             = useState([]);

  useEffect(() => {
    Promise.all([getDepartments(), getProgrammes(), getRoles()])
      .then(([d, p, r]) => {
        setDepartments(d.data);
        setProgrammes(p.data);
        setRoles(r.data.filter(r => r.role !== 'Student' && r.role !== 'Super Admin'));
      })
      .catch(() => {});
  }, []);

  const generateReport = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (dept)          params.dept          = dept;
      if (programme)     params.programme     = programme;
      if (complaintType) params.complaintType = complaintType;
      if (status)        params.status        = status;
      if (assignee)      params.assignee      = assignee;

      const res = await getComplaintReport(params);
      setReportData(res.data.results || []);
      setHasGenerated(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate report. Make sure you are logged in as Super Admin.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setDept(''); setProgramme(''); setComplaintType(''); setStatus(''); setAssignee('');
    setReportData([]); setHasGenerated(false); setError('');
  };

  const SelectField = ({ label, value, onChange, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        {children}
      </select>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Complaint Report</h1>
        <p className="text-sm text-gray-500 mt-1">Filter and export complaint data for analysis</p>
      </div>

      {/* Filter card */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Filter Criteria</h2>
        <form onSubmit={generateReport}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
            <SelectField label="Department" value={dept} onChange={setDept}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d._id} value={d.dept}>{d.dept}</option>)}
            </SelectField>

            <SelectField label="Programme" value={programme} onChange={setProgramme}>
              <option value="">All Programmes</option>
              {programmes.map(p => <option key={p._id} value={p.programme}>{p.programme}</option>)}
            </SelectField>

            <SelectField label="Complaint Type" value={complaintType} onChange={setComplaintType}>
              <option value="">All Types</option>
              {COMPLAINT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </SelectField>

            <SelectField label="Status" value={status} onChange={setStatus}>
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s === 'Assign' ? 'New (Unassigned)' : s}</option>)}
            </SelectField>

            <SelectField label="Assigned To" value={assignee} onChange={setAssignee}>
              <option value="">All Departments</option>
              {roles.map(r => <option key={r._id} value={r._id}>{r.role}</option>)}
            </SelectField>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
            {hasGenerated && (
              <button type="button" onClick={clearFilters}
                className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Results */}
      {hasGenerated && (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Results</span>
            <span className="text-xs text-gray-400">{reportData.length} complaint{reportData.length !== 1 ? 's' : ''} found</span>
          </div>

          {reportData.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              No complaints match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {['#', 'Date', 'Type', 'Location', 'Department', 'Programme', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reportData.map((c, i) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-xs text-gray-400">{i + 1}</td>
                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{c.complaintType}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{c.block} — {c.room}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{c.currentUser?.dept || '—'}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{c.currentUser?.programme || '—'}</td>
                      <td className="px-5 py-4 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Report;
