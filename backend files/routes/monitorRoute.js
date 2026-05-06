const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const MonitorSnapshot = require("../models/monitorModel");
const Recording = require("../models/recordingModel");
const User = require("../models/userModel");

// upsert latest snapshot for an active session
router.post("/snapshot", authMiddleware, async (req, res) => {
  try {
    const { exam, sessionId, image, questionIndex, tabViolations } = req.body;
    const userId = req.body.userId;
    if (!exam || !sessionId) {
      return res
        .status(200)
        .send({ message: "exam and sessionId are required", success: false });
    }
    await MonitorSnapshot.findOneAndUpdate(
      { user: userId, exam, sessionId },
      {
        user: userId,
        exam,
        sessionId,
        image: image || "",
        questionIndex: questionIndex || 0,
        tabViolations: tabViolations || 0,
        lastSeenAt: new Date(),
      },
      { upsert: true, new: true }
    );
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// admin: list active sessions (heartbeat in last 30s)
router.post("/active-sessions", authMiddleware, async (req, res) => {
  try {
    const me = await User.findById(req.body.userId);
    if (!me || !me.isAdmin) {
      return res
        .status(403)
        .send({ message: "Admin only", success: false });
    }
    const cutoff = new Date(Date.now() - 30 * 1000);
    const sessions = await MonitorSnapshot.find({ lastSeenAt: { $gte: cutoff } })
      .populate("user", "name email")
      .populate("exam", "name stage")
      .sort({ lastSeenAt: -1 });
    res.send({ success: true, data: sessions });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// student or admin: end a session (clears the snapshot row)
router.post("/end-session", authMiddleware, async (req, res) => {
  try {
    const { exam, sessionId } = req.body;
    await MonitorSnapshot.deleteOne({
      user: req.body.userId,
      exam,
      sessionId,
    });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// student: save a video/audio chunk
router.post("/save-recording-chunk", authMiddleware, async (req, res) => {
  try {
    const { exam, sessionId, videoData, chunkIndex } = req.body;
    const userId = req.body.userId;
    if (!exam || !sessionId || !videoData) {
      return res.status(200).send({ message: "Invalid payload", success: false });
    }
    const recording = new Recording({
      user: userId,
      exam,
      sessionId,
      videoData,
      chunkIndex,
    });
    await recording.save();
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
});

// admin: get recordings for a specific session
router.post("/get-recordings", authMiddleware, async (req, res) => {
  try {
    const me = await User.findById(req.body.userId);
    if (!me || !me.isAdmin) {
      return res.status(403).send({ message: "Admin only", success: false });
    }
    const { sessionId } = req.body;
    const recordings = await Recording.find({ sessionId }).sort({ chunkIndex: 1 });
    res.send({ success: true, data: recordings });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
});

// admin: get all unique recording sessions
router.get("/recorded-sessions", authMiddleware, async (req, res) => {
  try {
    const me = await User.findById(req.body.userId);
    if (!me || !me.isAdmin) {
      return res.status(403).send({ message: "Admin only", success: false });
    }
    
    const sessions = await Recording.aggregate([
      {
        $group: {
          _id: "$sessionId",
          user: { $first: "$user" },
          exam: { $first: "$exam" },
          createdAt: { $first: "$createdAt" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    
    // Populate user and exam
    const populated = await Recording.populate(sessions, [
      { path: "user", select: "name email" },
      { path: "exam", select: "name stage" }
    ]);

    res.send({ success: true, data: populated });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
});

module.exports = router;
