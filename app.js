const express = require("express");
require("dotenv").config();
const mongoose = require("./db/mongoose.js");
const bodyParser = require("body-parser");
const cors = require("cors");

const users = require("./routes/users.js");
const challenges = require("./routes/challenges.js");
const bounties = require("./routes/bounties.js");
const jobs = require("./routes/jobs");
const profile = require("./routes/profile.js");
const blog = require("./routes/blog.js");
const product = require("./routes/products.js");

const error = require("./middlewares/error.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/v1/user", users);
app.use("/api/v1/challenges", challenges);
app.use("/api/v1/bounties", bounties);
app.use("/api/v1/profile", profile);
app.use("/api/v1/jobs", jobs);
app.use("/api/v1/blog", blog);
app.use("/api/v1/products", product);

app.use((err, req, res, next) => {
  if (err.name === "CastError")
    res.status(400).send({
      success: false,
      message: "Id parameter is invalid",
    });

  if (err.name === "MongoError")
    res.status(400).send({
      success: false,
    });

  console.log(err);

  next(err);
});

app.use(error);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
