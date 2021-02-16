const Joi = require("joi");
const joi = require("joi");

const userValidationSchema = joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const challengeValidationSchema = joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(20).required(),
  instructions: Joi.string().min(20).required(),
  tags: Joi.array(),
  stack: Joi.string().required(),
  challengeRepo: Joi.string().uri().optional(),
  company: Joi.string(),
  companyUrl: Joi.string(),
});

const bountyValidationSchema = joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(20).required(),
  instructions: Joi.string().min(20).required(),
  product: Joi.string().required(),
  productUrl: Joi.string().uri().required(),
  expiry: Joi.string(),
});

const completedChallengeValidationSchema = joi.object({
  comments: joi.string().min(20),
  challengeRepo: joi.string().uri().required(),
  website: joi.string().uri(),
  githubUrl: joi.string().uri(),
  employmentStatus: joi.bool().optional(),
});

const completedBountyValidationSchema = joi.object({
  name: joi.string().min(6).required(),
  title: joi.string().uri().required(),
  domain: joi.string().uri().required(),
  subdomain: joi.string().uri().required(),
  description: joi.string().uri().required(),
  stepsToReproduce: joi.string().uri().required(),
  impact: joi.string().uri().required(),
});

module.exports = {
  userValidationSchema,
  challengeValidationSchema,
  bountyValidationSchema,
  completedChallengeValidationSchema,
  completedBountyValidationSchema,
};
