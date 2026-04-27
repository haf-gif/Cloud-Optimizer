import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [data, setData] = useState(null);

  // Backend se data mangwane ka function
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/dashboard')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  if (!data) return <h2>Loading Cloud Dashboard...</h2>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#f4f7f6' }}>
      <h1 style={{ color: '#2c3e50' }}>Cloud Optimization Dashboard ☁️</h1>
      
      {/* Top Stats Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <Card title="Total Servers" value={data.stats.total_nodes} color="#3498db" />
        <Card title="Running" value={data.stats.running} color="#2ecc71" />
        <Card title="Waste Detected" value={data.stats.waste_detected} color="#e74c3c" />
        <Card title="Savings" value={data.stats.money_saved} color="#f1c40f" />
      </div>

      {/* Recommendations Section */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h3>🚀 Smart Suggestions to Save Money</h3>
        <ul>
          {data.recommendations.map((rec, index) => (
            <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Chota component Cards banane ke liye
function Card({ title, value, color }) {
  return (
    <div style={{ 
      backgroundColor: color, color: 'white', padding: '20px', 
      borderRadius: '10px', flex: 1, textAlign: 'center' 
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default Dashboard;