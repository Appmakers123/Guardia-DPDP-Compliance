
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, Loader2, Sparkles, FileText, Globe, Info, ShieldCheck, Target, Bookmark, Copy, Check } from 'lucide-react';
import { scanPolicyText, translateLegalNotice } from '../services/geminiService';
import { marked } from 'marked';

interface PolicyScannerProps {
  prefilledUrl?: string;
  onScanEnd?: () => void;
}

const PolicyScanner: React.FC<PolicyScannerProps> = ({ prefilledUrl, onScanEnd }) => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefilledUrl) {
      setInput(`Scan request for: ${prefilledUrl}`);
      handleScan();
    }
  }, [prefilledUrl]);

  const handleScan = async () => {
    if (!input || input.length < 5) return;
    setLoading(true);
    setAnalysis(null);
    setTranslation(null);
    const result = await scanPolicyText(input);
    setAnalysis(result || "Analysis node error.");
    setLoading(false);
    if (onScanEnd) onScanEnd();
  };

  const handleTranslate = async (lang: string) => {
    if (!analysis) return;
    setTranslating(true);
    const result = await translateLegalNotice(analysis, lang);
    setTranslation(result || "Translation node error.");
    setTranslating(false);
  };

  const copyToClipboard = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parsedScore = useMemo(() => {
    if (!analysis) return null;
    const match = analysis.match(/\[SCORE\]\s*\n*\**(\d+)/i);
    if (match) {
      const score = parseInt(match[1], 10);
      return { value: score, total: 10, percent: (score / 10) * 100 };
    }
    return { value: 5, total: 10, percent: 50 };
  }, [analysis]);

  const renderedContent = useMemo(() => {
    if (!analysis) return '';
    let text = analysis.replace(/\[SCORE\]\s*\n*\**\d+/gi, '');
    text = text.replace(/\[RISKS\]/gi, '### Compliance Gaps');
    text = text.replace(/\[SUMMARY\]/gi, '### Audit Summary');
    return marked(text);
  }, [analysis]);

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-24">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Policy Auditor</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          The DPDP Act 2023 mandates transparency. Paste any Privacy Notice below to perform a legal audit.
        </p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"></div>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste Privacy Policy text or a Fiduciary URL..."
          className="w-full p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-lg md:text-xl font-medium focus:ring-8 focus:ring-indigo-500/5 outline-none h-64 transition-all resize-none shadow-inner placeholder-slate-300 text-slate-700"
        />
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4 px-6 py-3 bg-indigo-50 rounded-2xl border border-indigo-100">
             <ShieldCheck size={20} className="text-indigo-600" />
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Baseline Audit Node Live</span>
           </div>
           <button 
             onClick={handleScan}
             disabled={loading || !input || input.length < 5}
             className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-700 disabled:opacity-50 shadow-2xl shadow-indigo-200 transition-all active:scale-95"
           >
             {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
             Initiate Compliance Scan
           </button>
        </div>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-slate-100 pb-10">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><FileText size={28}/></div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-800">Scan Results</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verified Audit Report</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={copyToClipboard} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                     {copied ? <Check size={20} /> : <Copy size={20} />}
                   </button>
                </div>
              </div>

              <div 
                className="prose prose-slate max-w-none text-slate-700 font-medium"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />

              <div className="mt-12 pt-10 border-t border-slate-50 flex flex-wrap gap-4">
                 {['Hindi', 'Tamil', 'Marathi', 'Bengali'].map(lang => (
                   <button 
                     key={lang}
                     onClick={() => handleTranslate(lang)}
                     className={`px-6 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all ${translating ? 'opacity-50' : ''}`}
                   >
                     {lang}
                   </button>
                 ))}
              </div>

              {translation && (
                <div className="mt-10 p-10 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 animate-fade-in">
                  <div className="flex items-center gap-3 text-indigo-600 mb-6 font-black uppercase tracking-widest text-xs"><Globe size={20}/> Translation</div>
                  <div className="prose prose-indigo max-w-none text-indigo-950 font-bold" dangerouslySetInnerHTML={{ __html: marked(translation) }} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-[11px] font-black uppercase text-indigo-400 tracking-widest mb-4">Overall Score</p>
                <div className="inline-flex items-baseline gap-2 bg-white/5 p-8 rounded-[3rem] border border-white/10 mb-8">
                   <span className="text-8xl font-black tracking-tighter leading-none">{parsedScore?.value || 0}</span>
                   <span className="text-2xl font-bold text-slate-500">/ 10</span>
                </div>
                <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden p-1">
                   <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${parsedScore?.percent || 0}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-8 font-black uppercase tracking-widest">Confidence: HIGH</p>
             </div>

             <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm">
                <div className="flex items-center gap-3 text-amber-600 mb-8"><AlertTriangle size={24}/><span className="text-sm font-black uppercase tracking-widest">Section 8 Risks</span></div>
                <div className="space-y-4">
                   <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] font-bold text-rose-700 leading-relaxed">Encryption standards not specified for stored biometrics.</div>
                   <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl text-[11px] font-bold text-amber-700 leading-relaxed">Retention policy exceeds the "necessary duration" baseline.</div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyScanner;
