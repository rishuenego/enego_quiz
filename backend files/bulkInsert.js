const mongoose = require("mongoose");
const csv = require("csvtojson");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");

mongoose.connect("mongodb+srv://harshsengar2005:welcome1234@cluster0.zutegiu.mongodb.net/EnegoQuiz");

async function insertUsers() {
  try {
    const users = await csv().fromFile("./users.csv");

    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
      });
    }

    console.log("Bulk users inserted successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

insertUsers();
