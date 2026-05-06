const mongoose = require("mongoose");
const User = require("../server/models/userModel");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");

    const email = "chiragenego@gmail.com";
    let user = await User.findOne({ email });

    if (user) {
      user.isAdmin = true;
      await user.save();
      console.log(`User ${email} is now an admin.`);
    } else {
      console.log(`User ${email} not found. Creating user...`);
      const hashedPassword = await bcrypt.hash("Chirag@123", 10);
      user = new User({
        name: "Chirag",
        email: email,
        password: hashedPassword,
        isAdmin: true,
      });
      await user.save();
      console.log(`User ${email} created as admin with password Chirag@123.`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();
