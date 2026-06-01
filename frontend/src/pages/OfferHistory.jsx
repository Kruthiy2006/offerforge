import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass, HiOutlineClock, HiOutlineDocumentArrowDown,
  HiOutlineArrowPath, HiOutlineFunnel
} from 'react-icons/hi2';
import { StatusBadge, EmptyState, LoadingSpinner, Modal } from '../components/UI';
import { getOffers, updateOfferStatus, getOfferPDF } from '../api';

const STATUS_OPTIONS = ['all', 'draft', 'sent', 'accepted', 'rejected', 'expired'];

export default function OfferHistory() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => { loadOffers(); }, [statusFilter]);

  const loadOffers = async () => {
    try {
      const data = await getOffers({ status: statusFilter !== 'all' ? statusFilter : undefined });
      setOffers(data);
    } catch (err) {
      console.error(err);
      setOffers([
        { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', candidate_name: 'Sarah Chen', candidate_email: 'sarah.chen@email.com', role: 'Senior Software Engineer', department: 'Engineering', salary: 185000, status: 'accepted', generated_at: '2026-05-15T10:00:00', template_name: 'Standard Employment Offer' },
        { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', candidate_name: 'James Rodriguez', candidate_email: 'james.rodriguez@email.com', role: 'VP of Product', department: 'Product', salary: 250000, status: 'sent', generated_at: '2026-05-14T14:30:00', template_name: 'Executive Offer Package' },
        { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', candidate_name: 'Priya Sharma', candidate_email: 'priya.sharma@email.com', role: 'Lead Data Scientist', department: 'Data & Analytics', salary: 165000, status: 'draft', generated_at: '2026-05-13T09:15:00', template_name: 'Standard Employment Offer' },
        { id: 'd4e5f6a7-b8c9-0123-defa-234567890123', candidate_name: 'Emily Watson', candidate_email: 'emily.watson@email.com', role: 'Senior DevOps Engineer', department: 'Infrastructure', salary: 175000, status: 'rejected', generated_at: '2026-05-12T16:45:00', template_name: 'Tech Startup Offer' },
        { id: 'e5f6a7b8-c9d0-1234-efab-345678901234', candidate_name: 'Alex Thompson', candidate_email: 'alex.thompson@email.com', role: 'Director of Marketing', department: 'Marketing', salary: 195000, status: 'draft', generated_at: '2026-05-11T11:00:00', template_name: 'Enterprise Corporate Offer' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = offers.filter(o =>
    o.candidate_name.toLowerCase().includes(search.toLowerCase()) ||
    o.candidate_email.toLowerCase().includes(search.toLowerCase()) ||
    o.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusUpdate = async () => {
    if (!showStatusModal || !newStatus) return;
    try {
      await updateOfferStatus(showStatusModal.id, { status: newStatus, note: statusNote });
      setOffers(prev => prev.map(o => o.id === showStatusModal.id ? { ...o, status: newStatus } : o));
      setShowStatusModal(null);
      setNewStatus('');
      setStatusNote('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const downloadPDF = async (offer) => {
    try {
      const blob = await getOfferPDF(offer.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OfferLetter_${offer.candidate_name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) return <LoadingSpinner text="Loading offers..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Offer History</h1>
          <p className="page-subtitle">{offers.length} total offers generated</p>
        </div>
        <button onClick={loadOffers} className="btn-secondary">
          <HiOutlineArrowPath className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input type="text" placeholder="Search offers..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <HiOutlineFunnel className="w-4 h-4 text-surface-400" />
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${statusFilter === s ? 'bg-brand-600 text-white shadow-brand' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Offers List */}
      {filtered.length === 0 ? (
        <EmptyState icon={HiOutlineClock} title="No offers found" description={search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Generate your first offer to see it here'} />
      ) : (
        <div className="space-y-3">
          {filtered.map((offer, i) => (
            <motion.div key={offer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card-solid p-4 sm:p-5 hover:shadow-card-hover transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-100 to-violet-100 dark:from-brand-900/30 dark:to-violet-900/30 flex items-center justify-center text-sm font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
                    {offer.candidate_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-surface-800 dark:text-surface-200">{offer.candidate_name}</h3>
                      <StatusBadge status={offer.status} />
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{offer.role} · {offer.department || 'General'}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-surface-400">${parseFloat(offer.salary).toLocaleString()}/yr</span>
                      <span className="text-xs text-surface-400">·</span>
                      <span className="text-xs text-surface-400">{formatDate(offer.generated_at)}</span>
                      {offer.template_name && (
                        <>
                          <span className="text-xs text-surface-400">·</span>
                          <span className="text-xs text-brand-500">{offer.template_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto">
                  <button onClick={() => downloadPDF(offer)} className="btn-ghost text-xs" title="Download PDF">
                    <HiOutlineDocumentArrowDown className="w-4 h-4" /> PDF
                  </button>
                  <button onClick={() => { setShowStatusModal(offer); setNewStatus(offer.status); }} className="btn-ghost text-xs" title="Update Status">
                    <HiOutlineArrowPath className="w-4 h-4" /> Status
                  </button>
                  <button onClick={() => setSelectedOffer(offer)} className="btn-ghost text-xs">
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selectedOffer} onClose={() => setSelectedOffer(null)} title="Offer Details" size="lg">
        {selectedOffer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Candidate', selectedOffer.candidate_name],
                ['Email', selectedOffer.candidate_email],
                ['Role', selectedOffer.role],
                ['Department', selectedOffer.department || '—'],
                ['Salary', `$${parseFloat(selectedOffer.salary).toLocaleString()}`],
                ['Status', null],
                ['Generated', formatDate(selectedOffer.generated_at)],
                ['Template', selectedOffer.template_name || 'AI Generated'],
              ].map(([label, val], i) => (
                <div key={i}>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">{label}</p>
                  {val !== null ? (
                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{val}</p>
                  ) : (
                    <StatusBadge status={selectedOffer.status} />
                  )}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-surface-500 mb-1">Offer ID</p>
              <p className="text-xs font-mono text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-900 px-3 py-2 rounded-lg break-all">{selectedOffer.id}</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => downloadPDF(selectedOffer)} className="btn-primary">
                <HiOutlineDocumentArrowDown className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal isOpen={!!showStatusModal} onClose={() => setShowStatusModal(null)} title="Update Offer Status">
        {showStatusModal && (
          <div className="space-y-4">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Updating status for <span className="font-semibold text-surface-800 dark:text-surface-200">{showStatusModal.candidate_name}</span>
            </p>
            <div>
              <label className="label-text">New Status</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field">
                {['draft', 'sent', 'accepted', 'rejected', 'expired', 'revoked'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">Note (Optional)</label>
              <textarea value={statusNote} onChange={e => setStatusNote(e.target.value)} className="input-field resize-none" rows={3} placeholder="Add a note about this status change..." />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowStatusModal(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleStatusUpdate} className="btn-primary">Update Status</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
