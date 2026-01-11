
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Home, BookOpen, FileText, SearchCode, AlertCircle,
  LogOut, WifiOff, Bell, Users, ChevronDown, Smartphone
} from 'lucide-react';
import { UserRole, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, setRole, user, onLogout }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, roles: [UserRole.DATA_PRINCIPAL] },
    { id: 'scanner', label: 'Audit Scan', icon: SearchCode, roles: [UserRole.DATA_PRINCIPAL] },
    { id: 'view', label: 'Consent Hub', icon: ShieldCheck, roles: [UserRole.DATA_PRINCIPAL] },
    { id: 'audit', label: 'Enterprise Auditor', icon: FileText, roles: [UserRole.AUDITOR, UserRole.ADMIN] },
    { id: 'grievances', label: 'Grievance Alerts', icon: AlertCircle, roles: [UserRole.DATA_PRINCIPAL, UserRole.DPO] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  const roleLabels: Record<UserRole, string> = {
    [UserRole.DATA_PRINCIPAL]: 'Principal',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.DPO]: 'DPO Agent',
    [UserRole.AUDITOR]: 'Auditor',
    [UserRole.CONSENT_MANAGER]: 'Manager'
  };

  return (
    <div className="flex min-h-[100svh] bg-slate-50 flex-col md:flex-row overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-slate-200 sticky top-0 h-screen shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800 leading-none">Guardia</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-2">DPDP Compliance</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-bold uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-100">
             <button onClick={() => setActiveTab('guide')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'guide' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                <BookOpen size={18} />
                <span className="text-sm font-bold uppercase tracking-tight">Privacy Lab</span>
             </button>
          </div>
        </nav>

        <div className="p-6 space-y-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
               <Users size={12} />
               <p className="text-[10px] font-black uppercase tracking-widest">Act Persona</p>
            </div>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm appearance-none"
            >
              <option value={UserRole.DATA_PRINCIPAL}>Data Principal</option>
              <option value={UserRole.ADMIN}>Administrator</option>
              <option value={UserRole.DPO}>DPO Agent</option>
              <option value={UserRole.AUDITOR}>Auditor</option>
              <option value={UserRole.CONSENT_MANAGER}>Consent Manager</option>
            </select>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 font-black uppercase tracking-widest text-[10px] transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-[100svh]">
        {/* Mobile Header - Improved Act Persona Switcher */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 safe-top shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
              <ShieldCheck size={20} />
            </div>
            
            {/* Act Persona Dropdown Button - Theme Matched */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm active:bg-slate-50 transition-all">
              <Users size={14} className="text-indigo-600 mr-2 shrink-0" />
              <div className="flex flex-col text-left mr-6">
                <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 leading-none mb-0.5">Role</span>
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight leading-none whitespace-nowrap">
                  {roleLabels[role] || 'Select'}
                </span>
              </div>
              <ChevronDown size={12} className="text-slate-400 absolute right-2" />
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer appearance-none z-10"
              >
                {Object.entries(roleLabels).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button className="p-2 text-slate-500 bg-slate-50 rounded-xl border border-slate-100"><Bell size={18} /></button>
             <div onClick={onLogout} className="w-9 h-9 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shadow-inner cursor-pointer active:scale-90 transition-transform">
                {user?.name.charAt(0)}
             </div>
          </div>
        </header>

        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest py-2 text-center flex items-center justify-center gap-2 sticky top-0 z-50 animate-pulse">
            <WifiOff size={10} /> Offline Mode
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-12 pb-24 md:pb-12 bg-slate-50/50">
          <div className="max-w-5xl mx-auto w-full animate-slide-up">
            {children}
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 pb-safe flex justify-around items-center z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 transition-all min-w-[60px] ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${activeTab === item.id ? 'bg-indigo-50' : 'bg-transparent'}`}>
                 <item.icon size={18} />
              </div>
              <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
          <button
             onClick={() => setActiveTab('guide')}
             className={`flex flex-col items-center gap-1 p-2 transition-all min-w-[60px] ${activeTab === 'guide' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
             <div className={`p-2 rounded-xl transition-colors ${activeTab === 'guide' ? 'bg-indigo-50' : 'bg-transparent'}`}>
                <Smartphone size={18} />
             </div>
             <span className="text-[7px] font-black uppercase tracking-widest">Act Lab</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
