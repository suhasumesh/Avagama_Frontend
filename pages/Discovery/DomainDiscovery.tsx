
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const DomainDiscovery: React.FC = () => {
  const [domainName, setDomainName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [objective, setObjective] = useState('');
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
        const res = await apiService.useCases.listDomain();
        // Handle varied backend responses
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
    if (!domainName.trim() || !userRole.trim() || !objective.trim() || loading) return;
    
    setLoading(true);
    try {
      // Pass all three required parameters to the API with correct keys
      const res = await apiService.useCases.generateDomain({
        domain: domainName.trim(),
        user_role: userRole.trim(),
        objective: objective.trim()
      });
      
      const result = res.data || res;
      const id = result._id || result.id;
      
      if (id) {
        navigate(`/discovery/detail/${id}?type=domain`);
      } else {
        throw new Error("Analysis initiated but no ID was returned. Please check portfolio below.");
      }
    } catch (err: any) {
      console.error("AI Domain Mapping error:", err);
      const errorMessage = err.message || "";
      if (errorMessage.toLowerCase().includes('insufficient credits') || errorMessage.toLowerCase().includes('credit')) {
        setErrorModal({
          show: true,
          title: "Insufficient Credits",
          message: "You do not have enough AI credits to run this domain capability mapping. Please contact your administrator for assistance."
        });
      } else {
        alert(`Agent Error: ${errorMessage || "Could not complete industry mapping. Please verify your connection."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] p-4 md:p-8 space-y-8 md:space-y-12">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 pt-6 md:pt-12">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mb-4">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-[#4db6ac] px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#4db6ac] animate-pulse"></span>
            Domain Capability Mapper
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all ${credits <= 5 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-white text-gray-400 border-gray-100'}`}>
            AI Credit: {credits}
            {credits <= 5 && <span className="text-[8px] font-black text-red-400 uppercase hidden sm:inline">(Low - Contact Admin)</span>}
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight px-2">
          Explore Vertical <span className="text-[#4db6ac]">AI Potential</span> <br className="hidden md:block" />
          Across Industry Domains
        </h1>
        <p className="text-xs md:text-base text-gray-500 font-medium max-w-2xl mx-auto px-4">
          Identify game-changing AI use cases by functional domain. Provide your context below to generate a tailored strategic automation roadmap.
        </p>
      </div>

      {/* Discovery Form */}
      <div className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleGenerate} className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-2 border-gray-100 shadow-2xl shadow-teal-50 space-y-6 md:space-y-8 group transition-all focus-within:border-[#4db6ac]/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-2 md:space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Industry Domain</label>
              <input 
                type="text" 
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                placeholder="e.g. Supply Chain..."
                className="w-full px-5 md:px-8 py-3.5 md:py-4 rounded-2xl md:rounded-3xl bg-gray-50 border border-gray-50 outline-none font-bold text-sm md:text-base text-gray-800 focus:bg-white focus:border-[#4db6ac] transition-all"
                required
              />
            </div>
            <div className="space-y-2 md:space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">User Role</label>
              <input 
                type="text" 
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="e.g. Operations Manager..."
                className="w-full px-5 md:px-8 py-3.5 md:py-4 rounded-2xl md:rounded-3xl bg-gray-50 border border-gray-50 outline-none font-bold text-sm md:text-base text-gray-800 focus:bg-white focus:border-[#4db6ac] transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Analysis Objective</label>
            <textarea 
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What specifically are you trying to achieve?..."
              className="w-full px-5 md:px-8 py-4 md:py-5 rounded-[24px] md:rounded-[32px] bg-gray-50 border border-gray-50 outline-none font-bold text-sm md:text-base text-gray-800 focus:bg-white focus:border-[#4db6ac] transition-all resize-none h-32"
              required
            />
          </div>

          <div className="flex justify-center pt-2 md:pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto h-[56px] md:h-[64px] px-8 md:px-12 bg-[#4db6ac] text-white rounded-[20px] md:rounded-[28px] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#3d968d] transition-all flex items-center justify-center gap-2 md:gap-3 disabled:bg-gray-300 shadow-xl shadow-teal-100"
            >
              {loading ? (
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {loading ? 'Processing...' : 'Execute Agent'}
            </button>
          </div>
        </form>
      </div>

      {/* History Grid */}
      <div className="max-w-7xl mx-auto space-y-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-2">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Industry Mapping Portfolio</h3>
          <span className="text-[10px] font-bold text-gray-300">{history.length} Records</span>
        </div>

        {fetchingHistory ? (
          <div className="flex justify-center py-20">
             <div className="w-8 h-8 border-3 border-teal-50 border-t-teal-400 rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] md:rounded-[48px] border border-dashed border-gray-200">
             <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No domain history yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
            {history.map((item) => (
              <div 
                key={item._id || item.id} 
                onClick={() => navigate(`/discovery/detail/${item._id || item.id}?type=domain`)}
                className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#4db6ac]/20 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-teal-50 text-[#4db6ac] flex items-center justify-center text-lg md:text-xl font-bold">🌐</div>
                  <div className="px-2 py-0.5 md:px-3 md:py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider border border-blue-100">
                    {item.totalUseCases || item.use_cases?.length || 0} Opportunities
                  </div>
                </div>
                <h4 className="text-lg md:text-xl font-black text-gray-900 group-hover:text-[#4db6ac] transition-colors truncate">{item.domain || item.company_name}</h4>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 truncate">{item.industry || 'Domain Mapping'}</p>
                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[9px] md:text-[10px] font-bold text-gray-300 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <div className="text-[#4db6ac] flex items-center gap-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Vertical
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

export default DomainDiscovery;
