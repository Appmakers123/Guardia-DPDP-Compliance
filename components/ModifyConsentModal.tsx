
import React, { useState } from 'react';
import { ShieldCheck, X, Save, UserMinus, AlertCircle } from 'lucide-react';
import { PURPOSES } from '../mockData';
import { ConsentArtifact, ConsentStatus } from '../types';

interface ModifyConsentModalProps {
  artifact: ConsentArtifact;
  onClose: () => void;
  onUpdate: (artifactId: string, selectedPurposes: string[]) => void;
  onWithdraw: (artifactId: string) => void;
}

const ModifyConsentModal: React.FC<ModifyConsentModalProps> = ({ artifact, onClose, onUpdate, onWithdraw }) => {
  const [selected, setSelected] = useState<string[]>(artifact.purposes);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);

  const togglePurpose = (id: string, mandatory: boolean) => {
    if (mandatory) return;
    setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  if (confirmWithdraw) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose}></div>
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up relative z-10 p-10 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UserMinus size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Withdraw Consent?</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
            This will immediately stop all processing of your data by the fiduciary. You may lose access to certain features.
          </p>
          <div className="flex gap-4">
            <button onClick={() => setConfirmWithdraw(false)} className="flex-1 py-4 font-black uppercase text-[10px] text-slate-500 bg-slate-50 rounded-2xl">Cancel</button>
            <button 
              onClick={() => onWithdraw(artifact.id)}
              className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-rose-100 active:scale-95 transition-all"
            >
              Withdraw Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fade-in-up relative z-10">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
             <ShieldCheck size={24} />
             <div>
                <h3 className="text-xl font-black">Manage Permissions</h3>
                <p className="text-[10px] text-indigo-100 uppercase tracking-widest font-black">Artifact: {artifact.id}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-4 max-h-[50vh] overflow-y-auto no-scrollbar">
          {PURPOSES.map(purpose => (
            <div key={purpose.id} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="flex-1">
                <p className="font-black text-slate-800 text-sm tracking-tight">{purpose.name}</p>
                <p className="text-[11px] text-slate-400 font-medium">{purpose.description}</p>
              </div>
              <input 
                type="checkbox"
                checked={selected.includes(purpose.id)}
                disabled={purpose.isMandatory}
                onChange={() => togglePurpose(purpose.id, purpose.isMandatory)}
                className="w-6 h-6 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
              />
            </div>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-50">
             <button 
               onClick={() => setConfirmWithdraw(true)}
               className="w-full py-4 border-2 border-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-50 transition-all"
             >
               <UserMinus size={16} /> Withdraw All Consents
             </button>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-200 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 font-black uppercase text-[10px] text-slate-500">Cancel</button>
          <button 
            onClick={() => onUpdate(artifact.id, selected)}
            className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Save size={18} />
            Update Artifact
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyConsentModal;
