
import React, { useState } from 'react';
import { 
  ShieldCheck, User as UserIcon, ArrowRight, 
  Loader2, CheckCircle2, Globe
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to proceed');
      return;
    }

    setLoading(true);
    // Mimic initialization sequence
    await new Promise(resolve => setTimeout(resolve, 1200));

    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      role: UserRole.DATA_PRINCIPAL,
      provider: 'email'
    });
    setLoading(false);
  };

  return (
    <div className="min-h-[100svh] bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in">
          
          <div className="p-10 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-600/10 to-transparent pointer-events-none"></div>
             <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/20 border border-white/10">
                <ShieldCheck size={40} className="text-white" />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter mb-1">Guardia Hub</h2>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest opacity-60">Citizen Entry Node</p>
          </div>

          <div className="px-10 pb-12">
            <div className="text-center mb-10">
              <h3 className="text-white font-bold text-lg mb-2">Welcome to your Privacy Dashboard</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Enter your name to initialize your DPDP-compliant session. 
                No password required for this simulation.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] rounded-2xl font-bold mb-6 animate-shake text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                    autoFocus
                    className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-white font-medium"
                    placeholder="Nikesh Maurya"
                  />
                </div>
              </div>

              <button
                disabled={loading || !name.trim()}
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Initialize Dashboard
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white/5 px-10 py-5 border-t border-white/5 flex items-center justify-center gap-6">
             <div className="flex items-center gap-2 text-slate-500">
                <Globe size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Region: India</span>
             </div>
             <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest">DPDP Compliant</span>
             </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-8">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Terms of Service</p>
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Act Library</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
