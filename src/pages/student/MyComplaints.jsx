import React, { useState, useEffect } from 'react';
import { getComplaints } from '../../api';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const { user } = useAuth();

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getComplaints();
      // currentUser is embedded (no _id) — match by gmail
      const mine = res.data.filter(c => c.currentUser?.gmail === user?.gmail);
      // Newest first
      mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComplaints(mine);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total:      complaints.length,
    open:       complaints.filter(c => ['Assign','Assigned','In-Progress','OnHold'].includes(c.status)).length,
    completed:  complaints.filter(c => c.status === 'Completed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading your complaints...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-sm text-gray-500 mt-1">Track the status of complaints you have submitted</p>
        </div>
        <Link
          to="/student/new-complaint"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Submit New Complaint
        </Link>
      </div>

      {/* Stats */}
      {complaints.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total',     value: stats.total,     color: 'bg-gray-50   border-gray-200   text-gray-700'   },
            { label: 'Open',      value: stats.open,      color: 'bg-blue-50   border-blue-200   text-blue-700'   },
            { label: 'Resolved',  value: stats.completed, color: 'bg-green-50  border-green-200  text-green-700'  },
          ].map(s => (
            <div key={s.label} className={`${s.color} border rounded-xl p-4 text-center`}>
              <div className={`text-2xl font-bold ${s.color.split(' ').find(c => c.startsWith('text-'))}`}>{s.value}</div>
              <div className="text-xs font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Complaint list */}
      {complaints.length === 0 ? (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-700 font-medium text-lg">No complaints submitted yet</p>
          <p className="text-gray-400 text-sm mt-2">When you submit a complaint it will appear here</p>
          <Link
            to="/student/new-complaint"
            className="mt-5 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
          >
            Submit Your First Complaint
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{c.complaintType}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">📍 {c.block} — Room {c.room}</p>
                  {c.message && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{c.message}</p>
                  )}
                  {c.media && c.media !== '/uploads/default.png' && (
                    <img
                      src={`http://localhost:5000${c.media}`}
                      alt="Complaint"
                      className="mt-3 max-h-36 rounded-lg object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
