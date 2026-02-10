
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Results: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/evaluations')} className="p-2 hover:bg-white rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <h1 className="text-2xl font-bold">Evaluation Results</h1>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-2 text-sm font-bold border border-gray-200 bg-white rounded-lg text-gray-600">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
             Download Report
           </button>
           <button className="bg-[#9d7bb0] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#8b6aa1]">
              Share with Stakeholders
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#9d7bb0] text-white p-8 rounded-[40px] shadow-xl shadow-purple-200 relative overflow-hidden">
           <div className="relative z-10 space-y-6 flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Automation Score</span>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="white" strokeOpacity="0.2" strokeWidth="10" fill="transparent" />
                  <circle cx="64" cy="64" r="58" stroke="white" strokeWidth="10" strokeDasharray="364" strokeDashoffset="110" strokeLinecap="round" fill="transparent" />
                </svg>
                <div className="absolute text-3xl font-bold">70%</div>
              </div>
              <p className="text-center text-sm font-medium">Medium automation potential</p>
           </div>
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="bg-[#8b6aa1] text-white p-8 rounded-[40px] shadow-xl shadow-purple-100 space-y-6 flex flex-col items-center">
           <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Feasibility Score</span>
           <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="white" strokeOpacity="0.2" strokeWidth="10" fill="transparent" />
                <circle cx="64" cy="64" r="58" stroke="white" strokeWidth="10" strokeDasharray="364" strokeDashoffset="127" strokeLinecap="round" fill="transparent" />
              </svg>
              <div className="absolute text-3xl font-bold">65%</div>
           </div>
           <p className="text-center text-sm font-medium">Moderate integration effort</p>
        </div>

        <div className="bg-[#4db6ac] text-white p-8 rounded-[40px] shadow-xl shadow-teal-100 col-span-1 lg:col-span-2 space-y-8">
           <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Fitment recommendation</span>
                 <h2 className="text-3xl font-bold">Agentic AI</h2>
              </div>
              <div className="bg-white/20 p-4 rounded-3xl text-3xl">🤖</div>
           </div>
           <div className="bg-white/10 p-6 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <span className="text-yellow-300">💡</span> Why this recommendation?
              </div>
              <p className="text-sm leading-relaxed opacity-90 font-medium">
                This process involves complex reasoning and autonomous decisions, making it ideal for AI-driven automation. Traditional RPA would fail due to the high exception rate.
              </p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold">Process Dimensions Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { label: 'Knowledge Intensity', score: 'Medium', color: '#f59e0b' },
            { label: 'Decision Intensity', score: 'High', color: '#ef4444' },
            { label: 'Data Structure', score: 'Structured', color: '#10b981' },
            { label: 'Context Awareness', score: 'Medium', color: '#f59e0b' },
            { label: 'Exception Handling', score: 'High', color: '#ef4444' }
          ].map((dim, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{dim.label}</div>
              <div className="text-lg font-bold">{dim.score}</div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    backgroundColor: dim.color, 
                    width: dim.score === 'High' ? '90%' : dim.score === 'Medium' ? '60%' : '100%' 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[40px] border border-gray-100 space-y-6">
            <h3 className="font-bold text-lg">Recommended Solution Stack</h3>
            <div className="space-y-4">
               {['Sap Ariba', 'Coupa', 'Tipalti'].map((tool, i) => (
                 <div key={i} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center hover:bg-gray-100 transition-colors cursor-pointer">
                    <span className="font-bold text-gray-700">{tool}</span>
                    <span className="text-[#9d7bb0] text-sm font-bold uppercase tracking-widest">Enterprise Fit</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-10 rounded-[40px] border border-gray-100 space-y-6">
            <h3 className="font-bold text-lg">Optimal LLM Models</h3>
            <div className="space-y-4">
               {['Mistral 7B', 'Llama 2 13B', 'Mistral 8x7B'].map((model, i) => (
                 <div key={i} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center hover:bg-gray-100 transition-colors cursor-pointer">
                    <span className="font-bold text-gray-700">{model}</span>
                    <span className="text-[#4db6ac] text-sm font-bold uppercase tracking-widest">Efficiency King</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Results;
