const router = require("express").Router();
const Exam = require("../models/examModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Question = require("../models/questionModel");
const Report = require("../models/reportModel");
const csv = require("csvtojson");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleQuestionOptions(question) {
  const q = question.toObject ? question.toObject() : { ...question };
  const optionKeys = Object.keys(q.options || {});
  if (!optionKeys.length || !q.correctOption) return q;
  const correctValue = q.options[q.correctOption];
  const shuffledValues = shuffle(optionKeys.map((k) => q.options[k]));
  const newOptions = {};
  optionKeys.forEach((k, i) => (newOptions[k] = shuffledValues[i]));
  q.options = newOptions;
  q.correctOption = optionKeys.find((k) => newOptions[k] === correctValue);
  return q;
}

// add exam

router.post("/add", authMiddleware, async (req, res) => {
  try {
    // check if exam already exists
    const examExists = await Exam.findOne({ name: req.body.name });
    if (examExists) {
      return res
        .status(200)
        .send({ message: "Exam already exists", success: false });
    }
    req.body.questions = [];
    const newExam = new Exam(req.body);
    await newExam.save();
    res.send({
      message: "Exam added successfully",
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

// get all exams
router.post("/get-all-exams", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;
    
    const exams = await Exam.find({});
    
    // Sort logic to handle "Level 10" > "Level 2" correctly
    const sortedExams = [...exams].sort((a, b) => {
      const stageA = a.stage || 1;
      const stageB = b.stage || 1;
      if (stageA !== stageB) return stageA - stageB;
      const getLevel = (name) => {
        const match = name.match(/Level\s*(\d+)/i);
        return match ? parseInt(match[1]) : name;
      };
      const levelA = getLevel(a.name);
      const levelB = getLevel(b.name);
      if (typeof levelA === 'number' && typeof levelB === 'number') return levelA - levelB;
      return a.name.localeCompare(b.name);
    });

    const totalCount = sortedExams.length;
    const paginatedExams = sortedExams.slice(skip, skip + limit);
    
    res.send({
      message: "Exams fetched successfully",
      data: {
        exams: paginatedExams,
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

// get exam by id (questions + options shuffled per request so each user sees a different order)
router.post("/get-exam-by-id", authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.examId).populate("questions");
    if (!exam) {
      return res
        .status(200)
        .send({ message: "Exam not found", success: false });
    }
    const examObj = exam.toObject();
    examObj.questions = shuffle(examObj.questions).map(shuffleQuestionOptions);
    res.send({
      message: "Exam fetched successfully",
      data: examObj,
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

// stage/lock status: returns map of examId -> { passed, attempted } for the current user
router.post("/get-exam-status-for-user", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const exams = await Exam.find({});
    const reports = await Report.find({ user: userId });

    const passedByExam = {};
    const attemptedByExam = {};
    for (const r of reports) {
      const eid = String(r.exam);
      if (r.result && r.result.verdict === "Pass") passedByExam[eid] = true;
      attemptedByExam[eid] = true;
    }

    let maxPassedStage = 0;
    for (const e of exams) {
      if (passedByExam[String(e._id)]) {
        if (e.stage > maxPassedStage) maxPassedStage = e.stage;
      }
    }

    const user = await User.findById(userId);
    const isAdmin = user && user.isAdmin;

    const status = {};
    
    // Sort exams to determine strict sequence: Stage first, then Name (for Levels)
    const sortedExams = [...exams].sort((a, b) => {
      const stageA = a.stage || 1;
      const stageB = b.stage || 1;
      if (stageA !== stageB) return stageA - stageB;
      // Extract Level number if present for better sorting, e.g., "Level 10" should be after "Level 2"
      const getLevel = (name) => {
        const match = name.match(/Level\s*(\d+)/i);
        return match ? parseInt(match[1]) : name;
      };
      const levelA = getLevel(a.name);
      const levelB = getLevel(b.name);
      if (typeof levelA === 'number' && typeof levelB === 'number') {
        return levelA - levelB;
      }
      return a.name.localeCompare(b.name);
    });

    let firstAvailableFound = false;

    for (const e of sortedExams) {
      const id = String(e._id);
      const isAttempted = !!attemptedByExam[id];
      const isPassed = !!passedByExam[id];
      
      let locked = true;
      
      if (isAdmin) {
        locked = false;
      } else {
        // Unlock if it's already passed (to let them see it)
        if (isPassed) {
          locked = false;
        } 
        // Unlock the first available exam that hasn't been passed yet
        else if (!firstAvailableFound) {
          locked = false;
          firstAvailableFound = true;
        }
      }

      status[id] = {
        stage: e.stage || 1,
        passed: isPassed,
        attempted: isAttempted,
        locked: locked,
        prerequisiteExam: e.prerequisiteExam || null,
      };
    }
    res.send({ success: true, data: status });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// bulk upload questions from CSV text. CSV header: name,correctOption,A,B,C,D
router.post("/bulk-upload-questions", authMiddleware, async (req, res) => {
  try {
    const { examId, csvText } = req.body;
    if (!examId || !csvText) {
      return res
        .status(200)
        .send({ message: "examId and csvText are required", success: false });
    }
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res
        .status(200)
        .send({ message: "Exam not found", success: false });
    }

    const rows = await csv().fromString(csvText);
    const created = [];
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const name = (r.name || r.question || "").trim();
      const name_hi = (r.name_hi || r.question_hi || r.name_hindi || "").trim();
      const correctOption = (r.correctOption || r.correct || "").trim().toUpperCase();
      
      const options = {};
      ["A", "B", "C", "D"].forEach((k) => {
        if (r[k] != null && r[k] !== "") options[k] = String(r[k]);
      });

      const options_hi = {};
      ["A", "B", "C", "D"].forEach((k) => {
        const hiKey = `${k}_hi`;
        const hindiKey = `${k}_hindi`;
        const val = r[hiKey] || r[hindiKey];
        if (val != null && val !== "") options_hi[k] = String(val);
      });

      if (!name || !correctOption || !options[correctOption]) {
        errors.push({ row: i + 2, reason: "missing name/correctOption or correctOption value" });
        continue;
      }

      const qPayload = { name, correctOption, options, exam: examId };
      if (name_hi) qPayload.name_hi = name_hi;
      if (Object.keys(options_hi).length > 0) qPayload.options_hi = options_hi;

      const q = await new Question(qPayload).save();
      created.push(q._id);
    }
    if (created.length) {
      exam.questions = [...exam.questions, ...created];
      await exam.save();
    }
    res.send({
      message: `Uploaded ${created.length} question(s)${errors.length ? `, ${errors.length} skipped` : ""}`,
      success: true,
      data: { created: created.length, errors },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// edit exam by id
router.post("/edit-exam-by-id", authMiddleware, async (req, res) => {
  try {
    await Exam.findByIdAndUpdate(req.body.examId, req.body);
    res.send({
      message: "Exam edited successfully",
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

// delete exam by id
router.post("/delete-exam-by-id", authMiddleware, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.body.examId);
    res.send({
      message: "Exam deleted successfully",
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

// add question to exam

router.post("/add-question-to-exam", authMiddleware, async (req, res) => {
  try {
    // add question to Questions collection
    const newQuestion = new Question(req.body);
    const question = await newQuestion.save();

    // add question to exam
    const exam = await Exam.findById(req.body.exam);
    exam.questions.push(question._id);
    await exam.save();
    res.send({
      message: "Question added successfully",
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

// edit question in exam
router.post("/edit-question-in-exam", authMiddleware, async (req, res) => {
  try {
    // edit question in Questions collection
    await Question.findByIdAndUpdate(req.body.questionId, req.body);
    res.send({
      message: "Question edited successfully",
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


// delete question in exam
router.post("/delete-question-in-exam", authMiddleware, async (req, res) => {
     try {
        // delete question in Questions collection
        await Question.findByIdAndDelete(req.body.questionId);

        // delete question in exam
        const exam = await Exam.findById(req.body.examId);
        exam.questions = exam.questions.filter(
          (question) => question._id != req.body.questionId
        );
        await exam.save();
        res.send({
          message: "Question deleted successfully",
          success: true,
        });
     } catch (error) {
      
     }
});


module.exports = router;
