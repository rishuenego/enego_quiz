import { message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { sendSnapshot, endMonitorSession, saveRecordingChunk } from "../../../apicalls/monitor";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { useT } from "../../../i18n/LanguageContext";
import Instructions from "./Instructions";

const SNAPSHOT_INTERVAL_MS = 10000;
const RECORDING_CHUNK_MS = 30000;

function WriteExam() {
  const [examData, setExamData] = React.useState(null);
  const [questions = [], setQuestions] = React.useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [result = {}, setResult] = React.useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft = 0, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [tabViolations, setTabViolations] = useState(0);
  const [cameraGranted, setCameraGranted] = useState(false);
  const { user } = useSelector((state) => state.users);
  const { t, lang } = useT();

  const mediaStreamRef = useRef(null);
  const videoRef = useRef(null);
  const questionStartRef = useRef(null);
  const timingsRef = useRef({});
  const snapshotTimerRef = useRef(null);
  const sessionIdRef = useRef(null);
  const tabViolationsRef = useRef(0);
  const selectedQuestionIndexRef = useRef(0);
  const lastViolationTimeRef = useRef(0);
  
  const mediaRecorderRef = useRef(null);
  const chunkIndexRef = useRef(0);

  useEffect(() => {
    selectedQuestionIndexRef.current = selectedQuestionIndex;
  }, [selectedQuestionIndex]);
  useEffect(() => {
    tabViolationsRef.current = tabViolations;
  }, [tabViolations]);
  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const flushCurrentQuestionTime = () => {
    if (questionStartRef.current == null) return;
    const elapsed = Date.now() - questionStartRef.current;
    const key = String(selectedQuestionIndex);
    timingsRef.current[key] = (timingsRef.current[key] || 0) + elapsed;
    questionStartRef.current = Date.now();
  };

  const stopMedia = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (snapshotTimerRef.current) {
      clearInterval(snapshotTimerRef.current);
      snapshotTimerRef.current = null;
    }
    if (sessionIdRef.current) {
      endMonitorSession({
        exam: params.id,
        sessionId: sessionIdRef.current,
      }).catch(() => {});
      sessionIdRef.current = null;
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return null;
    const canvas = document.createElement("canvas");
    const w = 240;
    const h = Math.round((video.videoHeight / video.videoWidth) * w) || 180;
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    try {
      return canvas.toDataURL("image/jpeg", 0.5);
    } catch (e) {
      return null;
    }
  };

  const startSnapshotLoop = () => {
    if (snapshotTimerRef.current) return;
    snapshotTimerRef.current = setInterval(() => {
      const image = captureFrame();
      sendSnapshot({
        exam: params.id,
        sessionId: sessionIdRef.current,
        image: image || "",
        questionIndex: selectedQuestionIndexRef.current,
        tabViolations: tabViolationsRef.current,
      }).catch(() => {});
    }, SNAPSHOT_INTERVAL_MS);
  };

  const requestMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = stream;
      sessionIdRef.current =
        Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      setCameraGranted(true);
      return true;
    } catch (e) {
      message.error(t("exam.cameraDenied"));
      setCameraGranted(false);
      return false;
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    try {
      const options = { mimeType: "video/webm;codecs=vp8,opus" };
      const recorder = new MediaRecorder(mediaStreamRef.current, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.readAsDataURL(event.data);
          reader.onloadend = async () => {
            const base64data = reader.result;
            await saveRecordingChunk({
              exam: params.id,
              sessionId: sessionIdRef.current,
              videoData: base64data,
              chunkIndex: chunkIndexRef.current,
            });
            chunkIndexRef.current += 1;
          };
        }
      };

      recorder.start(RECORDING_CHUNK_MS); // capture in chunks
    } catch (e) {
      console.error("Recording failed:", e);
    }
  };

  const calculateResult = async () => {
    try {
      flushCurrentQuestionTime();
      let correctAnswers = [];
      let wrongAnswers = [];

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(index);
        } else {
          wrongAnswers.push(index);
        }
      });

      let verdict = "Pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
        selectedOptions,
      };
      setResult(tempResult);
      dispatch(ShowLoading());
      const totalTime = Object.values(timingsRef.current).reduce((a, b) => a + b, 0);

      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
        questionTimings: timingsRef.current,
        tabViolations,
        cameraGranted,
        totalTime,
        sessionId: sessionIdRef.current,
      });
      dispatch(HideLoading());
      stopMedia();
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    let totalSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      message.warning(t("exam.timeUp"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
    return () => {
      stopMedia();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKick = async () => {
    message.error(t("exam.tabKicked"), 10);
    clearInterval(intervalId);
    await calculateResult();
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  // tab/window switch detection during exam (#1)
  useEffect(() => {
    if (view !== "questions") return;
    const onViolation = () => {
      const now = Date.now();
      if (now - lastViolationTimeRef.current < 1000) return; // ignore events within 1s
      lastViolationTimeRef.current = now;

      setTabViolations((n) => {
        const newVal = n + 1;
        if (newVal >= 4) {
          handleKick();
        } else {
          message.warning(t("exam.tabWarn", { n: newVal }));
        }
        return newVal;
      });
    };
    const onVisibility = () => {
      if (document.hidden) onViolation();
    };
    const onBlur = () => {
      onViolation();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, intervalId]);

  // attach the camera stream to the preview video when entering questions
  useEffect(() => {
    if (view === "questions" && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      // first heartbeat right away so supervisor sees the session immediately
      sendSnapshot({
        exam: params.id,
        sessionId: sessionIdRef.current,
        image: "",
        questionIndex: 0,
        tabViolations: 0,
      }).catch(() => {});
      startSnapshotLoop();
      startRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // start timing the current question; flush prior question's time
  useEffect(() => {
    if (view !== "questions") return;
    const key = String(selectedQuestionIndex);
    if (questionStartRef.current != null) {
      // when index changes, accumulate elapsed onto previous index
      // (we can't easily know previous index here, so we accumulate onto current
      //  via flushCurrentQuestionTime called manually right before changing index)
    }
    questionStartRef.current = Date.now();
    if (timingsRef.current[key] == null) timingsRef.current[key] = 0;
  }, [selectedQuestionIndex, view]);
  return (
    examData && (
      <div className="mt-2">
        <div className="divider"></div>
        <h1 className="text-center">{examData.name}</h1>
        <div className="divider"></div>

        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
            requestMedia={requestMedia}
          />
        )}

        {view === "questions" && (
          <div className="flex flex-col gap-2">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                position: "fixed",
                bottom: 80,
                right: 20,
                width: 180,
                height: 135,
                borderRadius: 12,
                background: "#000",
                border: "3px solid #C41E3A",
                zIndex: 1000,
                objectFit: "cover",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              }}
            />
            <div className="flex justify-between">
              <h1 className="text-2xl">
                {selectedQuestionIndex + 1} :{" "}
                {(lang === "hi" || lang === "hinglish") && questions[selectedQuestionIndex].name_hi
                  ? questions[selectedQuestionIndex].name_hi
                  : questions[selectedQuestionIndex].name}
              </h1>

              <div className="flex gap-2 items-center">
                {tabViolations > 0 && (
                  <span style={{ color: "#C41E3A", fontSize: 12 }}>
                    {t("exam.tabSwitches")}: {tabViolations}
                  </span>
                )}
                <div className="timer">
                  <span className="text-2xl">{secondsLeft}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {Object.keys(questions[selectedQuestionIndex].options).map(
                (option, index) => {
                  const optText = ((lang === "hi" || lang === "hinglish") && questions[selectedQuestionIndex].options_hi?.[option])
                    ? questions[selectedQuestionIndex].options_hi[option]
                    : questions[selectedQuestionIndex].options[option];
                  return (
                    <div
                      className={`option ${
                        selectedOptions[selectedQuestionIndex] === option
                          ? "selected-option"
                          : ""
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }}
                    >
                      <h1 className="text-xl">
                        {option} : {optText}
                      </h1>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex justify-end mt-4 mb-10 pb-10">
              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  style={{ height: 50, minWidth: 120, fontSize: 18 }}
                  disabled={selectedOptions[selectedQuestionIndex] === undefined}
                  onClick={() => {
                    if (selectedOptions[selectedQuestionIndex] === undefined) {
                      message.warning(t("exam.warnSelect"));
                      return;
                    }
                    flushCurrentQuestionTime();
                    setSelectedQuestionIndex(selectedQuestionIndex + 1);
                  }}
                >
                  {t("exam.next")} <i className="ri-arrow-right-line ml-2"></i>
                </button>
              )}

              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  style={{ height: 50, minWidth: 120, fontSize: 18 }}
                  disabled={selectedOptions[selectedQuestionIndex] === undefined}
                  onClick={() => {
                    if (selectedOptions[selectedQuestionIndex] === undefined) {
                      message.warning(t("exam.warnSelectSubmit"));
                      return;
                    }
                    clearInterval(intervalId);
                    calculateResult();
                  }}
                >
                  {t("exam.submit")} <i className="ri-check-line ml-2"></i>
                </button>
              )}
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="flex items-center mt-5 justify-center">
            <div className="result-card p-4 flex flex-col gap-4 items-center">
              <div className="result-header text-center">
                <h1 className="text-3xl mb-2">{t("result.title")}</h1>
                <div className={`verdict-badge ${result.verdict === "Pass" ? "pass" : "fail"}`}>
                   {result.verdict === "Pass" ? <i className="ri-checkbox-circle-fill"></i> : <i className="ri-close-circle-fill"></i>}
                   <span>{result.verdict}</span>
                </div>
              </div>

              <div className="result-stats-grid">
                <div className="stat-box">
                  <span className="label">{t("result.totalMarks")}</span>
                  <span className="value">{examData.totalMarks}</span>
                </div>
                <div className="stat-box">
                  <span className="label">{t("result.obtained")}</span>
                  <span className="value text-primary">{result.correctAnswers.length}</span>
                </div>
                <div className="stat-box">
                  <span className="label">{t("result.wrong")}</span>
                  <span className="value text-error">{result.wrongAnswers.length}</span>
                </div>
                <div className="stat-box">
                  <span className="label">{t("result.passing")}</span>
                  <span className="value">{examData.passingMarks}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4 w-100">
                <button
                  className="primary-contained-btn flex-1"
                  onClick={() => setView("review")}
                >
                  <i className="ri-eye-line mr-2"></i> {t("result.review")}
                </button>
                <button
                  className="primary-outlined-btn flex-1"
                  onClick={() => navigate("/")}
                >
                  <i className="ri-home-4-line mr-2"></i> {t("result.back")}
                </button>
              </div>

              <div className="lottie-animation-small mt-2">
                {result.verdict === "Pass" && (
                  <lottie-player
                    src="https://assets2.lottiefiles.com/packages/lf20_ya4ycrti.json"
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                    style={{ width: 150, height: 150 }}
                  ></lottie-player>
                )}
                {result.verdict === "Fail" && (
                  <lottie-player
                    src="https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json"
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                    style={{ width: 150, height: 150 }}
                  ></lottie-player>
                )}
              </div>
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedOptions[index];
              return (
                <div
                  className={`
                  flex flex-col gap-1 p-2 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }
                `}
                >
                  <h1 className="text-xl">
                    {index + 1} : {question.name}
                  </h1>
                  <h1 className="text-md">
                    Submitted Answer : {selectedOptions[index]} -{" "}
                    {question.options[selectedOptions[index]]}
                  </h1>
                  <h1 className="text-md">
                    Correct Answer : {question.correctOption} -{" "}
                    {question.options[question.correctOption]}
                  </h1>
                </div>
              );
            })}

            <div className="flex justify-center gap-2">
              <button
                className="primary-contained-btn"
                onClick={() => {
                  navigate("/");
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div> 
    )
  );
}

export default WriteExam;
