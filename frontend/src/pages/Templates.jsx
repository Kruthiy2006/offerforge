import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePlusCircle, HiOutlineDocumentText, HiOutlineSparkles, HiOutlineEye } from 'react-icons/hi2';
import { EmptyState, LoadingSpinner, Modal } from '../components/UI';
import { getTemplates, createTemplate } from '../api';

const PLACEHOLDER_TAGS = ['candidate_name', 'role', 'department', 'salary', 'joining_date', 'company_name', 'hr_name', 'hr_title', 'valid_until'];
const CATEGORIES = ['general', 'executive', 'startup', 'corporate', 'internship'];

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', content: '', category: 'general', is_premium: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadTemplates(); }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error(err);
      setTemplates([
        { id: 1, name: 'Standard Employment Offer', description: 'A comprehensive standard offer letter.', category: 'general', is_premium: false, content: 'Dear {{candidate_name}},...', placeholders: PLACEHOLDER_TAGS, created_at: '2026-05-01' },
        { id: 2, name: 'Executive Offer Package', description: 'Premium offer for C-level positions.', category: 'executive', is_premium: true, content: 'Dear {{candidate_name}},...', placeholders: PLACEHOLDER_TAGS, created_at: '2026-05-02' },
        { id: 3, name: 'Tech Startup Offer', description: 'Modern offer for startups.', category: 'startup', is_premium: false, content: 'Hey {{candidate_name}}! 🎉...', placeholders: PLACEHOLDER_TAGS, created_at: '2026-05-03' },
        { id: 4, name: 'Enterprise Corporate Offer', description: 'Formal corporate offer letter.', category: 'corporate', is_premium: true, content: 'Dear {{candidate_name}},...', placeholders: PLACEHOLDER_TAGS, created_at: '2026-05-04' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const insertPlaceholder = (tag) => {
    setForm(prev => ({ ...prev, content: prev.content + `{{${tag}}}` }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createTemplate(form);
      setTemplates(prev => [created, ...prev]);
      setShowCreate(false);
      setForm({ name: '', description: '', content: '', category: 'general', is_premium: false });
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  const categoryColors = {
    general: 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400',
    executive: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
    startup: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    corporate: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    internship: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
  };

  if (loading) return <LoadingSpinner text="Loading templates..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Template Builder</h1>
          <p className="page-subtitle">Create and manage reusable offer letter templates</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <HiOutlinePlusCircle className="w-4 h-4" /> Create Template
        </button>
      </div>

      {/* Template Grid */}
      {templates.length === 0 ? (
        <EmptyState icon={HiOutlineDocumentText} title="No templates yet" description="Create your first template to start generating offers." action={<button onClick={() => setShowCreate(true)} className="btn-primary"><HiOutlinePlusCircle className="w-4 h-4" /> Create Template</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-solid p-5 hover:shadow-card-hover transition-all duration-300 group flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase ${categoryColors[t.category] || categoryColors.general}`}>
                    {t.category}
                  </span>
                  {t.is_premium && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                      PRO
                    </span>
                  )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiOutlineDocumentText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 mb-1">{t.name}</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-4 flex-1 line-clamp-2">{t.description}</p>
              
              {/* Placeholders */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(Array.isArray(t.placeholders) ? t.placeholders : []).slice(0, 5).map(p => (
                  <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                    {`{{${p}}}`}
                  </span>
                ))}
                {(Array.isArray(t.placeholders) ? t.placeholders : []).length > 5 && (
                  <span className="text-[10px] text-surface-400 px-2 py-0.5">+{t.placeholders.length - 5} more</span>
                )}
              </div>

              <button onClick={() => setShowPreview(t)} className="btn-ghost text-sm w-full justify-center border border-surface-200 dark:border-surface-700">
                <HiOutlineEye className="w-4 h-4" /> Preview
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Template Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Template" size="xl">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Template Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g., Engineering Offer" />
            </div>
            <div>
              <label className="label-text">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label-text">Description</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" placeholder="Brief description of this template" />
          </div>

          {/* Placeholder tags */}
          <div>
            <label className="label-text mb-2">Insert Placeholders</label>
            <div className="flex flex-wrap gap-1.5">
              {PLACEHOLDER_TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => insertPlaceholder(tag)} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors border border-brand-200 dark:border-brand-800">
                  {`{{${tag}}}`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Template Content *</label>
            <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="input-field font-mono text-sm resize-none" rows={12} placeholder="Dear {{candidate_name}},&#10;&#10;We are pleased to offer you the position of {{role}}..." />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_premium" checked={form.is_premium} onChange={e => setForm({ ...form, is_premium: e.target.checked })} className="rounded border-surface-300 text-brand-600 focus:ring-brand-500" />
            <label htmlFor="is_premium" className="text-sm text-surface-700 dark:text-surface-300">Mark as Premium Template</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Creating...' : 'Create Template'}</button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!showPreview} onClose={() => setShowPreview(null)} title={showPreview?.name || 'Template Preview'} size="lg">
        {showPreview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${categoryColors[showPreview.category] || categoryColors.general}`}>
                {showPreview.category}
              </span>
              {showPreview.is_premium && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white">PRO</span>
              )}
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400">{showPreview.description}</p>
            <div className="p-5 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
              <pre className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap font-sans leading-relaxed">
                {showPreview.content}
              </pre>
            </div>
            <div>
              <p className="text-xs font-semibold text-surface-500 mb-2">Available Placeholders:</p>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(showPreview.placeholders) ? showPreview.placeholders : []).map(p => (
                  <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                    {`{{${p}}}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
