const AppError = require("../utils/AppError.js");
const {
  userValidationSchema,
  bountyValidationSchema,
  challengeValidationSchema,
  completedBountyValidationSchema,
  completedChallengeValidationSchema,
  productValidationSchema,
  profileValidationSchema,
  jobValidationSchema,
  blogValidationSchema,
} = require("../utils/validationSchemas.js");

const userValidation = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

const bountyValidation = (req, res, next) => {
  const { error } = bountyValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

const challengeValidation = (req, res, next) => {
  const { error } = challengeValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

const completedBountyValidation = (req, res, next) => {
  const { error } = completedBountyValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

const completedChallengeValidation = (req, res, next) => {
  const { error } = completedChallengeValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

const productValidation = (req, res, next) => {
  const { error } = productValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

const profileValidation = (req, res, next) => {
  const { error } = profileValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

const jobValidation = (req, res, next) => {
  const { error } = jobValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

const blogValidation = (req, res, next) => {
  const { error } = blogValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

module.exports = {
  bountyValidation,
  challengeValidation,
  completedBountyValidation,
  completedChallengeValidation,
  productValidation,
  userValidation,
  profileValidation,
  jobValidation,
  blogValidation,
};
