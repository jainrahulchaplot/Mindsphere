const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const vectorDB = require('./vector-db-service');
const router = express.Router();

// Initialize Supabase client with service role key to bypass RLS
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Get user snippets
router.get('/', async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { limit = 50, offset = 0 } = req.query;
    
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { data, error } = await supabase
      .from('user_snippets')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error('Error fetching snippets:', error);
      return res.status(500).json({ error: 'Failed to fetch snippets' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error in snippets GET:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new snippet
router.post('/', async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { content } = req.body;
    
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (!content) {
      return res.status(400).json({ 
        error: 'content is required' 
      });
    }

    // Validate content length
    if (content.length > 500) {
      return res.status(400).json({ 
        error: 'Content must be 500 characters or less' 
      });
    }

    console.log('Creating snippet with embedding...');
    const data = await vectorDB.storeSnippet(user_id, content);

    if (!data) {
      return res.status(500).json({ error: 'Failed to create snippet with embedding' });
    }

    console.log('Snippet created successfully with embedding');
    res.status(201).json(data);
  } catch (error) {
    console.error('Error in snippets POST:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update snippet
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ 
        error: 'Content must be 500 characters or less' 
      });
    }

    const updateData = {
      content: content,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_snippets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating snippet:', error);
      return res.status(500).json({ error: 'Failed to update snippet' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in snippets PUT:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete snippet
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('user_snippets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting snippet:', error);
      return res.status(500).json({ error: 'Failed to delete snippet' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in snippets DELETE:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
