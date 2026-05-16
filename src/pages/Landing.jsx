import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen font-sans flex flex-col bg-white">
      {/* Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold tracking-wide">ResolveDesk</span>
            </div>
            <div className="flex items-center">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center">
          {/* Left Side Content */}
          <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Report. Track. Resolve.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0">
              The centralized college complaint management portal designed to streamline campus maintenance and support.
            </p>
            <div>
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
              >
                Access Portal
              </Link>
            </div>
          </div>

          {/* Right Side Illustration */}
          <div className="lg:w-1/2 mt-16 lg:mt-0 flex justify-center">
            <svg className="w-full max-w-md h-auto" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Abstract background blobs */}
              <circle cx="250" cy="200" r="150" fill="#1e293b" />
              <path d="M400 300C400 355.228 355.228 400 300 400H100C44.7715 400 0 355.228 0 300V200C0 144.772 44.7715 100 100 100H200L400 300Z" fill="#0f172a" opacity="0.5" />
              
              {/* Document Base */}
              <rect x="150" y="80" width="200" height="260" rx="8" fill="#334155" stroke="#475569" strokeWidth="4" />
              <rect x="130" y="100" width="200" height="260" rx="8" fill="#f8fafc" />
              
              {/* Document Header */}
              <rect x="150" y="130" width="160" height="24" rx="4" fill="#cbd5e1" />
              <rect x="150" y="170" width="100" height="12" rx="4" fill="#e2e8f0" />
              
              {/* Document Lines */}
              <rect x="150" y="200" width="160" height="8" rx="4" fill="#e2e8f0" />
              <rect x="150" y="220" width="160" height="8" rx="4" fill="#e2e8f0" />
              <rect x="150" y="240" width="120" height="8" rx="4" fill="#e2e8f0" />
              
              {/* Stamp / Badge */}
              <circle cx="280" cy="280" r="30" fill="#2563eb" opacity="0.1" />
              <circle cx="280" cy="280" r="20" fill="#2563eb" />
              <path d="M273 280L278 285L288 275" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Processing Elements */}
              <rect x="90" y="230" width="60" height="40" rx="6" fill="#3b82f6" opacity="0.9" />
              <path d="M105 250H135" stroke="white" strokeWidth="4" strokeLinecap="round" />
              <path d="M125 240L135 250L125 260" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Submission</h3>
              <p className="text-slate-600 leading-relaxed">
                Log campus issues quickly through our streamlined digital interface without filling out lengthy paper forms.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-Time Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Monitor the exact status and progress of your reported complaints from submission to final resolution.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Routing</h3>
              <p className="text-slate-600 leading-relaxed">
                Complaints are automatically assigned to the correct technical department based on the selected category.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} ResolveDesk. All rights reserved.</p>
          <p className="mt-2 md:mt-0">College Complaint Management Portal</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
