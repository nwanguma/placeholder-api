const AppError = require("../utils/AppError.js");
const {
  completedChallengeValidationSchema,
} = require("../utils/validationSchemas.js");

const completedChallengeValidation = (req, res, next) => {
  const { error } = completedChallengeValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

module.exports = completedChallengeValidation;
