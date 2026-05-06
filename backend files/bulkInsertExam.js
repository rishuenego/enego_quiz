// const mongoose = require("mongoose");
// const Exam = require("./models/examModel");
// const Question = require("./models/questionModel");

// // Connect to MongoDB (using same connection as existing bulkInsert.js)
// mongoose.connect("mongodb+srv://harshsengar2005:welcome1234@cluster0.zutegiu.mongodb.net/EnegoQuiz");

// const connection = mongoose.connection;

// connection.on("connected", () => {
//   console.log("MongoDB Connection Successful");
// });

// connection.on("error", (err) => {
//   console.log("MongoDB Connection Failed:", err);
// });

// // Sample exam configuration
// const examData = {
//   name: "General Knowledge Quiz 2024",
//   duration: 60, // 60 minutes
//   category: "General Knowledge",
//   totalMarks: 30,
//   passingMarks: 15,
// };

// // Sample questions data (30 questions)
// const questionsData = [
//   {
//     name: "What is the capital of France?",
//     correctOption: "C",
//     options: {
//       A: "London",
//       B: "Berlin",
//       C: "Paris",
//       D: "Madrid"
//     }
//   },
//   {
//     name: "Which planet is known as the Red Planet?",
//     correctOption: "B",
//     options: {
//       A: "Venus",
//       B: "Mars",
//       C: "Jupiter",
//       D: "Saturn"
//     }
//   },
//   {
//     name: "What is 2 + 2?",
//     correctOption: "B",
//     options: {
//       A: "3",
//       B: "4",
//       C: "5",
//       D: "6"
//     }
//   },
//   {
//     name: "Who wrote 'Romeo and Juliet'?",
//     correctOption: "B",
//     options: {
//       A: "Charles Dickens",
//       B: "William Shakespeare",
//       C: "Jane Austen",
//       D: "Mark Twain"
//     }
//   },
//   {
//     name: "What is the largest ocean on Earth?",
//     correctOption: "C",
//     options: {
//       A: "Atlantic Ocean",
//       B: "Indian Ocean",
//       C: "Pacific Ocean",
//       D: "Arctic Ocean"
//     }
//   },
//   {
//     name: "Which element has the chemical symbol 'O'?",
//     correctOption: "B",
//     options: {
//       A: "Gold",
//       B: "Oxygen",
//       C: "Silver",
//       D: "Iron"
//     }
//   },
//   {
//     name: "What is the square root of 16?",
//     correctOption: "B",
//     options: {
//       A: "2",
//       B: "4",
//       C: "8",
//       D: "16"
//     }
//   },
//   {
//     name: "Which country is known as the Land of the Rising Sun?",
//     correctOption: "B",
//     options: {
//       A: "China",
//       B: "Japan",
//       C: "Thailand",
//       D: "South Korea"
//     }
//   },
//   {
//     name: "What is the currency of the United Kingdom?",
//     correctOption: "C",
//     options: {
//       A: "Euro",
//       B: "Dollar",
//       C: "Pound Sterling",
//       D: "Yen"
//     }
//   },
//   {
//     name: "Which gas do plants absorb from the atmosphere?",
//     correctOption: "C",
//     options: {
//       A: "Oxygen",
//       B: "Nitrogen",
//       C: "Carbon Dioxide",
//       D: "Hydrogen"
//     }
//   },
//   {
//     name: "What is the largest mammal in the world?",
//     correctOption: "B",
//     options: {
//       A: "Elephant",
//       B: "Blue Whale",
//       C: "Giraffe",
//       D: "Polar Bear"
//     }
//   },
//   {
//     name: "Which programming language is known for its use in web development?",
//     correctOption: "B",
//     options: {
//       A: "Python",
//       B: "JavaScript",
//       C: "C++",
//       D: "Java"
//     }
//   },
//   {
//     name: "What is the chemical formula for water?",
//     correctOption: "B",
//     options: {
//       A: "CO2",
//       B: "H2O",
//       C: "O2",
//       D: "NaCl"
//     }
//   },
//   {
//     name: "Which continent is the Sahara Desert located in?",
//     correctOption: "B",
//     options: {
//       A: "Asia",
//       B: "Africa",
//       C: "Australia",
//       D: "South America"
//     }
//   },
//   {
//     name: "What is the hardest natural substance on Earth?",
//     correctOption: "C",
//     options: {
//       A: "Gold",
//       B: "Iron",
//       C: "Diamond",
//       D: "Platinum"
//     }
//   },
//   {
//     name: "Which vitamin is produced when skin is exposed to sunlight?",
//     correctOption: "D",
//     options: {
//       A: "Vitamin A",
//       B: "Vitamin B",
//       C: "Vitamin C",
//       D: "Vitamin D"
//     }
//   },
//   {
//     name: "What is the capital of Australia?",
//     correctOption: "C",
//     options: {
//       A: "Sydney",
//       B: "Melbourne",
//       C: "Canberra",
//       D: "Perth"
//     }
//   },
//   {
//     name: "Which planet is closest to the Sun?",
//     correctOption: "B",
//     options: {
//       A: "Venus",
//       B: "Mercury",
//       C: "Earth",
//       D: "Mars"
//     }
//   },
//   {
//     name: "What does 'HTTP' stand for?",
//     correctOption: "B",
//     options: {
//       A: "High Tech Transfer Protocol",
//       B: "HyperText Transfer Protocol",
//       C: "Home Tool Transfer Protocol",
//       D: "Hyperlink Text Transfer Protocol"
//     }
//   },
//   {
//     name: "Which gas makes up the majority of Earth's atmosphere?",
//     correctOption: "C",
//     options: {
//       A: "Oxygen",
//       B: "Carbon Dioxide",
//       C: "Nitrogen",
//       D: "Argon"
//     }
//   },
//   {
//     name: "What is the largest planet in our solar system?",
//     correctOption: "B",
//     options: {
//       A: "Saturn",
//       B: "Jupiter",
//       C: "Neptune",
//       D: "Uranus"
//     }
//   },
//   {
//     name: "Which famous scientist developed the theory of relativity?",
//     correctOption: "B",
//     options: {
//       A: "Isaac Newton",
//       B: "Albert Einstein",
//       C: "Stephen Hawking",
//       D: "Galileo Galilei"
//     }
//   },
//   {
//     name: "What is the main ingredient in guacamole?",
//     correctOption: "B",
//     options: {
//       A: "Tomato",
//       B: "Avocado",
//       C: "Onion",
//       D: "Lemon"
//     }
//   },
//   {
//     name: "Which programming language was created by Guido van Rossum?",
//     correctOption: "B",
//     options: {
//       A: "Java",
//       B: "Python",
//       C: "Ruby",
//       D: "PHP"
//     }
//   },
//   {
//     name: "What is the smallest country in the world?",
//     correctOption: "B",
//     options: {
//       A: "Monaco",
//       B: "Vatican City",
//       C: "San Marino",
//       D: "Liechtenstein"
//     }
//   },
//   {
//     name: "Which element has the atomic number 1?",
//     correctOption: "B",
//     options: {
//       A: "Helium",
//       B: "Hydrogen",
//       C: "Lithium",
//       D: "Carbon"
//     }
//   },
//   {
//     name: "What does 'CPU' stand for in computers?",
//     correctOption: "B",
//     options: {
//       A: "Computer Personal Unit",
//       B: "Central Processing Unit",
//       C: "Control Processing Unit",
//       D: "Central Program Unit"
//     }
//   },
//   {
//     name: "Which ocean is located between Africa and Australia?",
//     correctOption: "C",
//     options: {
//       A: "Pacific Ocean",
//       B: "Atlantic Ocean",
//       C: "Indian Ocean",
//       D: "Arctic Ocean"
//     }
//   },
//   {
//     name: "What is the primary color of the sky on a clear day?",
//     correctOption: "B",
//     options: {
//       A: "Green",
//       B: "Blue",
//       C: "Red",
//       D: "Yellow"
//     }
//   },
//   {
//     name: "Which famous wall was built to protect against invasions?",
//     correctOption: "B",
//     options: {
//       A: "Berlin Wall",
//       B: "Great Wall of China",
//       C: "Hadrian's Wall",
//       D: "Western Wall"
//     }
//   }
// ];

// async function bulkInsertExamAndQuestions() {
//   try {
//     console.log("Starting bulk insert process...");

//     // Check if exam already exists
//     const existingExam = await Exam.findOne({ name: examData.name });
//     if (existingExam) {
//       console.log(`Exam "${examData.name}" already exists. Skipping exam creation.`);
//       return;
//     }

//     // Create the exam
//     console.log("Creating exam...");
//     const newExam = new Exam({
//       ...examData,
//       questions: [] // Start with empty questions array
//     });
//     const savedExam = await newExam.save();
//     console.log(`Exam "${savedExam.name}" created successfully with ID: ${savedExam._id}`);

//     // Create and save questions
//     console.log("Creating questions...");
//     const questionIds = [];

//     for (let i = 0; i < questionsData.length; i++) {
//       const questionData = questionsData[i];
//       const newQuestion = new Question({
//         ...questionData,
//         exam: savedExam._id
//       });

//       const savedQuestion = await newQuestion.save();
//       questionIds.push(savedQuestion._id);

//       console.log(`Question ${i + 1}/${questionsData.length} created: "${questionData.name}"`);
//     }

//     // Update exam with question IDs
//     console.log("Updating exam with questions...");
//     savedExam.questions = questionIds;
//     await savedExam.save();

//     console.log(`\n✅ Bulk insert completed successfully!`);
//     console.log(`📚 Exam: ${savedExam.name}`);
//     console.log(`❓ Questions added: ${questionIds.length}`);
//     console.log(`⏱️  Duration: ${savedExam.duration} minutes`);
//     console.log(`🎯 Total Marks: ${savedExam.totalMarks}`);
//     console.log(`📈 Passing Marks: ${savedExam.passingMarks}`);

//     process.exit(0);

//   } catch (error) {
//     console.error("❌ Error during bulk insert:", error);
//     process.exit(1);
//   }
// }

// // Run the bulk insert
// bulkInsertExamAndQuestions();


//QUIZ LEVEL 1 (Schemes Included PMEGP, CGTMSE, MUDRA, SC/ST, NAIF )

// const mongoose = require("mongoose");
// const Exam = require("./models/examModel");
// const Question = require("./models/questionModel");

// // MongoDB connection
// mongoose.connect("mongodb+srv://harshsengar2005:welcome1234@cluster0.zutegiu.mongodb.net/EnegoQuiz");

// const connection = mongoose.connection;

// connection.on("connected", () => {
//   console.log("MongoDB Connection Successful");
// });

// connection.on("error", (err) => {
//   console.log("MongoDB Connection Failed:", err);
// });

// // ================= EXAM CONFIG =================
// const examData = {
//   name: "Govt Credit Schemes Quiz – Level 1",
//   duration: 1200, // seconds
//   category: "Government Schemes",
//   totalMarks: 30,
//   passingMarks: 10,
// };

// // ================= QUESTIONS =================
// const questionsData = [
//   {
//     name: "PMEGP stands for?",
//     correctOption: "B",
//     options: {
//       A: "Prime Minister Employment Guarantee Program",
//       B: "Prime Minister’s Employment Generation Programme",
//       C: "Public Micro Enterprise Growth Plan",
//       D: "Prime Market Employment Group",
//     },
//   },
//   {
//     name: "PMEGP is implemented by which organization?",
//     correctOption: "C",
//     options: {
//       A: "RBI",
//       B: "NABARD",
//       C: "KVIC",
//       D: "SIDBI",
//     },
//   },
//   {
//     name: "Under PMEGP, subsidy is called?",
//     correctOption: "B",
//     options: {
//       A: "Capital Grant",
//       B: "Margin Money",
//       C: "Interest Support",
//       D: "Loan Waiver",
//     },
//   },
//   {
//     name: "Maximum project cost under PMEGP (Manufacturing)?",
//     correctOption: "C",
//     options: {
//       A: "₹25 lakh",
//       B: "₹40 lakh",
//       C: "₹50 lakh",
//       D: "₹1 crore",
//     },
//   },
//   {
//     name: "CGTMSE provides which facility?",
//     correctOption: "C",
//     options: {
//       A: "Direct Loan",
//       B: "Interest Subsidy",
//       C: "Credit Guarantee",
//       D: "Equity Funding",
//     },
//   },
//   {
//     name: "CGTMSE stands for?",
//     correctOption: "A",
//     options: {
//       A: "Credit Guarantee Trust for Micro & Small Enterprises",
//       B: "Central Guarantee for MSMEs",
//       C: "Credit Grant Scheme",
//       D: "Credit Growth Trust",
//     },
//   },
//   {
//     name: "CGTMSE mainly benefits?",
//     correctOption: "C",
//     options: {
//       A: "Borrowers only",
//       B: "Government",
//       C: "Banks & NBFCs",
//       D: "Auditors",
//     },
//   },
//   {
//     name: "Collateral requirement under CGTMSE?",
//     correctOption: "C",
//     options: {
//       A: "Mandatory",
//       B: "Optional",
//       C: "Not required",
//       D: "Required above ₹5 lakh",
//     },
//   },
//   {
//     name: "MUDRA loans are given to?",
//     correctOption: "C",
//     options: {
//       A: "Large industries",
//       B: "Corporate companies",
//       C: "Non-corporate small businesses",
//       D: "Government employees",
//     },
//   },
//   {
//     name: "MUDRA stands for?",
//     correctOption: "A",
//     options: {
//       A: "Micro Units Development & Refinance Agency",
//       B: "Micro Urban Development Agency",
//       C: "Ministry of Urban Development",
//       D: "Micro Union Development Authority",
//     },
//   },
//   {
//     name: "Which is NOT a MUDRA category?",
//     correctOption: "D",
//     options: {
//       A: "Shishu",
//       B: "Kishore",
//       C: "Tarun",
//       D: "Mahila",
//     },
//   },
//   {
//     name: "Maximum loan amount under MUDRA?",
//     correctOption: "B",
//     options: {
//       A: "₹5 lakh",
//       B: "₹10 lakh",
//       C: "₹15 lakh",
//       D: "₹20 lakh",
//     },
//   },
//   {
//     name: "Shishu loan covers up to?",
//     correctOption: "D",
//     options: {
//       A: "₹50,000",
//       B: "₹1 lakh",
//       C: "₹2 lakh",
//       D: "₹5 lakh",
//     },
//   },
//   {
//     name: "SC/ST schemes aim at?",
//     correctOption: "C",
//     options: {
//       A: "Export promotion",
//       B: "Industrialization",
//       C: "Financial inclusion",
//       D: "Urban development",
//     },
//   },
//   {
//     name: "Which body supports SC entrepreneurs?",
//     correctOption: "C",
//     options: {
//       A: "SIDBI",
//       B: "NSIC",
//       C: "NSFDC",
//       D: "IFCI",
//     },
//   },
//   {
//     name: "NAIF stands for?",
//     correctOption: "A",
//     options: {
//       A: "National Agriculture Infrastructure Fund",
//       B: "National Agro Industrial Fund",
//       C: "New Agriculture Investment Facility",
//       D: "National Allied Industry Fund",
//     },
//   },
//   {
//     name: "NAIF mainly supports?",
//     correctOption: "B",
//     options: {
//       A: "IT Infrastructure",
//       B: "Agriculture Infrastructure",
//       C: "Tourism",
//       D: "Manufacturing",
//     },
//   },
//   {
//     name: "NAIF was launched in?",
//     correctOption: "C",
//     options: {
//       A: "2018",
//       B: "2019",
//       C: "2020",
//       D: "2021",
//     },
//   },
//   {
//     name: "NAIF is implemented by?",
//     correctOption: "B",
//     options: {
//       A: "RBI",
//       B: "NABARD",
//       C: "SIDBI",
//       D: "SEBI",
//     },
//   },
//   {
//     name: "Which scheme provides loan + subsidy?",
//     correctOption: "C",
//     options: {
//       A: "CGTMSE",
//       B: "MUDRA",
//       C: "PMEGP",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme focuses on collateral-free loans?",
//     correctOption: "C",
//     options: {
//       A: "PMEGP",
//       B: "MUDRA",
//       C: "CGTMSE",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "NAIF benefits mainly?",
//     correctOption: "A",
//     options: {
//       A: "Farmers & FPOs",
//       B: "Bankers",
//       C: "Retailers",
//       D: "Exporters",
//     },
//   },
//   {
//     name: "PMEGP is applicable in?",
//     correctOption: "C",
//     options: {
//       A: "Urban only",
//       B: "Rural only",
//       C: "Both rural & urban",
//       D: "Metro cities only",
//     },
//   },
//   {
//     name: "Which scheme supports first-time entrepreneurs?",
//     correctOption: "B",
//     options: {
//       A: "CGTMSE",
//       B: "PMEGP",
//       C: "NAIF",
//       D: "NSFDC",
//     },
//   },
//   {
//     name: "CGTMSE covers loans up to?",
//     correctOption: "D",
//     options: {
//       A: "₹50 lakh",
//       B: "₹1 crore",
//       C: "₹1.5 crore",
//       D: "₹2 crore",
//     },
//   },
//   {
//     name: "MUDRA loans are provided through?",
//     correctOption: "C",
//     options: {
//       A: "Insurance firms",
//       B: "NGOs",
//       C: "Banks & NBFCs",
//       D: "Stock exchanges",
//     },
//   },
//   {
//     name: "PMEGP comes under which ministry?",
//     correctOption: "B",
//     options: {
//       A: "Finance",
//       B: "MSME",
//       C: "Rural Development",
//       D: "Commerce",
//     },
//   },
//   {
//     name: "SC/ST schemes are handled by?",
//     correctOption: "C",
//     options: {
//       A: "Finance Ministry",
//       B: "MSME Ministry",
//       C: "Social Justice & Empowerment",
//       D: "Home Ministry",
//     },
//   },
//   {
//     name: "NAIF supports which activity?",
//     correctOption: "B",
//     options: {
//       A: "Personal farming",
//       B: "Post-harvest infrastructure",
//       C: "Corporate farming",
//       D: "Import trading",
//     },
//   },
//   {
//     name: "Which scheme provides credit guarantee without collateral?",
//     correctOption: "C",
//     options: {
//       A: "PMEGP",
//       B: "MUDRA",
//       C: "CGTMSE",
//       D: "NAIF",
//     },
//   },
// ];

// // ================= BULK INSERT =================
// async function bulkInsertExamAndQuestions() {
//   try {
//     const existingExam = await Exam.findOne({ name: examData.name });
//     if (existingExam) {
//       console.log("Exam already exists. Skipping.");
//       process.exit(0);
//     }

//     const exam = await new Exam({ ...examData, questions: [] }).save();

//     const questionIds = [];
//     for (const q of questionsData) {
//       const savedQ = await new Question({ ...q, exam: exam._id }).save();
//       questionIds.push(savedQ._id);
//     }

//     exam.questions = questionIds;
//     await exam.save();

//     console.log("✅ Scheme Quiz inserted successfully");
//     process.exit(0);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }

// bulkInsertExamAndQuestions();


//QUIZ LEVEL 2 (Schemes Included PMEGP, CGTMSE, MUDRA, SC/ST, NAIF )

// const mongoose = require("mongoose");
// const Exam = require("./models/examModel");
// const Question = require("./models/questionModel");

// // MongoDB connection
// mongoose.connect("mongodb+srv://harshsengar2005:welcome1234@cluster0.zutegiu.mongodb.net/EnegoQuiz");

// const connection = mongoose.connection;

// connection.on("connected", () => {
//   console.log("MongoDB Connection Successful");
// });

// connection.on("error", (err) => {
//   console.log("MongoDB Connection Failed:", err);
// });

// // ================= EXAM CONFIG =================
// const examData = {
//   name: "Govt Credit Schemes Quiz – Level 2",
//   duration: 1200, // seconds
//   category: "Government Schemes",
//   totalMarks: 30,
//   passingMarks: 10,
// };

// // ================= QUESTIONS (LEVEL 2) =================
// const questionsData = [
//   {
//     name: "Which agency releases margin money subsidy under PMEGP?",
//     correctOption: "B",
//     options: {
//       A: "RBI",
//       B: "KVIC",
//       C: "SIDBI",
//       D: "NABARD",
//     },
//   },
//   {
//     name: "PMEGP subsidy is calculated on which cost?",
//     correctOption: "C",
//     options: {
//       A: "Working capital",
//       B: "Land cost",
//       C: "Project cost",
//       D: "Machinery cost",
//     },
//   },
//   {
//     name: "Maximum project cost under PMEGP for service sector?",
//     correctOption: "B",
//     options: {
//       A: "₹10 lakh",
//       B: "₹20 lakh",
//       C: "₹40 lakh",
//       D: "₹50 lakh",
//     },
//   },
//   {
//     name: "Which category gets higher subsidy under PMEGP?",
//     correctOption: "C",
//     options: {
//       A: "General",
//       B: "OBC",
//       C: "SC/ST/Women",
//       D: "Urban applicants",
//     },
//   },
//   {
//     name: "CGTMSE guarantee cover is mainly provided to?",
//     correctOption: "B",
//     options: {
//       A: "Borrower",
//       B: "Lending institution",
//       C: "State government",
//       D: "Auditor",
//     },
//   },
//   {
//     name: "CGTMSE primarily encourages lending to?",
//     correctOption: "C",
//     options: {
//       A: "Large enterprises",
//       B: "Startups only",
//       C: "Micro & Small Enterprises",
//       D: "Public sector units",
//     },
//   },
//   {
//     name: "Which loan type is covered under CGTMSE?",
//     correctOption: "D",
//     options: {
//       A: "Personal loan",
//       B: "Education loan",
//       C: "Gold loan",
//       D: "MSME business loan",
//     },
//   },
//   {
//     name: "Who pays the CGTMSE guarantee fee?",
//     correctOption: "B",
//     options: {
//       A: "Government",
//       B: "Borrower",
//       C: "RBI",
//       D: "NABARD",
//     },
//   },
//   {
//     name: "Which MUDRA category is suitable for business expansion?",
//     correctOption: "C",
//     options: {
//       A: "Shishu",
//       B: "Kishore",
//       C: "Tarun",
//       D: "Startup",
//     },
//   },
//   {
//     name: "Kishore category loan range is?",
//     correctOption: "B",
//     options: {
//       A: "Up to ₹5 lakh",
//       B: "₹5–10 lakh",
//       C: "₹10–15 lakh",
//       D: "Above ₹10 lakh",
//     },
//   },
//   {
//     name: "MUDRA loans are refinance-supported by?",
//     correctOption: "C",
//     options: {
//       A: "RBI",
//       B: "NABARD",
//       C: "MUDRA Ltd",
//       D: "SIDBI",
//     },
//   },
//   {
//     name: "Which businesses are eligible under MUDRA?",
//     correctOption: "C",
//     options: {
//       A: "Corporate firms",
//       B: "Public companies",
//       C: "Proprietorship & partnership",
//       D: "Foreign companies",
//     },
//   },
//   {
//     name: "SC/ST entrepreneurship schemes focus on which objective?",
//     correctOption: "C",
//     options: {
//       A: "Skill training",
//       B: "Export promotion",
//       C: "Self-employment",
//       D: "Tax collection",
//     },
//   },
//   {
//     name: "Which organization provides concessional loans to SC entrepreneurs?",
//     correctOption: "B",
//     options: {
//       A: "SIDBI",
//       B: "NSFDC",
//       C: "KVIC",
//       D: "NABARD",
//     },
//   },
//   {
//     name: "SC/ST schemes are mainly credit-linked with?",
//     correctOption: "C",
//     options: {
//       A: "Insurance",
//       B: "Subsidy only",
//       C: "Bank loans",
//       D: "Equity funding",
//     },
//   },
//   {
//     name: "NAIF funding is mainly used for?",
//     correctOption: "B",
//     options: {
//       A: "Crop production",
//       B: "Post-harvest management",
//       C: "Seed distribution",
//       D: "Fertilizer subsidy",
//     },
//   },
//   {
//     name: "NAIF interest subvention is provided for?",
//     correctOption: "C",
//     options: {
//       A: "Personal loans",
//       B: "Land purchase",
//       C: "Agri-infrastructure projects",
//       D: "Consumer loans",
//     },
//   },
//   {
//     name: "NAIF loans have maximum tenure up to?",
//     correctOption: "C",
//     options: {
//       A: "3 years",
//       B: "5 years",
//       C: "7 years",
//       D: "10 years",
//     },
//   },
//   {
//     name: "Which entities are eligible under NAIF?",
//     correctOption: "C",
//     options: {
//       A: "Only farmers",
//       B: "Only companies",
//       C: "FPOs, PACS, Agri entrepreneurs",
//       D: "Banks only",
//     },
//   },
//   {
//     name: "Which scheme reduces bank risk through guarantee?",
//     correctOption: "B",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "PMEGP loan is sanctioned by?",
//     correctOption: "B",
//     options: {
//       A: "KVIC",
//       B: "Banks",
//       C: "MSME Ministry",
//       D: "NABARD",
//     },
//   },
//   {
//     name: "Which scheme combines subsidy + bank loan?",
//     correctOption: "A",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme does NOT provide subsidy?",
//     correctOption: "B",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "NAIF",
//       D: "SC/ST schemes",
//     },
//   },
//   {
//     name: "NAIF is a fund of how much corpus?",
//     correctOption: "C",
//     options: {
//       A: "₹50,000 crore",
//       B: "₹75,000 crore",
//       C: "₹1 lakh crore",
//       D: "₹1.5 lakh crore",
//     },
//   },
//   {
//     name: "CGTMSE mainly supports which stage?",
//     correctOption: "B",
//     options: {
//       A: "Idea stage",
//       B: "Credit stage",
//       C: "Marketing stage",
//       D: "Export stage",
//     },
//   },
//   {
//     name: "Which MUDRA category suits working capital needs?",
//     correctOption: "B",
//     options: {
//       A: "Shishu",
//       B: "Kishore",
//       C: "Tarun",
//       D: "Mega",
//     },
//   },
//   {
//     name: "SC/ST schemes are targeted for which purpose?",
//     correctOption: "C",
//     options: {
//       A: "Tax benefit",
//       B: "Welfare pension",
//       C: "Entrepreneurship promotion",
//       D: "Loan waiver",
//     },
//   },
//   {
//     name: "NAIF projects are monitored by?",
//     correctOption: "B",
//     options: {
//       A: "RBI",
//       B: "NABARD",
//       C: "SIDBI",
//       D: "SEBI",
//     },
//   },
//   {
//     name: "CGTMSE guarantee coverage applies to?",
//     correctOption: "C",
//     options: {
//       A: "Only term loans",
//       B: "Only working capital",
//       C: "Both term loan & WC",
//       D: "Personal loans",
//     },
//   },
//   {
//     name: "Which scheme is best for agriculture infrastructure?",
//     correctOption: "D",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
// ];

// // ================= BULK INSERT =================
// async function bulkInsertExamAndQuestions() {
//   try {
//     const existingExam = await Exam.findOne({ name: examData.name });
//     if (existingExam) {
//       console.log("Exam already exists. Skipping.");
//       process.exit(0);
//     }

//     const exam = await new Exam({ ...examData, questions: [] }).save();

//     const questionIds = [];
//     for (const q of questionsData) {
//       const savedQ = await new Question({ ...q, exam: exam._id }).save();
//       questionIds.push(savedQ._id);
//     }

//     exam.questions = questionIds;
//     await exam.save();

//     console.log("✅ Level 2 Scheme Quiz inserted successfully");
//     process.exit(0);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }

// bulkInsertExamAndQuestions();


//QUIZ LEVEL 3 (Schemes Included PMEGP, CGTMSE, MUDRA, SC/ST, NAIF )
// const mongoose = require("mongoose");
// const Exam = require("./models/examModel");
// const Question = require("./models/questionModel");

// // MongoDB connection
// mongoose.connect("mongodb+srv://harshsengar2005:welcome1234@cluster0.zutegiu.mongodb.net/EnegoQuiz");

// const connection = mongoose.connection;

// connection.on("connected", () => {
//   console.log("MongoDB Connection Successful");
// });

// connection.on("error", (err) => {
//   console.log("MongoDB Connection Failed:", err);
// });

// // ================= EXAM CONFIG =================
// const examData = {
//   name: "Govt Credit Schemes Quiz – Level 3",
//   duration: 1200, // seconds
//   category: "Government Schemes",
//   totalMarks: 30,
//   passingMarks: 10,
// };

// // ================= QUESTIONS (LEVEL 3 – ADVANCED) =================
// const questionsData = [
//   {
//     name: "An SC entrepreneur wants to start a manufacturing unit costing ₹45 lakh. Which scheme is MOST suitable?",
//     correctOption: "A",
//     options: {
//       A: "PMEGP",
//       B: "MUDRA",
//       C: "CGTMSE",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "A bank wants collateral-free security for a ₹1.5 crore MSME loan. Which scheme applies?",
//     correctOption: "B",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "SC/ST Scheme",
//     },
//   },
//   {
//     name: "A farmer-producer organization wants funding for cold storage. Which scheme fits best?",
//     correctOption: "D",
//     options: {
//       A: "PMEGP",
//       B: "MUDRA",
//       C: "CGTMSE",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "An existing small trader needs ₹8 lakh for expansion. Which MUDRA category applies?",
//     correctOption: "B",
//     options: {
//       A: "Shishu",
//       B: "Kishore",
//       C: "Tarun",
//       D: "Startup",
//     },
//   },
//   {
//     name: "Which scheme directly reduces bank NPA risk?",
//     correctOption: "B",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Margin money under PMEGP is treated as?",
//     correctOption: "C",
//     options: {
//       A: "Repayable loan",
//       B: "Interest subsidy",
//       C: "Government subsidy",
//       D: "Security deposit",
//     },
//   },
//   {
//     name: "Which loan component is NOT covered under CGTMSE?",
//     correctOption: "D",
//     options: {
//       A: "Term loan",
//       B: "Working capital",
//       C: "Composite loan",
//       D: "Personal loan",
//     },
//   },
//   {
//     name: "An entrepreneur wants collateral-free loan + subsidy. Best combination?",
//     correctOption: "A",
//     options: {
//       A: "PMEGP + CGTMSE",
//       B: "MUDRA + NAIF",
//       C: "SC/ST + NAIF",
//       D: "Only CGTMSE",
//     },
//   },
//   {
//     name: "Which scheme is MOST suitable for rural employment generation?",
//     correctOption: "A",
//     options: {
//       A: "PMEGP",
//       B: "MUDRA",
//       C: "CGTMSE",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "A bank charges guarantee fee under CGTMSE from whom?",
//     correctOption: "B",
//     options: {
//       A: "Government",
//       B: "Borrower",
//       C: "RBI",
//       D: "NABARD",
//     },
//   },
//   {
//     name: "Which factor decides subsidy rate under PMEGP?",
//     correctOption: "C",
//     options: {
//       A: "Loan tenure",
//       B: "Bank type",
//       C: "Category & location",
//       D: "Turnover",
//     },
//   },
//   {
//     name: "Which scheme is NOT sector-specific?",
//     correctOption: "B",
//     options: {
//       A: "NAIF",
//       B: "CGTMSE",
//       C: "PMEGP",
//       D: "SC/ST Scheme",
//     },
//   },
//   {
//     name: "A woman entrepreneur from urban area gets PMEGP subsidy of?",
//     correctOption: "B",
//     options: {
//       A: "15%",
//       B: "25%",
//       C: "35%",
//       D: "40%",
//     },
//   },
//   {
//     name: "Which MUDRA category has highest ticket size?",
//     correctOption: "C",
//     options: {
//       A: "Shishu",
//       B: "Kishore",
//       C: "Tarun",
//       D: "Nano",
//     },
//   },
//   {
//     name: "Which scheme requires creation of durable assets?",
//     correctOption: "D",
//     options: {
//       A: "CGTMSE",
//       B: "MUDRA",
//       C: "PMEGP",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which institution supervises NAIF implementation?",
//     correctOption: "B",
//     options: {
//       A: "RBI",
//       B: "NABARD",
//       C: "SIDBI",
//       D: "SEBI",
//     },
//   },
//   {
//     name: "Which scheme is best for first-time rural entrepreneurs?",
//     correctOption: "C",
//     options: {
//       A: "CGTMSE",
//       B: "MUDRA",
//       C: "PMEGP",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "CGTMSE coverage applies till loan becomes?",
//     correctOption: "B",
//     options: {
//       A: "Sanctioned",
//       B: "Closed or defaulted",
//       C: "Disbursed",
//       D: "Renewed",
//     },
//   },
//   {
//     name: "Which scheme is MOST suitable for warehouse construction?",
//     correctOption: "D",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which combination improves credit flow to MSMEs?",
//     correctOption: "A",
//     options: {
//       A: "CGTMSE + Bank Loan",
//       B: "MUDRA + Subsidy",
//       C: "NAIF + Personal Loan",
//       D: "PMEGP only",
//     },
//   },
//   {
//     name: "PMEGP margin money is locked for how long?",
//     correctOption: "C",
//     options: {
//       A: "1 year",
//       B: "2 years",
//       C: "3 years",
//       D: "5 years",
//     },
//   },
//   {
//     name: "Which scheme is linked with Atmanirbhar Bharat?",
//     correctOption: "B",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme is refinance-based?",
//     correctOption: "C",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme targets post-harvest value chain?",
//     correctOption: "D",
//     options: {
//       A: "PMEGP",
//       B: "MUDRA",
//       C: "CGTMSE",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme benefits lending institutions directly?",
//     correctOption: "B",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "SC/ST Scheme",
//     },
//   },
//   {
//     name: "Which scheme requires entrepreneur contribution?",
//     correctOption: "A",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "NAIF",
//       D: "None",
//     },
//   },
//   {
//     name: "Which scheme has interest subvention component?",
//     correctOption: "D",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme is BEST for agri-logistics?",
//     correctOption: "D",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme directly supports social inclusion?",
//     correctOption: "C",
//     options: {
//       A: "CGTMSE",
//       B: "MUDRA",
//       C: "SC/ST Schemes",
//       D: "NAIF",
//     },
//   },
// ];

// // ================= BULK INSERT =================
// async function bulkInsertExamAndQuestions() {
//   try {
//     const existingExam = await Exam.findOne({ name: examData.name });
//     if (existingExam) {
//       console.log("Exam already exists. Skipping.");
//       process.exit(0);
//     }

//     const exam = await new Exam({ ...examData, questions: [] }).save();

//     const questionIds = [];
//     for (const q of questionsData) {
//       const savedQ = await new Question({ ...q, exam: exam._id }).save();
//       questionIds.push(savedQ._id);
//     }

//     exam.questions = questionIds;
//     await exam.save();

//     console.log("✅ Level 3 Scheme Quiz inserted successfully");
//     process.exit(0);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }

// bulkInsertExamAndQuestions();

//QUIZ LEVEL 4 (Schemes Included PMEGP, CGTMSE, MUDRA, SC/ST, NAIF )
// const mongoose = require("mongoose");
// const Exam = require("./models/examModel");
// const Question = require("./models/questionModel");

// // MongoDB connection
// mongoose.connect("mongodb+srv://harshsengar2005:welcome1234@cluster0.zutegiu.mongodb.net/EnegoQuiz");

// const connection = mongoose.connection;

// connection.on("connected", () => {
//   console.log("MongoDB Connection Successful");
// });

// connection.on("error", (err) => {
//   console.log("MongoDB Connection Failed:", err);
// });

// // ================= EXAM CONFIG =================
// const examData = {
//   name: "Govt Credit Schemes Quiz – Level 4",
//   duration: 1200, // seconds
//   category: "Government Schemes",
//   totalMarks: 30,
//   passingMarks: 10,
// };

// // ================= QUESTIONS (LEVEL 4 – EXPERT) =================
// const questionsData = [
//   {
//     name: "PMEGP margin money subsidy is adjusted against which component of the loan?",
//     correctOption: "C",
//     options: {
//       A: "Working capital",
//       B: "Interest",
//       C: "Term loan",
//       D: "Processing fee",
//     },
//   },
//   {
//     name: "Under PMEGP, which expense is NOT included in project cost?",
//     correctOption: "B",
//     options: {
//       A: "Machinery",
//       B: "Land purchase",
//       C: "Tools",
//       D: "Working capital (1 cycle)",
//     },
//   },
//   {
//     name: "Which scenario will lead to reversal of PMEGP subsidy?",
//     correctOption: "C",
//     options: {
//       A: "Low profit",
//       B: "Late EMI",
//       C: "Unit becomes non-functional",
//       D: "Change in bank",
//     },
//   },
//   {
//     name: "CGTMSE guarantee cover percentage generally decreases when loan amount:",
//     correctOption: "B",
//     options: {
//       A: "Is less than ₹5 lakh",
//       B: "Increases",
//       C: "Is sanctioned by PSU bank",
//       D: "Is under PMEGP",
//     },
//   },
//   {
//     name: "Which loan will NOT be eligible under CGTMSE?",
//     correctOption: "D",
//     options: {
//       A: "New MSME loan",
//       B: "Composite loan",
//       C: "Existing MSME expansion loan",
//       D: "Loan backed by collateral",
//     },
//   },
//   {
//     name: "Who is the legal beneficiary of CGTMSE guarantee cover?",
//     correctOption: "B",
//     options: {
//       A: "Borrower",
//       B: "Lending institution",
//       C: "MSME Ministry",
//       D: "Trust",
//     },
//   },
//   {
//     name: "Which MUDRA loan case will be REJECTED?",
//     correctOption: "C",
//     options: {
//       A: "Proprietorship firm",
//       B: "Retail trader",
//       C: "Private Limited Company",
//       D: "Small manufacturer",
//     },
//   },
//   {
//     name: "Which MUDRA category has the HIGHEST credit risk for banks?",
//     correctOption: "A",
//     options: {
//       A: "Shishu",
//       B: "Kishore",
//       C: "Tarun",
//       D: "All equal",
//     },
//   },
//   {
//     name: "MUDRA refinance is provided mainly to:",
//     correctOption: "C",
//     options: {
//       A: "Borrowers",
//       B: "State governments",
//       C: "Banks & MFIs",
//       D: "MSMEs",
//     },
//   },
//   {
//     name: "Which SC/ST scheme institution provides venture-style funding?",
//     correctOption: "B",
//     options: {
//       A: "NSFDC",
//       B: "VCF-SC",
//       C: "SIDBI",
//       D: "KVIC",
//     },
//   },
//   {
//     name: "SC/ST Stand-Up India scheme mandates which condition?",
//     correctOption: "C",
//     options: {
//       A: "Subsidy compulsory",
//       B: "Collateral-free only",
//       C: "One SC/ST & one woman borrower per branch",
//       D: "Interest-free loan",
//     },
//   },
//   {
//     name: "Which scheme overlaps MOST with PMEGP objectives?",
//     correctOption: "D",
//     options: {
//       A: "NAIF",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "Stand-Up India",
//     },
//   },
//   {
//     name: "NAIF interest subvention is limited to how many years?",
//     correctOption: "B",
//     options: {
//       A: "3 years",
//       B: "7 years",
//       C: "10 years",
//       D: "Entire tenure",
//     },
//   },
//   {
//     name: "Which NAIF project will be rejected?",
//     correctOption: "C",
//     options: {
//       A: "Cold chain",
//       B: "Warehouse",
//       C: "Crop cultivation",
//       D: "Primary processing unit",
//     },
//   },
//   {
//     name: "NAIF loans are routed through which mechanism?",
//     correctOption: "B",
//     options: {
//       A: "Direct government transfer",
//       B: "Scheduled lending institutions",
//       C: "Cooperative societies only",
//       D: "State governments",
//     },
//   },
//   {
//     name: "Which scheme has the LONGEST repayment tenure?",
//     correctOption: "D",
//     options: {
//       A: "PMEGP",
//       B: "MUDRA",
//       C: "CGTMSE",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme requires promoter contribution upfront?",
//     correctOption: "A",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which risk is NOT mitigated by CGTMSE?",
//     correctOption: "D",
//     options: {
//       A: "Credit risk",
//       B: "Default risk",
//       C: "Collateral risk",
//       D: "Market risk",
//     },
//   },
//   {
//     name: "Which scheme is most sensitive to project viability reports?",
//     correctOption: "A",
//     options: {
//       A: "PMEGP",
//       B: "MUDRA",
//       C: "CGTMSE",
//       D: "SC/ST Scheme",
//     },
//   },
//   {
//     name: "Which combination is INVALID?",
//     correctOption: "C",
//     options: {
//       A: "PMEGP + CGTMSE",
//       B: "NAIF + CGTMSE",
//       C: "MUDRA + PMEGP",
//       D: "SC/ST + CGTMSE",
//     },
//   },
//   {
//     name: "Which scheme directly impacts bank capital adequacy?",
//     correctOption: "B",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme is MOST policy-driven rather than demand-driven?",
//     correctOption: "D",
//     options: {
//       A: "MUDRA",
//       B: "CGTMSE",
//       C: "PMEGP",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme has the highest compliance monitoring?",
//     correctOption: "A",
//     options: {
//       A: "PMEGP",
//       B: "MUDRA",
//       C: "CGTMSE",
//       D: "SC/ST Scheme",
//     },
//   },
//   {
//     name: "Which scheme fails if asset creation is delayed?",
//     correctOption: "D",
//     options: {
//       A: "CGTMSE",
//       B: "MUDRA",
//       C: "PMEGP",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme is MOST suitable for policy impact assessment?",
//     correctOption: "D",
//     options: {
//       A: "MUDRA",
//       B: "PMEGP",
//       C: "CGTMSE",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme depends heavily on bank appraisal quality?",
//     correctOption: "A",
//     options: {
//       A: "CGTMSE",
//       B: "MUDRA",
//       C: "NAIF",
//       D: "SC/ST Scheme",
//     },
//   },
//   {
//     name: "Which scheme is LEAST flexible in restructuring?",
//     correctOption: "C",
//     options: {
//       A: "MUDRA",
//       B: "CGTMSE",
//       C: "PMEGP",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme’s failure leads to subsidy recovery?",
//     correctOption: "C",
//     options: {
//       A: "CGTMSE",
//       B: "MUDRA",
//       C: "PMEGP",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme is BEST described as a credit risk-transfer mechanism?",
//     correctOption: "B",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
//   {
//     name: "Which scheme is most aligned with long-term agri reforms?",
//     correctOption: "D",
//     options: {
//       A: "PMEGP",
//       B: "CGTMSE",
//       C: "MUDRA",
//       D: "NAIF",
//     },
//   },
// ];

// // ================= BULK INSERT =================
// async function bulkInsertExamAndQuestions() {
//   try {
//     const existingExam = await Exam.findOne({ name: examData.name });
//     if (existingExam) {
//       console.log("Exam already exists. Skipping.");
//       process.exit(0);
//     }

//     const exam = await new Exam({ ...examData, questions: [] }).save();

//     const questionIds = [];
//     for (const q of questionsData) {
//       const savedQ = await new Question({ ...q, exam: exam._id }).save();
//       questionIds.push(savedQ._id);
//     }

//     exam.questions = questionIds;
//     await exam.save();

//     console.log("✅ Level 4 Scheme Quiz inserted successfully");
//     process.exit(0);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }

// bulkInsertExamAndQuestions();


//QUIZ LEVEL 5 (Schemes Included PMEGP, CGTMSE, MUDRA, SC/ST, NAIF )

const mongoose = require("mongoose");
const Exam = require("./models/examModel");
const Question = require("./models/questionModel");

// MongoDB connection
mongoose.connect("mongodb+srv://harshsengar2005:welcome1234@cluster0.zutegiu.mongodb.net/EnegoQuiz");

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("MongoDB Connection Successful");
});

connection.on("error", (err) => {
  console.log("MongoDB Connection Failed:", err);
});

// ================= EXAM CONFIG =================
const examData = {
  name: "Govt Credit Schemes Quiz – Level 5",
  duration: 1200, // seconds
  category: "Government Schemes",
  totalMarks: 30,
  passingMarks: 10,
};

// ================= QUESTIONS (LEVEL 5 – MASTER) =================
const questionsData = [
  {
    name: "If a PMEGP unit defaults after 2 years, what happens to margin money?",
    correctOption: "C",
    options: {
      A: "Converted into grant",
      B: "Transferred to bank",
      C: "Adjusted / recovered by bank",
      D: "Written off",
    },
  },
  {
    name: "Which factor MOST influences CGTMSE risk premium?",
    correctOption: "B",
    options: {
      A: "Borrower age",
      B: "Loan amount & tenure",
      C: "Bank branch",
      D: "Location",
    },
  },
  {
    name: "Which scheme directly affects bank provisioning norms?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
  {
    name: "Under PMEGP, margin money is credited to which account?",
    correctOption: "C",
    options: {
      A: "Borrower savings account",
      B: "Government account",
      C: "Loan account (lock-in)",
      D: "KVIC account",
    },
  },
  {
    name: "Which scenario makes CGTMSE claim INVALID?",
    correctOption: "D",
    options: {
      A: "Borrower death",
      B: "Business failure",
      C: "Economic slowdown",
      D: "Non-adherence to appraisal norms",
    },
  },
  {
    name: "Which MUDRA loan type has highest default probability statistically?",
    correctOption: "A",
    options: {
      A: "Shishu",
      B: "Kishore",
      C: "Tarun",
      D: "All equal",
    },
  },
  {
    name: "Which scheme is MOST exposed to moral hazard?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "NAIF",
      D: "SC/ST Schemes",
    },
  },
  {
    name: "If a NAIF project fails due to poor execution, who bears maximum loss?",
    correctOption: "B",
    options: {
      A: "Government",
      B: "Lending institution",
      C: "NABARD",
      D: "Borrower only",
    },
  },
  {
    name: "Which scheme has the MOST stringent asset verification?",
    correctOption: "C",
    options: {
      A: "CGTMSE",
      B: "MUDRA",
      C: "NAIF",
      D: "SC/ST Scheme",
    },
  },
  {
    name: "Which scheme is LEAST scalable without banking reforms?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
  {
    name: "Which policy risk impacts NAIF the most?",
    correctOption: "C",
    options: {
      A: "Interest rate risk",
      B: "Credit risk",
      C: "Execution & viability risk",
      D: "Currency risk",
    },
  },
  {
    name: "Which scheme converts fiscal support into contingent liability?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme depends MOST on promoter integrity?",
    correctOption: "A",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "NAIF",
      D: "MUDRA",
    },
  },
  {
    name: "Which scheme’s misuse directly inflates NPAs?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme has highest fiscal multiplier effect?",
    correctOption: "D",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme requires the MOST inter-agency coordination?",
    correctOption: "C",
    options: {
      A: "MUDRA",
      B: "CGTMSE",
      C: "PMEGP",
      D: "SC/ST Schemes",
    },
  },
  {
    name: "Which scheme’s failure creates reputational risk for banks?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme is MOST vulnerable to political interference?",
    correctOption: "A",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "NAIF",
      D: "MUDRA",
    },
  },
  {
    name: "Which scheme best represents risk-sharing model?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme aligns MOST with long-term capital formation?",
    correctOption: "D",
    options: {
      A: "PMEGP",
      B: "MUDRA",
      C: "CGTMSE",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme has the HIGHEST audit scrutiny?",
    correctOption: "C",
    options: {
      A: "MUDRA",
      B: "CGTMSE",
      C: "PMEGP",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme converts subsidy into quasi-equity?",
    correctOption: "A",
    options: {
      A: "PMEGP",
      B: "MUDRA",
      C: "CGTMSE",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme is MOST dependent on field-level verification?",
    correctOption: "A",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme has least flexibility in restructuring stressed assets?",
    correctOption: "A",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme acts as credit catalyst rather than fund provider?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "NAIF",
      D: "SC/ST Scheme",
    },
  },
  {
    name: "Which scheme’s impact is hardest to measure short-term?",
    correctOption: "D",
    options: {
      A: "PMEGP",
      B: "MUDRA",
      C: "CGTMSE",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme creates contingent fiscal stress during downturns?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme is MOST aligned with supply-chain strengthening?",
    correctOption: "D",
    options: {
      A: "PMEGP",
      B: "MUDRA",
      C: "CGTMSE",
      D: "NAIF",
    },
  },
  {
    name: "Which scheme represents the highest policy sophistication?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "SC/ST Scheme",
    },
  },
  {
    name: "Which scheme’s misuse directly impacts sovereign credibility?",
    correctOption: "B",
    options: {
      A: "PMEGP",
      B: "CGTMSE",
      C: "MUDRA",
      D: "NAIF",
    },
  },
];

// ================= BULK INSERT =================
async function bulkInsertExamAndQuestions() {
  try {
    const existingExam = await Exam.findOne({ name: examData.name });
    if (existingExam) {
      console.log("Exam already exists. Skipping.");
      process.exit(0);
    }

    const exam = await new Exam({ ...examData, questions: [] }).save();

    const questionIds = [];
    for (const q of questionsData) {
      const savedQ = await new Question({ ...q, exam: exam._id }).save();
      questionIds.push(savedQ._id);
    }

    exam.questions = questionIds;
    await exam.save();

    console.log("✅ Level 5 Scheme Quiz inserted successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

bulkInsertExamAndQuestions();
