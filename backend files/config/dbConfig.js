const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URL;
const maskedUrl = mongoUrl.replace(/\/\/.*@/, "//****:****@");
console.log("Connecting to:", maskedUrl);

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongo Db Connection Successful");
});

connection.on("error", (err) => {
  console.log("Mongo Db Connection Error");
  console.error(err);
});

module.exports = connection;

connection.on("error", (err) => {
  console.log("Mongo Db Connection Error");
  console.error(err);
});

connection.on("disconnected", () => {
  console.log("Mongo Db Disconnected");
});

module.exports = connection;
