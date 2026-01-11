
import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Sparkles, Send, X, MessageSquare, ShieldAlert } from 'lucide-react';
import { suggestGrievanceDraft } from '../services/geminiService';

interface GrievanceModalProps {
  onClose: () => void;
  onSubmit: (category: string, description: string) => void;
  prefilledFiduciary?: string | null;
}

const GrievanceModal: React.FC<GrievanceModalProps> = ({ onClose, onSubmit, prefilledFiduciary }) => {
  const [category, setCategory] = useState('CONSENT_VIOLATION');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  useEffect(() => {
    if (prefilledFiduciary) {
      setIssue(`I have a concern regarding data processing by ${prefilledFiduciary}. Specifically...`);
    }
  }, [prefilledFiduciary]);

  const handleAiDraft = async () => {
    if (!issue || issue.length < 10) return;
    setIsDrafting(true);
    const draft = await suggestGrievanceDraft(issue);
    setDescription(draft || '');
    setIsDrafting(false);
  };

  const handleFinalSubmit = () => {
    if (!description || description.length < 20) {
      alert("Please provide a more detailed formal description.");
      return;
    }
    onSubmit(category, description);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-fade-in" onClick={onClose}></div>
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fade-in-up relative z-10">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shadow-inner"><MessageSquare size={20}/></div>
             <div>
                <h3 className="text-xl font-black text-slate-800">New Grievance</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">Section 13 Compliance</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Violation Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none"
            >
              <option value="CONSENT_VIOLATION">Consent Violation</option>
              <option value="DATA_BREACH">Data Breach Inquiry</option>
              <option value="PROCESSING_ERROR">Incorrect Processing</option>
              <option value="ACCESS_REQUEST">Right to Access Request</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plain Text Issue</label>
            <div className="relative group">
              <textarea 
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Briefly describe what happened..."
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none h-32 transition-all resize-none shadow-inner"
              />
              <button 
                onClick={handleAiDraft}
                disabled={isDrafting || !issue || issue.length < 10}
                className="absolute right-3 bottom-3 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-200"
              >
                {isDrafting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Format Formally
              </button>
            </div>
            <p className="text-[9px] text-slate-400 px-1">Tip: Use our AI to draft a professional legal notice.</p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Formal Legal Draft</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="The formal description will appear here after formatting..."
              className="w-full p-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold h-48 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none italic text-slate-600 leading-relaxed"
            />
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
          <button onClick={onClose} className="flex-1 py-4 font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-200 rounded-2xl transition-all">Discard</button>
          <button 
            onClick={handleFinalSubmit}
            disabled={!description || description.length < 20}
            className="flex-[2] py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
          >
            <Send size={18} />
            Submit Formal Notice
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrievanceModal;
