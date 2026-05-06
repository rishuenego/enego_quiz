const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "exams",
    },
    result: {
      type: Object,
      required: true,
    },
    questionTimings: {
      type: Object,
      default: {},
    },
    tabViolations: {
      type: Number,
      default: 0,
    },
    cameraGranted: {
      type: Boolean,
      default: false,
    },
    totalTime: {
      type: Number,
      default: 0,
    },
    sessionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("reports", reportSchema);

module.exports = Report;
