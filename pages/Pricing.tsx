
import React from 'react';
import { PricingPlan } from '../types';

const plans: PricingPlan[] = [
  {
    name: 'STARTER PACK',
    subtitle: 'Discovery Pilot',
    price: '₹7,50,000',
    duration: '/ 3m',
    validity: '3 Months Validity',
    runs: '75 Evaluation Runs',
    users: '2 Enterprise Licenses',
    features: [
      'Evaluation over 10 dimensions',
      'Agentic AI Fitment & Scoring',
      'Domain Use Case Discovery',
      'Strategic Decisioning Dashboard',
      'Excel Export: Priority Roadmap'
    ],
    footerNote: 'IDEAL FOR PILOT TEAMS'
  },
  {
    name: 'GROWTH PACK',
    subtitle: 'Strategic Expansion',
    price: '₹13,50,000',
    duration: '/ 6m',
    validity: '6 Months Validity',
    runs: '150 Evaluation Runs',
    users: '5 Enterprise Licenses',
    features: [
      'Everything in Starter',
      'Higher discovery volume',
      'Quarterly roadmap planning',
      'Advanced risk mapping',
      'Carry-forward runs (with ext.)'
    ],
    footerNote: 'MOST POPULAR FOR MID-SIZE'
  },
  {
    name: 'SCALE PACK',
    subtitle: 'Enterprise Transformation',
    price: '₹23,76,000',
    duration: '/ 12m',
    validity: '12 Months Validity',
    runs: '300 Evaluation Runs',
    users: '10 Enterprise Licenses',
    features: [
      'Everything in Growth',
      'Maximum agentic intelligence',
      'Annual strategy alignment',
      'Full export capabilities',
      'Priority roadmap governance'
    ],
    footerNote: 'FOR GLOBAL ENTERPRISES'
  }
];

const Pricing: React.FC = () => {
  return (
    <div className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-6 mb-24">
        <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Pricing Prospectus 2026
        </div>
        <h1 className="text-7xl font-black text-gray-900 tracking-tighter">
          Invest in <span className="text-[#9d7bb0]">Clarity.</span><br />
          Scale with <span className="text-[#4db6ac]">Confidence.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Avagama AI provides upper mid and large enterprises with the scientific rigor needed to prioritize automation investments.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {plans.map((plan, i) => (
          <div key={i} className={`group relative p-12 rounded-[60px] border-2 transition-all duration-500 flex flex-col ${i === 1 ? 'border-[#9d7bb0] bg-gray-50/30 scale-105 shadow-2xl' : 'border-gray-100 hover:border-[#9d7bb0]/30 hover:shadow-xl'}`}>
            {i === 1 && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#9d7bb0] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
                Strategic Choice
              </div>
            )}
            
            <div className="space-y-2 mb-10">
              <h2 className="text-[#9d7bb0] font-black text-xs tracking-[0.3em] uppercase">{plan.name}</h2>
              <p className="text-2xl font-bold text-gray-900 leading-tight">{plan.subtitle}</p>
            </div>

            <div className="mb-12">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">{plan.price}</span>
                <span className="text-gray-400 font-bold text-sm">{plan.duration}</span>
              </div>
            </div>

            <div className="space-y-6 flex-grow">
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#9d7bb0]">⏳</div>
                    {plan.validity}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#4db6ac]">⚡</div>
                    {plan.runs}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">👤</div>
                    {plan.users}
                  </div>
               </div>

               <div className="pt-8 border-t border-gray-100 space-y-4">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex gap-4 items-start text-xs font-medium text-gray-500 leading-relaxed">
                      <svg className="w-4 h-4 text-[#4db6ac] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {f}
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-12">
               <div className="bg-gray-100 p-4 rounded-2xl text-[10px] text-center font-black text-gray-400 mb-8 uppercase tracking-widest">
                  {plan.footerNote}
               </div>
               <button className={`w-full py-5 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] transition-all ${i === 1 ? 'bg-[#9d7bb0] text-white hover:bg-[#8b6aa1] shadow-2xl shadow-purple-200' : 'bg-gray-900 text-white hover:bg-black'}`}>
                 Select {plan.name.split(' ')[0]}
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-40">
        <div className="bg-gray-50 p-16 rounded-[60px] border border-gray-100 space-y-12">
           <div className="text-center space-y-2">
              <h3 className="text-3xl font-bold">Enterprise Add-ons</h3>
              <p className="text-gray-500 font-medium">Extend your discovery phase without losing momentum.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: '1 Month Ext.', price: '₹2,37,500', runs: '+25 runs' },
                { label: '3 Month Ext.', price: '₹6,76,875', runs: '+75 runs' },
                { label: '6 Month Ext.', price: '₹12,86,063', runs: '+150 runs' }
              ].map((addon, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-4 shadow-sm hover:shadow-lg transition-all">
                   <div className="text-[10px] font-black text-[#9d7bb0] uppercase tracking-widest">{addon.label}</div>
                   <div className="text-xl font-black text-gray-900">{addon.price}</div>
                   <div className="text-[10px] font-bold text-[#4db6ac] uppercase">{addon.runs}</div>
                   <button className="w-full py-3 rounded-xl bg-gray-50 text-gray-800 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100">Add to Pack</button>
                </div>
              ))}
           </div>
           
           <div className="text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pricing subject to standard terms and conditions. Taxes additional as applicable.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
