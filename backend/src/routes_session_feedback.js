const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { sessionSchema } = require('./schemas/sessions');

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

// POST /api/v1/session/:id/feedback - Update session with post-listening feedback
router.post('/:id/feedback', async (req, res) => {
  try {
    const { id } = req.params;
    const { post_rating, post_feedback } = req.body;

    // Validate rating (1-3)
    if (post_rating && (post_rating < 1 || post_rating > 3)) {
      return res.status(400).json({ 
        error: 'Invalid rating. Must be between 1 and 3' 
      });
    }

    // Prepare update data
    const updateData = {
      post_rating: post_rating || null,
      post_feedback: post_feedback || null,
      completed_at: new Date().toISOString()
    };

        // Update session with feedback
        // Convert string ID to numeric ID
        let numericId = parseInt(id);
        if (isNaN(numericId)) {
          // If not numeric, try to extract numeric part from session-* format
          const match = id.match(/session-(\d+)/);
          if (match) {
            numericId = parseInt(match[1]);
          } else {
            // Try old session_*_* format as fallback
            const oldMatch = id.match(/session_(\d+)_/);
            if (oldMatch) {
              numericId = parseInt(oldMatch[1]);
            } else {
              // Final fallback: extract all digits and take last 10
              numericId = parseInt(id.replace(/\D/g, '').slice(-10)) || Date.now();
            }
          }
        }
    
    const { data, error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('id', numericId)
      .select();

    if (error) {
      console.error('Error updating session feedback:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      session: data[0],
      message: 'Feedback submitted successfully'
    });

  } catch (e) {
    console.error('Error updating session feedback:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

// GET /api/v1/session/:id - Get session details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Looking for session ID:', id);
    
    // Try to find session by exact ID first (in case it's already numeric)
    let numericId = parseInt(id);
    if (isNaN(numericId)) {
      // If not numeric, try to extract numeric part from session-* format
      const match = id.match(/session-(\d+)/);
      if (match) {
        numericId = parseInt(match[1]);
        console.log('🔍 Extracted numeric ID from session- format:', numericId);
      } else {
        // Try old session_*_* format as fallback
        const oldMatch = id.match(/session_(\d+)_/);
        if (oldMatch) {
          numericId = parseInt(oldMatch[1]);
          console.log('🔍 Extracted numeric ID from old session_ format:', numericId);
        } else {
          // Final fallback: extract all digits and take last 10
          numericId = parseInt(id.replace(/\D/g, '').slice(-10)) || Date.now();
          console.log('🔍 Fallback numeric ID:', numericId);
        }
      }
    }
    
    console.log('🔍 Searching for numeric ID:', numericId);
    
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', numericId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return res.status(404).json({ error: 'Session not found' });
      }
      console.error('Error fetching session:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    res.json(data);
  } catch (e) {
    console.error('Error getting session:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

module.exports = router;
