import { motion } from 'framer-motion';

export default function StatsCard({ title, value, change, icon: Icon, color = 'brand', index = 0 }) {
  const colorMap = {
    brand: {
      bg: 'bg-brand-50 dark:bg-brand-900/20',
      icon: 'text-brand-600 dark:text-brand-400',
      ring: 'ring-brand-200 dark:ring-brand-800',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      icon: 'text-emerald-600 dark:text-emerald-400',
      ring: 'ring-emerald-200 dark:ring-emerald-800',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      icon: 'text-amber-600 dark:text-amber-400',
      ring: 'ring-amber-200 dark:ring-amber-800',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
      ring: 'ring-red-200 dark:ring-red-800',
    },
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      icon: 'text-violet-600 dark:text-violet-400',
      ring: 'ring-violet-200 dark:ring-violet-800',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      icon: 'text-cyan-600 dark:text-cyan-400',
      ring: 'ring-cyan-200 dark:ring-cyan-800',
    },
  };

  const colors = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{title}</p>
          <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              </span>
              <span className="text-xs text-surface-400">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colors.bg} ring-1 ${colors.ring} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
