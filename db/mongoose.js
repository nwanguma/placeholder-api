const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/defi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
