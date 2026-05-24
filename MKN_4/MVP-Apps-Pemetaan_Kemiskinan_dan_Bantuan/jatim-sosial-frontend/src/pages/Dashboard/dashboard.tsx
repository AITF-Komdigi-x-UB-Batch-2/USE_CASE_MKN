import React, { useMemo } from 'react';
import { 
  Users,
  Map,
  Layers
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import { rawKeluargaData } from '../../data/dataKeluarga';
import './Dashboard.css';

interface DashboardProps {
  onLogout?: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const totalData = rawKeluargaData.length;

  const distributionByKecamatan = useMemo(() => {
    const counts: Record<string, number> = {};
    rawKeluargaData.forEach(d => {
      counts[d.nama_kecamatan] = (counts[d.nama_kecamatan] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const distributionByDecile = useMemo(() => {
    const counts: Record<string, number> = {};
    rawKeluargaData.forEach(d => {
      const key = `Desil ${d.desil_kesejahteraan}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, decile: parseInt(name.replace('Desil ', '')) }))
      .sort((a, b) => a.decile - b.decile);
  }, []);

  return (
    <AdminLayout title="Dashboard Monitoring" onLogout={onLogout}>
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Dashboard Pemetaan Kemiskinan</h2>
            <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>Ringkasan data kesejahteraan masyarakat Jawa Timur</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '12px' }}>
              <Users size={32} color="#3b82f6" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Total Data Input</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#111827', lineHeight: 1 }}>{totalData}</p>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '12px' }}>
              <Map size={32} color="#22c55e" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Kecamatan</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#111827', lineHeight: 1 }}>{distributionByKecamatan.length}</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: '#fffbeb', padding: '16px', borderRadius: '12px' }}>
              <Layers size={32} color="#f59e0b" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Desil Terdata</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#111827', lineHeight: 1 }}>{distributionByDecile.length}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', paddingBottom: '24px' }}>
          
          {/* Bar Chart Wilayah */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px', color: '#1f2937', marginTop: 0 }}>Persebaran Kemiskinan Berdasarkan Kecamatan</h3>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionByKecamatan} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dx={-10} />
                  <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" name="Jumlah Keluarga" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40}>
                    {distributionByKecamatan.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Desil */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px', color: '#1f2937', marginTop: 0 }}>Distribusi Desil Kesejahteraan</h3>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionByDecile}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent = 0 }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{stroke: '#9ca3af', strokeWidth: 1}}
                  >
                    {distributionByDecile.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
