import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint, getBlocks, getRoomNos } from '../../api';
import { useAuth } from '../../context/AuthContext';

const COMPLAINT_TYPES = [
  'PC Hardware', 'PC Software', 'Application Issues',
  'Network', 'Electronics', 'Plumbing',
];

const PRIORITIES = [
  { value: 'Low',      desc: 'Minor issue, not urgent' },
  { value: 'Medium',   desc: 'Noticeable but manageable' },
  { value: 'High',     desc: 'Affecting work significantly' },
  { value: 'Critical', desc: 'Complete outage or safety risk' },
];

const PRIORITY_STYLES = {
  Low:      'bg-slate-50  border-slate-200 text-slate-700',
  Medium:   'bg-blue-50   border-blue-200  text-blue-700',
  High:     'bg-amber-50  border-amber-200 text-amber-700',
  Critical: 'bg-red-50    border-red-200   text-red-700',
};

const FormField = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const selectClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none';

const NewComplaint = () => {
  const [formData, setFormData] = useState({
    complaintType: '',
    block:         '',
    room:          '',
    message:       '',
    priority:      'Medium',
  });
  const [image, setImage]   = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [rooms, setRooms]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([getBlocks(), getRoomNos()])
      .then(([blocksRes, roomsRes]) => {
        setBlocks(blocksRes.data);
        setRooms(roomsRes.data);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('complaintType', formData.complaintType);
      payload.append('block',         formData.block);
      payload.append('room',          formData.room);
      payload.append('message',       formData.message);
      payload.append('priority',      formData.priority);

      const currentUser = {
        name:      user?.name      || '',
        gmail:     user?.gmail     || '',
        phoneNo:   user?.phoneNo   || '',
        dept:      user?.dept      || '',
        programme: user?.programme || '',
      };
      payload.append('currentUser', JSON.stringify(currentUser));

      if (image) payload.append('media', image);

      await createComplaint(payload);
      setSuccess(true);
      setTimeout(() => navigate('/student/complaints'), 2000);
    } catch (err) {
      alert('Failed to submit: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Submit a Complaint</h1>
        <p className="text-sm text-slate-500 mt-0.5">Describe the issue and our team will attend to it promptly.</p>
      </div>

      {success && (
        <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Complaint submitted successfully! Redirecting...</span>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Complaint Type */}
          <FormField label="Complaint Type" required>
            <select name="complaintType" required value={formData.complaintType} onChange={handleChange} className={selectClass}>
              <option value="">Select type...</option>
              {COMPLAINT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>

          {/* Block + Room */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Block" required>
              <select name="block" required value={formData.block} onChange={handleChange} className={selectClass}>
                <option value="">Select block...</option>
                {blocks.map(b => <option key={b._id} value={b.block}>{b.block}</option>)}
              </select>
            </FormField>
            <FormField label="Room" required>
              <select name="room" required value={formData.room} onChange={handleChange} className={selectClass}>
                <option value="">Select room...</option>
                {rooms.map(r => <option key={r._id} value={r.roomNo}>{r.roomNo}</option>)}
              </select>
            </FormField>
          </div>

          {/* Priority — card selector */}
          <FormField label="Priority" required>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: p.value }))}
                  className={`border rounded-lg px-3 py-2.5 text-left transition-all ${
                    formData.priority === p.value
                      ? `${PRIORITY_STYLES[p.value]} ring-2 ring-offset-1 ${
                          p.value === 'Critical' ? 'ring-red-400' :
                          p.value === 'High'     ? 'ring-amber-400' :
                          p.value === 'Medium'   ? 'ring-blue-400' : 'ring-slate-400'
                        }`
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-semibold">{p.value}</div>
                  <div className="text-xs opacity-70 mt-0.5 leading-tight">{p.desc}</div>
                </button>
              ))}
            </div>
          </FormField>

          {/* Message */}
          <FormField label="Description" required>
            <textarea
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe the issue clearly — what's broken, since when, what you've already tried..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </FormField>

          {/* Photo */}
          <FormField label="Attach Photo (Optional)">
            <label className="flex items-center gap-3 border border-dashed border-slate-300 rounded-lg px-4 py-3 cursor-pointer hover:border-indigo-400 transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-sm text-slate-500">
                {image ? image.name : 'Click to upload an image...'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files[0])} />
            </label>
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Submitting...
              </>
            ) : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;
