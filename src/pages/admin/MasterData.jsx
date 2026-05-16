import React, { useState, useEffect } from 'react';
import {
  getDepartments, createDepartment,
  getProgrammes, createProgramme,
  getBlocks, createBlock,
  getRoomNos, createRoomNo,
  getRoles, createRole,
} from '../../api';

const TABS = [
  { name: 'Departments', get: getDepartments, create: createDepartment, field: 'dept',      label: 'department'  },
  { name: 'Programmes',  get: getProgrammes,  create: createProgramme,  field: 'programme', label: 'programme'   },
  { name: 'Blocks',      get: getBlocks,      create: createBlock,      field: 'block',     label: 'block'       },
  { name: 'Rooms',       get: getRoomNos,     create: createRoomNo,     field: 'roomNo',    label: 'room number' },
  { name: 'Roles',       get: getRoles,       create: createRole,       field: 'role',      label: 'role'        },
];

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('Departments');
  const [data, setData]           = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  const currentTab = TABS.find(t => t.name === activeTab);

  useEffect(() => { fetchTabData(); }, [activeTab]);

  const fetchTabData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await currentTab.get();
      setData(res.data);
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await currentTab.create({ [currentTab.field]: inputValue.trim() });
      setInputValue('');
      setSuccess(`${currentTab.label.charAt(0).toUpperCase() + currentTab.label.slice(1)} added successfully.`);
      fetchTabData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to add ${currentTab.label}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Master Data</h1>
        <p className="text-sm text-gray-500 mt-1">Manage lookup values used across the system</p>
      </div>

      {/* Tab bar */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.name}
              onClick={() => { setActiveTab(tab.name); setInputValue(''); setError(''); setSuccess(''); }}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeTab === tab.name
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Add New {currentTab.label}</h2>
        {error   && <div className="mb-3 bg-red-50  border border-red-200  text-red-700  text-sm px-4 py-2.5 rounded-lg">{error}</div>}
        {success && <div className="mb-3 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg">{success}</div>}
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={`Enter ${currentTab.label} name...`}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {submitting ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      {/* Data list */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{currentTab.name}</span>
          <span className="text-xs text-gray-400">{data.length} item{data.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : data.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No {currentTab.label}s added yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {data.map((item, idx) => (
              <li key={item._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <span className="text-xs font-mono text-gray-300 w-5 text-right">{idx + 1}</span>
                <span className="text-sm text-gray-800 font-medium">{item[currentTab.field]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MasterData;
