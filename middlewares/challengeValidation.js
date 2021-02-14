const AppError = require("../utils/AppError.js");
const { challengeValidationSchema } = require("../utils/validationSchemas.js");

const challengeValidation = (req, res, next) => {
  const { error } = challengeValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

module.exports = challengeValidation;
