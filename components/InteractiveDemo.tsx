
import React, { useState } from 'react';
import { 
  ShieldCheck, UserCheck, Building2, 
  ArrowRight, CheckCircle2, XCircle, Info, Languages,
  Lock, RefreshCcw, Trash2, Play, Scale
} from 'lucide-react';

const DEMO_STEPS = [
  {
    id: 'notice',
    title: 'The Notice (Section 5)',
    actor: 'Data Fiduciary',
    icon: Languages,
    color: 'bg-blue-600',
    description: "Before a Data Fiduciary (the business) asks for your data, they must provide a Notice. It must explain what personal data is collected and why, in simple English or any of the 22 Indian languages.",
    action: "Prisha receives a clear Notice explaining that her health vitals are needed for a medical report.",
    lawTip: "Section 5: Every request for consent must be preceded or accompanied by a notice."
  },
  {
    id: 'consent',
    title: 'Valid Consent (Section 6)',
    actor: 'Data Principal',
    icon: CheckCircle2,
    color: 'bg-indigo-600',
    description: "Consent must be free, specific, informed, unconditional, and unambiguous. You are the 'Data Principal'—the master of your data. You decide exactly which purposes you agree to.",
    action: "Prisha gives consent for 'Diagnosis' but declines 'Third-party Marketing'.",
    lawTip: "Section 6: Consent shall be limited to such personal data as is necessary for the specified purpose."
  },
  {
    id: 'obligations',
    title: 'Fiduciary Obligations (Section 8)',
    actor: 'Data Fiduciary',
    icon: Lock,
    color: 'bg-emerald-600',
    description: "The Data Fiduciary is responsible for protecting your data. They must ensure its accuracy and use 'reasonable security safeguards' to prevent any personal data breach.",
    action: "The app securely encrypts Prisha's data and logs her consent status in a tamper-proof ledger.",
    lawTip: "Section 8: Obligations of Data Fiduciary to maintain security and accuracy."
  },
  {
    id: 'withdrawal',
    title: 'Right to Withdraw (Section 6(4))',
    actor: 'Data Principal',
    icon: RefreshCcw,
    color: 'bg-rose-600',
    description: "You have the right to withdraw your consent at any time. The process to withdraw MUST be as easy as the process to give consent. Once you withdraw, processing must stop immediately.",
    action: "Prisha clicks 'Stop Sharing' in the app. The Fiduciary must immediately cease processing her vitals.",
    lawTip: "Section 6(4): The Data Principal shall have the right to withdraw his consent at any time."
  },
  {
    id: 'grievance',
    title: 'Grievance Redressal (Section 13)',
    actor: 'Data Principal / DPO',
    icon: Scale,
    color: 'bg-amber-600',
    description: "If your rights are violated, you have the right to approach the Fiduciary's Grievance Redressal mechanism. They must respond within a specified time.",
    action: "Prisha files a complaint through the app about an unauthorized message. The DPO must investigate.",
    lawTip: "Section 13: Right of grievance redressal before approaching the Board."
  }
];

const InteractiveDemo: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = DEMO_STEPS[currentStep];

  const next = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onExit();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col lg:flex-row overflow-hidden animate-fade-in">
      {/* Visual Canvas - Simulation Area: Optimized height for small screens */}
      <div className="h-[30vh] lg:h-full lg:flex-1 bg-indigo-950 flex flex-col items-center justify-center p-4 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50"></div>
        
        <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xl border border-white/20">
            <ShieldCheck size={18} />
          </div>
          <div className="text-left">
            <span className="text-white font-black uppercase tracking-widest text-[8px] block leading-none mb-1">Journey Simulator</span>
            <span className="text-indigo-200 font-bold text-[10px]">Active Node</span>
          </div>
        </div>

        {/* Device Mockup with Dynamic Scaling */}
        <div className="relative group perspective-1000 transform scale-[0.45] sm:scale-[0.8] lg:scale-100 transition-transform duration-500 origin-center">
          <div className="w-[280px] h-[560px] md:w-[320px] md:h-[640px] bg-slate-800 rounded-[3rem] border-[10px] border-slate-700 shadow-[0_0_100px_rgba(79,70,229,0.4)] relative overflow-hidden flex flex-col">
            <div className="h-6 w-1/3 bg-slate-700 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20"></div>
            
            <div className="flex-1 bg-white p-6 pt-12 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black border border-indigo-100 shadow-inner">P</div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Secure Node</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="flex-1">
                {currentStep === 0 && (
                  <div className="space-y-4 animate-slide-up">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm text-left">
                      <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Notice (Section 5)</p>
                      <p className="text-xs font-bold text-slate-800 leading-relaxed">
                        This Medical App needs your <strong>Biometric Data</strong> to generate reports. Data will be stored for 12 months.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4 animate-slide-up text-left">
                    <h4 className="font-black text-slate-800 text-sm">Specify Purposes</h4>
                    {[
                      { label: 'Health Diagnosis', desc: 'Mandatory vitals', checked: true },
                      { label: 'Marketing Alerts', desc: 'Optional promos', checked: false }
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                        <div>
                          <p className="text-[10px] font-black text-slate-800">{p.label}</p>
                          <p className="text-[9px] text-slate-400">{p.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded border ${p.checked ? 'bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-100' : 'border-slate-300'} flex items-center justify-center transition-all`}>
                          {p.checked && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="flex flex-col items-center justify-center h-full animate-fade-in text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-6 shadow-xl border border-emerald-100">
                      <Lock size={40} />
                    </div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Security Active</p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6 animate-slide-up text-center pt-16">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mx-auto shadow-inner">
                      <Trash2 size={32} />
                    </div>
                    <button className="w-full py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Withdraw Consent</button>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4 animate-slide-up text-left">
                    <h4 className="font-black text-slate-800 text-sm">Raise Grievance</h4>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                      <textarea className="w-full h-20 bg-white border border-amber-100 rounded-lg p-2 text-[10px] outline-none" placeholder="Explain the violation..."></textarea>
                    </div>
                    <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Submit</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Side Panel */}
      <div className="flex-1 lg:w-[480px] lg:flex-none bg-white flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.1)] relative z-10 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 pb-32">
          <div className="flex items-center justify-between mb-6 lg:mb-10">
            <div className={`w-12 h-12 lg:w-14 lg:h-14 ${step.color} text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-100`}>
              <step.icon size={24} />
            </div>
            <button onClick={onExit} className="p-2 lg:p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
              <XCircle size={20} className="text-slate-400" />
            </button>
          </div>
          
          <h2 className="text-2xl lg:text-4xl font-black text-slate-900 mb-4 lg:mb-6 tracking-tighter leading-tight">{step.title}</h2>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              Actor: {step.actor}
            </span>
          </div>

          <p className="text-slate-600 text-base lg:text-lg leading-relaxed mb-6 font-medium">
            {step.description}
          </p>

          <div className="space-y-4">
            <div className="bg-indigo-50/50 border-l-4 border-indigo-500 p-4 rounded-r-2xl">
               <h5 className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <Play size={10} fill="currentColor" /> Action
               </h5>
               <p className="text-xs lg:text-sm font-bold text-slate-800 leading-relaxed italic">"{step.action}"</p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem]">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                <Info size={16} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Legal Citation</p>
                <p className="text-[10px] font-bold text-slate-700 leading-relaxed">{step.lawTip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Control Bar */}
        <div className="bg-white border-t border-slate-100 p-6 flex flex-col gap-4 sticky bottom-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
           <div className="flex gap-1">
             {DEMO_STEPS.map((_, i) => (
               <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-10 bg-indigo-600' : 'w-2 bg-slate-100'}`} />
             ))}
           </div>
           
           <div className="flex gap-3">
             {currentStep > 0 && (
               <button 
                 onClick={prev}
                 className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2"
               >
                 Back
               </button>
             )}
             <button 
               onClick={next}
               className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 active:scale-95 transition-all"
             >
               {currentStep === DEMO_STEPS.length - 1 ? 'Finish Journey' : 'Next Step'}
               <ArrowRight size={16} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
