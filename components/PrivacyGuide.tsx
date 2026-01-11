
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Sparkles, MessageSquare, ArrowRight, ShieldCheck, 
  Landmark, ShoppingBag, HeartPulse, Send, Loader2, PlayCircle,
  UserCheck, Building2, Scale, HelpCircle, ChevronRight, LayoutGrid,
  GitBranch, Smartphone, Play, Fingerprint, ShieldAlert, Book, Users
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { marked } from 'marked';
import DPDPFlow from './DPDPFlow';
import SequenceDiagram from './SequenceDiagram';
import InteractiveDemo from './InteractiveDemo';

const PERSONAS = [
  {
    id: 'principal',
    role: 'Data Principal',
    title: 'The Citizen',
    desc: 'The individual to whom personal data relates.',
    focus: 'Right to Notice, Consent, Correction, Erasure, Withdrawal.',
    icon: UserCheck,
    color: 'bg-indigo-600'
  },
  {
    id: 'fiduciary',
    role: 'Data Fiduciary',
    title: 'The Data Entity',
    desc: 'Entities determining purpose and means of processing.',
    focus: 'Obligations, Notice (S5), Security Safeguards (S8).',
    icon: Building2,
    color: 'bg-emerald-600'
  },
  {
    id: 'manager',
    role: 'Consent Manager',
    title: 'Your Agent',
    desc: 'Registered entities managing your consent across apps.',
    focus: 'Unified dashboard, Consent retrieval, Accountability.',
    icon: Users,
    color: 'bg-blue-600'
  }
];

interface PrivacyGuideProps {
  onSimulate: (fidId: string, purposes: string[]) => void;
}

const PrivacyGuide: React.FC<PrivacyGuideProps> = ({ onSimulate }) => {
  const [activeTab, setActiveTab] = useState<'personas' | 'scenarios' | 'flow' | 'diagrams' | 'ai'>('flow');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDiagram, setActiveDiagram] = useState<'collection' | 'withdrawal' | 'validation'>('collection');
  const [showDemo, setShowDemo] = useState(false);

  const askAi = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain this DPDP Act 2023 query for an Indian Data Principal: "${question}". 
        Strictly use Act terminology. Avoid asterisks.`,
      });
      setAnswer(response.text || "No response received.");
    } catch (e) {
      setAnswer("Communication error with Legal Node.");
    } finally {
      setLoading(false);
    }
  };

  const renderedAnswer = useMemo(() => {
    if (!answer) return '';
    return marked(answer);
  }, [answer]);

  if (showDemo) return <InteractiveDemo onExit={() => setShowDemo(false)} />;

  return (
    <div className="space-y-6 md:space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 border-b border-slate-200 pb-6 md:pb-8">
        <div className="flex items-start gap-3 md:gap-4">
           <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
              <Book size={20} />
           </div>
           <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-none md:leading-normal">Act Lab</h2>
            <p className="text-slate-500 mt-0.5 md:mt-1 text-[10px] md:text-base font-medium">DPDP Act 2023 Explorer</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl md:rounded-2xl overflow-x-auto no-scrollbar border border-slate-200 shadow-inner">
          {(['flow', 'diagrams', 'personas', 'ai'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-[7px] md:text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'ai' ? 'Legal AI' : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'flow' && (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
           <div className="bg-indigo-600 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
             <div className="relative z-10 space-y-4 md:space-y-6 flex-1">
                <div className="flex items-center gap-2">
                   <div className="px-2 py-0.5 bg-white/10 backdrop-blur-xl rounded text-[8px] font-black uppercase tracking-widest border border-white/10">Interactive Mode</div>
                </div>
                <h3 className="text-2xl md:text-4xl font-black tracking-tighter leading-tight">The Data Principal<br/>Citizen Journey</h3>
                <p className="text-indigo-100 text-xs md:text-lg font-medium opacity-90 max-w-xl">
                  Experience how the law protects your personal data in real-time.
                </p>
                <button 
                  onClick={() => setShowDemo(true)}
                  className="px-6 md:px-10 py-3 md:py-5 bg-white text-indigo-600 rounded-xl md:rounded-[2rem] font-black uppercase tracking-widest text-[8px] md:text-[11px] flex items-center gap-2 hover:scale-[1.03] transition-all active:scale-95 shadow-2xl"
                >
                  <PlayCircle size={18} fill="currentColor" /> Launch Full Experience
                </button>
             </div>
           </div>
           <DPDPFlow />
        </div>
      )}

      {activeTab === 'diagrams' && (
        <div className="space-y-8 animate-fade-in">
           <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-8">
             {(['collection', 'withdrawal', 'validation'] as const).map(d => (
               <button 
                 key={d}
                 onClick={() => setActiveDiagram(d)}
                 className={`px-4 md:px-8 py-2.5 md:py-4 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${
                   activeDiagram === d ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400'
                 }`}
               >
                 {d} Workflow
               </button>
             ))}
           </div>
           <SequenceDiagram type={activeDiagram} />
        </div>
      )}

      {activeTab === 'personas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 animate-fade-in">
          {PERSONAS.map(p => (
            <div key={p.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 md:p-10 flex flex-col justify-between hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <div className={`w-12 h-12 md:w-14 md:h-14 ${p.color} text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-100`}>
                  <p.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-1">{p.title}</h3>
                <p className="text-[8px] font-black uppercase text-indigo-500 tracking-widest mb-4">{p.role}</p>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6">{p.desc}</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-widest">Act Focus</p>
                  <p className="text-[9px] md:text-[11px] font-bold text-slate-700 leading-relaxed">{p.focus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
          <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-xl text-center relative overflow-hidden">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 md:mb-8 shadow-2xl">
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-2 md:mb-4 tracking-tighter">Citizens' Act Assistant</h3>
            <p className="text-slate-500 mb-6 md:mb-10 font-medium text-xs md:text-base">Ask questions about DPDP Act 2023.</p>
            
            <div className="relative mb-6 md:mb-8 group">
              <input 
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Can I withdraw consent?"
                className="w-full px-5 md:px-8 py-4 md:py-6 bg-slate-50 border border-slate-200 rounded-xl md:rounded-[2rem] text-sm md:text-lg outline-none pr-16 md:pr-24 font-medium"
              />
              <button 
                onClick={askAi}
                disabled={loading || !question}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-indigo-600 text-white rounded-lg md:rounded-[1.5rem] disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>

            {answer && (
              <div className="p-6 md:p-12 bg-white rounded-xl md:rounded-[2.5rem] border border-slate-100 text-left animate-fade-in-up shadow-inner overflow-hidden">
                <div 
                  className="prose prose-slate max-w-none text-slate-700 font-medium text-xs md:text-base"
                  dangerouslySetInnerHTML={{ __html: renderedAnswer }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyGuide;
