const Joi = require('joi');

const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2100).required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number().integer().min(0).required(),
    albumId: Joi.string().optional(),
});

module.exports = { SongPayloadSchema };
