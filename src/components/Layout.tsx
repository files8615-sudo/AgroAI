
import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, Camera, BookOpen, MessageCircle, User as UserIcon } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onLogout }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => onNavigate(view)}
        className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${
          isActive ? 'text-agro-600' : 'text-gray-400 hover:text-agro-500'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <header className="bg-white px-4 py-3 flex justify-between items-center sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <h1 className="text-xl font-extrabold text-agro-800 tracking-tight">AgroAI</h1>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <button onClick={onLogout} className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200">
            <UserIcon size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {children}
      </main>

      <nav className="bg-white border-t border-gray-100 flex justify-between items-center px-2 sticky bottom-0 pb-safe z-30">
        <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Home" />
        <NavItem view={AppView.DIAGNOSIS} icon={Camera} label="Doctor" />
        <NavItem view={AppView.NOTES} icon={BookOpen} label="Notes" />
        <NavItem view={AppView.EXPERT} icon={MessageCircle} label="Expert" />
      </nav>
    </div>
  );
};
