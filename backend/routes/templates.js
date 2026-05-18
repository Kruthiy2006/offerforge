const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all templates
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM templates';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);

    // Parse placeholders JSON
    const templates = rows.map(t => ({
      ...t,
      placeholders: typeof t.placeholders === 'string' ? JSON.parse(t.placeholders) : t.placeholders
    }));

    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single template
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM templates WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Template not found' });

    const template = {
      ...rows[0],
      placeholders: typeof rows[0].placeholders === 'string' ? JSON.parse(rows[0].placeholders) : rows[0].placeholders
    };

    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create template
router.post('/', async (req, res) => {
  try {
    const { name, description, content, category, is_premium, placeholders } = req.body;

    if (!name || !content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }

    // Auto-detect placeholders from content
    const detectedPlaceholders = [...new Set(
      (content.match(/\{\{(\w+)\}\}/g) || []).map(p => p.replace(/\{\{|\}\}/g, ''))
    )];

    const finalPlaceholders = placeholders || detectedPlaceholders;

    const [result] = await db.query(
      `INSERT INTO templates (name, description, content, category, is_premium, placeholders) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || null, content, category || 'general', is_premium || false, JSON.stringify(finalPlaceholders)]
    );

    const [rows] = await db.query('SELECT * FROM templates WHERE id = ?', [result.insertId]);
    res.status(201).json({
      ...rows[0],
      placeholders: finalPlaceholders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update template
router.put('/:id', async (req, res) => {
  try {
    const { name, description, content, category, is_premium } = req.body;

    const [existing] = await db.query('SELECT * FROM templates WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Template not found' });

    const updatedContent = content || existing[0].content;
    const detectedPlaceholders = [...new Set(
      (updatedContent.match(/\{\{(\w+)\}\}/g) || []).map(p => p.replace(/\{\{|\}\}/g, ''))
    )];

    await db.query(
      `UPDATE templates SET name=?, description=?, content=?, category=?, is_premium=?, placeholders=? WHERE id=?`,
      [
        name || existing[0].name,
        description !== undefined ? description : existing[0].description,
        updatedContent,
        category || existing[0].category,
        is_premium !== undefined ? is_premium : existing[0].is_premium,
        JSON.stringify(detectedPlaceholders),
        req.params.id
      ]
    );

    const [rows] = await db.query('SELECT * FROM templates WHERE id = ?', [req.params.id]);
    res.json({
      ...rows[0],
      placeholders: detectedPlaceholders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE template
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM templates WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Template not found' });
    res.json({ message: 'Template deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
