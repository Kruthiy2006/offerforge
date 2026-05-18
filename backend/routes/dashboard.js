const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalOffers] = await db.query('SELECT COUNT(*) as count FROM offers');
    const [acceptedOffers] = await db.query("SELECT COUNT(*) as count FROM offers WHERE status = 'accepted'");
    const [pendingOffers] = await db.query("SELECT COUNT(*) as count FROM offers WHERE status IN ('draft', 'sent')");
    const [rejectedOffers] = await db.query("SELECT COUNT(*) as count FROM offers WHERE status = 'rejected'");
    const [totalCandidates] = await db.query('SELECT COUNT(*) as count FROM candidates');
    const [totalTemplates] = await db.query('SELECT COUNT(*) as count FROM templates');

    // Monthly offer trends (last 6 months)
    const [monthlyTrends] = await db.query(`
      SELECT 
        DATE_FORMAT(generated_at, '%Y-%m') as month,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status IN ('draft', 'sent') THEN 1 ELSE 0 END) as pending
      FROM offers
      WHERE generated_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(generated_at, '%Y-%m')
      ORDER BY month ASC
    `);

    // Status distribution
    const [statusDist] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM offers 
      GROUP BY status
    `);

    // Department distribution
    const [deptDist] = await db.query(`
      SELECT COALESCE(department, 'Other') as department, COUNT(*) as count 
      FROM offers 
      GROUP BY department
      ORDER BY count DESC
      LIMIT 6
    `);

    // Recent offers
    const [recentOffers] = await db.query(`
      SELECT id, candidate_name, candidate_email, role, status, generated_at, salary 
      FROM offers 
      ORDER BY generated_at DESC 
      LIMIT 5
    `);

    // Average salary by department
    const [avgSalary] = await db.query(`
      SELECT COALESCE(department, 'Other') as department, ROUND(AVG(salary)) as avg_salary 
      FROM offers 
      GROUP BY department
      HAVING COUNT(*) > 0
      ORDER BY avg_salary DESC
    `);

    res.json({
      stats: {
        total_offers: totalOffers[0].count,
        accepted_offers: acceptedOffers[0].count,
        pending_offers: pendingOffers[0].count,
        rejected_offers: rejectedOffers[0].count,
        total_candidates: totalCandidates[0].count,
        total_templates: totalTemplates[0].count,
        acceptance_rate: totalOffers[0].count > 0
          ? Math.round((acceptedOffers[0].count / totalOffers[0].count) * 100)
          : 0
      },
      monthly_trends: monthlyTrends,
      status_distribution: statusDist,
      department_distribution: deptDist,
      recent_offers: recentOffers,
      avg_salary_by_dept: avgSalary
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
