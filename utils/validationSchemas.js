const joi = require("joi");

const userValidationSchema = joi.object({
  username: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const challengeValidationSchema = joi.object({
  title: joi.string().min(3).required(),
  description: joi.string().min(20).required(),
  instructions: joi.string().min(20).required(),
  tags: joi.array(),
  stack: joi.string().required(),
  challengeRepo: joi.string().uri().optional(),
  company: joi.string(),
  companyUrl: joi.string(),
});

const bountyValidationSchema = joi.object({
  title: joi.string().min(3).required(),
  description: joi.string().min(20).required(),
  instructions: joi.string().min(20).required(),
  product: joi.string().required(),
  productUrl: joi.string().uri().required(),
  expiry: joi.string(),
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

const profileValidationSchema = joi.object({
  firstname: joi.string().min(3).required(),
  lastname: joi.string().min(3).required(),
  bio: joi.string().min(3).required(),
  company: joi.string().min(3).required(),
  githubUrl: joi.string().uri().min(3).required(),
  website: joi.string().uri().min(3).required(),
});

const productValidationSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().min(3).required(),
  poster: joi.object({
    firstname: joi.string().min(3).optional(),
    lastname: joi.string().min(3).optional(),
    email: joi.string().email().min(3).optional(),
    twitterUrl: joi.string().uri().min(3).optional(),
    linkedinUrl: joi.string().uri().min(3).optional(),
  }),
  makers: joi
    .array()
    .items(
      joi.object({
        firstname: joi.string().min(3).optional(),
        lastname: joi.string().min(3).optional(),
        email: joi.string().email().min(3).optional(),
        twitterUrl: joi.string().uri().min(3).optional(),
        linkedinUrl: joi.string().uri().min(3).optional(),
      })
    )
    .required(),
});

const jobValidationSchema = joi.object({
  title: joi.string().min(3).required(),
  description: joi.string().min(3).optional(),
  responsibilities: joi.array().items(joi.string()).optional(),
  tags: joi.array().items(joi.string()).optional(),
  stack: joi.string().min(3).optional(),
  qualifications: joi.string().min(3).optional(),
  benefits: joi.string().min(3).optional(),
  company: joi.string().min(3).optional(),
  companyUrl: joi.string().uri().min(3).optional(),
  applicationUrl: joi.string().uri().min(3).optional(),
  location: joi.string().optional(),
});

const blogValidationSchema = joi.object({
  title: joi.string().min(3).required(),
  body: joi.string().min(3).required(),
});

module.exports = {
  userValidationSchema,
  challengeValidationSchema,
  bountyValidationSchema,
  completedChallengeValidationSchema,
  completedBountyValidationSchema,
  profileValidationSchema,
  productValidationSchema,
  jobValidationSchema,
  blogValidationSchema,
};
