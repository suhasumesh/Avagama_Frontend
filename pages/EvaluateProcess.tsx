
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EvaluateProcess: React.FC = () => {
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [formData, setFormData] = useState({
    processName: '',
    description: '',
    model: 'mistral-large-latest',
    agentType: 'Process Discovery Agent',
    volume: '',
    frequency: 'Daily',
    complexity: 5,
    exceptionRate: 20,
    riskTolerance: 'Medium'
  });

  const navigate = useNavigate();

  const handleNext = () => step < 4 && setStep(step + 1);
  const handlePrev = () => step > 1 && setStep(step - 1);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalSubmit = async () => {
    setShowConfirm(false);
    setIsEvaluating(true);
    
    // This is where the user will integrate their Node.js backend
    // const response = await fetch('http://localhost:5000/api/evaluate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
    
    setTimeout(() => {
      navigate('/results/new');
    }, 4000);
  };

  if (isEvaluating) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-12">
        <div className="relative w-96 h-96 flex items-center justify-center">
           <div className="absolute inset-0 border-2 border-dashed border-gray-100 rounded-full animate-[spin_20s_linear_infinite]"></div>
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-purple-50 text-[#9d7bb0] rounded-xl shadow-lg font-bold">Mistral</div>
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-3 bg-teal-50 text-[#4db6ac] rounded-xl shadow-lg">Agent</div>
           
           <div className="text-center space-y-4">
              <div className="w-24 h-24 border-8 border-gray-100 border-t-[#9d7bb0] rounded-full animate-spin mx-auto"></div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">AI Agent Analysis</h2>
                <p className="text-gray-500 font-medium">Processing via {formData.model}..</p>
              </div>
           </div>
        </div>
        <div className="max-w-md text-center mt-12 space-y-2">
           <p className="text-sm font-bold text-[#9d7bb0] uppercase tracking-widest animate-pulse">Evaluating Knowledge Intensity</p>
           <p className="text-gray-400 text-xs">Cross-referencing 10 critical dimensions for ROI fitment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/evaluations')} className="p-2 hover:bg-white rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <h1 className="text-2xl font-bold">Evaluate a process</h1>
          <div className="bg-[#9d7bb0]/10 text-[#9d7bb0] px-3 py-1 rounded-full text-xs font-bold border border-[#9d7bb0]/20 flex items-center gap-1">
             AI Credit: <span className="text-sm font-black">75 Remaining</span>
          </div>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-2 text-sm font-bold border border-gray-200 bg-white rounded-lg text-gray-600 hover:bg-gray-50">
             Save as draft
           </button>
           <button 
             onClick={() => step === 4 ? setShowConfirm(true) : handleNext()}
             className="bg-[#9d7bb0] text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#8b6aa1] transition-colors shadow-lg shadow-purple-200"
           >
              {step === 4 ? 'Run AI Agent' : 'Next step'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-12 max-w-5xl mx-auto min-h-[650px] flex flex-col">
        {/* Stepper Header */}
        <div className="flex justify-between items-center mb-16 px-10">
           {[1, 2, 3, 4].map(s => (
             <div key={s} className="flex flex-col items-center gap-2 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s ? 'bg-[#9d7bb0] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                   {s}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s ? 'text-[#9d7bb0]' : 'text-gray-400'}`}>
                  {s === 1 ? 'Discovery' : s === 2 ? 'Operations' : s === 3 ? 'AI Config' : 'Finalize'}
                </span>
                {s < 4 && <div className={`absolute top-5 left-12 w-24 h-[2px] ${step > s ? 'bg-[#9d7bb0]' : 'bg-gray-100'}`}></div>}
             </div>
           ))}
        </div>

        <div className="flex-grow">
           {step === 1 && (
             <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Process name</label>
                    <input 
                      name="processName"
                      value={formData.processName}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="e.g., Accounts Payable Automation" 
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#9d7bb0]/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Target Agent</label>
                    <select 
                      name="agentType"
                      value={formData.agentType}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium"
                    >
                      <option>Process Discovery Agent</option>
                      <option>ROI & Feasibility Agent</option>
                      <option>Tech Fitment Advisor</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Strategic Context</label>
                   <textarea 
                     name="description"
                     value={formData.description}
                     onChange={handleInputChange}
                     rows={4}
                     placeholder="Provide context on why this process is a candidate for transformation..." 
                     className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#9d7bb0]/10 outline-none transition-all resize-none font-medium"
                   />
                </div>
             </div>
           )}

           {step === 2 && (
             <div className="space-y-10 animate-fadeIn">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Volume (tx / Month)</label>
                      <input 
                        name="volume"
                        value={formData.volume}
                        onChange={handleInputChange}
                        type="number" 
                        placeholder="5000" 
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Frequency</label>
                      <select 
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium"
                      >
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Batch Monthly</option>
                      </select>
                   </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Process Complexity</label>
                        <span className="text-sm font-black text-[#9d7bb0]">{formData.complexity} / 10</span>
                      </div>
                      <input 
                        name="complexity"
                        type="range" 
                        min="1" max="10"
                        value={formData.complexity}
                        onChange={handleInputChange}
                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#9d7bb0]" 
                      />
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Exception Rate (%)</label>
                        <span className="text-sm font-black text-[#4db6ac]">{formData.exceptionRate}%</span>
                      </div>
                      <input 
                        name="exceptionRate"
                        type="range" 
                        min="0" max="100"
                        value={formData.exceptionRate}
                        onChange={handleInputChange}
                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#4db6ac]" 
                      />
                   </div>
                </div>
             </div>
           )}

           {step === 3 && (
             <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Base LLM Engine</label>
                      <select 
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-bold text-[#9d7bb0]"
                      >
                        <option value="mistral-large-latest">Mistral Large (Reasoning Capable)</option>
                        <option value="mistral-small-latest">Mistral Small (Fast Efficiency)</option>
                        <option value="pixtral-12b">Pixtral 12B (Vision/SOP Analysis)</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Strategic Risk Appetite</label>
                      <select 
                        name="riskTolerance"
                        value={formData.riskTolerance}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium"
                      >
                        <option>Low (Conservative transformation)</option>
                        <option>Medium (Standard enterprise baseline)</option>
                        <option>High (Aggressive AI-first approach)</option>
                      </select>
                   </div>
                </div>
                <div className="p-8 bg-purple-50 rounded-3xl border border-purple-100 flex items-start gap-4">
                   <div className="text-2xl">💡</div>
                   <div className="space-y-1">
                      <p className="font-bold text-purple-900 text-sm">Agentic Advice</p>
                      <p className="text-xs text-purple-700 leading-relaxed">Selecting Mistral Large is recommended for processes with over 15% exception rates as it provides superior autonomous reasoning capabilities for unstructured decision paths.</p>
                   </div>
                </div>
             </div>
           )}

           {step === 4 && (
             <div className="space-y-8 animate-fadeIn">
                <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Operational Overview</h3>
                      <div className="space-y-4">
                         <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-sm text-gray-500 font-medium">Process</span>
                            <span className="text-sm font-bold text-gray-900">{formData.processName || 'Untitled'}</span>
                         </div>
                         <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-sm text-gray-500 font-medium">Monthly Tx</span>
                            <span className="text-sm font-bold text-gray-900">{formData.volume}</span>
                         </div>
                         <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-sm text-gray-500 font-medium">Exception Rate</span>
                            <span className="text-sm font-bold text-gray-900">{formData.exceptionRate}%</span>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">AI Configuration</h3>
                      <div className="space-y-4">
                         <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-sm text-gray-500 font-medium">Target LLM</span>
                            <span className="text-sm font-bold text-[#9d7bb0]">{formData.model}</span>
                         </div>
                         <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-sm text-gray-500 font-medium">Agent Module</span>
                            <span className="text-sm font-bold text-gray-900">{formData.agentType}</span>
                         </div>
                         <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-sm text-gray-500 font-medium">Risk Stance</span>
                            <span className="text-sm font-bold text-gray-900">{formData.riskTolerance}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="flex justify-between pt-12">
           <button 
             onClick={handlePrev} 
             disabled={step === 1}
             className="px-8 py-3 rounded-xl font-bold text-gray-400 hover:text-gray-600 disabled:opacity-0 transition-all uppercase text-[10px] tracking-widest"
           >
             Go back
           </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-6">
           <div className="bg-white rounded-[50px] p-16 max-w-xl w-full shadow-2xl space-y-10 animate-modalIn border border-white/20">
              <div className="w-24 h-24 bg-[#9d7bb0]/10 text-[#9d7bb0] rounded-[30px] flex items-center justify-center text-4xl mx-auto border border-[#9d7bb0]/20">
                 🤖
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black text-gray-900">Initiate AI Assessment?</h3>
                <p className="text-gray-500 text-lg">This will trigger the <strong>{formData.model}</strong> Agent to perform a full process discovery over your inputs.</p>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setShowConfirm(false)} className="flex-1 py-5 border-2 border-gray-100 rounded-3xl font-black text-gray-400 hover:bg-gray-50 transition-all uppercase text-xs tracking-widest">Hold on</button>
                 <button onClick={handleFinalSubmit} className="flex-1 py-5 bg-[#9d7bb0] text-white rounded-3xl font-black hover:bg-[#8b6aa1] shadow-2xl shadow-purple-200 transition-all uppercase text-xs tracking-widest">Execute Agent</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default EvaluateProcess;
