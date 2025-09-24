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

// Get user memories
router.get('/', async (req, res) => {
  try {
    const user_id = req.user?.id;
    
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { data, error } = await supabase
      .from('user_memories')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching memories:', error);
      return res.status(500).json({ error: 'Failed to fetch memories' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error in memories GET:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new memory
router.post('/', async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { content, category, importance } = req.body;
    
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (!content) {
      return res.status(400).json({ 
        error: 'content is required' 
      });
    }

    console.log('Creating memory with embedding...');
    const data = await vectorDB.storeMemory(user_id, content, category, importance);

    if (!data) {
      return res.status(500).json({ error: 'Failed to create memory with embedding' });
    }

    console.log('Memory created successfully with embedding');
    res.status(201).json(data);
  } catch (error) {
    console.error('Error in memories POST:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update memory
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, category, importance } = req.body;
    
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (importance !== undefined) updateData.importance = importance;

    const { data, error } = await supabase
      .from('user_memories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating memory:', error);
      return res.status(500).json({ error: 'Failed to update memory' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in memories PUT:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete memory
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('user_memories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting memory:', error);
      return res.status(500).json({ error: 'Failed to delete memory' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in memories DELETE:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
