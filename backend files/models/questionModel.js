const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  name_hi: {
    type: String,
  },
  correctOption: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  options_hi: {
    type: Object,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exams",
  },
}, {
    timestamps: true,
});

const Question = mongoose.model("questions", questionSchema);
module.exports = Question;
