const authMiddleware = require("../middlewares/authMiddleware");
const Exam = require("../models/examModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const router = require("express").Router();

// add report

router.post("/add-report", authMiddleware, async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.send({
      message: "Attempt added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all reports
router.post("/get-all-reports", authMiddleware, async (req, res) => {
  try {
    const {
      examName = "",
      userName = "",
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.body;
    const skip = (page - 1) * limit;

    const exams = await Exam.find({
      name: { $regex: examName, $options: "i" },
    });
    const matchedExamIds = exams.map((exam) => exam._id);

    const users = await User.find({
      name: { $regex: userName, $options: "i" },
    });
    const matchedUserIds = users.map((user) => user._id);

    const query = {
      exam: { $in: matchedExamIds },
      user: { $in: matchedUserIds },
    };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const reports = await Report.find(query)
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Report.countDocuments(query);

    res.send({
      message: "Attempts fetched successfully",
      data: { reports, totalCount },
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all reports by user
router.post("/get-all-reports-by-user", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;

    const query = { user: req.body.userId };
    const reports = await Report.find(query)
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Report.countDocuments(query);

    res.send({
      message: "Attempts fetched successfully",
      data: {
        reports,
        totalCount,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get report by id
router.post("/get-report-by-id", authMiddleware, async (req, res) => {
  try {
    const report = await Report.findById(req.body.reportId)
      .populate({
        path: "exam",
        populate: {
          path: "questions"
        }
      })
      .populate("user");
    res.send({
      message: "Report fetched successfully",
      data: report,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

module.exports = router;
