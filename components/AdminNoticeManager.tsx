
import React, { useState } from 'react';
import { Sparkles, Send, FileText, Loader2, Wand2, Globe, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AdminNoticeManagerProps {
  onPublish: (title: string, content: string) => void;
}

const AdminNoticeManager: React.FC<AdminNoticeManagerProps> = ({ onPublish }) => {
  const [description, setDescription] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');

  const generateNotice = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Draft a formal Privacy Notice under Section 6 of the DPDP Act 2023 for a service with the following description: "${description}". Include clear purpose limitation, right to withdraw, and DPO details. Use professional but accessible legal language.`,
      });
      setDraft(response.text || "");
      setTitle(`${description.split(' ').slice(0, 3).join(' ')} Notice`);
    } catch (e) {
      setDraft("Error generating notice. Please check your AI Studio API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Wand2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Notice Generator</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">AI-Powered Compliance (Sec 6)</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Service Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A digital wallet that processes UPI transactions and provides micro-loans based on transaction history."
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-40 transition-all"
            />
          </div>

          <button 
            onClick={generateNotice}
            disabled={loading || !description}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            Generate Compliant Draft
          </button>
        </div>

        <div className="mt-10 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
          <div className="p-2 bg-white rounded-xl text-amber-500 h-fit"><Globe size={20} /></div>
          <div>
            <p className="text-xs font-bold text-amber-900 mb-1">Multi-Language Requirement</p>
            <p className="text-[10px] text-amber-700 leading-relaxed uppercase tracking-wider font-bold">DPDP Section 6(3) mandates notices in English and all 22 languages specified in the 8th Schedule upon request.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
        <FileText className="absolute top-0 right-0 p-8 text-white opacity-5" size={240} />
        
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold">Draft Preview</h3>
             {draft && <span className="px-3 py-1 bg-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-lg">AI Ready</span>}
          </div>

          {draft ? (
            <div className="flex-1 flex flex-col">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-none text-2xl font-black mb-4 focus:ring-0 outline-none p-0 w-full"
              />
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex-1 overflow-y-auto mb-8 scrollbar-hide">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{draft}</p>
              </div>
              <button 
                onClick={() => onPublish(title, draft)}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
              >
                <CheckCircle2 size={20} />
                Publish to Global Hub
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
              <FileText size={64} className="mb-4" />
              <p className="font-bold">Enter description to start drafting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNoticeManager;
