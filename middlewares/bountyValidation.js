const AppError = require("../utils/AppError.js");
const { bountyValidationSchema } = require("../utils/validationSchemas.js");

const bountyValidation = (req, res, next) => {
  const { error } = bountyValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

module.exports = bountyValidation;
