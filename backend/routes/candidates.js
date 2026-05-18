const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all candidates
router.get('/', async (req, res) => {
  try {
    const { search, status, department } = req.query;
    let query = 'SELECT * FROM candidates WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR current_role LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single candidate
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM candidates WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Candidate not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create candidate
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, current_role, department, experience_years, location, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const [result] = await db.query(
      `INSERT INTO candidates (name, email, phone, current_role, department, experience_years, location, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, current_role || null, department || null, experience_years || 0, location || null, notes || null]
    );

    const [rows] = await db.query('SELECT * FROM candidates WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A candidate with this email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT update candidate
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, current_role, department, experience_years, location, status, notes } = req.body;

    const [existing] = await db.query('SELECT * FROM candidates WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Candidate not found' });

    await db.query(
      `UPDATE candidates SET name=?, email=?, phone=?, current_role=?, department=?, 
       experience_years=?, location=?, status=?, notes=? WHERE id=?`,
      [
        name || existing[0].name,
        email || existing[0].email,
        phone !== undefined ? phone : existing[0].phone,
        current_role !== undefined ? current_role : existing[0].current_role,
        department !== undefined ? department : existing[0].department,
        experience_years !== undefined ? experience_years : existing[0].experience_years,
        location !== undefined ? location : existing[0].location,
        status || existing[0].status,
        notes !== undefined ? notes : existing[0].notes,
        req.params.id
      ]
    );

    const [rows] = await db.query('SELECT * FROM candidates WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE candidate
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM candidates WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Candidate not found' });
    res.json({ message: 'Candidate deleted successfully', id: parseInt(req.params.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
