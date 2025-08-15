const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2100).required(),
});

const CoverUploadSchema = Joi.object({
  'content-type': Joi.string()
    .valid('image/jpeg', 'image/png', 'image/jpg', 'image/webp')
    .required(),
  'content-length': Joi.number()
    .max(512000)
    .required(),
});

module.exports = {
  AlbumPayloadSchema,
  CoverUploadSchema,
};
