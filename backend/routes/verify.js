const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET verify offer by ID
router.get('/:id', async (req, res) => {
  try {
    const offerId = req.params.id;

    const [rows] = await db.query(
      `SELECT o.id, o.candidate_name, o.candidate_email, o.role, o.department, 
              o.company_name, o.status, o.joining_date, o.generated_at, o.valid_until,
              o.hr_name, o.hr_title
       FROM offers o WHERE o.id = ?`,
      [offerId]
    );

    if (rows.length === 0) {
      return res.json({
        verified: false,
        message: 'No offer found with this ID. The offer may not exist or the ID is incorrect.',
        offer_id: offerId
      });
    }

    const offer = rows[0];
    const isExpired = offer.valid_until && new Date(offer.valid_until) < new Date();

    // Get status history
    const [logs] = await db.query(
      'SELECT new_status, changed_at, note FROM offer_status_logs WHERE offer_id = ? ORDER BY changed_at ASC',
      [offerId]
    );

    res.json({
      verified: true,
      message: 'This is a valid offer letter issued by ' + offer.company_name,
      offer: {
        id: offer.id,
        candidate_name: offer.candidate_name,
        role: offer.role,
        department: offer.department,
        company: offer.company_name,
        status: offer.status,
        joining_date: offer.joining_date,
        issued_date: offer.generated_at,
        valid_until: offer.valid_until,
        is_expired: isExpired,
        issued_by: {
          name: offer.hr_name,
          title: offer.hr_title
        }
      },
      status_history: logs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
