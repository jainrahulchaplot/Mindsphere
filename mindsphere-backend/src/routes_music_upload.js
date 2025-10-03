require('dotenv').config();
const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const router = Router();

// POST /api/v1/music/upload - Add new track from storage URL
router.post('/upload', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const { title, url, sort_order } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    // Get the next sort order if not provided
    let nextSortOrder = sort_order;
    if (!nextSortOrder) {
      const { data: lastTrack } = await supabase
        .from('music_tracks')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();
      
      nextSortOrder = lastTrack ? lastTrack.sort_order + 1 : 1;
    }

    // Add the new track
    const { data, error } = await supabase
      .from('music_tracks')
      .insert({
        title,
        url,
        sort_order: nextSortOrder
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to add track', detail: error.message });
    }

    console.log(`✅ Added new track: ${title} (ID: ${data.id})`);
    return res.json({ success: true, track: data });

  } catch (e) {
    console.error('music upload error', e);
    return res.status(500).json({ error: 'music_upload_failed', detail: e?.message || String(e) });
  }
});

// GET /api/v1/music/scan-storage - Scan storage bucket for new tracks
router.get('/scan-storage', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // List files in the music bucket
    const { data: files, error: listError } = await supabase.storage
      .from('music')
      .list('ambient', { limit: 100 });

    if (listError) {
      return res.status(500).json({ error: 'Failed to list storage files', detail: listError.message });
    }

    // Get existing tracks
    const { data: existingTracks } = await supabase
      .from('music_tracks')
      .select('url');

    const existingUrls = existingTracks?.map(track => track.url) || [];

    // Find new files
    const newFiles = files.filter(file => {
      const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/music/ambient/${file.name}`;
      return !existingUrls.includes(fileUrl) && file.name.endsWith('.mp3');
    });

    // Add new tracks
    const addedTracks = [];
    for (const file of newFiles) {
      const title = file.name.replace('.mp3', '').replace(/[-_]/g, ' ');
      const url = `${SUPABASE_URL}/storage/v1/object/public/music/ambient/${file.name}`;
      
      const { data, error } = await supabase
        .from('music_tracks')
        .insert({
          title,
          url,
          sort_order: existingTracks.length + addedTracks.length + 1
        })
        .select()
        .single();

      if (!error) {
        addedTracks.push(data);
        console.log(`✅ Auto-added track: ${title} (ID: ${data.id})`);
      }
    }

    return res.json({ 
      success: true, 
      newFiles: newFiles.length,
      addedTracks: addedTracks.length,
      tracks: addedTracks
    });

  } catch (e) {
    console.error('scan storage error', e);
    return res.status(500).json({ error: 'scan_failed', detail: e?.message || String(e) });
  }
});

module.exports = router;
