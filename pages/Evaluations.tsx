
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Evaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvals = async () => {
      try {
        const res = await apiService.evaluations.list();
        if (res.success) setEvaluations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvals();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) return;
    navigate(`/compare?ids=${selectedIds.join(',')}`);
  };

  const handleExport = async () => {
    if (evaluations.length === 0) {
      alert("No data available to export.");
      return;
    }
    
    setIsExporting(true);
    try {
      const blob = await apiService.evaluations.export();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Avagama_Evaluations_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (err: any) {
      console.error("Export error:", err);
      alert(`Export Error: ${err.message || "The server encountered an error generating your file. Please ensure you have evaluations completed."}`);
    } finally {
      setIsExporting(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-gray-200';
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-orange-400';
    return 'bg-red-500';
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = evaluations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(evaluations.length / rowsPerPage);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <div className="p-8 space-y-8 bg-[#fcfdff] min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-900">My Evaluations</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCompare}
            disabled={selectedIds.length < 2}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm border transition-all ${
              selectedIds.length >= 2 
                ? 'bg-white border-[#9d7bb0] text-[#9d7bb0] hover:bg-purple-50 shadow-sm' 
                : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Compare
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${selectedIds.length >= 2 ? 'bg-[#9d7bb0] text-white' : 'bg-gray-200 text-white'}`}>
              {selectedIds.length}
            </span>
          </button>
          
          <button 
            onClick={handleExport}
            disabled={isExporting || evaluations.length === 0}
            className={`flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-100 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all shadow-sm ${isExporting || evaluations.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
            {isExporting ? 'Exporting...' : 'Export'}
          </button>

          <Link to="/evaluate" className="bg-[#9d7bb0] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#8b6aa1] transition-all shadow-lg shadow-purple-100 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Evaluate a process
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {/* Table Header Styling */}
        <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
          <div className="flex items-center">
             <input type="checkbox" className="w-4 h-4 rounded border-gray-200" disabled />
          </div>
          <div>Process name</div>
          <div>Created on</div>
          <div>Automation score</div>
          <div>Feasibility score</div>
          <div>Fitment type</div>
          <div>LLM type</div>
          <div className="text-right pr-4">Status</div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
             <div className="w-10 h-10 border-4 border-[#9d7bb0]/20 border-t-[#9d7bb0] rounded-full animate-spin"></div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Retrieving Roadmap...</p>
          </div>
        ) : evaluations.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
             <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No evaluations found.</p>
             <Link to="/evaluate" className="text-[#9d7bb0] text-sm font-bold mt-2 inline-block hover:underline">Start your first assessment</Link>
          </div>
        ) : (
          currentItems.map((item) => {
            const isSelected = selectedIds.includes(item._id);
            const automation = item.aiAnalysis?.automationScore;
            const feasibility = item.aiAnalysis?.feasibilityScore;
            const fitment = item.aiAnalysis?.fitmentType;
            const status = item.status || 'Draft';

            return (
              <div 
                key={item._id} 
                className={`grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 px-6 py-5 bg-white rounded-2xl border transition-all items-center hover:shadow-md ${isSelected ? 'border-[#9d7bb0] shadow-sm' : 'border-gray-100 shadow-sm'}`}
              >
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => toggleSelect(item._id)}
                    className="w-4 h-4 rounded border-gray-200 text-[#9d7bb0] focus:ring-[#9d7bb0]" 
                  />
                </div>
                <div>
                  <Link to={`/results/${item._id}`} className="font-bold text-[#9d7bb0] text-sm hover:underline block truncate max-w-[280px]">
                    {item.discovery?.processName || 'Untitled Process'}
                  </Link>
                </div>
                <div className="text-xs font-medium text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}, {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${getScoreColor(automation)}`}></div>
                  <span className="text-sm font-bold text-gray-700">{automation ? `${automation}%` : '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${getScoreColor(feasibility)}`}></div>
                  <span className="text-sm font-bold text-gray-700">{feasibility ? `${feasibility}%` : '-'}</span>
                </div>
                <div>
                  <span className="px-3 py-1 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                    {fitment || '-'}
                  </span>
                </div>
                <div>
                  <span className="px-3 py-1 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                    {item.aiConfig?.baseModel ? (item.aiConfig.baseModel.includes('large') ? 'Large LLM' : 'Small LLM') : '-'}
                  </span>
                </div>
                <div className="text-right pr-4">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${status.toLowerCase() === 'completed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                    {status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center px-4 pt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-4">
           <span>Rows per page</span>
           <div className="relative">
             <select 
               value={rowsPerPage} 
               onChange={handleRowsPerPageChange}
               className="appearance-none bg-white px-3 py-1.5 pr-8 rounded-lg border border-gray-100 text-gray-600 shadow-sm cursor-pointer outline-none focus:border-[#9d7bb0]"
             >
               <option value={10}>10</option>
               <option value={20}>20</option>
               <option value={25}>25</option>
               <option value={30}>30</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </div>
           </div>
           <span className="ml-4">
             {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, evaluations.length)} of {evaluations.length} Results
           </span>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <button 
               onClick={goToFirstPage}
               disabled={currentPage === 1}
               className="p-2 px-4 hover:bg-gray-50 text-gray-400 disabled:opacity-30 border-r border-gray-50"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </button>
             <button 
               onClick={goToPrevPage}
               disabled={currentPage === 1}
               className="p-2 px-4 hover:bg-gray-50 text-gray-400 disabled:opacity-30 border-r border-gray-50"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </button>
             <button 
               onClick={goToNextPage}
               disabled={currentPage === totalPages}
               className="p-2 px-4 hover:bg-gray-50 text-gray-400 disabled:opacity-30 border-r border-gray-50"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </button>
             <button 
               onClick={goToLastPage}
               disabled={currentPage === totalPages}
               className="p-2 px-4 hover:bg-gray-50 text-gray-400 disabled:opacity-30"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 5l7 7-7 7m-8-14l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluations;
