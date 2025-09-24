const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { noteSchema } = require('./schemas/notes');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const router = express.Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Middleware to check Supabase connection
router.use((req, res, next) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  next();
});

// POST /api/v1/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const { error, value } = noteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: 'Invalid input', details: error.details });
    }

    const { data, error: dbError } = await supabase
      .from('notes')
      .insert([{ id: uuidv4(), ...value }])
      .select();

    if (dbError) {
      console.error('Error inserting note:', dbError);
      return res.status(500).json({ error: 'Database error', details: dbError.message });
    }

    res.status(201).json(data[0]);
  } catch (e) {
    console.error('Error creating note:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

// GET /api/v1/notes/:id - Get a single note
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return res.status(404).json({ error: 'Note not found' });
      }
      console.error('Error fetching note:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    res.json(data);
  } catch (e) {
    console.error('Error getting note:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

// PUT /api/v1/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = noteSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
      return res.status(400).json({ error: 'Invalid input', details: error.details });
    }

    const { data, error: dbError } = await supabase
      .from('notes')
      .update(value)
      .eq('id', id)
      .select();

    if (dbError) {
      console.error('Error updating note:', dbError);
      return res.status(500).json({ error: 'Database error', details: dbError.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(data[0]);
  } catch (e) {
    console.error('Error updating note:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

// DELETE /api/v1/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    res.status(204).send(); // No content
  } catch (e) {
    console.error('Error deleting note:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

// POST /api/v1/notes/similarity - Find similar notes (requires embedding)
router.post('/similarity', async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { embedding, limit = 5 } = req.body;
    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      return res.status(400).json({ error: 'Embedding array required' });
    }
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { data, error } = await supabase.rpc('match_notes', {
      query_embedding: embedding,
      match_user_id: user_id,
      match_threshold: 0.7, // Adjust as needed
      match_count: limit,
    });

    if (error) {
      console.error('Error finding similar notes:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    res.json(data);
  } catch (e) {
    console.error('Error in similarity search:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

// POST /api/v1/notes/:id/embedding - Update embedding for a note
router.post('/:id/embedding', async (req, res) => {
  try {
    const { id } = req.params;
    const { embedding } = req.body;
    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      return res.status(400).json({ error: 'Embedding array required' });
    }

    const { data, error: dbError } = await supabase
      .from('notes')
      .update({ embedding: embedding })
      .eq('id', id)
      .select();

    if (dbError) {
      console.error('Error updating embedding:', dbError);
      return res.status(500).json({ error: 'Database error', details: dbError.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(data[0]);
  } catch (e) {
    console.error('Error updating embedding:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

module.exports = router;
