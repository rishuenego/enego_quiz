const mongoose = require("mongoose");

const recordingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "exams", required: true },
    sessionId: { type: String, required: true },
    videoData: { type: String, required: true }, // base64 webm chunk
    chunkIndex: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("recordings", recordingSchema);
