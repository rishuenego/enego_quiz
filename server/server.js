const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
app.use(express.json({ limit: "50mb" }));
// const dbConfig = require("./config/dbConfig"); // Handled in server.js now

const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const reportsRoute = require("./routes/reportsRoute");
const monitorRoute = require("./routes/monitorRoute");
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://quiz.enego.co.in",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", reportsRoute);
app.use("/api/monitor", monitorRoute);
const port = process.env.PORT || 3021;

const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client" , "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });   
} 

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).send({
    message: err.message,
    data: err,
    success: false,
  });
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Mongo Db Connection Successful");
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch((err) => {
  console.log("Mongo Db Connection Failed");
  console.error(err);
});

// Triggering nodemon restart to pick up .env changes
