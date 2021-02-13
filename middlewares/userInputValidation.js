const AppError = require("../util/AppError.js");
const { userValidationSchema } = require("../util/validationSchemas.js");

const userValidation = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(",");

    throw new AppError(message, 400);
  }

  next();
};

module.exports = userValidation;
