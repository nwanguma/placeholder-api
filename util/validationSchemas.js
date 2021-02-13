const Joi = require("joi");
const joi = require("joi");

const userValidationSchema = joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

module.exports = {
  userValidationSchema,
};
