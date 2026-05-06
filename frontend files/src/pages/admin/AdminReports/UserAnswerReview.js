import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import { CloseOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { getRecordings } from "../../../apicalls/monitor";

function UserAnswerReview({ visible, setVisible, reportData }) {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  if (!reportData) return null;

  const { exam, user, result, sessionId } = reportData;
  const { correctAnswers = [], wrongAnswers = [], selectedOptions = {} } = result;

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const response = await getRecordings({ sessionId });
      if (response.success) {
        if (response.data.length === 0) {
          message.info("No video recordings found for this session.");
        } else {
          setRecordings(response.data);
          setShowVideo(true);
        }
      } else {
        message.error(response.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const getFullVideoUrl = () => {
    if (recordings.length === 0) return null;
    // Combine base64 chunks into a single blob
    try {
      const byteArrays = recordings.map(r => {
        const base64 = r.videoData.split(',')[1];
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Uint8Array(byteNumbers);
      });
      const blob = new Blob(byteArrays, { type: 'video/webm' });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error("Error creating video blob", e);
      return null;
    }
  };

  const getUserAnswer = (questionIndex) => {
    if (!selectedOptions || !exam || !exam.questions || !exam.questions[questionIndex]) {
      return "Data not available";
    }

    const selectedOption = selectedOptions[questionIndex];
    if (!selectedOption) return "Not answered";

    const question = exam.questions[questionIndex];
    if (!question || !question.options || !question.options[selectedOption]) {
      return `${selectedOption} - Option not found`;
    }

    return `${selectedOption} - ${question.options[selectedOption]}`;
  };

  const getCorrectAnswer = (questionIndex) => {
    if (!exam || !exam.questions || !exam.questions[questionIndex]) {
      return "Data not available";
    }

    const question = exam.questions[questionIndex];
    const correctOption = question.correctOption;

    if (!correctOption || !question.options || !question.options[correctOption]) {
      return "Data not available";
    }

    return `${correctOption} - ${question.options[correctOption]}`;
  };

  const isCorrect = (questionIndex) => {
    return correctAnswers.includes(questionIndex);
  };

  return (
    <Modal
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Answer Review
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            {exam.name} • {user.name}
          </p>
        </div>
      }
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setShowVideo(false);
      }}
      footer={null}
      width={900}
      centered
      className="creative-modal"
      closeIcon={
        <div className="modal-close-creative">
          <CloseOutlined />
        </div>
      }
    >
      <div className="max-h-96 overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-md font-medium mb-2">Exam Summary:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total Questions: {exam.questions ? exam.questions.length : 0}</div>
              <div>Correct Answers: {correctAnswers.length}</div>
              <div>Wrong Answers: {wrongAnswers.length}</div>
              <div>Verdict: {result.verdict}</div>
              <div>Session ID: <code className="text-xs">{sessionId}</code></div>
            </div>
          </div>
          
          <Button 
            type="primary" 
            danger 
            icon={<VideoCameraOutlined />} 
            onClick={fetchRecordings}
            loading={loading}
          >
            Watch Exam Recording
          </Button>
        </div>

        {showVideo && (
          <div className="mb-6 p-2 bg-black rounded-lg overflow-hidden shadow-2xl">
            <video 
              src={getFullVideoUrl()} 
              controls 
              className="w-full h-auto" 
              autoPlay
              style={{ maxHeight: '400px' }}
            />
            <div className="text-white text-xs p-2 text-center bg-gray-900">
              Exam Recording (Video + Audio)
            </div>
          </div>
        )}

        <div className="divider mb-4"></div>

        <div className="space-y-4">
          {exam.questions && exam.questions.length > 0 ? (
            exam.questions.map((question, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                isCorrect(index)
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <h4 className="font-medium mb-2">
                Question {index + 1}: {question.name}
              </h4>

              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Your Answer: </span>
                  <span className={isCorrect(index) ? "text-green-600" : "text-red-600"}>
                    {getUserAnswer(index)}
                  </span>
                </div>

                <div>
                  <span className="font-medium">Correct Answer: </span>
                  <span className="text-green-600">
                    {getCorrectAnswer(index)}
                  </span>
                </div>

                {reportData.questionTimings && reportData.questionTimings[index] != null && (
                  <div>
                    <span className="font-medium">Time Taken: </span>
                    <span>
                      {Math.round(reportData.questionTimings[index] / 1000)} seconds
                    </span>
                  </div>
                )}

                <div className="mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    isCorrect(index)
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {isCorrect(index) ? "Correct" : "Incorrect"}
                  </span>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No questions available for this exam.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default UserAnswerReview;
