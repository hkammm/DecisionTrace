
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: 'dashboard' | 'create' | 'history') => void;
  currentView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, currentView }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">DecisionTrace</span>
          </div>

          {user && (
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`text-sm font-medium ${currentView === 'dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('create')}
                className={`text-sm font-medium ${currentView === 'create' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                New Decision
              </button>
              <button
                onClick={() => onNavigate('history')}
                className={`text-sm font-medium ${currentView === 'history' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                History
              </button>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600">Hi, {user.name}</span>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-md hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <span className="text-sm text-slate-400">Welcome to better decisions</span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-slate-400 text-xs">
          <p>© 2024 DecisionTrace. Built for rational minds.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-slate-600">Privacy</a>
            <a href="#" className="hover:text-slate-600">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
