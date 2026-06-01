export function StatusBadge({ status }) {
  const statusConfig = {
    draft: { label: 'Draft', class: 'status-draft', dot: 'bg-surface-400' },
    sent: { label: 'Sent', class: 'status-sent', dot: 'bg-blue-500' },
    pending: { label: 'Pending', class: 'status-pending', dot: 'bg-yellow-500' },
    accepted: { label: 'Accepted', class: 'status-accepted', dot: 'bg-emerald-500' },
    rejected: { label: 'Rejected', class: 'status-rejected', dot: 'bg-red-500' },
    expired: { label: 'Expired', class: 'status-expired', dot: 'bg-amber-500' },
    revoked: { label: 'Revoked', class: 'status-rejected', dot: 'bg-red-500' },
    active: { label: 'Active', class: 'status-accepted', dot: 'bg-emerald-500' },
    inactive: { label: 'Inactive', class: 'status-draft', dot: 'bg-surface-400' },
    hired: { label: 'Hired', class: 'status-accepted', dot: 'bg-emerald-500' },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={config.class}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-brand-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 text-center max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}

export function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="spinner mb-4" />
      <p className="text-sm text-surface-500 dark:text-surface-400">{text}</p>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${sizeClasses[size]} w-full glass-card-solid p-6 animate-in`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-400 hover:text-surface-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
