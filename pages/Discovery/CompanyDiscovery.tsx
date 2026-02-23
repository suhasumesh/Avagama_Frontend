
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const CompanyDiscovery: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [credits, setCredits] = useState<number>(0);
  const [errorModal, setErrorModal] = useState<{ show: boolean; title: string; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.credits !== undefined) setCredits(user.credits);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    const fetchHistory = async () => {
      try {
        const res = await apiService.useCases.listCompany();
        // Backend returns { success: true, data: [...] } or just [...]
        const items = res.data || res;
        if (Array.isArray(items)) {
          setHistory(items);
        }
      } catch (err) {
        console.error("Fetch history error:", err);
      } finally {
        setFetchingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || loading) return;
    
    setLoading(true);
    try {
      // The API expects { "company": "..." } in the body
      const res = await apiService.useCases.generateCompany(companyName.trim());
      
      // Robust ID extraction from common backend patterns
      const result = res.data || res;
      const targetId = result._id || result.id;

      if (targetId) {
        navigate(`/discovery/detail/${targetId}?type=company`);
      } else {
        throw new Error("Analysis completed but no document ID was returned. Check history below.");
      }
    } catch (err: any) {
      console.error("AI Generation error:", err);
      const errorMessage = err.message || "";
      if (errorMessage.toLowerCase().includes('insufficient credits') || errorMessage.toLowerCase().includes('credit')) {
        setErrorModal({
          show: true,
          title: "Insufficient Credits",
          message: "You do not have enough AI credits to run this strategic analysis. Please contact your administrator for assistance."
        });
      } else {
        alert(`AI Agent Error: ${errorMessage || "Failed to initiate agent. Please try again later."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] p-4 md:p-8 space-y-8 md:space-y-12">
      {/* Hero Search Section */}
      <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 pt-6 md:pt-12">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mb-4">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-[#9d7bb0] px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#9d7bb0] animate-pulse"></span>
            Strategic Company Analyzer
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all ${credits <= 5 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-white text-gray-400 border-gray-100'}`}>
            AI Credit: {credits}
            {credits <= 5 && <span className="text-[8px] font-black text-red-400 uppercase hidden sm:inline">(Low - Contact Admin)</span>}
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight px-2">
          Discover High-Impact <span className="text-[#9d7bb0]">AI Use Cases</span> <br className="hidden md:block" />
          For Your Specific Enterprise
        </h1>
        <p className="text-xs md:text-base text-gray-500 font-medium max-w-2xl mx-auto px-4">
          Enter any global enterprise name. Our Agentic AI will perform a deep sectoral analysis 
          to identify the most profitable automation opportunities.
        </p>
        
        <form onSubmit={handleGenerate} className="max-w-2xl mx-auto pt-2 md:pt-6 group px-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-[24px] md:rounded-[32px] border-2 border-gray-100 shadow-2xl shadow-purple-100 focus-within:border-[#9d7bb0] transition-all p-2 gap-2">
            <input 
              type="text" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter Company (e.g. Cisco)..."
              className="flex-1 pl-4 md:pl-8 py-3 md:py-4 outline-none font-bold text-sm md:text-lg text-gray-800 placeholder:text-gray-300"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="h-[50px] md:h-[60px] px-6 md:px-10 bg-[#9d7bb0] text-white rounded-[18px] md:rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#8b6aa1] transition-all flex items-center justify-center gap-2 md:gap-3 disabled:bg-gray-300 shadow-lg shadow-purple-200 shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {loading ? 'Analyzing...' : 'Execute Agent'}
            </button>
          </div>
        </form>
      </div>

      {/* History Grid */}
      <div className="max-w-7xl mx-auto space-y-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-2">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Historical Analysis Portfolio</h3>
          <span className="text-[10px] font-bold text-gray-300">{history.length} Records</span>
        </div>

        {fetchingHistory ? (
          <div className="flex justify-center py-20">
             <div className="w-8 h-8 border-3 border-purple-50 border-t-purple-400 rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] md:rounded-[48px] border border-dashed border-gray-200">
             <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No history found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
            {history.map((item) => (
              <div 
                key={item._id || item.id} 
                onClick={() => navigate(`/discovery/detail/${item._id || item.id}?type=company`)}
                className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#9d7bb0]/20 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-purple-50 text-[#9d7bb0] flex items-center justify-center text-lg md:text-xl font-bold">🏢</div>
                  <div className="px-2 py-0.5 md:px-3 md:py-1 bg-green-50 text-green-600 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider border border-green-100">
                    {item.strongROICount || 0} ROI Scenarios
                  </div>
                </div>
                <h4 className="text-lg md:text-xl font-black text-gray-900 group-hover:text-[#9d7bb0] transition-colors truncate">{item.company_name}</h4>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 truncate">{item.industry}</p>
                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[9px] md:text-[10px] font-bold text-gray-300 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <div className="text-[#9d7bb0] flex items-center gap-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    View Report
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {errorModal?.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-center justify-center p-4 md:p-6">
          <div className="bg-white rounded-[32px] md:rounded-[50px] p-8 md:p-16 max-w-xl w-full shadow-2xl space-y-6 md:space-y-8 border border-white/20">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 text-red-500 rounded-[20px] md:rounded-[24px] flex items-center justify-center mx-auto border border-red-100">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">{errorModal.title}</h3>
              <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">
                {errorModal.message}
              </p>
            </div>
            <button 
              onClick={() => {
                setErrorModal(null);
                navigate('/dashboard');
              }} 
              className="w-full py-4 md:py-5 bg-gray-900 text-white rounded-2xl md:rounded-3xl font-black hover:bg-black transition-all uppercase text-xs tracking-widest shadow-xl shadow-gray-200"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDiscovery;
