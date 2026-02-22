
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Compare: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ids = params.get('ids')?.split(',') || [];
    
    if (ids.length < 2) {
      navigate('/evaluations');
      return;
    }

    const fetchItems = async () => {
      try {
        const results = await Promise.all(ids.map(id => apiService.evaluations.get(id)));
        setItems(results.filter(r => r.success).map(r => r.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-8 border-[#9d7bb0]/20 border-t-[#9d7bb0] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Building Comparison Matrix...</p>
      </div>
    );
  }

  const dimensions = [
    'knowledgeIntensity',
    'decisionIntensity',
    'dataStructure',
    'contextAwareness',
    'exceptionHandling',
    'orchestrationComplexity',
    'processVolume',
    'processFrequency',
    'riskTolerance',
    'complianceSensitivity'
  ];

  return (
    <div className="p-10 space-y-10 bg-[#fcfdff] min-h-screen">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/evaluations')} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-600 shadow-sm transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Process Comparison</h1>
          <p className="text-sm font-medium text-gray-400">Comparing {items.length} strategic assessments</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-10">
        <div className="inline-flex gap-8 min-w-full">
          {items.map((item) => (
            <div key={item._id} className="w-[400px] flex-shrink-0 space-y-8 animate-fadeIn">
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-8 space-y-6">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-[#9d7bb0] uppercase tracking-widest">Process Evaluation</div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">{item.discovery?.processName}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-purple-50 rounded-3xl border border-purple-100 text-center">
                    <div className="text-[9px] font-bold text-[#9d7bb0] uppercase tracking-tighter mb-1">Automation</div>
                    <div className="text-2xl font-black text-[#9d7bb0]">{item.aiAnalysis?.automationScore}%</div>
                  </div>
                  <div className="p-5 bg-teal-50 rounded-3xl border border-teal-100 text-center">
                    <div className="text-[9px] font-bold text-[#4db6ac] uppercase tracking-tighter mb-1">Feasibility</div>
                    <div className="text-2xl font-black text-[#4db6ac]">
                      {(() => {
                        let f = item.aiAnalysis?.feasibilityScore;
                        if (!f && item.aiAnalysis?.automationScore && item.aiAnalysis?.businessBenefitScore) {
                          f = Math.round((item.aiAnalysis.automationScore + item.aiAnalysis.businessBenefitScore) / 2);
                        }
                        return f ? `${f}%` : '-';
                      })()}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Fitment Verdict</h3>
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-center font-black text-sm uppercase tracking-widest">
                    {item.aiAnalysis?.fitmentType}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-[11px] font-medium text-gray-500 leading-relaxed italic">
                    "{item.aiAnalysis?.recommendations?.notes?.substring(0, 150)}..."
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">10-Dimension Profile</h3>
                  <div className="space-y-2">
                    {dimensions.map(dim => {
                      const val = item.aiAnalysis?.dimensions?.[dim] || 'low';
                      return (
                        <div key={dim} className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-gray-400 uppercase">{dim.replace(/([A-Z])/g, ' $1')}</span>
                          <span className={`px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            val === 'high' ? 'bg-red-50 text-red-500' : 
                            val === 'medium' ? 'bg-orange-50 text-orange-500' : 
                            'bg-green-50 text-green-500'
                          }`}>
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compare;
