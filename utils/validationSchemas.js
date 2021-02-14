const Joi = require("joi");
const joi = require("joi");

const userValidationSchema = joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

const challengeValidationSchema = joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(20).required(),
  instructions: Joi.string().min(20).required(),
  tags: Joi.array(),
  stack: Joi.string().required(),
  challengeRepo: Joi.string().uri(),
  company: Joi.string(),
  companyUrl: Joi.string(),
});

const bountyValidationSchema = joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(20).required(),
  instructions: Joi.string().min(20).required(),
  product: Joi.string().required(),
  productUrl: Joi.string().uri().required(),
});

module.exports = {
  userValidationSchema,
  challengeValidationSchema,
  bountyValidationSchema,
};
