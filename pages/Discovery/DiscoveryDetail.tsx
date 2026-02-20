
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';

const DiscoveryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine back path from query params
  const searchParams = new URLSearchParams(location.search);
  const discoveryType = searchParams.get('type') || 'company';
  const backPath = discoveryType === 'domain' ? '/discovery/domain' : '/discovery/company';

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        let res;
        // Distinguish between company and domain detail endpoints
        if (discoveryType === 'domain') {
          res = await apiService.useCases.getDomain(id);
        } else {
          res = await apiService.useCases.getCompany(id);
        }
        
        const detail = res.data || res;
        if (detail && (detail._id || detail.id)) {
          setData(detail);
        }
      } catch (err) {
        console.error("Fetch detail error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, discoveryType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-purple-50 border-t-[#9d7bb0] rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Compiling Agentic Roadmap...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdff]">
      <div className="text-center space-y-6 max-w-sm">
        <div className="text-5xl">🔭</div>
        <h2 className="text-xl font-black text-gray-900">Analysis not found</h2>
        <p className="text-sm text-gray-500">The requested report could not be retrieved. It may have been archived.</p>
        <button onClick={() => navigate(backPath)} className="bg-[#9d7bb0] text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-100">Return to Workspace</button>
      </div>
    </div>
  );

  const getInterpretationColor = (val: string) => {
    const v = val?.toLowerCase() || '';
    if (v.includes('strong')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (v.includes('moderate')) return 'bg-blue-50 text-blue-600 border-blue-100';
    return 'bg-gray-50 text-gray-400 border-gray-100';
  };

  /**
   * Benefit Score Progress Ring
   * Calculated with extra padding in the viewBox to prevent 'round' stroke-linecap clipping
   */
  const BenefitScoreRing = ({ score }: { score: number }) => {
    const size = 100; // SVG ViewBox base
    const strokeWidth = 12;
    // We add extra margin to the radius so the rounded cap doesn't hit the viewBox edge
    const r = (size - strokeWidth * 2) / 2; 
    const center = size / 2;
    const circumference = 2 * Math.PI * r;
    const validScore = Math.min(Math.max(score || 0, 0), 100);
    const strokeDashoffset = circumference - (validScore / 100) * circumference;
    
    return (
      <div className="w-20 h-20 relative flex items-center justify-center shrink-0">
        <svg 
          viewBox={`0 0 ${size} ${size}`} 
          width="100%" 
          height="100%" 
          className="transform -rotate-90 overflow-visible"
        >
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={r}
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Overlay */}
          <circle
            cx={center}
            cy={center}
            r={r}
            stroke={discoveryType === 'domain' ? '#4db6ac' : '#9d7bb0'}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-[#fcfdff] min-h-screen pb-32">
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-14">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-end gap-10">
           <div className="space-y-4">
              <button 
                onClick={() => navigate(backPath)}
                className="group flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-[#9d7bb0] transition-colors"
              >
                <svg className="w-3 h-3 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back to Discovery
              </button>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
                {data.domain || data.company_name} <span className="text-gray-200">/</span> <span className={discoveryType === 'domain' ? 'text-[#4db6ac]' : 'text-[#9d7bb0]'}>Roadmap</span>
              </h1>
              <div className="flex flex-wrap items-center gap-5">
                <div className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-2">
                   <span className={`w-1.5 h-1.5 rounded-full ${discoveryType === 'domain' ? 'bg-[#4db6ac]' : 'bg-[#9d7bb0]'}`}></span>
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{data.industry || (discoveryType === 'domain' ? 'Industry Mapping' : 'Company Analysis')}</span>
                </div>
                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  Agent: {data.model || 'Agentic Synth 1.0'}
                </div>
              </div>
           </div>
           
           <div className="flex gap-4">
              <div className="p-6 bg-white rounded-3xl border border-gray-100 text-center min-w-[140px] shadow-sm">
                 <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Compute Yield</div>
                 <div className="text-2xl font-black text-gray-900">{data.usage?.total_tokens?.toLocaleString() || 'N/A'}</div>
              </div>
              <div className="p-6 bg-gray-900 rounded-3xl shadow-2xl text-center min-w-[140px]">
                 <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Total Scenarios</div>
                 <div className="text-2xl font-black text-white">{data.totalUseCases || data.use_cases?.length || 0}</div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-16 space-y-16">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { label: 'Avg ROI Index', value: `${Math.round(data.avgBusinessBenefitScore || 0)}%`, color: 'text-gray-900' },
             { label: 'Strong ROI Scenarios', value: data.strongROICount || 0, color: 'text-emerald-500' },
             { label: 'Moderate ROI Scenarios', value: data.moderateROICount || 0, color: 'text-blue-500' },
             { label: 'Peak Benefit Yield', value: `${data.maxBusinessBenefitScore || 0}%`, color: discoveryType === 'domain' ? 'text-[#4db6ac]' : 'text-[#9d7bb0]' }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className={`text-4xl font-black ${stat.color}`}>{stat.value}</div>
             </div>
           ))}
        </div>

        {/* Use Case Catalog */}
        <div className="space-y-10">
           <div className="flex justify-between items-center border-b border-gray-100 pb-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4">
                 <span className="w-10 h-px bg-gray-200"></span>
                 Opportunity Catalog
              </h3>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Diagnostic Detail</span>
           </div>
           
           <div className="grid grid-cols-1 gap-12">
              {data.use_cases?.map((uc: any, idx: number) => (
                <div key={idx} className={`bg-white rounded-[56px] border border-gray-100 shadow-sm overflow-hidden group transition-all ${discoveryType === 'domain' ? 'hover:border-[#4db6ac]/20' : 'hover:border-[#9d7bb0]/20'}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    
                    {/* Left Diagnostic Panel */}
                    <div className="lg:col-span-5 p-12 lg:p-14 bg-gray-50/50 border-r border-gray-100 flex flex-col justify-between">
                       <div className="space-y-8">
                          <div className="flex justify-between items-start">
                             <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                                {idx % 2 === 0 ? '🦾' : '🧠'}
                             </div>
                             <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${getInterpretationColor(uc.business_benefit_score?.interpretation || 'In Review')}`}>
                                {uc.business_benefit_score?.interpretation || 'In Review'}
                             </div>
                          </div>
                          <div className="space-y-3">
                             <h4 className={`text-2xl font-black text-gray-900 leading-tight transition-colors ${discoveryType === 'domain' ? 'group-hover:text-[#4db6ac]' : 'group-hover:text-[#9d7bb0]'}`}>{uc.title}</h4>
                             <p className="text-sm font-medium text-gray-500 leading-relaxed italic opacity-80">"{uc.description}"</p>
                          </div>
                       </div>
                       
                       <div className="pt-8 border-t border-gray-200 mt-10">
                          <div className="flex justify-between items-center bg-white p-8 lg:p-10 rounded-[40px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                             <div className="space-y-1">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">BENEFIT SCORE</p>
                                <div className="text-4xl font-black text-gray-900 flex items-baseline gap-1">
                                  {uc.business_benefit_score?.score || 0}
                                  <span className="text-sm text-gray-300 font-bold">/100</span>
                                </div>
                             </div>
                             <BenefitScoreRing score={uc.business_benefit_score?.score || 0} />
                          </div>
                       </div>
                    </div>

                    {/* Right Justification Matrix */}
                    <div className="lg:col-span-7 p-14 space-y-10">
                       <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">AI Reasoning Matrix</h5>
                       <div className="space-y-8">
                          {(uc.parameter_scoring || []).map((param: any, pIdx: number) => (
                            <div key={pIdx} className="space-y-3">
                               <div className="flex justify-between items-end">
                                  <div className="space-y-1 pr-12">
                                     <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{param.parameter}</p>
                                     <p className="text-[11px] font-medium text-gray-500 leading-snug">{param.justification}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                     <span className="text-lg font-black text-[#4db6ac]">{param.score}</span>
                                     <span className="text-[10px] font-bold text-gray-300">/10</span>
                                  </div>
                               </div>
                               <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#4db6ac] transition-all duration-1000 ease-out" style={{width: `${param.score * 10}%`}}></div>
                               </div>
                            </div>
                          ))}
                       </div>
                       
                       <div className={`p-6 rounded-[32px] border flex items-center justify-between mt-8 ${discoveryType === 'domain' ? 'bg-[#4db6ac]/5 border-[#4db6ac]/10' : 'bg-[#9d7bb0]/5 border-[#9d7bb0]/10'}`}>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-sm">🎯</div>
                             <div>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${discoveryType === 'domain' ? 'text-[#4db6ac]' : 'text-[#9d7bb0]'}`}>Weighted Readiness</p>
                                <p className="text-[11px] font-bold text-gray-600">Calculated Strategy Alignment</p>
                             </div>
                          </div>
                          <span className="text-2xl font-black text-gray-900">{uc.totalWeightedScore || '-'}</span>
                       </div>
                    </div>

                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryDetail;
