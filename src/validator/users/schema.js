const Joi = require('joi');

const UserSchema = Joi.object({
  id: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

module.exports = UserSchema;