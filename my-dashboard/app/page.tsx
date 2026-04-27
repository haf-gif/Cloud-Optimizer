"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LayoutDashboard, Server, BarChart3, PlusCircle, Activity } from 'lucide-react';

const graphData = [
  { day: 'Mon', cost: 40 }, { day: 'Tue', cost: 35 }, { day: 'Wed', cost: 55 },
  { day: 'Thu', cost: 30 }, { day: 'Fri', cost: 20 }, { day: 'Sat', cost: 15 }, { day: 'Sun', cost: 10 },
];

const analyticsData = [
  { month: 'Jan', standard: 400, optimized: 320 },
  { month: 'Feb', standard: 450, optimized: 300 },
  { month: 'Mar', standard: 500, optimized: 280 },
  { month: 'Apr', standard: 480, optimized: 250 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({ 
    stats: { total_nodes: 0, waste_detected: 0, money_saved: "$0" }, 
    recommendations: [] 
  });

  const fetchData = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) { console.error("Backend offline"); }
  };

  useEffect(() => { fetchData(); }, []);

  const addServer = async (type: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/add-instance/${type}`, { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setTimeout(fetchData, 800); 
      } else {
        alert("Backend error: " + result.error);
      }
    } catch (err) {
      alert("Backend Not Connected!");
    }
  };

  const handleExecute = async (id: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/optimize/${id}`, { method: 'POST' });
      if (res.ok) { fetchData(); }
    } catch (err) { alert("Action failed"); }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] border-r border-slate-800 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">C</div>
          <span className="text-xl font-bold tracking-tight text-white">CloudOptix</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('instances')} className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'instances' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Server size={20} /> <span>Instances</span>
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'analytics' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
            <BarChart3 size={20} /> <span>Cost Analytics</span>
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT Area */}
      <div className="flex-1 bg-slate-50 text-slate-900 p-10 overflow-y-auto">
        
        {/* --- Tab 1: Dashboard --- */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold text-slate-800">Cloud Overview</h1>
                <div className="flex gap-3">
                    <button onClick={() => addServer('t2.micro')} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 shadow-sm transition active:scale-95">
                        <PlusCircle size={14}/> Add Normal
                    </button>
                    <button onClick={() => addServer('t3.large')} className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 shadow-sm transition active:scale-95">
                        <PlusCircle size={14}/> Add Wasteful
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
               <div className="bg-[#0f172a] p-8 rounded-2xl shadow-xl border border-slate-700 text-white">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Servers</p>
                  <p className="text-4xl font-black mt-2 tracking-tight">{data.stats.total_nodes}</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Waste Points</p>
                  <p className="text-4xl font-black text-red-500 mt-2 tracking-tight">{data.stats.waste_detected}</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Savings</p>
                  <p className="text-4xl font-black text-green-600 mt-2 tracking-tight">{data.stats.money_saved}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl border shadow-sm">
                <h2 className="font-bold mb-6 flex items-center gap-2 text-slate-800"><Activity size={18} className="text-blue-600"/> Real-time Efficiency</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                        <XAxis dataKey="day" axisLine={false} tickLine={false}/>
                        <YAxis axisLine={false} tickLine={false}/>
                        <Tooltip />
                        <Line type="monotone" dataKey="cost" stroke="#2563eb" strokeWidth={4} dot={{r:6}} />
                      </LineChart>
                    </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border shadow-sm">
                <h2 className="font-bold mb-6 text-slate-800 tracking-tight text-lg">Smart Actions</h2>
                <div className="space-y-4">
                  {data.recommendations.length > 0 ? data.recommendations.map((rec:any) => (
                    <div key={rec.id} className="p-5 bg-slate-50 rounded-xl border border-slate-100 border-l-4 border-l-red-500">
                      <p className="text-xs font-bold text-slate-600 mb-4">{rec.text}</p>
                      <button onClick={() => handleExecute(rec.id)} className="w-full bg-[#0f172a] text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition shadow-md active:scale-95">Execute Optimization</button>
                    </div>
                  )) : <div className="py-20 text-center text-slate-400 italic text-sm">System Optimized ✨</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 2: Instances --- */}
        {activeTab === 'instances' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-slate-800">Infrastructure Nodes</h1>
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-5">Instance ID</th>
                        <th className="p-5">Status</th>
                        <th className="p-5">Type</th>
                        <th className="p-5">Health</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recommendations.length > 0 || data.stats.total_nodes > 0 ? (
                        <tr className="border-b hover:bg-slate-50">
                            <td className="p-5 font-mono text-sm">i-0de9d3f024e2961c93</td>
                            <td className="p-5 text-sm font-bold text-green-600 uppercase">● Running</td>
                            <td className="p-5 text-sm">t2.micro</td>
                            <td className="p-5"><span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold text-xs">HEALTHY</span></td>
                        </tr>
                      ) : (
                        <tr><td colSpan={4} className="p-10 text-center text-slate-400 italic">No instances active.</td></tr>
                      )}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {/* --- Tab 3: Analytics --- */}
        {activeTab === 'analytics' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-10 text-slate-800">Cost Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border shadow-sm">
                    <h2 className="font-bold mb-6 text-slate-700 uppercase text-xs tracking-widest">Spending Comparison</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: '#f8fafc'}} />
                          <Legend />
                          <Bar name="Standard Cost" dataKey="standard" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                          <Bar name="Optimized Cost" dataKey="optimized" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-blue-600 p-10 rounded-2xl text-white shadow-xl flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">Monthly Report</h3>
                    <p className="text-blue-100 opacity-90 leading-relaxed mb-6">
                        Automated optimization has successfully reduced cloud waste. 
                        Your current efficiency score is <strong>85%</strong>.
                    </p>
                    <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                        <p className="text-sm">Projected Annual Savings: <span className="font-bold text-white text-xl">$1,200</span></p>
                    </div>
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}