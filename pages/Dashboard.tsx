
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const dataTrends = [
  { name: '6 Dec - 15 Dec', completed: 25, score: 78 },
  { name: '16 Dec - 25 Dec', completed: 35, score: 96 },
  { name: '26 Dec - 4 Jan', completed: 30, score: 85 },
];

const dataTech = [
  { name: 'RPA', value: 35 },
  { name: 'Agentic AI', value: 25 },
  { name: 'Augment AI', value: 15 },
  { name: 'Process Transformation', value: 8 },
  { name: 'Data Governance', value: 18 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="font-medium">Last 30 days</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div className="bg-[#f3ebf6] p-10 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Hi <span className="text-[#9d7bb0]">Karthik</span>, welcome to Avagama.ai!</h2>
          <p className="text-gray-600 max-w-2xl">Discover automation opportunities, evaluate business processes, and unlock AI-powered automation for your enterprise.</p>
          <div className="flex gap-4 pt-2">
            <Link to="/evaluate" className="bg-[#9d7bb0] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200 hover:bg-[#8b6aa1]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Start new evaluation
            </Link>
            <button className="bg-white text-[#9d7bb0] border border-[#9d7bb0]/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
              Discover AI use cases
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Evaluations completed', value: '102', change: '+12.5%', icon: '📋', color: '#9d7bb0' },
          { label: 'Avg. automation score', value: '82', suffix: '/ 100', change: '+1.5', icon: '⚙️', color: '#9d7bb0' },
          { label: 'AI use cases found - Domain', value: '128', change: '-2.0', icon: '🎯', color: '#4db6ac' },
          { label: 'AI use cases found - Company', value: '256', change: '+16', icon: '🏢', color: '#4db6ac' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="text-sm font-medium text-gray-400 max-w-[150px]">{stat.label}</div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{backgroundColor: `${stat.color}20`}}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.suffix && <div className="text-sm font-medium text-gray-400">{stat.suffix}</div>}
            </div>
            <div className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
               {stat.change} <span className="text-gray-400 font-normal">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Evaluation trends</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-[#4db6ac]"></div> Evaluations completed
                 </div>
                 <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-[#9d7bb0]"></div> Avg. automation score
                 </div>
              </div>
           </div>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={dataTrends}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                 <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                 <Line type="monotone" dataKey="completed" stroke="#4db6ac" strokeWidth={3} dot={{ r: 6, fill: '#fff', strokeWidth: 3 }} />
                 <Line type="monotone" dataKey="score" stroke="#9d7bb0" strokeWidth={3} dot={{ r: 6, fill: '#fff', strokeWidth: 3 }} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
           <h3 className="font-bold text-lg">Technology distribution</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={dataTech} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#4b5563'}} width={130} />
                 <Tooltip />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {dataTech.map((entry, index) => (
                      <rect key={index} fill={index < 3 ? '#9d7bb0' : '#4db6ac'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
