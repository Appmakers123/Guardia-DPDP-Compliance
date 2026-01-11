
import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface AdBannerProps {
  isPro: boolean;
  onUpgrade: () => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ isPro, onUpgrade }) => {
  if (isPro) return null;

  return (
    <div className="mx-6 my-4 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 text-white flex items-center justify-between border border-white/5 shadow-lg relative overflow-hidden group">
      <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles size={18} className="text-white animate-pulse" />
        </div>
        <div>
          <h4 className="text-sm font-black tracking-tight">Remove Ads with Guardia Pro</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Unlimited Deep Scans & Priority Support</p>
        </div>
      </div>
      <button 
        onClick={onUpgrade}
        className="px-5 py-2 bg-white text-slate-900 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-xl relative z-10"
      >
        Upgrade
      </button>
    </div>
  );
};

export default AdBanner;
