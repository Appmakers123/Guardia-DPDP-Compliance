
import React, { useState } from 'react';
import { ShieldCheck, Zap, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "India's #1 DPDP App",
    description: "Guardia is the complete compliance ecosystem built specifically for the Digital Personal Data Protection Act, 2023.",
    icon: ShieldCheck,
    color: "bg-indigo-600"
  },
  {
    title: "Deep Audit Scanner",
    description: "Scan your website or app to identify hidden privacy risks and get traffic-light compliance reports instantly.",
    icon: Zap,
    color: "bg-amber-500"
  },
  {
    title: "Remediation Engine",
    description: "Don't just find problems—fix them. Generate production-ready compliance code to patch your privacy gaps.",
    icon: ShieldAlert,
    color: "bg-emerald-600"
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="max-w-md w-full flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className={`w-24 h-24 ${step.color} text-white rounded-[2rem] flex items-center justify-center shadow-2xl mb-10 transform transition-transform duration-500 scale-110`}>
            <step.icon size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">{step.title}</h2>
          <p className="text-slate-500 text-lg leading-relaxed">{step.description}</p>
        </div>

        <div className="pb-12 space-y-8">
          <div className="flex justify-center gap-2">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
            ))}
          </div>
          
          <button 
            onClick={next}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-800 active:scale-95 transition-all"
          >
            {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight size={20} />
          </button>
          
          {currentStep === 0 && (
            <button onClick={onComplete} className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600">
              Skip Onboarding
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
