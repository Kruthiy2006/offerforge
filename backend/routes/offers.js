const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { generateOfferContent } = require('../services/aiService');
const { generatePDF } = require('../services/pdfService');

// GET all offers
router.get('/', async (req, res) => {
  try {
    const { status, search, limit } = req.query;
    let query = `SELECT o.*, c.phone as candidate_phone, t.name as template_name 
                 FROM offers o 
                 LEFT JOIN candidates c ON o.candidate_id = c.id
                 LEFT JOIN templates t ON o.template_id = t.id
                 WHERE 1=1`;
    const params = [];

    if (status && status !== 'all') {
      query += ' AND o.status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (o.candidate_name LIKE ? OR o.candidate_email LIKE ? OR o.role LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY o.generated_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single offer
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.*, t.name as template_name, t.content as template_content 
       FROM offers o 
       LEFT JOIN templates t ON o.template_id = t.id
       WHERE o.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Offer not found' });

    // Get status logs
    const [logs] = await db.query(
      'SELECT * FROM offer_status_logs WHERE offer_id = ? ORDER BY changed_at ASC',
      [req.params.id]
    );

    const offer = rows[0];
    offer.benefits = typeof offer.benefits === 'string' ? JSON.parse(offer.benefits) : offer.benefits;
    offer.status_logs = logs;

    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create offer
// POST create offer
router.post('/', async (req, res) => {
  try {
    const {
      candidate_name,
      candidate_email,
      role,
      salary,
      joining_date,
      company_name,
      hr_name
    } = req.body;

    if (
      !candidate_name ||
      !candidate_email ||
      !role ||
      !salary ||
      !joining_date ||
      !company_name ||
      !hr_name
    ) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const offerId = uuidv4();

    const content = `
Dear ${candidate_name},

We are pleased to offer you the position of ${role} at ${company_name}.

Annual Compensation: $${salary}

Joining Date: ${joining_date}

We are excited to welcome you to our organization and look forward to your contribution to the company’s continued success.

Best Regards,
${hr_name}
${company_name}
`;

    await db.query(
      `
      INSERT INTO offers
      (
        id,
        candidate_name,
        candidate_email,
        role,
        salary,
        joining_date,
        company_name,
        hr_name,
        content,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        offerId,
        candidate_name,
        candidate_email,
        role,
        salary,
        joining_date,
        company_name,
        hr_name,
        content,
        'draft'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Offer generated successfully',
      offerId
    });

  } catch (err) {
    console.error('Offer creation error:', err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// PATCH update offer status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, note, changed_by } = req.body;
    const validStatuses = ['draft', 'sent', 'accepted', 'rejected', 'expired', 'revoked'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const [existing] = await db.query('SELECT * FROM offers WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Offer not found' });

    const oldStatus = existing[0].status;

    await db.query('UPDATE offers SET status = ? WHERE id = ?', [status, req.params.id]);

    // Log the status change
    await db.query(
      'INSERT INTO offer_status_logs (offer_id, old_status, new_status, changed_by, note) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, oldStatus, status, changed_by || 'System', note || `Status changed from ${oldStatus} to ${status}`]
    );

    // Update candidate status if accepted
    if (status === 'accepted' && existing[0].candidate_id) {
      await db.query('UPDATE candidates SET status = ? WHERE id = ?', ['hired', existing[0].candidate_id]);
    }

    const [rows] = await db.query('SELECT * FROM offers WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET offer PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM offers WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    const offer = rows[0];

    const PDFDocument = require('pdfkit');

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=OfferLetter_${offer.candidate_name}.pdf`
    );

    doc.pipe(res);

    // HEADER
    doc
      .fontSize(24)
      .fillColor('#6C4CF1')
      .text(offer.company_name || 'OfferForge', {
        align: 'center'
      });

    doc.moveDown();

    // TITLE
    doc
      .fontSize(18)
      .fillColor('black')
      .text('OFFICIAL OFFER LETTER', {
        align: 'center'
      });

    doc.moveDown(2);







// DATE
doc
  .fontSize(11)
  .fillColor('black')
  .text(`Date: ${new Date().toDateString()}`, {
    align: 'right'
  });

doc.moveDown(2);

// SALUTATION
doc
  .fontSize(12)
  .text(`Dear Mr./Ms. ${offer.candidate_name},`);

doc.moveDown();

// INTRO
doc.text(
  `Congratulations on being selected for the position of ${offer.role} at ${offer.company_name}. We are pleased to extend this formal offer of employment based on your qualifications, skills, and performance during the recruitment process.`
);

doc.moveDown();

doc.text(
  `At ${offer.company_name}, we believe in innovation, teamwork, and professional growth. We are confident that your contribution will play an important role in helping the company achieve its goals and objectives.`
);

doc.moveDown();

doc.text(
  `This offer letter outlines the terms and conditions of your employment with the organization. Please review the following details carefully.`
);

doc.moveDown(2);

// POSITION DETAILS
doc
  .fontSize(15)
  .fillColor('#6C4CF1')
  .text('POSITION DETAILS');

doc.moveDown();

doc
  .fontSize(12)
  .fillColor('black');

doc.text(`Position: ${offer.role}`);
doc.text(`Company: ${offer.company_name}`);
doc.text(`Employment Type: Full-Time`);
doc.text(`Annual Salary: $${offer.salary}`);
doc.text(`Joining Date: ${new Date(offer.joining_date).toDateString()}`);
doc.text(`Work Location: ${offer.company_name} Headquarters`);

doc.moveDown(2);

// BENEFITS
doc
  .fontSize(15)
  .fillColor('#6C4CF1')
  .text('EMPLOYEE BENEFITS');

doc.moveDown();

doc
  .fontSize(12)
  .fillColor('black');

doc.text('• Comprehensive Health Insurance');
doc.text('• Paid Vacation and Sick Leave');
doc.text('• Performance-Based Incentives');
doc.text('• Flexible and Hybrid Work Opportunities');
doc.text('• Learning & Development Programs');
doc.text('• Retirement and Wellness Benefits');

doc.moveDown(2);

// TERMS
doc
  .fontSize(15)
  .fillColor('#6C4CF1')
  .text('TERMS & CONDITIONS');

doc.moveDown();

doc
  .fontSize(12)
  .fillColor('black');

doc.text(
  `1. This employment offer is subject to successful completion of background verification and submission of all required documents.`
);

doc.moveDown();

doc.text(
  `2. You will be expected to comply with all organizational rules, confidentiality agreements, and professional ethics throughout your employment period.`
);

doc.moveDown();

doc.text(
  `3. Any disclosure of confidential company information during or after employment may lead to disciplinary action or termination.`
);

doc.moveDown();

doc.text(
  `4. Your employment may be terminated in accordance with company policies and applicable employment laws.`
);

doc.moveDown();

doc.text(
  `5. Please sign and return a copy of this offer letter as confirmation of your acceptance of the position.`
);

doc.moveDown(3);

// NEW PAGE
doc.addPage();

// AGREEMENT PAGE
doc
  .fontSize(18)
  .fillColor('#6C4CF1')
  .text('EMPLOYMENT AGREEMENT', {
    align: 'center'
  });

doc.moveDown(2);

doc
  .fontSize(12)
  .fillColor('black');

doc.text(
  `I, ${offer.candidate_name}, hereby accept the employment offer provided by ${offer.company_name} for the position of ${offer.role}.`
);

doc.moveDown();

doc.text(
  `I agree to perform my duties responsibly, maintain professional conduct, and comply with all organizational policies and procedures.`
);

doc.moveDown();

doc.text(
  `I understand that this offer is subject to the terms and conditions mentioned in this document and acknowledge that violation of company policies may result in disciplinary action.`
);

doc.moveDown();

doc.text(
  `I also understand that my employment is contingent upon the accuracy of the information provided during the hiring process.`
);

doc.moveDown(5);

// SIGNATURES
doc.text('____________________________');
doc.text(offer.hr_name || 'HR Manager');

doc.moveDown(4);

doc.text('____________________________');
doc.text(offer.candidate_name);

doc.moveDown(4);

// FOOTER
doc
  .fontSize(10)
  .fillColor('gray')
  .text(
    `${offer.company_name} • Official Offer Letter`,
    {
      align: 'center'
    }
  );

doc.end();

  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Fallback content generator
function generateFallbackContent(data) {
  const { candidate_name, role, department, salary, joining_date, company_name, hr_name, hr_title, validUntil } = data;
  const formattedSalary = `$${parseFloat(salary).toLocaleString()}`;
  const formattedDate = new Date(joining_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedValidUntil = validUntil instanceof Date ? validUntil.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : validUntil;

  return `Dear ${candidate_name},

We are delighted to extend this formal offer of employment for the position of ${role} in the ${department || 'General'} department at ${company_name}.

After a thorough evaluation of your qualifications, experience, and potential contributions, we are confident that you will be an exceptional addition to our organization. Your expertise aligns perfectly with our strategic objectives, and we are eager to have you join our team.

POSITION DETAILS:
- Position: ${role}
- Department: ${department || 'General'}
- Start Date: ${formattedDate}
- Employment Type: Full-time
- Location: ${company_name} Headquarters

COMPENSATION:
Your annual base salary will be ${formattedSalary}, paid on a bi-weekly basis through direct deposit. Your compensation package also includes eligibility for our annual performance bonus program.

BENEFITS:
As a valued member of our team, you will have access to our comprehensive benefits package, including health insurance, retirement plan with company matching, paid time off, professional development opportunities, and more.

This offer is contingent upon successful completion of a background verification and any other pre-employment requirements.

We kindly request your response by ${formattedValidUntil}. If you have any questions, please do not hesitate to reach out.

We look forward to welcoming you aboard!

Sincerely,
${hr_name}
${hr_title || 'Head of Human Resources'}
${company_name}`;
}

module.exports = router;
