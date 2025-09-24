const Joi = require('joi');

const noteSchema = Joi.object({
  user_id: Joi.string().required(),
  kind: Joi.string().valid('prompt', 'journal', 'voice_note').required(),
  text: Joi.string().required(),
  embedding: Joi.array().items(Joi.number()).optional(), // Vector embedding
  mood: Joi.string().optional(),
  emotions: Joi.array().items(Joi.string()).optional(),
  created_at: Joi.string().optional()
});

module.exports = { noteSchema };
