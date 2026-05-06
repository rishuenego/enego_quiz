const mongoose = require("mongoose");

const monitorSnapshotSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "exams", required: true },
    sessionId: { type: String, required: true },
    image: { type: String, default: "" },
    questionIndex: { type: Number, default: 0 },
    tabViolations: { type: Number, default: 0 },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

monitorSnapshotSchema.index({ user: 1, exam: 1, sessionId: 1 }, { unique: true });
monitorSnapshotSchema.index({ lastSeenAt: -1 });

module.exports = mongoose.model("monitor_snapshots", monitorSnapshotSchema);
