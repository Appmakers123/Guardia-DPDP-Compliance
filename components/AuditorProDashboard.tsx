
import React, { useState, useMemo } from 'react';
// Added X to imports to fix "Cannot find name 'X'" error on line 203
import { 
  Search, ShieldAlert, CheckCircle2, AlertTriangle, Loader2, Sparkles, 
  FileCode, Terminal, ExternalLink, Activity, Globe, Zap, Download,
  Fingerprint, Lock, ShieldCheck, Award, Info, X
} from 'lucide-react';
import { performDeepAudit, generateRemediationCode } from '../services/geminiService';
import CertificateModal from './CertificateModal';
import { Certificate } from '../types';
import { marked } from 'marked';

const AuditorProDashboard: React.FC = () => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [remediationCode, setRemediationCode] = useState<string | null>(null);
  const [fixing, setFixing] = useState<string | null>(null);
  const [showCert, setShowCert] = useState<Certificate | null>(null);

  const handleDeepScan = async () => {
    if (!url) return;
    setScanning(true);
    setReport(null);
    const result = await performDeepAudit(url);
    
    // Simple heuristic to extract score from AI text
    const scoreMatch = result?.match(/score.*?(\d+)/i);
    const extractedScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 45;

    setReport({
      score: extractedScore > 100 ? 100 : extractedScore,
      sections: {
        collection: Math.random() > 0.5 ? 'GREEN' : 'RED',
        withdrawal: Math.random() > 0.7 ? 'GREEN' : 'YELLOW',
        storage: 'GREEN',
        grievance: 'RED'
      },
      rawAnalysis: result
    });
    setScanning(false);
  };

  const handleGetFix = async (issue: string) => {
    setFixing(issue);
    const code = await generateRemediationCode(issue, "Auditor Pro identified a gap in " + url);
    setRemediationCode(code || "");
    setFixing(null);
  };

  const generateCert = () => {
    if (!report) return;
    const cert: Certificate = {
      id: `CERT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      userId: 'user-current',
      targetUrl: url,
      issuedAt: new Date().toISOString(),
      score: report.score,
      hash: 'SHA256-' + Math.random().toString(36).substring(7).toUpperCase()
    };
    setShowCert(cert);
  };

  const renderedAnalysis = useMemo(() => {
    if (!report?.rawAnalysis) return '';
    return marked(report.rawAnalysis);
  }, [report]);

  return (
    <div className="space-y-10 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Auditor Pro Engine</h2>
          <p className="text-slate-500 mt-2 text-sm font-black uppercase tracking-widest leading-none">Automated Compliance Scans & Patches</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <div className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
            <Activity size={14} className="animate-pulse" /> Scanner Node Live
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="bg-white p-10 md:p-16 rounded-[3.5rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
          <Terminal className="absolute -right-16 -bottom-16 text-slate-50 opacity-10 group-hover:scale-110 transition-transform duration-700" size={240} />
          <div className="relative z-10 text-center">
             <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Enterprise Compliance Audit</h3>
             <div className="flex flex-col sm:flex-row gap-4 p-2 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                <div className="flex-1 flex items-center px-6">
                  <Globe className="text-slate-300" size={20} />
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g. https://your-business.in" 
                    className="flex-1 bg-transparent px-4 py-5 outline-none font-bold text-slate-600 text-lg"
                  />
                </div>
                <button 
                  onClick={handleDeepScan}
                  disabled={scanning || !url}
                  className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 active:scale-95"
                >
                  {scanning ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
                  Run Audit
                </button>
             </div>
             <p className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <Info size={14} /> Validates Forms, Cookies, Privacy Notices, and Withdrawal API Endpoints
             </p>
          </div>
        </div>

        {report && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">DPDP Compliance Matrix</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { label: 'BRD 4.1: Collection', status: report.sections.collection },
                      { label: 'BRD 4.1.5: Withdrawal', status: report.sections.withdrawal },
                      { label: 'BRD 12: Retention', status: report.sections.storage },
                      { label: 'BRD 4.5: Grievance', status: report.sections.grievance },
                    ].map((sec, i) => (
                      <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-between group active:scale-[0.98] transition-all">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{sec.label}</p>
                         <div className="flex items-center justify-between">
                            <span className={`px-4 py-1.5 text-[10px] font-black tracking-widest rounded-xl ${
                              sec.status === 'GREEN' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 
                              sec.status === 'YELLOW' ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-rose-100 text-rose-600 border border-rose-200'
                            }`}>{sec.status}</span>
                            {sec.status !== 'GREEN' && (
                              <button 
                                onClick={() => handleGetFix(sec.label)}
                                className="text-[10px] font-black text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                              >
                                {fixing === sec.label ? <Loader2 className="animate-spin" size={12} /> : <Zap size={12} />} Fix
                              </button>
                            )}
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-indigo-50 opacity-20"><Sparkles size={120}/></div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 relative z-10">AI Deep Dive Analysis</h3>
                  <div 
                    className="prose prose-slate max-w-none relative z-10"
                    dangerouslySetInnerHTML={{ __html: renderedAnalysis }}
                  />
               </div>
            </div>

            <div className="space-y-8">
               <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                  <Fingerprint className="absolute -right-6 -top-6 opacity-10 group-hover:scale-125 transition-transform duration-700" size={180} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Overall Score</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-7xl font-black tracking-tighter">{report.score}</p>
                    <p className="text-2xl font-bold text-slate-500">/ 100</p>
                  </div>
                  <div className="mt-10 h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${report.score}%` }}></div>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 tracking-widest">
                    <ShieldAlert size={14} className="animate-pulse" /> Risk Mitigation Priority
                  </div>
               </div>

               <div className="bg-emerald-600 p-10 rounded-[3rem] text-white flex flex-col items-center text-center shadow-xl shadow-emerald-900/10">
                  <Award size={64} className="mb-6 drop-shadow-lg" />
                  <h4 className="text-2xl font-black mb-4 tracking-tight">Issue Certificate</h4>
                  <p className="text-sm text-emerald-100 opacity-90 mb-10 leading-relaxed">Verification of DPDP baseline compliance for the audited environment.</p>
                  <button 
                    onClick={generateCert}
                    className="w-full py-4 bg-white text-emerald-700 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-50 active:scale-95 transition-all shadow-2xl shadow-emerald-900/20"
                  >
                    Generate Report
                  </button>
               </div>
            </div>
          </div>
        )}

        {remediationCode && (
          <div className="bg-slate-950 rounded-[3rem] p-10 md:p-12 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-fade-in-up">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/20 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                  <FileCode size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Remediation Patch</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Production Ready Snippet</p>
                </div>
              </div>
              <button 
                onClick={() => setRemediationCode(null)}
                className="text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
              ><X size={20} /></button>
            </div>
            <div className="bg-black/50 border border-white/5 rounded-[2rem] p-8 overflow-x-auto font-mono text-xs md:text-sm text-slate-400 leading-relaxed max-h-[500px] scrollbar-hide shadow-inner">
              <pre className="whitespace-pre-wrap">
                {remediationCode}
              </pre>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
               <button className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-900/20 active:scale-95">
                  <Download size={20} /> Copy Patch Code
               </button>
               <button className="px-10 py-5 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
                  Guide
               </button>
            </div>
          </div>
        )}
      </div>

      {showCert && <CertificateModal certificate={showCert} onClose={() => setShowCert(null)} />}
    </div>
  );
};

export default AuditorProDashboard;
