import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(gmail, password);
      const role = userData?.role?.role || userData?.role;
      if (role === 'Super Admin') navigate('/admin/dashboard');
      else if (role === 'Student' || role === 'User') navigate('/student/complaints');
      else navigate('/staff/complaints');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 to-indigo-900 flex-col relative overflow-hidden px-12 xl:px-20 text-white justify-between">
        
        {/* Decorative background element */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 -right-32 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        {/* Top/Middle Content - pushed down slightly to top third */}
        <div className="max-w-md mx-auto z-10 w-full pt-32">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight mb-3 text-white">CampusDesk</h1>
            <p className="text-sm font-normal text-indigo-100/90 leading-relaxed">
              Your campus voice, heard and resolved.
            </p>
          </div>

          <div className="w-full h-px bg-white/20 mb-10"></div>

          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Secure Access</h3>
                <p className="text-xs font-normal text-indigo-200">Encrypted portal for students and staff</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Role Based System</h3>
                <p className="text-xs font-normal text-indigo-200">Personalized dashboards for every user</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">College Portal</h3>
                <p className="text-xs font-normal text-indigo-200">Centralized academic facility management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="pb-10 z-10 max-w-md mx-auto w-full">
          <p className="text-xs font-normal text-indigo-300/80 tracking-wide">College Complaint Portal</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-3/5 bg-white flex flex-col justify-center px-6 sm:px-12 md:px-24 py-12 h-screen overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile App Name */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CampusDesk</h1>
            <p className="text-sm font-normal text-slate-500 mt-2">Your campus voice, heard and resolved.</p>
          </div>
          
          <div className="mb-10 text-center lg:text-left">
            <div className="hidden lg:flex w-14 h-14 bg-blue-600 rounded-xl items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 14l9-5-9-5-9 5 9 5z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14v7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Sign In</h2>
            <p className="text-sm font-normal text-slate-500">Enter your credentials to access the portal.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="gmail" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="gmail"
                type="email"
                required
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50/50 transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50/50 transition-all duration-200 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-1.29c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs font-normal text-slate-400">
              Credentials are provided by the administrator only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
