
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import AdBanner from './components/AdBanner';
import GrievanceModal from './components/GrievanceModal';
import ModifyConsentModal from './components/ModifyConsentModal';
import PrivacyGuide from './components/PrivacyGuide';
import FiduciaryList from './components/FiduciaryList';
import PolicyScanner from './components/PolicyScanner';
import AuditorProDashboard from './components/AuditorProDashboard';
import InteractiveDemo from './components/InteractiveDemo';
import { 
  UserRole, ConsentStatus, ConsentArtifact, Grievance, AuditLog, User, Fiduciary
} from './types';
import { 
  INITIAL_CONSENTS, INITIAL_AUDIT_LOGS, INITIAL_GRIEVANCES, FIDUCIARIES, CASE_STUDIES
} from './mockData';
import ConsentNotice from './components/ConsentNotice';
import { 
  ShieldCheck, Plus, Sparkles, RefreshCcw, MessageSquare, ShieldOff,
  Activity, ArrowRight, Star, BookOpen, Search, PlayCircle, Users
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.DATA_PRINCIPAL);
  const [activeTab, setActiveTab] = useState('home');
  const [showDemo, setShowDemo] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('guardia_onboarding_done') === 'true';
  });

  const [consents, setConsents] = useState<ConsentArtifact[]>(() => {
    const saved = localStorage.getItem('guardia_consents');
    return saved ? JSON.parse(saved) : INITIAL_CONSENTS;
  });
  const [grievances, setGrievances] = useState<Grievance[]>(() => {
    const saved = localStorage.getItem('guardia_grievances');
    return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('guardia_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [fiduciaries] = useState<Fiduciary[]>(FIDUCIARIES);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [modifyingArtifact, setModifyingArtifact] = useState<ConsentArtifact | null>(null);
  const [prefilledFiduciary, setPrefilledFiduciary] = useState<string | null>(null);
  const [prefilledAuditUrl, setPrefilledAuditUrl] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('guardia_consents', JSON.stringify(consents));
    localStorage.setItem('guardia_grievances', JSON.stringify(grievances));
    localStorage.setItem('guardia_audit', JSON.stringify(auditLogs));
  }, [consents, grievances, auditLogs]);

  useEffect(() => {
    const session = sessionStorage.getItem('guardia_session');
    if (session) {
      const userData = JSON.parse(session);
      setUser(userData);
      setRole(userData.role);
    }
  }, []);

  const handleLogin = (userData: User) => {
    const isPro = localStorage.getItem('guardia_pro') === 'true';
    const completeUser = { ...userData, isPro };
    setUser(completeUser);
    setRole(userData.role);
    sessionStorage.setItem('guardia_session', JSON.stringify(completeUser));
    setActiveTab(userData.role === UserRole.DATA_PRINCIPAL ? 'home' : 'audit');
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('guardia_session');
  };

  const addAuditLog = useCallback((action: any, pId: string | undefined, status: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      userId: user?.id || 'anon',
      action, purposeId: pId, timestamp: new Date().toISOString(),
      status, initiator: role, sourceIp: '106.21.XX.XX', hash: 'SHA256-' + Math.random().toString(36).substring(7).toUpperCase()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [user, role]);

  const handleGrantConsent = (selectedPurposes: string[]) => {
    const newArtifact: ConsentArtifact = {
      id: `ART-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      userId: user?.id || 'anon',
      fiduciaryId: prefilledFiduciary || 'fid-1',
      purposes: selectedPurposes,
      status: ConsentStatus.ACTIVE,
      timestamp: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 31536000000).toISOString(),
      hash: 'SHA256-' + Math.random().toString(36).substring(7).toUpperCase()
    };
    setConsents([newArtifact, ...consents]);
    addAuditLog('GRANT', selectedPurposes[0], 'ACTIVE');
    setPrefilledFiduciary(null);
    setActiveTab('view');
  };

  const handleWithdrawConsent = (artifactId: string) => {
    setConsents(prev => prev.map(c => c.id === artifactId ? { ...c, status: ConsentStatus.WITHDRAWN } : c));
    addAuditLog('WITHDRAW', artifactId, 'WITHDRAWN');
    setModifyingArtifact(null);
  };

  const handleUpgrade = () => {
    localStorage.setItem('guardia_pro', 'true');
    setUser(prev => prev ? { ...prev, isPro: true } : null);
  };

  const openGrievanceForFiduciary = (fidName: string) => {
    setPrefilledFiduciary(fidName);
    setShowGrievanceModal(true);
  };

  const openAuditForFiduciary = (url: string) => {
    setPrefilledAuditUrl(url);
    setActiveTab('scanner');
  };

  if (!user) return <Auth onLogin={handleLogin} />;
  if (!hasCompletedOnboarding) return <Onboarding onComplete={() => { setHasCompletedOnboarding(true); localStorage.setItem('guardia_onboarding_done', 'true'); }} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 animate-slide-up pb-20">
            <AdBanner isPro={!!user.isPro} onUpgrade={handleUpgrade} />

            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-950 rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">Active Simulation Node</div>
                </div>
                <h2 className="text-4xl md:text-7xl font-black mb-10 leading-none tracking-tighter">Your Data.<br/>Your Choice.</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setShowDemo(true)} className="px-10 py-5 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.03] transition-all">
                    <PlayCircle size={22} fill="currentColor" /> Launch Journey
                  </button>
                  <button onClick={() => setActiveTab('scanner')} className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
                    <Search size={22} /> Audit Policy
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Showcase: Educational Content */}
            <div className="space-y-6">
              <div className="px-2">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Act Showcase (Working Flows)</h4>
                <p className="text-sm text-slate-500 font-medium">Click any scenario to see the compliance engine in action.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CASE_STUDIES.map((study, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      if (study.prefill) setPrefilledFiduciary(study.prefill);
                      setActiveTab(study.link);
                    }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-200 text-left hover:border-indigo-400 transition-all group flex flex-col justify-between shadow-sm active:scale-95 duration-200"
                  >
                    <div>
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg mb-4 inline-block">{study.actReference}</span>
                      <h5 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{study.title}</h5>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{study.description}</p>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
                      Run Showcase <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Logs Visual Feed */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Immutable Audit Trail (Section 4.7)</h4>
                  <button onClick={() => setActiveTab('view')} className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:underline">View History</button>
               </div>
               <div className="space-y-4">
                  {auditLogs.slice(0, 3).map(log => (
                    <div key={log.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-indigo-200 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-[12px] font-black ${log.action === 'GRANT' ? 'bg-emerald-500 shadow-emerald-100 shadow-lg' : 'bg-indigo-500 shadow-indigo-100 shadow-lg'}`}>
                            {log.action.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{log.action === 'GRANT' ? 'CONSENT_GRANTED' : 'STATE_CHANGE'}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-mono text-slate-400 uppercase">{log.hash.slice(0, 12)}...</p>
                          <p className="text-[7px] text-slate-300 font-black uppercase tracking-widest">Signed Node</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Live Consents', val: consents.filter(c => c.status === ConsentStatus.ACTIVE).length, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Audit Trail', val: auditLogs.length, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Grievance Alerts', val: grievances.length, icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Role Context', val: role.split('_')[0], icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shadow-inner`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-slate-800 tracking-tighter">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'scanner': return <PolicyScanner prefilledUrl={prefilledAuditUrl} onScanEnd={() => setPrefilledAuditUrl('')} />;
      case 'audit': return <AuditorProDashboard />;
      case 'fiduciaries': return <FiduciaryList fiduciaries={fiduciaries} consents={consents} onContact={openGrievanceForFiduciary} onAudit={openAuditForFiduciary} />;
      case 'guide': return <PrivacyGuide onSimulate={(fidId) => { setPrefilledFiduciary(fidId); setActiveTab('create'); }} />;
      case 'view': 
        return (
          <div className="space-y-8 pb-24">
             <div className="flex items-center justify-between px-2">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Consent Artifacts</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">Section 6 Verifiable Proofs</p>
                </div>
                <button onClick={() => setActiveTab('create')} className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-2xl active:scale-90 transition-all"><Plus size={24}/></button>
             </div>
             <div className="grid grid-cols-1 gap-4">
               {consents.map(c => (
                 <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center justify-between shadow-sm group hover:border-indigo-200 transition-all">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${c.status === ConsentStatus.ACTIVE ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'} rounded-xl flex items-center justify-center font-black text-lg border border-slate-100`}>
                        {fiduciaries.find(f => f.id === c.fiduciaryId)?.logo || 'ID'}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-base leading-none">{fiduciaries.find(f => f.id === c.fiduciaryId)?.name}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${c.status === ConsentStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600' : c.status === ConsentStatus.WITHDRAWN ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>{c.status}</span>
                          <span className="text-[8px] text-slate-300 uppercase font-black tracking-widest">#{c.id}</span>
                        </div>
                      </div>
                   </div>
                   {c.status === ConsentStatus.ACTIVE && (
                     <button onClick={() => setModifyingArtifact(c)} className="p-4 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"><RefreshCcw size={18} /></button>
                   )}
                 </div>
               ))}
             </div>
          </div>
        );
      case 'grievances':
        return (
          <div className="space-y-8 pb-24">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Grievance Portal</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Section 13 Redressal Tracking</p>
              </div>
              <button onClick={() => setShowGrievanceModal(true)} className="px-5 py-3 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-2xl">
                File Notice
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {grievances.map(g => (
                <div key={g.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:border-rose-100 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-lg border border-rose-100/50">{g.category.replace('_', ' ')}</span>
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${g.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{g.status}</span>
                  </div>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-6">{g.description}</p>
                  <div className="flex items-center justify-between text-[8px] text-slate-400 font-black uppercase tracking-widest pt-4 border-t border-slate-50">
                    <span>Ref: {g.referenceNumber}</span>
                    <span>{new Date(g.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'create': return <ConsentNotice onGrant={handleGrantConsent} onCancel={() => setActiveTab('home')} fiduciaryId={prefilledFiduciary || undefined} />;
      default: return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} role={role} setRole={setRole} user={user} onLogout={handleLogout}>
      {renderContent()}
      {showGrievanceModal && <GrievanceModal prefilledFiduciary={prefilledFiduciary} onClose={() => { setShowGrievanceModal(false); setPrefilledFiduciary(null); }} onSubmit={(cat, desc) => {
        const newG = { id: Date.now().toString(), userId: user!.id, category: cat as any, description: desc, status: 'SUBMITTED' as any, createdAt: new Date().toISOString(), referenceNumber: 'REF-DPDP-'+Math.floor(Math.random()*9000) };
        setGrievances([newG, ...grievances]);
        addAuditLog('NOTIFICATION', undefined, 'SUBMITTED');
        setShowGrievanceModal(false);
        setPrefilledFiduciary(null);
      }} />}
      {modifyingArtifact && <ModifyConsentModal artifact={modifyingArtifact} onClose={() => setModifyingArtifact(null)} onUpdate={(id, purs) => {
        setConsents(consents.map(c => c.id === id ? { ...c, purposes: purs, timestamp: new Date().toISOString() } : c));
        addAuditLog('UPDATE', purs[0], 'ACTIVE');
        setModifyingArtifact(null);
      }} onWithdraw={handleWithdrawConsent} />}
      {showDemo && <InteractiveDemo onExit={() => setShowDemo(false)} />}
    </Layout>
  );
};

export default App;
