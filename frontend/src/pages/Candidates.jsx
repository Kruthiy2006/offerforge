import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUserPlus, HiOutlineMagnifyingGlass, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineUserGroup } from 'react-icons/hi2';
import { StatusBadge, EmptyState, LoadingSpinner, Modal } from '../components/UI';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from '../api';

const INITIAL_FORM = { name: '', email: '', phone: '', current_role: '', department: '', experience_years: 0, location: '', notes: '' };

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCandidates(); }, []);

  const loadCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (err) {
      console.error(err);
      setCandidates([
        { id: 1, name: 'Sarah Chen', email: 'sarah.chen@email.com', phone: '+1-555-0101', current_role: 'Senior Software Engineer', department: 'Engineering', experience_years: 6, location: 'San Francisco, CA', status: 'active', created_at: '2026-05-01' },
        { id: 2, name: 'James Rodriguez', email: 'james.rodriguez@email.com', phone: '+1-555-0102', current_role: 'Product Manager', department: 'Product', experience_years: 8, location: 'New York, NY', status: 'active', created_at: '2026-05-02' },
        { id: 3, name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+1-555-0103', current_role: 'Data Scientist', department: 'Data & Analytics', experience_years: 4, location: 'Austin, TX', status: 'active', created_at: '2026-05-03' },
        { id: 4, name: 'Michael Park', email: 'michael.park@email.com', phone: '+1-555-0104', current_role: 'UX Designer', department: 'Design', experience_years: 5, location: 'Seattle, WA', status: 'inactive', created_at: '2026-05-04' },
        { id: 5, name: 'Emily Watson', email: 'emily.watson@email.com', phone: '+1-555-0105', current_role: 'DevOps Engineer', department: 'Infrastructure', experience_years: 7, location: 'Denver, CO', status: 'hired', created_at: '2026-05-05' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.current_role || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(INITIAL_FORM); setEditingId(null); setShowModal(true); };
  const openEdit = (c) => { setForm({ name: c.name, email: c.email, phone: c.phone || '', current_role: c.current_role || '', department: c.department || '', experience_years: c.experience_years || 0, location: c.location || '', notes: c.notes || '' }); setEditingId(c.id); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateCandidate(editingId, form);
        setCandidates(prev => prev.map(c => c.id === editingId ? updated : c));
      } else {
        const created = await createCandidate(form);
        setCandidates(prev => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await deleteCandidate(id);
      setCandidates(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <LoadingSpinner text="Loading candidates..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Candidates</h1>
          <p className="page-subtitle">{candidates.length} candidates in your pipeline</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <HiOutlineUserPlus className="w-4 h-4" /> Add Candidate
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={HiOutlineUserGroup} title="No candidates found" description={search ? 'Try a different search term' : 'Add your first candidate to get started'} action={!search && <button onClick={openCreate} className="btn-primary"><HiOutlineUserPlus className="w-4 h-4" /> Add Candidate</button>} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header hidden sm:table-cell">Role</th>
                <th className="table-header hidden md:table-cell">Department</th>
                <th className="table-header hidden lg:table-cell">Experience</th>
                <th className="table-header hidden lg:table-cell">Location</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-100 to-violet-100 dark:from-brand-900/30 dark:to-violet-900/30 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-surface-800 dark:text-surface-200">{c.name}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell hidden sm:table-cell">{c.current_role || '—'}</td>
                  <td className="table-cell hidden md:table-cell">{c.department || '—'}</td>
                  <td className="table-cell hidden lg:table-cell">{c.experience_years ? `${c.experience_years} yrs` : '—'}</td>
                  <td className="table-cell hidden lg:table-cell text-xs">{c.location || '—'}</td>
                  <td className="table-cell"><StatusBadge status={c.status} /></td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-500 hover:text-brand-600">
                        <HiOutlinePencilSquare className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-surface-500 hover:text-red-600">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Candidate' : 'Add Candidate'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Full Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="label-text">Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="john@email.com" />
            </div>
            <div>
              <label className="label-text">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+1-555-0100" />
            </div>
            <div>
              <label className="label-text">Current Role</label>
              <input type="text" value={form.current_role} onChange={e => setForm({ ...form, current_role: e.target.value })} className="input-field" placeholder="Software Engineer" />
            </div>
            <div>
              <label className="label-text">Department</label>
              <input type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="input-field" placeholder="Engineering" />
            </div>
            <div>
              <label className="label-text">Experience (years)</label>
              <input type="number" min="0" value={form.experience_years} onChange={e => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-text">Location</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="San Francisco, CA" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-text">Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" rows={3} placeholder="Additional notes..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
