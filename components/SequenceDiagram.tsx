
import React from 'react';
import { User, Building2, Server, Database, History, ArrowRight } from 'lucide-react';

interface SequenceDiagramProps {
  type: 'collection' | 'withdrawal' | 'validation';
}

const SequenceDiagram: React.FC<SequenceDiagramProps> = ({ type }) => {
  const actors = [
    { id: 'principal', name: 'Data Principal', icon: User, color: 'text-indigo-600' },
    { id: 'fiduciary', name: 'Data Fiduciary', icon: Building2, color: 'text-slate-800' },
    { id: 'cms', name: 'Consent Manager', icon: Server, color: 'text-emerald-600' },
    { id: 'db', name: 'Consent DB', icon: Database, color: 'text-amber-600' },
  ];

  const getFlowSteps = () => {
    switch(type) {
      case 'collection':
        return [
          { from: 'principal', to: 'fiduciary', msg: 'Initiate Service Request', note: 'Account creation/Onboarding' },
          { from: 'fiduciary', to: 'cms', msg: 'Generate Notice', note: 'Tailored to purposes' },
          { from: 'cms', to: 'principal', msg: 'Display Notice', note: 'Multi-lingual & Granular' },
          { from: 'principal', to: 'cms', msg: 'Submit Preferences', note: 'Explicit Action Required' },
          { from: 'cms', to: 'db', msg: 'Store Artifact', note: 'Immutable & Hashed' },
          { from: 'cms', to: 'principal', msg: 'Notify Success', note: 'Email/SMS Alert' },
        ];
      case 'withdrawal':
        return [
          { from: 'principal', to: 'cms', msg: 'Initiate Withdrawal', note: 'As simple as giving consent' },
          { from: 'cms', to: 'principal', msg: 'Show Implications', note: 'Loss of features summary' },
          { from: 'principal', to: 'cms', msg: 'Confirm Revocation', note: 'Immediate Effect' },
          { from: 'cms', to: 'fiduciary', msg: 'Notify Withdrawal', note: 'Real-time alert' },
          { from: 'fiduciary', to: 'fiduciary', msg: 'Cessation of Use', note: 'Stop all processing' },
          { from: 'cms', to: 'db', msg: 'Update Status', note: 'Record "Withdrawn" state' },
        ];
      case 'validation':
        return [
          { from: 'fiduciary', to: 'cms', msg: 'API: Request Validation', note: 'Before data processing' },
          { from: 'cms', to: 'db', msg: 'Lookup Artifact', note: 'Check for specific Purpose ID' },
          { from: 'db', to: 'cms', msg: 'Return Status', note: 'Active/Withdrawn/Expired' },
          { from: 'cms', to: 'fiduciary', msg: 'Validation Response', note: 'Allow or Deny processing' },
          { from: 'fiduciary', to: 'principal', msg: 'Notify Status', note: 'If processing is denied' },
        ];
      default: return [];
    }
  };

  const steps = getFlowSteps();

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 overflow-x-auto">
      <div className="min-w-[700px] flex flex-col relative pb-10">
        
        {/* Header Actors */}
        <div className="flex justify-between mb-20 relative z-10">
          {actors.map(actor => (
            <div key={actor.id} className="flex flex-col items-center gap-4 w-32">
              <div className={`w-16 h-16 bg-slate-50 ${actor.color} rounded-2xl flex items-center justify-center shadow-sm border border-slate-100`}>
                <actor.icon size={28} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-800 text-center">{actor.name}</p>
              {/* Vertical Lifeline */}
              <div className="absolute top-24 bottom-0 w-0.5 border-l-2 border-dashed border-slate-200 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Message Lines */}
        <div className="space-y-12 relative z-10">
          {steps.map((step, i) => {
            const fromIdx = actors.findIndex(a => a.id === step.from);
            const toIdx = actors.findIndex(a => a.id === step.to);
            const isSelf = fromIdx === toIdx;
            const isForward = toIdx > fromIdx;
            
            return (
              <div key={i} className="relative h-12 flex items-center">
                {!isSelf ? (
                  <div 
                    className="absolute h-0.5 bg-indigo-600 flex items-center justify-end"
                    style={{ 
                      left: `${Math.min(fromIdx, toIdx) * 33.3 + 16.6}%`, 
                      width: `${Math.abs(toIdx - fromIdx) * 33.3}%`
                    }}
                  >
                    <div className="bg-indigo-600 text-white rounded-full p-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl border-4 border-white">
                       <ArrowRight size={12} className={!isForward ? 'rotate-180' : ''} />
                    </div>
                    <div className="absolute -top-10 left-0 right-0 text-center">
                       <p className="text-[10px] font-black text-indigo-700 bg-indigo-50 inline-block px-3 py-1 rounded-full border border-indigo-100">{step.msg}</p>
                    </div>
                    <div className="absolute -bottom-6 left-0 right-0 text-center">
                       <p className="text-[9px] font-medium text-slate-400 italic">{step.note}</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute left-[50%] flex flex-col items-center">
                     <div className="w-10 h-10 border-t-2 border-r-2 border-b-2 border-amber-600 rounded-r-lg -ml-1"></div>
                     <div className="absolute -top-10 text-center whitespace-nowrap">
                       <p className="text-[10px] font-black text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-full border border-amber-100">{step.msg}</p>
                     </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SequenceDiagram;
