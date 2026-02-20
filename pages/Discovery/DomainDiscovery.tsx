
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
  const navigate = useNavigate();

  useEffect(() => {
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
      alert(`Agent Error: ${err.message || "Could not complete industry mapping. Please verify your connection."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] p-8 space-y-12">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center space-y-8 pt-12">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-[#4db6ac] px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#4db6ac] animate-pulse"></span>
          Domain Capability Mapper
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Explore Vertical <span className="text-[#4db6ac]">AI Potential</span> <br />
          Across Industry Domains
        </h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">
          Identify game-changing AI use cases by functional domain. Provide your context below to generate a tailored strategic automation roadmap.
        </p>
      </div>

      {/* Discovery Form */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleGenerate} className="bg-white p-10 rounded-[48px] border-2 border-gray-100 shadow-2xl shadow-teal-50 space-y-8 group transition-all focus-within:border-[#4db6ac]/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Industry Domain</label>
              <input 
                type="text" 
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                placeholder="e.g. Supply Chain, FinTech..."
                className="w-full px-8 py-4 rounded-3xl bg-gray-50 border border-gray-50 outline-none font-bold text-gray-800 focus:bg-white focus:border-[#4db6ac] transition-all"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">User Role</label>
              <input 
                type="text" 
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="e.g. Operations Manager..."
                className="w-full px-8 py-4 rounded-3xl bg-gray-50 border border-gray-50 outline-none font-bold text-gray-800 focus:bg-white focus:border-[#4db6ac] transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Analysis Objective</label>
            <textarea 
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What specifically are you trying to achieve? (e.g. Reduce manual reconciliation by 40% using AI Agents)..."
              className="w-full px-8 py-5 rounded-[32px] bg-gray-50 border border-gray-50 outline-none font-bold text-gray-800 focus:bg-white focus:border-[#4db6ac] transition-all resize-none h-32"
              required
            />
          </div>

          <div className="flex justify-center pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="h-[64px] px-12 bg-[#4db6ac] text-white rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-[#3d968d] transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 shadow-xl shadow-teal-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {loading ? 'Processing Analysis...' : 'Execute Agent'}
            </button>
          </div>
        </form>
      </div>

      {/* History Grid */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Industry Mapping Portfolio</h3>
          <span className="text-[10px] font-bold text-gray-300">{history.length} Records</span>
        </div>

        {fetchingHistory ? (
          <div className="flex justify-center py-20">
             <div className="w-8 h-8 border-3 border-teal-50 border-t-teal-400 rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[48px] border border-dashed border-gray-200">
             <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No domain history yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {history.map((item) => (
              <div 
                key={item._id || item.id} 
                onClick={() => navigate(`/discovery/detail/${item._id || item.id}?type=domain`)}
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#4db6ac]/20 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#4db6ac] flex items-center justify-center text-xl font-bold">🌐</div>
                  <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100">
                    {item.totalUseCases || item.use_cases?.length || 0} Opportunities
                  </div>
                </div>
                <h4 className="text-xl font-black text-gray-900 group-hover:text-[#4db6ac] transition-colors truncate">{item.domain || item.company_name}</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 truncate">{item.industry || 'Domain Mapping'}</p>
                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-300 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <div className="text-[#4db6ac] flex items-center gap-1 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Vertical
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainDiscovery;
