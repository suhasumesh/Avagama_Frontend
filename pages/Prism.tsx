
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
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Pyramid Constants
    const w = 550;
    const h = 450;
    
    // Center the pyramid with more bottom margin for axis
    const g = svg.append("g")
      .attr("transform", `translate(${(width - w) / 2 + 60}, 50)`);

    // Draw background bands (High at top, Low at bottom)
    const bands = [
      { label: "High", color: "#9d7bb0", yStart: 0, yEnd: h * 0.33, desc: "Strategic Priority" },
      { label: "Medium", color: "#7b92af", yStart: h * 0.33, yEnd: h * 0.66, desc: "Operational Fit" },
      { label: "Low", color: "#4db6ac", yStart: h * 0.66, yEnd: h, desc: "Low Impact" }
    ];

    bands.forEach((band, i) => {
      const y1 = band.yStart;
      const y2 = band.yEnd;
      
      const getXLeft = (y: number) => (w / 2) * (1 - y / h);
      const getXRight = (y: number) => (w / 2) * (1 + y / h);

      const x1_l = getXLeft(y1);
      const x1_r = getXRight(y1);
      const x2_l = getXLeft(y2);
      const x2_r = getXRight(y2);

      const bandPath = d3.line()([
        [x1_l, y1],
        [x1_r, y1],
        [x2_r, y2],
        [x2_l, y2]
      ]) + "Z";

      g.append("path")
        .attr("d", bandPath)
        .attr("fill", band.color)
        .attr("fill-opacity", 0.06 + (i * 0.03))
        .attr("stroke", "rgba(15, 23, 42, 0.05)")
        .attr("stroke-width", 1);

      // Value Labels on the left
      g.append("text")
        .attr("x", -15)
        .attr("y", (y1 + y2) / 2)
        .attr("fill", "#64748b")
        .attr("font-size", "10px")
        .attr("font-weight", "900")
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("text-transform", "uppercase")
        .text(band.label);
    });

    // Outer Triangle Border
    g.append("path")
      .attr("d", d3.line()([[w/2, 0], [w, h], [0, h]]) + "Z")
      .attr("fill", "none")
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 2);

    // Axis Titles
    // Value Axis (Vertical)
    const valueAxisG = g.append("g").attr("transform", `translate(-65, ${h/2}) rotate(-90)`);
    valueAxisG.append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#0f172a")
      .attr("font-size", "12px")
      .attr("font-weight", "900")
      .attr("text-transform", "uppercase")
      .attr("letter-spacing", "0.15em")
      .text("Business Value");
    
    // Feasibility Axis (Horizontal)
    const feasibilityAxisG = g.append("g").attr("transform", `translate(${w/2}, ${h + 70})`);
    feasibilityAxisG.append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#0f172a")
      .attr("font-size", "12px")
      .attr("font-weight", "900")
      .attr("text-transform", "uppercase")
      .attr("letter-spacing", "0.15em")
      .text("Implementation Feasibility");

    // Feasibility Sub-labels (High, Medium, Low)
    const fLabels = [
      { label: "High", x: w * 0.25 },
      { label: "Medium", x: w * 0.5 },
      { label: "Low", x: w * 0.75 }
    ];
    fLabels.forEach(f => {
      g.append("text")
        .attr("x", f.x)
        .attr("y", h + 30)
        .attr("fill", "#94a3b8")
        .attr("font-size", "10px")
        .attr("font-weight", "900")
        .attr("text-anchor", "middle")
        .attr("text-transform", "uppercase")
        .text(f.label);
    });

    // Plot Items with smarter separation and boundary enforcement
    const plottedPoints: {x: number, y: number}[] = [];
    const padding = 20; // Keep points away from edges
    
    items.forEach((item, idx) => {
      const bv = (item.aiAnalysis?.businessBenefitScore || 0) / 100;
      
      // Fix: Fallback feasibility calculation
      let feasibilityScore = item.aiAnalysis?.feasibilityScore;
      if (!feasibilityScore && item.aiAnalysis?.automationScore && item.aiAnalysis?.businessBenefitScore) {
        feasibilityScore = Math.round((item.aiAnalysis.automationScore + item.aiAnalysis.businessBenefitScore) / 2);
      }
      const f = (feasibilityScore || 0) / 100;

      // Y position based on Value (Higher score = smaller Y)
      // Constrain Y to be within [padding, h - padding]
      let y = padding + (h - 2 * padding) * (1 - bv);
      
      // X position based on Feasibility
      // The triangle width at height y is: currentWidth = (y * w) / h
      const currentWidth = (y * w) / h;
      const leftBound = (w - currentWidth) / 2;
      
      // Map Feasibility (0-1) to the available width at this height, with padding
      const availableWidth = currentWidth - 2 * padding;
      let x = leftBound + padding + (availableWidth * (1 - f));

      // Collision detection for points
      let attempts = 0;
      while (attempts < 30) {
        let collision = false;
        for (const p of plottedPoints) {
          const dist = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
          if (dist < 35) {
            collision = true;
            break;
          }
        }
        if (!collision) break;
        
        // Jitter within boundaries
        const jitterX = (Math.random() - 0.5) * 40;
        const jitterY = (Math.random() - 0.5) * 40;
        
        const newY = Math.max(padding, Math.min(h - padding, y + jitterY));
        const newCW = (newY * w) / h;
        const newLB = (w - newCW) / 2;
        const newAW = newCW - 2 * padding;
        const newX = Math.max(newLB + padding, Math.min(newLB + newCW - padding, x + jitterX));
        
        x = newX;
        y = newY;
        attempts++;
      }
      plottedPoints.push({x, y});

      const color = idx % 2 === 0 ? "#9d7bb0" : "#4db6ac";

      const dot = g.append("g")
        .attr("transform", `translate(${x}, ${y})`)
        .style("cursor", "pointer");

      dot.append("circle")
        .attr("r", 14)
        .attr("fill", color)
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      dot.append("text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "11px")
        .attr("font-weight", "900")
        .style("pointer-events", "none")
        .text(idx + 1);

      // Label with better positioning
      const isLeft = x < w / 2;
      const labelX = isLeft ? x - 110 : x + 110;
      const labelY = y - (idx * 15 % 45); 

      g.append("path")
        .attr("d", d3.line()([[x, y], [labelX, labelY]]))
        .attr("stroke", "rgba(15, 23, 42, 0.08)")
        .attr("stroke-width", 1)
        .attr("fill", "none");

      g.append("text")
        .attr("x", labelX)
        .attr("y", labelY - 5)
        .attr("text-anchor", isLeft ? "end" : "start")
        .attr("fill", "#475569")
        .attr("font-size", "9px")
        .attr("font-weight", "900")
        .attr("text-transform", "uppercase")
        .text(`${idx + 1}. ${item.discovery?.processName?.substring(0, 20)}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfdff] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-8 border-[#9d7bb0]/20 border-t-[#9d7bb0] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Generating Strategic Prism...</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10 bg-[#fcfdff] min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/evaluations')} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-600 shadow-sm transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Strategic Prism</h1>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Multi-Process Fitment Visualization</p>
          </div>
        </div>
        
        <div className="flex gap-4">
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
        <div className="bg-white rounded-[56px] border border-gray-100 shadow-xl p-12 flex flex-col items-center justify-center overflow-hidden">
          <svg ref={svgRef} width="800" height="600" viewBox="0 0 800 600" className="max-w-full h-auto"></svg>
          
          {/* How to Read Guide */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl border-t border-gray-50 pt-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#9d7bb0]"></div>
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Top Left: Quick Wins</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">High Value + High Feasibility. These are your immediate priorities for implementation.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#7b92af]"></div>
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Top Right: Strategic Bets</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">High Value but Lower Feasibility. Requires significant investment or tech maturity.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4db6ac]"></div>
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Bottom: Low Priority</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Lower Business Value. These processes should be deprioritized in the current roadmap.</p>
            </div>
          </div>
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
