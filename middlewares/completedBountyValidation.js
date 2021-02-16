const AppError = require("../utils/AppError.js");
const {
  completedBountyValidationSchema,
} = require("../utils/validationSchemas.js");

const completedBountyValidation = (req, res, next) => {
  const { error } = completedBountyValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

module.exports = completedBountyValidation;
