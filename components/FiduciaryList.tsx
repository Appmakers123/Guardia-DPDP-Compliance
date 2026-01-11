
import React from 'react';
import { Building2, Mail, ExternalLink, ShieldCheck, UserCheck, ChevronRight } from 'lucide-react';
import { Fiduciary, ConsentArtifact } from '../types';

interface FiduciaryListProps {
  fiduciaries: Fiduciary[];
  consents: ConsentArtifact[];
  onContact: (name: string) => void;
  onAudit: (url: string) => void;
}

const FiduciaryList: React.FC<FiduciaryListProps> = ({ fiduciaries, consents, onContact, onAudit }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Fiduciaries</h2>
          <p className="text-slate-500 mt-1 font-medium">Verified organizations processing personal data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fiduciaries.map(fid => {
          const activeConsents = consents.filter(c => c.fiduciaryId === fid.id && c.status === 'ACTIVE');
          return (
            <div key={fid.id} className="bg-white rounded-[3rem] border border-slate-200 p-8 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] group-hover:bg-indigo-50 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    {fid.logo}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-xl tracking-tight leading-tight">{fid.name}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg mt-1 inline-block">{fid.category}</span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 leading-relaxed mb-8 h-12 overflow-hidden font-medium">
                  {fid.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 flex items-center gap-2"><ShieldCheck size={14}/> Artifact Status</span>
                    <span className={activeConsents.length > 0 ? 'text-emerald-600' : 'text-slate-400'}>
                      {activeConsents.length > 0 ? 'Active Access' : 'No Active Consent'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 flex items-center gap-2"><UserCheck size={14}/> DPO Contact</span>
                    <span className="text-slate-700">{fid.contactEmail}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-50 flex items-center gap-4 relative z-10">
                <button 
                  onClick={() => onContact(fid.name)}
                  className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-100"
                >
                  <Mail size={14} /> Contact
                </button>
                <button 
                  onClick={() => onAudit(`https://${fid.name.toLowerCase().replace(/\s+/g, '')}.in/privacy`)}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} /> Full Audit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FiduciaryList;
