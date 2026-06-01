import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineSparkles, HiOutlineDocumentArrowDown, HiOutlineCheckCircle } from 'react-icons/hi2';
import { LoadingSpinner } from '../components/UI';
import { getTemplates, getCandidates, createOffer, getOfferPDF } from '../api';

export default function GenerateOffer() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    candidate_name: '', candidate_email: '', candidate_id: '',
    role: '', department: '', salary: '',
    joining_date: '', company_name: 'TechCorp Global Inc.',
    company_address: '100 Innovation Drive, San Francisco, CA 94105',
    hr_name: 'Jennifer Morrison', hr_title: 'Head of Human Resources',
    hr_email: 'hr@techcorpglobal.com', template_id: '', use_ai: true, currency: 'USD'
  });

  useEffect(() => {
    Promise.all([
      getTemplates().catch(() => []),
      getCandidates().catch(() => [])
    ]).then(([t, c]) => {
      setTemplates(t);
      setCandidates(c);
      setLoading(false);
    });
  }, []);

  const handleCandidateSelect = (e) => {
    const id = e.target.value;
    if (id) {
      const c = candidates.find(c => c.id === parseInt(id));
      if (c) {
        setForm(prev => ({
          ...prev,
          candidate_id: c.id,
          candidate_name: c.name,
          candidate_email: c.email,
          role: c.current_role || prev.role,
          department: c.department || prev.department
        }));
      }
    } else {
      setForm(prev => ({ ...prev, candidate_id: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const result = await createOffer({
        ...form,
        salary: parseFloat(form.salary),
        template_id: form.template_id ? parseInt(form.template_id) : null,
        candidate_id: form.candidate_id ? parseInt(form.candidate_id) : null
      });
      setSuccess(result);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate offer. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!success?.id) return;
    try {
      const blob = await getOfferPDF(success.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OfferLetter_${success.candidate_name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading form data..." />;

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-10">
        <div className="glass-card-solid p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-6">
            <HiOutlineCheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Offer Generated Successfully!</h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            Offer letter for <span className="font-semibold text-surface-700 dark:text-surface-300">{success.candidate_name}</span> has been created.
          </p>

          <div className="glass-card p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Offer ID</span>
              <span className="font-mono text-xs text-surface-700 dark:text-surface-300">{success.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Position</span>
              <span className="font-medium text-surface-700 dark:text-surface-300">{success.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Salary</span>
              <span className="font-medium text-surface-700 dark:text-surface-300">${parseFloat(success.salary).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Status</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">Draft</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={downloadPDF} className="btn-primary">
              <HiOutlineDocumentArrowDown className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={() => navigate('/history')} className="btn-secondary">
              View in History
            </button>
            <button onClick={() => { setSuccess(null); setForm(prev => ({ ...prev, candidate_name: '', candidate_email: '', candidate_id: '', role: '', department: '', salary: '', joining_date: '', template_id: '' })); }} className="btn-ghost">
              Create Another
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="page-header">Generate Offer Letter</h1>
        <p className="page-subtitle">Fill in the details below to create a professional offer letter</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Candidate Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-solid p-6">
          <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center text-xs font-bold text-brand-600">1</span>
            Candidate Information
          </h3>

          <div className="mb-4">
            <label className="label-text">Select Existing Candidate (Optional)</label>
            <select value={form.candidate_id} onChange={handleCandidateSelect} className="input-field">
              <option value="">— Select or enter manually below —</option>
              {candidates.map(c => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Full Name *</label>
              <input type="text" required value={form.candidate_name} onChange={e => setForm({ ...form, candidate_name: e.target.value })} className="input-field" placeholder="Sarah Chen" />
            </div>
            <div>
              <label className="label-text">Email *</label>
              <input type="email" required value={form.candidate_email} onChange={e => setForm({ ...form, candidate_email: e.target.value })} className="input-field" placeholder="sarah@email.com" />
            </div>
          </div>
        </motion.div>

        {/* Position Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-solid p-6">
          <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center text-xs font-bold text-violet-600">2</span>
            Position Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Job Role *</label>
              <input type="text" required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field" placeholder="Senior Software Engineer" />
            </div>
            <div>
              <label className="label-text">Department</label>
              <input type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="input-field" placeholder="Engineering" />
            </div>
            <div>
              <label className="label-text">Annual Salary ({form.currency}) *</label>
              <input type="number" required min="0" step="1000" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} className="input-field" placeholder="185000" />
            </div>
            <div>
              <label className="label-text">Joining Date *</label>
              <input type="date" required value={form.joining_date} onChange={e => setForm({ ...form, joining_date: e.target.value })} className="input-field" />
            </div>
          </div>
        </motion.div>

        {/* Company Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-solid p-6">
          <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-xs font-bold text-emerald-600">3</span>
            Company & HR Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Company Name *</label>
              <input type="text" required value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-text">Company Address</label>
              <input type="text" value={form.company_address} onChange={e => setForm({ ...form, company_address: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-text">HR Name *</label>
              <input type="text" required value={form.hr_name} onChange={e => setForm({ ...form, hr_name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-text">HR Title</label>
              <input type="text" value={form.hr_title} onChange={e => setForm({ ...form, hr_title: e.target.value })} className="input-field" />
            </div>
          </div>
        </motion.div>

        {/* Template & AI */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-solid p-6">
          <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center text-xs font-bold text-cyan-600">4</span>
            Template & AI Options
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Select Template</label>
              <select value={form.template_id} onChange={e => setForm({ ...form, template_id: e.target.value })} className="input-field">
                <option value="">— No template (AI will generate) —</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.category})</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-brand-50 to-violet-50 dark:from-brand-900/10 dark:to-violet-900/10 border border-brand-200 dark:border-brand-800 w-full cursor-pointer">
                <input type="checkbox" checked={form.use_ai} onChange={e => setForm({ ...form, use_ai: e.target.checked })} className="rounded border-brand-300 text-brand-600 focus:ring-brand-500" />
                <div>
                  <p className="text-sm font-medium text-surface-800 dark:text-surface-200 flex items-center gap-1.5">
                    <HiOutlineSparkles className="w-4 h-4 text-brand-500" />
                    AI Enhancement
                  </p>
                  <p className="text-[11px] text-surface-500 dark:text-surface-400">Use AI to generate professional content</p>
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={generating} className="btn-primary px-8 py-3">
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <HiOutlineSparkles className="w-5 h-5" />
                Generate Offer Letter
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
