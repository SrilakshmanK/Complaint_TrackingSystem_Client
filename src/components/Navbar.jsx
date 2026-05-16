import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Avatar: renders user initials in a small circle
const Avatar = ({ name }) => {
  const initials = (name || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white text-sm font-bold select-none flex-shrink-0">
      {initials}
    </span>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || '';

  const handleLogout = () => { logout(); navigate('/login'); };

  const adminLinks = [
    { to: '/admin/dashboard',   label: 'Dashboard'   },
    { to: '/admin/complaints',  label: 'Complaints'  },
    { to: '/admin/users',       label: 'Users'       },
    { to: '/admin/master-data', label: 'Master Data' },
    { to: '/admin/report',      label: 'Reports'     },
  ];
  const staffLinks   = [{ to: '/staff/complaints',   label: 'My Complaints' }];
  const studentLinks = [
    { to: '/student/complaints',    label: 'My Complaints'     },
    { to: '/student/new-complaint', label: 'Submit Complaint'  },
  ];

  let links = [];
  if (role === 'Super Admin')               links = adminLinks;
  else if (role === 'Student' || role === 'User') links = studentLinks;
  else                                      links = staffLinks;

  const linkClass = ({ isActive }) =>
    `h-full flex items-center text-sm font-medium transition-colors duration-150 border-b-2 mt-[2px] ${
      isActive
        ? 'border-blue-500 text-white'
        : 'border-transparent text-slate-400 hover:text-white'
    }`;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand + Nav links */}
          <div className="flex items-center gap-10 h-full">
            <div className="flex items-center">
              <span className="text-white font-bold text-xl tracking-wide">CampusDesk</span>
            </div>
            <div className="hidden md:flex items-center gap-8 h-full">
              {links.map(link => (
                <NavLink key={link.to} to={link.to} className={linkClass} end>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* User info + Logout */}
          <div className="flex items-center gap-6">
            {user && (
              <div className="hidden sm:flex items-center gap-4">
                <Avatar name={user.name} />
                <div className="flex flex-col justify-center gap-1">
                  <p className="text-sm text-white font-semibold leading-none whitespace-nowrap">{user.name}</p>
                  <p className="text-xs text-slate-400 leading-none">{role}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-white hover:bg-white/10 text-sm font-medium px-4 py-2 rounded-md transition-colors border border-white/20"
            >
              Sign out
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
