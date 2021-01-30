const error = (err, req, res, next) => {
  console.log("something");
  res.status(500).send({
    success: false,
  });
};

module.exports = error;
