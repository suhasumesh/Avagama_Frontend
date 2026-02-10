
import React from 'react';
import { Link } from 'react-router-dom';
import { Evaluation, EvaluationStatus, FitmentType } from '../types';

const mockEvaluations: Evaluation[] = [
  { id: '1', processName: 'Invoice processing automation', createdOn: '07-01-2026, 05:47 PM', automationScore: 92, feasibilityScore: 86, fitmentType: FitmentType.RPA, llmType: 'Not Applicable', status: EvaluationStatus.COMPLETED },
  { id: '2', processName: 'Vendor onboarding validation', createdOn: '07-01-2026, 02:52 PM', automationScore: null, feasibilityScore: null, fitmentType: FitmentType.AGENTIC_AI, llmType: '-', status: EvaluationStatus.DRAFT },
  { id: '3', processName: 'Customer query resolution', createdOn: '06-01-2026, 04:12 PM', automationScore: 85, feasibilityScore: 76, fitmentType: FitmentType.AGENTIC_AI, llmType: 'Large LLM', status: EvaluationStatus.COMPLETED },
  { id: '4', processName: 'Contract review & analysis', createdOn: '06-01-2026, 01:27 PM', automationScore: 92, feasibilityScore: 80, fitmentType: FitmentType.AUGMENT_AI, llmType: 'Small LLM', status: EvaluationStatus.COMPLETED },
  { id: '5', processName: 'HR resume screening', createdOn: '06-01-2026, 11:51 AM', automationScore: null, feasibilityScore: null, fitmentType: FitmentType.AUGMENT_AI, llmType: '-', status: EvaluationStatus.DRAFT },
  { id: '6', processName: 'Supply chain optimization', createdOn: '05-01-2026, 04:22 PM', automationScore: 71, feasibilityScore: 65, fitmentType: FitmentType.TRANSFORMATION, llmType: 'Large LLM', status: EvaluationStatus.COMPLETED },
];

const Evaluations: React.FC = () => {
  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Evaluations</h1>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-200 bg-white rounded-lg text-gray-600 hover:bg-gray-50">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
             Compare <span className="bg-[#9d7bb0] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">0</span>
           </button>
           <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-200 bg-white rounded-lg text-gray-600 hover:bg-gray-50">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
             Export
           </button>
           <Link to="/evaluate" className="bg-[#9d7bb0] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#8b6aa1]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Evaluate a process
           </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-4 w-12"><input type="checkbox" className="rounded" /></th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Process name</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Created on</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Automation score</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Feasibility score</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fitment type</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">LLM type</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockEvaluations.map((evalItem) => (
              <tr key={evalItem.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4"><input type="checkbox" className="rounded" /></td>
                <td className="p-4">
                  <Link to={`/results/${evalItem.id}`} className="font-medium text-[#9d7bb0] hover:underline">{evalItem.processName}</Link>
                </td>
                <td className="p-4 text-sm text-gray-500 font-medium">{evalItem.createdOn}</td>
                <td className="p-4 font-bold">
                  {evalItem.automationScore ? (
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                       {evalItem.automationScore}%
                    </div>
                  ) : '-'}
                </td>
                <td className="p-4 font-bold">
                  {evalItem.feasibilityScore ? (
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                       {evalItem.feasibilityScore}%
                    </div>
                  ) : '-'}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold tracking-tight">
                    {evalItem.fitmentType}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400">{evalItem.llmType}</td>
                <td className="p-4 text-right">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    evalItem.status === EvaluationStatus.COMPLETED ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {evalItem.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50/50 flex justify-between items-center text-sm text-gray-500">
           <div className="flex items-center gap-2">
             Rows per page 
             <select className="bg-transparent border border-gray-200 rounded px-1">
               <option>10</option>
               <option>20</option>
             </select>
             <span>1-10 of 204 Results</span>
           </div>
           <div className="flex gap-1">
             <button className="p-1 border border-gray-200 rounded hover:bg-white">«</button>
             <button className="p-1 border border-gray-200 rounded hover:bg-white">‹</button>
             <button className="p-1 border border-gray-200 rounded hover:bg-white">›</button>
             <button className="p-1 border border-gray-200 rounded hover:bg-white">»</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluations;
