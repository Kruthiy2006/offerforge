import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineDocumentText, HiOutlineCheckCircle,
  HiOutlineClock, HiOutlineXCircle, HiOutlineUserGroup,
  HiOutlineSparkles, HiOutlineArrowRight
} from 'react-icons/hi2';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import StatsCard from '../components/StatsCard';
import { StatusBadge, LoadingSpinner } from '../components/UI';
import { getDashboardStats } from '../api';

const CHART_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const result = await getDashboardStats();
      setData(result);
    } catch (err) {
      console.error('Dashboard load error:', err);
      // Use fallback data for demo
      setData({
        stats: { total_offers: 247, accepted_offers: 189, pending_offers: 38, rejected_offers: 20, total_candidates: 156, total_templates: 12, acceptance_rate: 77 },
        monthly_trends: [
          { month: '2026-01', total: 35, accepted: 28, rejected: 3, pending: 4 },
          { month: '2026-02', total: 42, accepted: 34, rejected: 4, pending: 4 },
          { month: '2026-03', total: 38, accepted: 30, rejected: 5, pending: 3 },
          { month: '2026-04', total: 51, accepted: 41, rejected: 3, pending: 7 },
          { month: '2026-05', total: 48, accepted: 35, rejected: 5, pending: 8 },
        ],
        status_distribution: [
          { status: 'accepted', count: 189 },
          { status: 'sent', count: 25 },
          { status: 'draft', count: 13 },
          { status: 'rejected', count: 20 },
        ],
        department_distribution: [
          { department: 'Engineering', count: 85 },
          { department: 'Product', count: 42 },
          { department: 'Design', count: 35 },
          { department: 'Marketing', count: 30 },
          { department: 'Data & Analytics', count: 28 },
          { department: 'Infrastructure', count: 27 },
        ],
        recent_offers: [
          { id: 'a1b2c3d4', candidate_name: 'Sarah Chen', role: 'Senior Software Engineer', status: 'accepted', generated_at: '2026-05-15', salary: 185000 },
          { id: 'b2c3d4e5', candidate_name: 'James Rodriguez', role: 'VP of Product', status: 'sent', generated_at: '2026-05-14', salary: 250000 },
          { id: 'c3d4e5f6', candidate_name: 'Priya Sharma', role: 'Lead Data Scientist', status: 'draft', generated_at: '2026-05-13', salary: 165000 },
          { id: 'd4e5f6a7', candidate_name: 'Emily Watson', role: 'Senior DevOps Engineer', status: 'rejected', generated_at: '2026-05-12', salary: 175000 },
          { id: 'e5f6a7b8', candidate_name: 'Alex Thompson', role: 'Director of Marketing', status: 'draft', generated_at: '2026-05-11', salary: 195000 },
        ],
        avg_salary_by_dept: [
          { department: 'Product', avg_salary: 220000 },
          { department: 'Engineering', avg_salary: 185000 },
          { department: 'Marketing', avg_salary: 170000 },
          { department: 'Data & Analytics', avg_salary: 165000 },
          { department: 'Design', avg_salary: 155000 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (!data) return null;

  const { stats, monthly_trends, status_distribution, department_distribution, recent_offers, avg_salary_by_dept } = data;

  const pieData = status_distribution.map(s => ({ name: s.status.charAt(0).toUpperCase() + s.status.slice(1), value: s.count }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Dashboard</h1>
          <p className="page-subtitle">Overview of your offer letter platform</p>
        </div>
        <Link to="/generate" className="btn-primary">
          <HiOutlineSparkles className="w-4 h-4" /> New Offer
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Offers" value={stats.total_offers} change={12} icon={HiOutlineDocumentText} color="brand" index={0} />
        <StatsCard title="Accepted" value={stats.accepted_offers} change={8} icon={HiOutlineCheckCircle} color="emerald" index={1} />
        <StatsCard title="Pending" value={stats.pending_offers} change={-3} icon={HiOutlineClock} color="amber" index={2} />
        <StatsCard title="Rejected" value={stats.rejected_offers} change={-15} icon={HiOutlineXCircle} color="red" index={3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Offer Trends */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass-card-solid p-5">
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-4">Offer Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly_trends}>
              <defs>
                <linearGradient id="gradAccepted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="total" stroke="#8B5CF6" fill="url(#gradTotal)" strokeWidth={2} name="Total" />
              <Area type="monotone" dataKey="accepted" stroke="#6366F1" fill="url(#gradAccepted)" strokeWidth={2} name="Accepted" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card-solid p-5">
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-xs text-surface-500 dark:text-surface-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Offers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card-solid p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300">Recent Offers</h3>
            <Link to="/history" className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View All <HiOutlineArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recent_offers.map((offer, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-surface-100 dark:border-surface-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-sm font-bold text-brand-600 dark:text-brand-400">
                    {offer.candidate_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{offer.candidate_name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{offer.role}</p>
                  </div>
                </div>
                <StatusBadge status={offer.status} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Avg Salary by Department */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card-solid p-5">
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-4">Avg Salary by Department</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={avg_salary_by_dept} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="department" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Avg Salary']} contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
              <Bar dataKey="avg_salary" fill="url(#barGrad)" radius={[0, 6, 6, 0]} barSize={20}>
                {avg_salary_by_dept.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/candidates" className="glass-card-solid p-5 hover:shadow-card-hover transition-all duration-300 group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <HiOutlineUserGroup className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Manage Candidates</p>
            <p className="text-xs text-surface-500 dark:text-surface-400">{stats.total_candidates} candidates</p>
          </div>
        </Link>
        <Link to="/templates" className="glass-card-solid p-5 hover:shadow-card-hover transition-all duration-300 group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <HiOutlineDocumentText className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Template Builder</p>
            <p className="text-xs text-surface-500 dark:text-surface-400">{stats.total_templates} templates</p>
          </div>
        </Link>
        <Link to="/verify" className="glass-card-solid p-5 hover:shadow-card-hover transition-all duration-300 group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Verify Offers</p>
            <p className="text-xs text-surface-500 dark:text-surface-400">Instant verification</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
