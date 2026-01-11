
import React, { useState } from 'react';
import { ShieldCheck, Info, Loader2, Sparkles, UserCheck, AlertTriangle, Mail, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { PURPOSES, FIDUCIARIES } from '../mockData';
import { summarizePolicy } from '../services/geminiService';

interface ConsentNoticeProps {
  onGrant: (selectedPurposes: string[]) => void;
  onCancel: () => void;
  fiduciaryId?: string;
}

const ConsentNotice: React.FC<ConsentNoticeProps> = ({ onGrant, onCancel, fiduciaryId = 'fid-1' }) => {
  const [step, setStep] = useState<'notice' | 'parental' | 'verifying'>('notice');
  // DPDP Compliance: Start with an empty selection to ensure "affirmative action" (no pre-checked boxes)
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});
  const [loadingAi, setLoadingAi] = useState<Record<string, boolean>>({});
  const [guardianEmail, setGuardianEmail] = useState('');

  const fiduciary = FIDUCIARIES.find(f => f.id === fiduciaryId) || FIDUCIARIES[0];
  const isChildJourney = fiduciary.isChildApp;

  // Filter purposes based on context (Child journey or Standard)
  const relevantPurposes = PURPOSES.filter(p => isChildJourney ? p.isChildSensitive || p.isMandatory : true);
  const mandatoryIds = relevantPurposes.filter(p => p.isMandatory).map(p => p.id);

  const handleAiHelp = async (id: string, name: string, desc: string) => {
    if (aiSummaries[id]) return;
    setLoadingAi(prev => ({ ...prev, [id]: true }));
    const summary = await summarizePolicy(name, desc);
    setAiSummaries(prev => ({ ...prev, [id]: summary }));
    setLoadingAi(prev => ({ ...prev, [id]: false }));
  };

  const handleContinue = () => {
    setError(null);
    
    // Check if all mandatory purposes are selected by the user
    const missingMandatory = mandatoryIds.filter(id => !selected.includes(id));
    
    if (missingMandatory.length > 0) {
      setError("Please select all mandatory purposes to proceed with this service.");
      return;
    }

    if (isChildJourney && step === 'notice') {
      setStep('parental');
    } else {
      onGrant(selected);
    }
  };

  const togglePurpose = (id: string) => {
    setError(null);
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  };

  const initiateParentalVerification = () => {
    if (!guardianEmail) return;
    setStep('verifying');
    // Simulate real-world verifiable parental consent logic
    setTimeout(() => {
      onGrant(selected);
    }, 2500);
  };

  if (step === 'verifying') {
    return (
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 p-16 text-center max-w-xl w-full mx-auto animate-fade-in">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-100">
           <Loader2 className="animate-spin text-amber-600" size={48} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Verifiable Parental Consent</h3>
        <p className="text-slate-500 font-medium">Waiting for guardian signature at {guardianEmail}...</p>
        <p className="text-[10px] text-slate-400 mt-8 font-black uppercase tracking-widest">Section 9 Compliance in progress</p>
      </div>
    );
  }

  if (step === 'parental') {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden max-w-xl w-full mx-auto animate-slide-up">
        <div className="bg-amber-600 p-8 text-white relative">
          <ShieldAlert className="absolute top-4 right-4 opacity-20" size={64} />
          <h2 className="text-2xl font-black mb-1">Parental Verification</h2>
          <p className="text-amber-50 font-bold uppercase tracking-widest text-[10px]">Verifiable Consent (Section 9)</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex gap-4">
             <AlertTriangle className="text-amber-600 shrink-0" size={24} />
             <p className="text-[11px] font-bold text-amber-900 leading-relaxed">
               For users under 18, we must obtain verifiable consent from a parent or legal guardian before any data processing can begin.
             </p>
          </div>
          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Guardian's Registered Email</label>
             <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold text-slate-700"
                />
             </div>
             <p className="text-[9px] text-slate-400 italic">This guardian will receive a secure link to authorize your data processing.</p>
          </div>
        </div>
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
           <button onClick={() => setStep('notice')} className="flex-1 py-4 font-black uppercase text-[10px] text-slate-500">Back</button>
           <button 
             onClick={initiateParentalVerification}
             disabled={!guardianEmail}
             className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
           >
             Send Verification Link <ArrowRight size={14} />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden max-w-2xl w-full mx-auto animate-fade-in-up">
      <div className="bg-indigo-600 p-10 text-white relative">
        <Sparkles className="absolute top-4 right-4 text-indigo-300 opacity-30" size={48} />
        <h2 className="text-3xl font-black mb-2 tracking-tight">Digital Notice</h2>
        <div className="flex items-center gap-2 opacity-80">
          <UserCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Section 5 Compliance</span>
        </div>
        <p className="text-indigo-100 leading-relaxed mt-6 text-sm font-medium">
          The Data Fiduciary <strong>{fiduciary.name}</strong> is requesting access to your data. Please review and <strong>manually select</strong> the purposes you agree to.
        </p>
      </div>

      <div className="p-10 space-y-6 max-h-[50vh] overflow-y-auto no-scrollbar">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-shake">
            <AlertCircle className="text-rose-600 shrink-0" size={18} />
            <p className="text-[11px] font-bold text-rose-800">{error}</p>
          </div>
        )}

        {relevantPurposes.map(purpose => (
          <div 
            key={purpose.id} 
            onClick={() => togglePurpose(purpose.id)}
            className={`group border rounded-[2rem] p-6 transition-all duration-300 cursor-pointer ${
              selected.includes(purpose.id) 
                ? 'border-indigo-400 bg-indigo-50/50' 
                : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                  selected.includes(purpose.id) 
                    ? 'bg-indigo-600 border-indigo-600 shadow-md' 
                    : 'bg-white border-slate-300'
                }`}>
                  {selected.includes(purpose.id) && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-slate-800 tracking-tight">{purpose.name}</h3>
                  {purpose.isMandatory && (
                    <span className="text-[8px] font-black uppercase tracking-widest bg-slate-900 text-white px-2 py-0.5 rounded-md">Mandatory</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">{purpose.description}</p>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAiHelp(purpose.id, purpose.name, purpose.description);
                  }}
                  className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-black uppercase tracking-widest hover:text-indigo-800 transition-colors"
                >
                  {loadingAi[purpose.id] ? <Loader2 size={12} className="animate-spin" /> : <Info size={12} />}
                  Legal Summary
                </button>

                {aiSummaries[purpose.id] && (
                  <div className="mt-4 bg-white p-4 rounded-xl border border-indigo-100 text-xs text-slate-600 animate-fade-in italic leading-relaxed">
                    {aiSummaries[purpose.id]}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isChildJourney && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex gap-4">
             <AlertTriangle className="text-rose-600 shrink-0" size={24} />
             <p className="text-[10px] font-bold text-rose-900 leading-relaxed uppercase tracking-wide">
               Section 9(2) Enforcement: This app is strictly restricted from behavioral monitoring or targeted advertising directed at you.
             </p>
          </div>
        )}
      </div>

      <div className="p-10 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onCancel}
          className="flex-1 py-4 font-black uppercase tracking-widest text-[11px] text-slate-400 hover:bg-white rounded-2xl transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={handleContinue}
          className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          {isChildJourney ? 'Proceed to Verification' : 'I Consent & Accept'}
        </button>
      </div>
    </div>
  );
};

export default ConsentNotice;
