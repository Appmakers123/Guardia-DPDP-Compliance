
import React from 'react';
import { X, Award, Download, Share2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Certificate } from '../types';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const handleDownload = () => {
    alert("Certificate downloaded as PDF (Simulated)");
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up relative z-10">
        <div className="absolute top-6 right-6 z-20">
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-12 text-center bg-slate-50 border-b border-slate-100 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl" />
          
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-slate-100 relative z-10">
            <Award size={48} className="text-indigo-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-2">DPDP Ready Certified</h3>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Section 4 Compliance Verification</p>
        </div>

        <div className="p-12 space-y-8">
          <div className="border-4 border-slate-50 p-8 rounded-[2rem] text-left space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Environment</p>
                <p className="text-xl font-black text-slate-800 truncate max-w-xs">{certificate.targetUrl}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Score</p>
                <p className="text-3xl font-black text-emerald-600">{certificate.score}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <ShieldCheck className="text-emerald-600" size={24} />
              <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                This environment has been audited by Guardia Auditor Pro and meets the baseline requirements for India's DPDP Act 2023.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Date</p>
                 <p className="text-sm font-bold text-slate-700">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificate ID</p>
                 <p className="text-xs font-mono font-bold text-slate-400">{certificate.id}</p>
               </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleDownload} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <Download size={20} /> Download PDF
            </button>
            <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
              <Share2 size={20} /> Share Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
