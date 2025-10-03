const Joi = require('joi');

// Helper to calculate word count
function calculateWordCount(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Helper to prepare session data for insertion/update
function prepareSessionForInsert(sessionData) {
  return {
    ...sessionData,
    created_at: sessionData.created_at || new Date().toISOString()
  };
}

// Session schema for validation
const sessionSchema = Joi.object({
  id: Joi.string().optional(),
  user_id: Joi.string().required(),
  kind: Joi.string().valid('meditation', 'sleep_story').required(),
  mood: Joi.string().optional(),
  style: Joi.string().optional(),
  duration: Joi.number().integer().min(1).max(60).optional(), // in minutes
  duration_sec: Joi.number().integer().optional(), // calculated duration in seconds
  words: Joi.number().integer().optional(), // word count of generated content
  prompt: Joi.string().optional(), // original user prompt/notes
  script: Joi.string().optional(), // generated script content
  user_notes: Joi.string().optional(), // additional user notes
  audio_url: Joi.string().uri().optional(),
  created_at: Joi.string().optional(),
  // Pre-listening data
  selected_duration: Joi.number().integer().optional(), // selected duration in minutes
  selected_type: Joi.string().valid('meditation', 'sleep_story').optional(),
  additional_notes: Joi.string().optional(),
  // Post-listening feedback
  post_rating: Joi.number().integer().min(1).max(3).optional(), // 1=feel bad, 2=no improvement, 3=feel good
  post_feedback: Joi.string().optional(), // free text feedback
  feedback_embedding: Joi.array().items(Joi.number()).optional(), // vector embedding of feedback
  completed_at: Joi.string().optional()
});

module.exports = { 
  calculateWordCount, 
  prepareSessionForInsert, 
  sessionSchema 
};
