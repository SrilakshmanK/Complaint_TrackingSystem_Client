import api from './axios';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginApi    = (data) => api.post('/auth/login', data);
export const getProfile  = ()     => api.get('/auth/profile');

// ── Roles ─────────────────────────────────────────────────────────────────────
export const getRoles    = ()     => api.get('/roles');
export const createRole  = (data) => api.post('/roles', data);

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers        = ()       => api.get('/users');
export const createUser      = (data)   => api.post('/users', data);
export const deleteUser      = (id)     => api.delete(`/users/${id}`);
/** Fetch staff members under a specific role — powers admin assign modal step 2 */
export const getUsersByRole  = (roleId) => api.get('/users/by-role', { params: { roleId } });

// ── Master Data ───────────────────────────────────────────────────────────────
export const getDepartments  = ()     => api.get('/master/departments');
export const createDepartment = (data) => api.post('/master/departments', data);

export const getProgrammes   = ()     => api.get('/master/programmes');
export const createProgramme = (data) => api.post('/master/programmes', data);

export const getBlocks       = ()     => api.get('/master/blocks');
export const createBlock     = (data) => api.post('/master/blocks', data);

export const getRoomNos      = ()     => api.get('/master/rooms');
export const createRoomNo    = (data) => api.post('/master/rooms', data);

// ── Complaints ────────────────────────────────────────────────────────────────
/** Admin: fetch all complaints */
export const getComplaints = () => api.get('/complaints');

/** Student: submit a new complaint (multipart/form-data) */
export const createComplaint = (formData) =>
  api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

/** Staff: fetch ONLY this staff member's assigned complaints — backend filtered */
export const getMyComplaints = () => api.get('/complaints/my-complaints');

/** Staff: update complaint status (In-Progress, OnHold, Completed) */
export const updateComplaintStatus = (id, status) =>
  api.put(`/complaints/${id}`, { status });

/**
 * Admin: assign complaint to a specific staff member.
 * @param {string} id - complaint _id
 * @param {object} payload - { roleId: string, assignedTo: string (userId) }
 */
export const assignComplaint = (id, { roleId, assignedTo }) =>
  api.put(`/complaints/assign/${id}`, { role: roleId, assignedTo });

/** Admin: generate filtered report */
export const getComplaintReport = (params) => api.get('/complaints/report', { params });
