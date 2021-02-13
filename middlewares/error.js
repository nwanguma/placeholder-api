const error = (err, req, res, next) => {
  const { status, message } = err;

  res.status(status).send({
    success: false,
    message,
  });
};

module.exports = error;
