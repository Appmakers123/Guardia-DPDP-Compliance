
import React from 'react';
import { 
  PlusCircle, ShieldCheck, RefreshCcw, History, 
  UserMinus, ArrowRight, Info, CheckCircle2
} from 'lucide-react';

const BRD_LIFECYCLE = [
  {
    id: 'collection',
    section: '4.1.1',
    title: 'Consent Collection',
    description: 'Explicit, purpose-specific, and granular collection. Requires affirmative action (no pre-checked boxes) and multi-language support.',
    icon: PlusCircle,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    id: 'validation',
    section: '4.1.2',
    title: 'Consent Validation',
    description: 'Pre-processing check to ensure consent exists, is active, and the processing activity matches the specific purpose provided.',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    id: 'update',
    section: '4.1.3',
    title: 'Consent Update',
    description: 'Enables Data Principals to modify previously granted consent when processing purposes or scopes change.',
    icon: RefreshCcw,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    id: 'renewal',
    section: '4.1.4',
    title: 'Consent Renewal',
    description: 'Automatic notification and seamless re-affirmation flow when consent is nearing its predefined expiration date.',
    icon: History,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    id: 'withdrawal',
    section: '4.1.5',
    title: 'Consent Withdrawal',
    description: 'The right to revoke consent as easily as it was given. Must result in immediate cessation of data processing.',
    icon: UserMinus,
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  }
];

const DPDPFlow: React.FC = () => {
  return (
    <div className="space-y-8 py-4 animate-fade-in">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden mb-12 shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={24} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">BRD Compliance Standards</span>
          </div>
          <h3 className="text-3xl font-black mb-4 tracking-tight">Consent Management Lifecycle</h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
            A comprehensive framework for aligning with the Digital Personal Data Protection (DPDP) Act, 2023, as outlined by the National e-Governance Division (NeGD).
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 opacity-5">
          <ShieldCheck size={320} />
        </div>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-[31px] top-0 bottom-0 w-1 bg-slate-100 md:hidden"></div>
        
        <div className="space-y-12">
          {BRD_LIFECYCLE.map((step, index) => (
            <div key={step.id} className="relative flex items-start gap-6 group">
              <div className={`w-16 h-16 shrink-0 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-300 border border-white/50`}>
                <step.icon size={28} />
              </div>
              
              <div className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-black text-slate-800 text-lg tracking-tight">{step.title}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Section {step.section}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">{step.description}</p>
                <div className="flex items-center gap-2">
                   <div className="h-1 flex-1 bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full ${step.color.replace('text', 'bg')} opacity-20`} style={{ width: '100%' }}></div>
                   </div>
                </div>
              </div>

              {index < BRD_LIFECYCLE.length - 1 && (
                <div className="hidden md:flex absolute -bottom-10 left-8 text-slate-200">
                  <ArrowRight className="rotate-90" size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2rem] flex items-start gap-5">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600 shrink-0">
          <Info size={24} />
        </div>
        <div>
          <h5 className="font-black text-slate-800 mb-1">Indicative Flow Requirements</h5>
          <p className="text-xs text-slate-600 leading-relaxed">
            The system must maintain an <span className="text-indigo-700 font-bold uppercase tracking-tight">Immutable Audit Log</span> for every action in this lifecycle, featuring Log IDs, Timestamps, and Cryptographic Hashes as per Section 4.7.1 of the BRD.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DPDPFlow;
