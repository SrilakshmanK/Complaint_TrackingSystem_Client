import React, { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser, getRoles, getDepartments, getProgrammes } from '../../api';

const EMPTY_FORM = { name: '', gmail: '', password: '', phoneNo: '', role: '', dept: '', programme: '' };

const roleBadgeColor = (roleName) => {
  if (!roleName) return 'bg-gray-100 text-gray-600';
  const r = roleName.toLowerCase();
  if (r.includes('admin'))   return 'bg-purple-100 text-purple-700';
  if (r.includes('student')) return 'bg-green-100  text-green-700';
  return 'bg-blue-100 text-blue-700';
};

const Users = () => {
  const [users, setUsers]           = useState([]);
  const [roles, setRoles]           = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [formError, setFormError]     = useState('');

  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes, deptRes, progRes] = await Promise.all([
        getUsers(), getRoles(), getDepartments(), getProgrammes()
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
      setDepartments(deptRes.data);
      setProgrammes(progRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await createUser(formData);
      setIsPanelOpen(false);
      setFormData(EMPTY_FORM);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await deleteUser(id);
      fetchData();
    } catch (err) {
      alert('Error deleting user: ' + (err.response?.data?.message || err.message));
    }
  };

  const openPanel = () => { setFormData(EMPTY_FORM); setFormError(''); setIsPanelOpen(true); };

  const filtered = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.gmail?.toLowerCase().includes(search.toLowerCase()) ||
    (u.role?.role || u.role || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Loading users...</p></div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button
          onClick={openPanel}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Create User
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {search ? 'No users match your search.' : 'No users yet. Create one to get started.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Role', 'Department', 'Programme', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{u.gmail}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadgeColor(u.role?.role || u.role)}`}>
                        {u.role?.role || u.role || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{u.dept || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{u.programme || '—'}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full font-medium transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over panel — Create User */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-30 flex justify-end" aria-modal="true">
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setIsPanelOpen(false)} />
          <div className="relative bg-white w-full max-w-md shadow-2xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Create New User</h2>
              <button onClick={() => setIsPanelOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {formError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {formError}
                </div>
              )}
              <form id="create-user-form" onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Full Name',      name: 'name',     type: 'text',     placeholder: 'John Doe'         },
                  { label: 'Email (Gmail)',  name: 'gmail',    type: 'email',    placeholder: 'john@gmail.com'   },
                  { label: 'Password',       name: 'password', type: 'password', placeholder: '••••••••'         },
                  { label: 'Phone Number',   name: 'phoneNo',  type: 'number',   placeholder: '9876543210'       },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      required
                      placeholder={f.placeholder}
                      value={formData[f.name]}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select name="role" required value={formData.role} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Role...</option>
                    {roles.map(r => <option key={r._id} value={r._id}>{r.role}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select name="dept" required value={formData.dept} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Department...</option>
                    {departments.map(d => <option key={d._id} value={d.dept}>{d.dept}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Programme</label>
                  <select name="programme" required value={formData.programme} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Programme...</option>
                    {programmes.map(p => <option key={p._id} value={p.programme}>{p.programme}</option>)}
                  </select>
                </div>
              </form>
            </div>

            {/* Panel footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button type="button" onClick={() => setIsPanelOpen(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="submit" form="create-user-form" disabled={submitting}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition">
                {submitting ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
