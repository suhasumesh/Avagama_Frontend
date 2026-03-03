
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import * as d3 from 'd3';
import { motion } from 'motion/react';

const StrategicPrism: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ids = params.get('ids')?.split(',') || [];
    
    if (ids.length === 0) {
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

  useEffect(() => {
    if (loading || items.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 650;
    const margin = { top: 60, right: 80, bottom: 80, left: 80 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Draw Quadrant Backgrounds
    const quadrants = [
      { name: "Quick Wins", x: 0, y: 0, color: "#9d7bb0", opacity: 0.05, label: "High Value + High Feasibility" },
      { name: "Strategic Bets", x: innerWidth / 2, y: 0, color: "#7b92af", opacity: 0.05, label: "High Value + Low Feasibility" },
      { name: "Tactical Gains", x: 0, y: innerHeight / 2, color: "#4db6ac", opacity: 0.05, label: "Low Value + High Feasibility" },
      { name: "Low Priority", x: innerWidth / 2, y: innerHeight / 2, color: "#94a3b8", opacity: 0.05, label: "Low Value + Low Feasibility" }
    ];

    quadrants.forEach(q => {
      g.append("rect")
        .attr("x", q.x)
        .attr("y", q.y)
        .attr("width", innerWidth / 2)
        .attr("height", innerHeight / 2)
        .attr("fill", q.color)
        .attr("fill-opacity", q.opacity)
        .attr("stroke", "rgba(15, 23, 42, 0.05)")
        .attr("stroke-width", 1);

      g.append("text")
        .attr("x", q.x + innerWidth / 4)
        .attr("y", q.y + 25)
        .attr("text-anchor", "middle")
        .attr("fill", q.color)
        .attr("font-size", "10px")
        .attr("font-weight", "900")
        .attr("text-transform", "uppercase")
        .attr("letter-spacing", "0.1em")
        .attr("opacity", 0.4)
        .text(q.name);
    });

    // Draw Main Axes
    g.append("line")
      .attr("x1", 0)
      .attr("y1", innerHeight / 2)
      .attr("x2", innerWidth)
      .attr("y2", innerHeight / 2)
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4 4")
      .attr("opacity", 0.2);

    g.append("line")
      .attr("x1", innerWidth / 2)
      .attr("y1", 0)
      .attr("x2", innerWidth / 2)
      .attr("y2", innerHeight)
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4 4")
      .attr("opacity", 0.2);

    // Outer Border
    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "none")
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 2);

    // Axis Titles
    // Value Axis (Vertical)
    const valueAxisG = g.append("g").attr("transform", `translate(-75, ${innerHeight / 2}) rotate(-90)`);
    valueAxisG.append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#0f172a")
      .attr("font-size", "12px")
      .attr("font-weight", "900")
      .attr("text-transform", "uppercase")
      .attr("letter-spacing", "0.15em")
      .text("Business Value");
    
    // Feasibility Axis (Horizontal)
    const feasibilityAxisG = g.append("g").attr("transform", `translate(${innerWidth / 2}, ${innerHeight + 55})`);
    feasibilityAxisG.append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#0f172a")
      .attr("font-size", "12px")
      .attr("font-weight", "900")
      .attr("text-transform", "uppercase")
      .attr("letter-spacing", "0.15em")
      .text("Implementation Feasibility");

    // Axis Labels
    const yLabels = [
      { label: "High", y: 0 },
      { label: "Medium", y: innerHeight / 2 },
      { label: "Low", y: innerHeight }
    ];
    yLabels.forEach(l => {
      g.append("text")
        .attr("x", -15)
        .attr("y", l.y)
        .attr("fill", "#64748b")
        .attr("font-size", "10px")
        .attr("font-weight", "900")
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .text(l.label);
    });

    const xLabels = [
      { label: "High", x: 0 },
      { label: "Medium", x: innerWidth / 2 },
      { label: "Low", x: innerWidth }
    ];
    xLabels.forEach(l => {
      g.append("text")
        .attr("x", l.x)
        .attr("y", innerHeight + 25)
        .attr("fill", "#64748b")
        .attr("font-size", "10px")
        .attr("font-weight", "900")
        .attr("text-anchor", "middle")
        .text(l.label);
    });

    // Plot Items
    const plottedPoints: {x: number, y: number}[] = [];
    const padding = 40;
    
    items.forEach((item, idx) => {
      const bv = (item.aiAnalysis?.businessBenefitScore || 0) / 100;
      let feasibilityScore = item.aiAnalysis?.feasibilityScore;
      if (!feasibilityScore && item.aiAnalysis?.automationScore && item.aiAnalysis?.businessBenefitScore) {
        feasibilityScore = Math.round((item.aiAnalysis.automationScore + item.aiAnalysis.businessBenefitScore) / 2);
      }
      const f = (feasibilityScore || 0) / 100;

      // Map scores to coordinates
      // Y: High Value (1) -> y=0, Low Value (0) -> y=innerHeight
      let y = padding + (innerHeight - 2 * padding) * (1 - bv);
      // X: High Feasibility (1) -> x=0, Low Feasibility (0) -> x=innerWidth (Reversed as requested)
      let x = padding + (innerWidth - 2 * padding) * (1 - f);

      // Collision detection
      let attempts = 0;
      while (attempts < 50) {
        let collision = false;
        for (const p of plottedPoints) {
          const dist = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
          if (dist < 40) {
            collision = true;
            break;
          }
        }
        if (!collision) break;
        x += (Math.random() - 0.5) * 60;
        y += (Math.random() - 0.5) * 60;
        x = Math.max(padding, Math.min(innerWidth - padding, x));
        y = Math.max(padding, Math.min(innerHeight - padding, y));
        attempts++;
      }
      plottedPoints.push({x, y});

      const color = idx % 2 === 0 ? "#9d7bb0" : "#4db6ac";

      const dot = g.append("g")
        .attr("transform", `translate(${x}, ${y})`)
        .style("cursor", "pointer")
        .on("mouseover", function() {
          d3.select(this).select("circle").transition().duration(200).attr("r", 20).attr("stroke-width", 5);
          d3.select(this).select(".label-bg").transition().duration(200).attr("opacity", 1);
          d3.select(this).select(".label-text-hover").transition().duration(200).attr("opacity", 1);
        })
        .on("mouseout", function() {
          d3.select(this).select("circle").transition().duration(200).attr("r", 14).attr("stroke-width", 2);
          d3.select(this).select(".label-bg").transition().duration(200).attr("opacity", 0);
          d3.select(this).select(".label-text-hover").transition().duration(200).attr("opacity", 0);
        })
        .on("click", () => setSelectedItem(item));

      dot.append("circle")
        .attr("r", 14)
        .attr("fill", color)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("filter", "drop-shadow(0 4px 6px rgba(0,0,0,0.1))");

      dot.append("text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "11px")
        .attr("font-weight", "900")
        .style("pointer-events", "none")
        .text(idx + 1);

      // Static Label (Process Name)
      const isRight = x > innerWidth / 2;
      const isBottom = y > innerHeight / 2;
      const labelX = isRight ? 22 : -22;
      const labelY = isBottom ? -18 : 22;
      
      const labelText = item.discovery?.processName?.substring(0, 18) + (item.discovery?.processName?.length > 18 ? "..." : "");

      // Halo for readability
      dot.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", isRight ? "start" : "end")
        .attr("fill", "white")
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr("font-size", "9px")
        .attr("font-weight", "800")
        .attr("text-transform", "uppercase")
        .attr("opacity", 0.8)
        .text(labelText);

      dot.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", isRight ? "start" : "end")
        .attr("fill", "#1e293b")
        .attr("font-size", "9px")
        .attr("font-weight", "800")
        .attr("text-transform", "uppercase")
        .text(labelText);

      // Hover Label (Detailed)
      const labelGroup = dot.append("g")
        .attr("class", "hover-label")
        .attr("transform", "translate(0, -35)");

      const fullLabelText = item.discovery?.processName || "Process";
      const textWidth = fullLabelText.length * 7;

      labelGroup.append("rect")
        .attr("class", "label-bg")
        .attr("x", -textWidth / 2 - 10)
        .attr("y", -12)
        .attr("width", textWidth + 20)
        .attr("height", 24)
        .attr("rx", 12)
        .attr("fill", "#1e293b")
        .attr("opacity", 0);

      labelGroup.append("text")
        .attr("class", "label-text-hover")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "10px")
        .attr("font-weight", "800")
        .attr("opacity", 0)
        .text(fullLabelText);
    });

  }, [loading, items]);

  const dimensionMap: Record<string, string> = {
    costOptimization: 'processVolume',
    operationsImprovement: 'orchestrationComplexity',
    riskTolerance: 'riskTolerance'
  };

  const normalize = (val?: string) => {
    if (val === 'high') return 5;
    if (val === 'medium') return 3;
    if (val === 'low') return 1;
    return 1;
  };

  const getGranularScore = (item: any, dim: string) => {
    const mappedDim = dimensionMap[dim] || dim;
    const val = item.aiAnalysis?.dimensions?.[mappedDim];
    return normalize(val);
  };

  const getFeasibilityParams = (item: any) => {
    const dims = item.aiAnalysis?.dimensions || {};
    return [
      { label: 'Technical Feasibility', score: normalize(dims.dataStructure) },
      { label: 'Process Simplicity', score: 6 - normalize(dims.orchestrationComplexity) },
      { label: 'Exception Stability', score: 6 - normalize(dims.exceptionHandling) },
      { label: 'Governance Risk', score: 6 - normalize(dims.complianceSensitivity) },
      { label: 'Operational Risk', score: 6 - normalize(dims.businessCriticality) }
    ];
  };

  const getROIPotential = (item: any) => {
    const bv = item.aiAnalysis?.businessBenefitScore || 0;
    const as = item.aiAnalysis?.automationScore || 0;
    const score = (bv * as) / 10000;
    if (score > 0.5) return { label: 'High', color: 'text-emerald-500' };
    if (score > 0.25) return { label: 'Medium', color: 'text-amber-500' };
    return { label: 'Low', color: 'text-rose-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfdff] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-8 border-[#9d7bb0]/20 border-t-[#9d7bb0] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Generating Strategic Quadrant...</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10 bg-[#fcfdff] min-h-screen print:p-0 print:bg-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          nav, footer, .print\\:hidden { display: none !important; }
          .bg-white { background-color: white !important; }
          .shadow-xl, .shadow-sm { shadow: none !important; }
          body { padding: 0 !important; margin: 0 !important; }
          .rounded-[56px] { border-radius: 0 !important; border: none !important; }
        }
      `}} />
      <div className="flex items-center justify-between print:mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/evaluations')} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-600 shadow-sm transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Strategic Quadrant</h1>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Multi-Process Fitment Visualization</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-black transition-all shadow-xl shadow-gray-100 print:hidden"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print PDF
          </button>
          {items.map((item, idx) => (
            <div key={item._id} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
              <span className="w-3 h-3 rounded-full" style={{backgroundColor: d3.schemeCategory10[idx % 10]}}></span>
              <span className="text-[10px] font-black text-gray-600 uppercase truncate max-w-[120px]">{item.discovery?.processName}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {/* Main Prism Visualization - Full Width */}
        <div className="bg-white rounded-[56px] border border-gray-100 shadow-xl p-12 flex flex-col items-center justify-center overflow-hidden relative">
          <svg ref={svgRef} width="800" height="650" viewBox="0 0 800 650" className="max-w-full h-auto"></svg>
          
          {/* How to Read Guide */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl border-t border-gray-50 pt-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#9d7bb0]"></div>
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Quick Wins</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">High Value + High Feasibility. Immediate priorities for implementation.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#7b92af]"></div>
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Strategic Bets</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">High Value + Low Feasibility. Significant investment or tech maturity required.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4db6ac]"></div>
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Tactical Gains</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Lower Value + High Feasibility. Good for building momentum and operational efficiency.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]"></div>
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Low Priority</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Lower Business Value + Low Feasibility. Should be deprioritized in the current roadmap.</p>
            </div>
          </div>

          {/* Interactive Detail Modal (Overlay) */}
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm p-12 flex flex-col items-center justify-center text-center"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              <div className="max-w-2xl space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-[#9d7bb0] uppercase tracking-[0.3em]">Process Insight</span>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{selectedItem.discovery?.processName}</h2>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Business Value</p>
                    <p className="text-2xl font-black text-[#9d7bb0]">{selectedItem.aiAnalysis?.businessBenefitScore}%</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Automation Score</p>
                    <p className="text-2xl font-black text-[#4db6ac]">{selectedItem.aiAnalysis?.automationScore}%</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">ROI Potential</p>
                    <p className={`text-2xl font-black ${getROIPotential(selectedItem).color}`}>
                      {getROIPotential(selectedItem).label}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 font-medium leading-relaxed">
                  {selectedItem.discovery?.description || "This process shows significant potential for AI-driven transformation with clear operational benefits and strategic alignment."}
                </p>

                <div className="flex gap-4 justify-center pt-4">
                  <button 
                    onClick={() => navigate(`/results/${selectedItem._id}`)}
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-black transition-all shadow-xl shadow-gray-100"
                  >
                    View Full Analysis
                  </button>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-gray-50 transition-all"
                  >
                    Back to Prism
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Granular Parameters - Comparison Grid Below */}
        <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm space-y-12">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Fitment Insights Comparison</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detailed parameter cross-reference across selected processes</p>
          </div>
          
          <div className="overflow-x-auto pb-6 custom-scrollbar">
            <div className="flex gap-8 min-w-max">
              {items.map((item, idx) => (
                <div key={item._id} className="w-[350px] space-y-8 bg-gray-50/50 p-8 rounded-[40px] border border-gray-100">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm" style={{backgroundColor: d3.schemeCategory10[idx % 10]}}>
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-gray-900 uppercase block truncate max-w-[200px]">{item.discovery?.processName}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Process Profile</span>
                    </div>
                  </div>

                  {/* Summary Scores */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Value Score</p>
                      <p className="text-lg font-black text-[#9d7bb0]">{item.aiAnalysis?.businessBenefitScore}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Feasibility</p>
                      <p className="text-lg font-black text-[#4db6ac]">
                        {(() => {
                          let f = item.aiAnalysis?.feasibilityScore;
                          if (!f && item.aiAnalysis?.automationScore && item.aiAnalysis?.businessBenefitScore) {
                            f = Math.round((item.aiAnalysis.automationScore + item.aiAnalysis.businessBenefitScore) / 2);
                          }
                          return f ? `${f}%` : '-';
                        })()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-10">
                    {/* Business Value Section */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xs shadow-sm">💎</div>
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Value Metrics</h4>
                      </div>
                      
                      <div className="space-y-5">
                        {[
                          { label: 'Cost Optimization', score: getGranularScore(item, 'costOptimization') },
                          { label: 'Ops Improvement', score: getGranularScore(item, 'operationsImprovement') },
                          { label: 'Risk Improvement', score: getGranularScore(item, 'riskTolerance') }
                        ].map((param, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{param.label}</span>
                            <div className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map(val => (
                                <div 
                                  key={val} 
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                                    val <= param.score ? 'bg-[#002147] text-white shadow-sm' : 'bg-white text-gray-200 border border-gray-100'
                                  }`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feasibility Section */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xl bg-teal-50 flex items-center justify-center text-[#4db6ac] text-xs shadow-sm">🛠️</div>
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Feasibility</h4>
                      </div>
                      
                      <div className="space-y-5">
                        {getFeasibilityParams(item).map((param, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{param.label}</span>
                            <div className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map(val => (
                                <div 
                                  key={val} 
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                                    val <= param.score ? 'bg-[#002147] text-white shadow-sm' : 'bg-white text-gray-200 border border-gray-100'
                                  }`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicPrism;
