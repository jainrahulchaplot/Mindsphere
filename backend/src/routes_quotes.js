const express = require('express');
const router = express.Router();
const { generateMentalHealthQuote } = require('./openai-content-generator');

// GET /api/v1/quotes/mental-health - Get AI-generated mental health quote
router.get('/mental-health', async (req, res) => {
  try {
    console.log('🤖 Generating mental health quote...');
    
    const quote = await generateMentalHealthQuote();
    
    res.json({
      quote: quote,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Mental health quote generation failed:', error.message);
    res.status(500).json({ error: 'Failed to generate mental health quote' });
  }
});

module.exports = router;
