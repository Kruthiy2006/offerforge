import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineMagnifyingGlass, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { StatusBadge } from '../components/UI';
import { verifyOffer } from '../api';

export default function VerifyOffer() {
  const [offerId, setOfferId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!offerId.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await verifyOffer(offerId.trim());
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please check the offer ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-brand">
          <HiOutlineShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="page-header text-center">Verify Offer Letter</h1>
        <p className="page-subtitle text-center">Enter an offer ID to verify its authenticity</p>
      </div>

      {/* Search Form */}
      <motion.form onSubmit={handleVerify} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-solid p-6">
        <label className="label-text">Offer ID</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={offerId}
              onChange={e => setOfferId(e.target.value)}
              placeholder="e.g., a1b2c3d4-e5f6-7890-abcd-ef1234567890"
              className="input-field pl-10 font-mono text-sm"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex-shrink-0">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiOutlineShieldCheck className="w-4 h-4" />
            )}
            Verify
          </button>
        </div>
        <p className="text-xs text-surface-400 mt-2">
          The offer ID can be found at the bottom of the offer letter PDF.
        </p>
      </motion.form>

      {/* Results */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card-solid p-6 border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <HiOutlineXCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Verification Failed</h3>
                <p className="text-sm text-red-500 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {result && !result.verified && (
          <motion.div key="not-found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card-solid p-6 border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <HiOutlineExclamationTriangle className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Offer Not Found</h3>
                <p className="text-sm text-amber-500 mt-1">{result.message}</p>
              </div>
            </div>
          </motion.div>
        )}

        {result && result.verified && (
          <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            {/* Verified Banner */}
            <div className="glass-card-solid p-6 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <HiOutlineCheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Verified ✓</h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500">{result.message}</p>
                </div>
              </div>
            </div>

            {/* Offer Details */}
            <div className="glass-card-solid p-6">
              <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 mb-4">Offer Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ['Candidate', result.offer.candidate_name],
                  ['Position', result.offer.role],
                  ['Department', result.offer.department || '—'],
                  ['Company', result.offer.company],
                  ['Joining Date', formatDate(result.offer.joining_date)],
                  ['Issued Date', formatDate(result.offer.issued_date)],
                  ['Valid Until', formatDate(result.offer.valid_until)],
                  ['Issued By', `${result.offer.issued_by?.name || '—'}, ${result.offer.issued_by?.title || '—'}`],
                ].map(([label, val], i) => (
                  <div key={i} className="py-2 border-b border-surface-100 dark:border-surface-800 last:border-0">
                    <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{val}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-surface-500">Current Status:</span>
                <StatusBadge status={result.offer.status} />
                {result.offer.is_expired && (
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <HiOutlineExclamationTriangle className="w-3.5 h-3.5" /> Expired
                  </span>
                )}
              </div>
            </div>

            {/* Status Timeline */}
            {result.status_history && result.status_history.length > 0 && (
              <div className="glass-card-solid p-6">
                <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 mb-4">Status Timeline</h3>
                <div className="space-y-0">
                  {result.status_history.map((log, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-brand-500 ring-4 ring-brand-100 dark:ring-brand-900/30 flex-shrink-0" />
                        {i < result.status_history.length - 1 && (
                          <div className="w-0.5 h-full bg-surface-200 dark:bg-surface-700 my-1" />
                        )}
                      </div>
                      <div className="pb-6 last:pb-0">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={log.new_status} />
                          <span className="text-xs text-surface-400">{formatDate(log.changed_at)}</span>
                        </div>
                        {log.note && (
                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{log.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
