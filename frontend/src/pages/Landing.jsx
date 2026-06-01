import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi2';
import {
  HiOutlineSparkles, HiOutlineDocumentText, HiOutlineShieldCheck,
  HiOutlineChartBar, HiOutlineClock, HiOutlineUserGroup,
  HiOutlineArrowRight, HiOutlineBolt
} from 'react-icons/hi2';
import { RiFireLine } from 'react-icons/ri';

const features = [
  { icon: HiOutlineSparkles, title: 'AI-Powered Generation', desc: 'Generate professional offer letters using advanced AI language models with role-specific content.' },
  { icon: HiOutlineDocumentText, title: 'Template Builder', desc: 'Create reusable templates with dynamic placeholders for consistent, branded offer letters.' },
  { icon: HiOutlineShieldCheck, title: 'Offer Verification', desc: 'Unique offer IDs enable instant verification of authenticity for candidates and third parties.' },
  { icon: HiOutlineChartBar, title: 'Analytics Dashboard', desc: 'Track offer metrics, acceptance rates, and hiring trends with interactive charts.' },
  { icon: HiOutlineClock, title: 'Status Tracking', desc: 'Monitor offer lifecycle from draft to acceptance with full audit trail and timeline.' },
  { icon: HiOutlineUserGroup, title: 'Candidate Management', desc: 'Maintain a centralized candidate database with search, filter, and status tracking.' },
];

const stats = [
  { value: '10,000+', label: 'Offers Generated' },
  { value: '98.5%', label: 'Delivery Rate' },
  { value: '500+', label: 'Companies Trust Us' },
  { value: '3 sec', label: 'Avg Generation Time' },
];

export default function Landing({ darkMode, toggleDarkMode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-brand">
              <RiFireLine className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900 dark:text-white">OfferForge</span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-500 to-violet-500 text-white uppercase">AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              {darkMode ? <HiSun className="w-5 h-5 text-amber-400" /> : <HiMoon className="w-5 h-5 text-surface-600" />}
            </button>
            <Link to="/dashboard" className="btn-primary text-sm">
              Open Dashboard <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-brand-500/5 to-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 mb-8">
              <HiOutlineBolt className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="text-sm font-medium text-brand-700 dark:text-brand-300">Powered by AI &mdash; Build offers in seconds</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-surface-900 dark:text-white">Smart Offer Letters,</span>
              <br />
              <span className="gradient-text">Forged with AI.</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The all-in-one platform for HR teams to create stunning, professional offer letters.
              AI-powered content, branded templates, PDF export, and instant verification.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="btn-primary px-8 py-3.5 text-base shadow-lg hover:shadow-xl">
                <HiOutlineSparkles className="w-5 h-5" />
                Get Started Free
              </Link>
              <Link to="/verify" className="btn-secondary px-8 py-3.5 text-base">
                Verify an Offer
              </Link>
            </div>
          </motion.div>

          {/* Product preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="glass-card p-2 sm:p-3 max-w-4xl mx-auto">
              <div className="rounded-xl bg-gradient-to-br from-brand-600 via-violet-600 to-brand-700 p-6 sm:p-10 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-white/40 ml-2 font-mono">OfferForge AI Dashboard</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {[
                    { l: 'Total Offers', v: '247' },
                    { l: 'Accepted', v: '189' },
                    { l: 'Pending', v: '38' },
                    { l: 'Rate', v: '76.5%' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-white/60">{s.l}</p>
                      <p className="text-xl sm:text-2xl font-bold text-white mt-1">{s.v}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {['Sarah Chen — Senior Engineer — Accepted', 'James Rodriguez — VP Product — Pending', 'Priya Sharma — Data Scientist — Draft'].map((r, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5">
                      <span className="text-sm text-white/80 font-medium">{r.split(' — ')[0]}</span>
                      <span className="text-xs text-white/50">{r.split(' — ').slice(1).join(' — ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 via-violet-500/20 to-cyan-500/20 rounded-3xl blur-2xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-y border-surface-200/50 dark:border-surface-800/50 bg-surface-50/50 dark:bg-surface-900/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-extrabold gradient-text">{stat.value}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Everything you need to manage offers
            </h2>
            <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
              From creation to verification, OfferForge AI streamlines your entire offer letter workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-solid p-6 hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-brand-700 p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to forge better offers?
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                Start creating professional, AI-powered offer letters today. No credit card required.
              </p>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 font-semibold rounded-xl hover:bg-surface-50 shadow-lg hover:shadow-xl transition-all duration-200 text-base">
                <HiOutlineSparkles className="w-5 h-5" />
                Launch Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <RiFireLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">OfferForge AI</span>
          </div>
          <p className="text-xs text-surface-400 dark:text-surface-500">
            &copy; 2026 OfferForge AI. Built with ❤️ for hackathons.
          </p>
        </div>
      </footer>
    </div>
  );
}
