
import React, { useEffect, useState, useRef } from 'react';

 

import { useLocation, useNavigate } from 'react-router-dom';

 

import { apiService } from '../services/api';

 

import * as d3 from 'd3';

 

import { motion } from 'motion/react';

 

// ─────────────────────────────────────────────────────────────────────────────

 

//  VALIDATED THRESHOLDS

//  Quick Wins    : BV >= 85%  AND  F >= 75%

//  Tactical Gains: 50% <= BV < 85%  AND  F >= 75%

//  Strategic Bets: BV >= 75%  AND  50% <= F < 75%

//  Low Priority  : everything else (primarily <= 75% BV AND <= 50% F)

// ─────────────────────────────────────────────────────────────────────────────

 

const THRESHOLDS = {

  QW_BV:     0.85,

  QW_F:      0.75,

  TG_BV_MIN: 0.50,

  TG_BV_MAX: 0.85,

  TG_F:      0.75,

  SB_BV:     0.75,

  SB_F_MIN:  0.50,

  SB_F_MAX:  0.75,

};

 

type Quadrant = 'qw' | 'sb' | 'tg' | 'lp';

 

const getQuadrant = (bv: number, f: number): Quadrant => {

  if (bv >= THRESHOLDS.QW_BV && f >= THRESHOLDS.QW_F) return 'qw';

  if (bv >= THRESHOLDS.TG_BV_MIN && bv < THRESHOLDS.TG_BV_MAX && f >= THRESHOLDS.TG_F) return 'tg';

  if (bv >= THRESHOLDS.SB_BV && f >= THRESHOLDS.SB_F_MIN && f < THRESHOLDS.SB_F_MAX) return 'sb';

  return 'lp';

};

 

const QUADRANT_COLORS: Record<Quadrant, string> = {

 

  qw: '#8b5cf6',

 

  sb: '#f43f5e',

 

  tg: '#10b981',

 

  lp: '#64748b',

 

};

 

const QUADRANT_META: Record<Quadrant, { name: string; description: string }> = {

  qw: { name: 'Quick Wins',     description: 'Business Value ≥ 85% + Feasibility ≥ 75%. Immediate priorities. Ship now.' },

  sb: { name: 'Strategic Bets', description: 'Business Value ≥ 75% + Feasibility 50–74%. Requires strategic investment plan.' },

  tg: { name: 'Tactical Gains', description: 'Business Value 50–84% + Feasibility ≥ 75%. Good for operational efficiency.' },

  lp: { name: 'Low Priority',   description: 'Business Value ≤ 75% + Feasibility ≤ 50%. Deprioritize and revisit later.' },

};

 

const StrategicQuadrant: React.FC = () => {

 

  const [items, setItems] = useState<any[]>([]);

 

  const [loading, setLoading] = useState(true);

 

  const location = useLocation();

 

  const navigate = useNavigate();

 

  const svgRef = useRef<SVGSVGElement>(null);

 

  const [selectedItem, setSelectedItem] = useState<any>(null);

 

  const handlePrint = () => window.print();

 

  useEffect(() => {

 

    const params = new URLSearchParams(location.search);

 

    const ids = params.get('ids')?.split(',') || [];

 

    if (ids.length === 0) { navigate('/evaluations'); return; }

 

    const fetchItems = async () => {

 

      try {

 

        const results = await Promise.all(ids.map((id) => apiService.evaluations.get(id)));

 

        setItems(results.filter((r) => r.success).map((r) => r.data));

 

      } catch (err) { console.error(err); }

 

      finally { setLoading(false); }

 

    };

 

    fetchItems();

 

  }, [location, navigate]);

 

  useEffect(() => {

 

    if (loading || items.length === 0 || !svgRef.current) return;

 

    const svg = d3.select(svgRef.current);

 

    svg.selectAll('*').remove();

 

    const width = 1200;

 

    const height = 650;

 

    const margin = { top: 60, right: 220, bottom: 80, left: 280 };

 

    const W = width  - margin.left - margin.right;

 

    const H = height - margin.top  - margin.bottom;

 

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

 

    // ── Equal visual split ─────────────────────────────────────────────

 

    const xMid = W / 2;

 

    const yMid = H / 2;

 

    const PAD  = 24;

 

    // ── Per-quadrant scales ────────────────────────────────────────────

 

    // Each quadrant maps its own score range to its own pixel zone.

 

    // This is the ONLY correct way to ensure dots always appear in the

 

    // right visual box while keeping equal-sized quadrant backgrounds.

 

    //  Quick Wins    BV[0.85–1.0] × F[0.75–1.0]  → top-right

    //  Tactical Gains BV[0.50–0.85]× F[0.75–1.0]  → bot-right

    //  Strategic Bets BV[0.75–1.0] × F[0.50–0.75] → top-left

    //  Low Priority   BV[0.0–0.75] × F[0.0–0.50]  → bot-left

    //

    type QScale = { x: d3.ScaleLinear<number,number>; y: d3.ScaleLinear<number,number> };

    const qScales: Record<Quadrant, QScale> = {

      qw: {

        x: d3.scaleLinear().domain([0.75, 1.0]).range([xMid+PAD, W-PAD]),

        y: d3.scaleLinear().domain([1.0, 0.85]).range([PAD, yMid-PAD]),

      },

      sb: {

        x: d3.scaleLinear().domain([0.50, 0.75]).range([PAD, xMid-PAD]),

        y: d3.scaleLinear().domain([1.0, 0.75]).range([PAD, yMid-PAD]),

      },

      tg: {

        x: d3.scaleLinear().domain([0.75, 1.0]).range([xMid+PAD, W-PAD]),

        y: d3.scaleLinear().domain([0.85, 0.50]).range([yMid+PAD, H-PAD]),

      },

      lp: {

        x: d3.scaleLinear().domain([0.0, 0.50]).range([PAD, xMid-PAD]),

        y: d3.scaleLinear().domain([0.50, 0.0]).range([yMid+PAD, H-PAD]),

      },

    };

 

    const applyScale = (sc: d3.ScaleLinear<number,number>, v: number) => {

 

      const [a, b] = sc.domain();

 

      return sc(Math.max(Math.min(a,b), Math.min(Math.max(a,b), v)));

 

    };

 

    // ── Quadrant backgrounds ───────────────────────────────────────────

 

    const qdefs = [

 

      { q: 'sb' as Quadrant, x: 0,    y: 0,    lx: xMid/2,       ly: 25,       label: 'Strategic Bets' },

 

      { q: 'qw' as Quadrant, x: xMid, y: 0,    lx: xMid+xMid/2,  ly: 25,       label: 'Quick Wins'     },

 

      { q: 'lp' as Quadrant, x: 0,    y: yMid, lx: xMid/2,       ly: yMid+25,  label: 'Low Priority'   },

 

      { q: 'tg' as Quadrant, x: xMid, y: yMid, lx: xMid+xMid/2,  ly: yMid+25,  label: 'Tactical Gains' },

 

    ];

 

    qdefs.forEach(({ q, x, y, lx, ly, label }) => {

 

      g.append('rect').attr('x',x).attr('y',y).attr('width',xMid).attr('height',yMid)

 

        .attr('fill', QUADRANT_COLORS[q]).attr('fill-opacity', 0.08)

 

        .attr('stroke','rgba(15,23,42,0.05)').attr('stroke-width',1);

 

      g.append('text').attr('x',lx).attr('y',ly).attr('text-anchor','middle')

 

        .attr('fill', QUADRANT_COLORS[q]).attr('font-size','10px').attr('font-weight','900')

 

        .attr('letter-spacing','0.1em').attr('opacity',0.45).text(label);

 

    });

 

    // ── Divider lines ──────────────────────────────────────────────────

 

    g.append('line').attr('x1',0).attr('y1',yMid).attr('x2',W).attr('y2',yMid)

 

      .attr('stroke','#0f172a').attr('stroke-width',1.5).attr('stroke-dasharray','4 4').attr('opacity',0.2);

 

    g.append('line').attr('x1',xMid).attr('y1',0).attr('x2',xMid).attr('y2',H)

 

      .attr('stroke','#0f172a').attr('stroke-width',1.5).attr('stroke-dasharray','4 4').attr('opacity',0.2);

 

    // ── Outer border ───────────────────────────────────────────────────

 

    g.append('rect').attr('x',0).attr('y',0).attr('width',W).attr('height',H)

 

      .attr('fill','none').attr('stroke','#0f172a').attr('stroke-width',2);

 

    // ── Axis titles ────────────────────────────────────────────────────

 

    g.append('g').attr('transform',`translate(-95,${H/2}) rotate(-90)`)

 

      .append('text').attr('text-anchor','middle').attr('fill','#0f172a')

 

      .attr('font-size','12px').attr('font-weight','900').attr('letter-spacing','0.15em')

 

      .text('Business Value');

 

    g.append('g').attr('transform',`translate(${W/2},${H+55})`)

 

      .append('text').attr('text-anchor','middle').attr('fill','#0f172a')

 

      .attr('font-size','12px').attr('font-weight','900').attr('letter-spacing','0.15em')

 

      .text('Implementation Feasibility');

 

    // ── Axis labels ────────────────────────────────────────────────────

 

    [{ t:'High',y:0 },{ t:'Medium',y:yMid },{ t:'Low',y:H }].forEach(l => {

 

      g.append('text').attr('x',-15).attr('y',l.y).attr('fill','#64748b')

 

        .attr('font-size','9px').attr('font-weight','700').attr('text-anchor','end')

 

        .attr('dominant-baseline','middle').text(l.t);

 

    });

 

    [{ t:'Low',x:0 },{ t:'Medium',x:xMid },{ t:'High',x:W }].forEach(l => {

 

      g.append('text').attr('x',l.x).attr('y',H+25).attr('fill','#64748b')

 

        .attr('font-size','9px').attr('font-weight','700').attr('text-anchor','middle').text(l.t);

 

    });

 

    // ── Plot items ─────────────────────────────────────────────────────

 

    type PP = { x:number; y:number; item:any; idx:number; color:string; quadrant:Quadrant };

 

    const pts: PP[] = [];

 

    const counts: Record<Quadrant,number> = { qw:0, sb:0, tg:0, lp:0 };

 

    items.forEach((item, idx) => {

 

      const bv = (item.aiAnalysis?.businessBenefitScore || 0) / 100;

 

      let fs = item.aiAnalysis?.feasibilityScore;

 

      if (!fs) fs = item.aiAnalysis?.automationScore || 0;

 

      const f = fs / 100;

 

      const quadrant = getQuadrant(bv, f);

 

      counts[quadrant]++;

 

      // Use per-quadrant scale — dot is always in the correct visual box

 

      const qs = qScales[quadrant];

 

      const ox = applyScale(qs.x, f);

 

      const oy = applyScale(qs.y, bv);

 

      // Hard pixel boundary for this quadrant box

 

      const qd = qdefs.find(d => d.q === quadrant)!;

 

      const minX = qd.x + PAD, maxX = qd.x + xMid - PAD;

 

      const minY = qd.y + PAD, maxY = qd.y + yMid - PAD;

 

      let x = Math.max(minX, Math.min(maxX, ox));

 

      let y = Math.max(minY, Math.min(maxY, oy));

 

      // Collision avoidance spiral

 

      for (let a = 0; a < 150; a++) {

 

        const hit = pts.some(p => Math.hypot(p.x-x, p.y-y) < 38);

 

        if (!hit) break;

 

        const angle = a * 0.4 + idx * 0.1;

 

        x = Math.max(minX, Math.min(maxX, ox + Math.cos(angle) * a * 1.5));

 

        y = Math.max(minY, Math.min(maxY, oy + Math.sin(angle) * a * 1.5));

 

      }

 

      pts.push({ x, y, item, idx, color: QUADRANT_COLORS[quadrant], quadrant });

 

    });

 

    const isMany = Object.values(counts).some(c => c > 7);

 

    pts.forEach((p) => {

 

      const dot = g.append('g').attr('transform',`translate(${p.x},${p.y})`)

 

        .style('cursor','pointer').on('click', () => setSelectedItem(p.item));

 

      dot.append('circle').attr('r',14).attr('fill',p.color)

 

        .attr('stroke','white').attr('stroke-width',2)

 

        .attr('filter','drop-shadow(0 4px 6px rgba(0,0,0,0.1))');

 

      dot.append('text').attr('dy','0.35em').attr('text-anchor','middle')

 

        .attr('fill','white').attr('font-size','11px').attr('font-weight','900')

 

        .style('pointer-events','none').text(p.idx + 1);

 

      if (!isMany) {

 

        const right = p.x < 100 ? true : p.x > W-100 ? false : p.x > W/2;

 

        const lx = right ? 18 : -18;

 

        const ly = p.y > H/2 ? -16 : 20;

 

        const txt = p.item.discovery?.processName || 'Process';

 

        ['white','#1e293b'].forEach((fill, i) => {

 

          dot.append('text').attr('x',lx).attr('y',ly)

 

            .attr('text-anchor', right ? 'start' : 'end')

 

            .attr('fill',fill).attr('stroke', i===0 ? 'white' : undefined)

 

            .attr('stroke-width', i===0 ? 3 : undefined)

 

            .attr('font-size','9px').attr('font-weight','800')

 

            .attr('opacity', i===0 ? 0.8 : 1).text(txt);

 

        });

 

      }

 

    });

 

    // ── Callout leader lines ───────────────────────────────────────────

 

    if (isMany) {

 

      const draw = (group: PP[], side: 'left'|'right') => {

 

        if (!group.length) return;

 

        const step = (H - 60) / Math.max(group.length - 1, 1);

 

        group.sort((a,b) => a.y-b.y).forEach((p, i) => {

 

          const ty = 30 + i * step;

 

          const tx = side === 'left' ? -270 : W + 10;

 

          const path = d3.path();

 

          path.moveTo(p.x, p.y);

 

          path.lineTo(side==='left' ? p.x-20 : p.x+20, p.y);

 

          path.lineTo(side==='left' ? tx+260 : tx-10, ty);

 

          path.lineTo(tx, ty);

 

          g.append('path').attr('d',path.toString()).attr('fill','none')

 

            .attr('stroke','#94a3b8').attr('stroke-width',1)

 

            .attr('stroke-dasharray','2,2').attr('opacity',0.5);

 

          const lbl = g.append('text').attr('x',tx).attr('y',ty).attr('dy','0.35em')

 

            .attr('text-anchor','start').attr('fill','#1e293b')

 

            .attr('font-size','8px').attr('font-weight','800');

 

          lbl.append('tspan').attr('fill',p.color).text(`${p.idx+1}. `);

 

          const name = p.item.discovery?.processName || 'Process';

 

          lbl.append('tspan').text(name.length > 55 ? name.slice(0,52)+'...' : name);

 

        });

 

      };

 

      draw(pts.filter(p => p.x < xMid), 'left');

 

      draw(pts.filter(p => p.x >= xMid), 'right');

 

    }

 

  }, [loading, items]);

 

  // ── Helpers ────────────────────────────────────────────────────────────

 

  const normalize = (v?: string) => v==='high' ? 5 : v==='medium' ? 3 : 1;

 

  const dimMap: Record<string,string> = {

 

    costOptimization:'processVolume', operationsImprovement:'orchestrationComplexity', riskTolerance:'riskTolerance',

 

  };

 

  const getGScore = (item:any, dim:string) => normalize(item.aiAnalysis?.dimensions?.[dimMap[dim]||dim]);

 

  const getFParams = (item:any) => {

 

    const d = item.aiAnalysis?.dimensions || {};

 

    return [

 

      { label:'Technical Feasibility', score: normalize(d.dataStructure)             },

 

      { label:'Process Simplicity',    score: 6-normalize(d.orchestrationComplexity) },

 

      { label:'Exception Stability',   score: 6-normalize(d.exceptionHandling)       },

 

      { label:'Governance Risk',       score: 6-normalize(d.complianceSensitivity)   },

 

      { label:'Operational Risk',      score: 6-normalize(d.businessCriticality)     },

 

    ];

 

  };

 

  const getROI = (item:any) => {

 

    const s = ((item.aiAnalysis?.businessBenefitScore||0)*(item.aiAnalysis?.automationScore||0))/10000;

 

    return s>=0.45 ? {label:'High',color:'text-emerald-500'} : s>=0.20 ? {label:'Medium',color:'text-amber-500'} : {label:'Low',color:'text-rose-500'};

 

  };

 

  const getItemQ = (item:any): Quadrant => {

 

    const bv = (item.aiAnalysis?.businessBenefitScore||0)/100;

 

    const f  = (item.aiAnalysis?.feasibilityScore || item.aiAnalysis?.automationScore || 0)/100;

 

    return getQuadrant(bv, f);

 

  };

 

  const getColor = (item:any) => QUADRANT_COLORS[getItemQ(item)];

 

  const getComment = (item:any) => {

 

    const bv = (item.aiAnalysis?.businessBenefitScore||0)/100;

 

    const f  = (item.aiAnalysis?.feasibilityScore || item.aiAnalysis?.automationScore || 0)/100;

 

    const q  = getQuadrant(bv,f);

 

    const roi = getROI(item).label;

 

    const bp  = Math.round(bv*100), fp = Math.round(f*100);

 

    if (q==='qw') return `Quick Win — BV ${bp}% and Feasibility ${fp}%, both above threshold. ${roi} ROI. Prioritize for immediate deployment.`;

 

    if (q==='sb') return `Strategic Bet — BV ${bp}% confirmed but Feasibility ${fp}% carries execution risk. ${roi} ROI. Requires phased investment and resourcing plan.`;

 

    if (q==='tg') return `Tactical Gain — Moderate BV (${bp}%) but strong Feasibility (${fp}%). ${roi} ROI. Execute during spare capacity.`;

 

    return `Low Priority — BV ${bp}% and Feasibility ${fp}%. ${roi} ROI. Remove from active roadmap. Revisit if context changes.`;

 

  };

 

  if (loading) return (

<div className="min-h-screen bg-[#fcfdff] flex flex-col items-center justify-center gap-6">

<div className="w-16 h-16 border-8 border-[#9d7bb0]/20 border-t-[#9d7bb0] rounded-full animate-spin"/>

<p className="text-gray-400 font-black uppercase tracking-widest text-sm">Generating Strategic Quadrant...</p>

</div>

 

  );

 

  return (

<div className="p-10 space-y-10 bg-[#fcfdff] min-h-screen print:p-0 print:bg-white">

<style dangerouslySetInnerHTML={{ __html:`@media print {

 

        nav,footer,.print\\:hidden{display:none!important}

 

        .bg-white{background-color:white!important}

 

        body{padding:0!important;margin:0!important}

 

        .rounded-\\[56px\\]{border-radius:0!important;border:none!important}

 

      }`}}/>

 

      {/* Header */}

<div className="flex items-center justify-between print:mb-8">

<div className="flex items-center gap-4">

<button onClick={()=>navigate('/evaluations')}

 

            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-600 shadow-sm transition-all">

<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

<path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

</svg>

</button>

<div>

<h1 className="text-3xl font-black text-gray-900 tracking-tight">Strategic Quadrant</h1>

<p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Multi-Process Fit Visualization</p>

</div>

</div>

<div className="flex items-start gap-4">

<button onClick={handlePrint}

 

            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-black transition-all shadow-xl shadow-gray-100 print:hidden shrink-0">

<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>

</svg>

 

            Print PDF

</button>

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">

 

            {items.map(item=>(

<div key={item._id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm min-w-[140px]">

<span className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor:getColor(item)}}/>

<span className="text-[9px] font-black text-gray-600 uppercase truncate max-w-[100px]">{item.discovery?.processName}</span>

</div>

 

            ))}

</div>

</div>

</div>

 

      <div className="space-y-10">

 

        {/* Chart */}

<div className="bg-white rounded-[56px] border border-gray-100 shadow-xl p-12 flex flex-col items-center justify-center overflow-hidden relative">

<svg ref={svgRef} width="1200" height="650" viewBox="0 0 1200 650" className="max-w-full h-auto"/>

 

          {/* Legend */}

<div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl border-t border-gray-50 pt-10">

 

            {(Object.keys(QUADRANT_META) as Quadrant[]).map(q=>(

<div key={q} className="space-y-3">

<div className="flex items-center gap-3">

<div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:QUADRANT_COLORS[q]}}/>

<span className="text-[11px] font-black text-gray-900 uppercase tracking-wider">{QUADRANT_META[q].name}</span>

</div>

<p className="text-[10px] text-gray-400 font-medium leading-relaxed">{QUADRANT_META[q].description}</p>

</div>

 

            ))}

</div>

 

          {/* Detail modal */}

 

          {selectedItem && (

<motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}

 

              className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm p-12 flex flex-col items-center justify-center text-center">

<button onClick={()=>setSelectedItem(null)}

 

                className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors">

<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

<path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

</svg>

</button>

<div className="max-w-2xl space-y-8">

<div className="space-y-2">

<span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{color:getColor(selectedItem)}}>

 

                    {QUADRANT_META[getItemQ(selectedItem)].name}

</span>

<h2 className="text-4xl font-black text-gray-900 tracking-tighter">{selectedItem.discovery?.processName}</h2>

</div>

<div className="grid grid-cols-3 gap-6">

 

                  {[

 

                    {label:'Business Value',   val:`${selectedItem.aiAnalysis?.businessBenefitScore}%`, cls:''},

 

                    {label:'Automation Score', val:`${selectedItem.aiAnalysis?.automationScore}%`,      cls:''},

 

                    {label:'ROI Potential',    val:getROI(selectedItem).label,                          cls:getROI(selectedItem).color},

 

                  ].map(s=>(

<div key={s.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">

<p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>

<p className={`text-2xl font-black ${s.cls}`} style={!s.cls?{color:getColor(selectedItem)}:{}}>{s.val}</p>

</div>

 

                  ))}

</div>

<p className="text-gray-600 font-medium leading-relaxed">{getComment(selectedItem)}</p>

<div className="flex gap-4 justify-center pt-4">

<button onClick={()=>navigate(`/results/${selectedItem._id}`)}

 

                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-black transition-all shadow-xl shadow-gray-100">

 

                    View Full Analysis

</button>

<button onClick={()=>setSelectedItem(null)}

 

                    className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-gray-50 transition-all">

 

                    Back to Quadrant

</button>

</div>

</div>

</motion.div>

 

          )}

</div>

 

        {/* Fit Insights */}

<div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm space-y-12">

<div className="space-y-2">

<h3 className="text-xl font-black text-gray-900 tracking-tight">Fit Insights Comparison</h3>

<p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detailed parameter cross-reference across selected processes</p>

</div>

<div className="overflow-x-auto pb-6">

<div className="flex gap-8 min-w-max">

 

              {items.map((item, idx)=>(

<div key={item._id} className="w-[350px] space-y-8 bg-gray-50/50 p-8 rounded-[40px] border border-gray-100">

<div className="flex items-center gap-4 border-b border-gray-100 pb-6">

<div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm" style={{backgroundColor:getColor(item)}}>

 

                      {idx+1}

</div>

<div className="space-y-0.5">

<span className="text-xs font-black text-gray-900 uppercase block truncate max-w-[200px]">{item.discovery?.processName}</span>

<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Process Profile</span>

</div>

</div>

<div className="grid grid-cols-2 gap-4">

<div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">

<p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Value Score</p>

<p className="text-lg font-black" style={{color:getColor(item)}}>{item.aiAnalysis?.businessBenefitScore}%</p>

</div>

<div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">

<p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Feasibility</p>

<p className="text-lg font-black" style={{color:getColor(item)}}>

 

                        {(()=>{

 

                          let f=item.aiAnalysis?.feasibilityScore;

 

                          if(!f&&item.aiAnalysis?.automationScore&&item.aiAnalysis?.businessBenefitScore)

 

                            f=Math.round((item.aiAnalysis.automationScore+item.aiAnalysis.businessBenefitScore)/2);

 

                          return f?`${f}%`:'-';

 

                        })()}

</p>

</div>

</div>

<div className="flex items-center gap-2">

<span className="w-2 h-2 rounded-full" style={{backgroundColor:getColor(item)}}/>

<span className="text-[10px] font-black uppercase tracking-widest" style={{color:getColor(item)}}>

 

                      {QUADRANT_META[getItemQ(item)].name}

</span>

</div>

<div className="space-y-10">

<div className="space-y-5">

<div className="flex items-center gap-3">

<div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xs shadow-sm">💎</div>

<h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Value Metrics</h4>

</div>

<div className="space-y-5">

 

                        {[

 

                          {label:'Cost Optimization',score:getGScore(item,'costOptimization')},

 

                          {label:'Ops Improvement',  score:getGScore(item,'operationsImprovement')},

 

                          {label:'Risk Improvement', score:getGScore(item,'riskTolerance')},

 

                        ].map((p,i)=>(

<div key={i} className="flex items-center justify-between">

<span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{p.label}</span>

<div className="flex gap-1.5">

 

                              {[1,2,3,4,5].map(v=>(

<div key={v} className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${v<=p.score?'bg-[#002147] text-white shadow-sm':'bg-white text-gray-200 border border-gray-100'}`}>{v}</div>

 

                              ))}

</div>

</div>

 

                        ))}

</div>

</div>

<div className="space-y-5">

<div className="flex items-center gap-3">

<div className="w-7 h-7 rounded-xl bg-teal-50 flex items-center justify-center text-[#4db6ac] text-xs shadow-sm">🛠️</div>

<h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Feasibility</h4>

</div>

<div className="space-y-5">

 

                        {getFParams(item).map((p,i)=>(

<div key={i} className="flex items-center justify-between">

<span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{p.label}</span>

<div className="flex gap-1.5">

 

                              {[1,2,3,4,5].map(v=>(

<div key={v} className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${v<=p.score?'bg-[#002147] text-white shadow-sm':'bg-white text-gray-200 border border-gray-100'}`}>{v}</div>

 

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

 

export default StrategicQuadrant;

 

