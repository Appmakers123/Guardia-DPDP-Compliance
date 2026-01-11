
import React, { useState } from 'react';
import { CheckCircle2, X, MessageCircle } from 'lucide-react';
import { Grievance } from '../types';

interface ResolveGrievanceModalProps {
  grievance: Grievance;
  onClose: () => void;
  onResolve: (id: string, notes: string) => void;
}

const ResolveGrievanceModal: React.FC<ResolveGrievanceModalProps> = ({ grievance, onClose, onResolve }) => {
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fade-in-up relative z-10">
        <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Process Grievance</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Case ID: {grievance.referenceNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">User Complaint</p>
            <p className="text-sm text-slate-700 italic">"{grievance.description}"</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <MessageCircle size={14} /> Resolution Notes
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detail the steps taken to resolve this issue..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-40"
            />
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Dismiss</button>
          <button 
            onClick={() => onResolve(grievance.id, notes)}
            disabled={!notes}
            className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            Resolve Case
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResolveGrievanceModal;
