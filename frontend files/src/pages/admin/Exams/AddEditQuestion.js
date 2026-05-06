import { Form, message, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { addQuestionToExam, editQuestionById } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function AddEditQuestion({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
    selectedQuestion,
    setSelectedQuestion
}) {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const requiredPayload = {
        name: values.name,
        name_hi: values.name_hi,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        },
        options_hi: {
          A: values.A_hi,
          B: values.B_hi,
          C: values.C_hi,
          D: values.D_hi,
        },
        exam: examId,
      };

      let response;
      if (selectedQuestion) {
        response = await editQuestionById({
          ...requiredPayload,
          questionId: selectedQuestion._id,
        });
      } else {
        response = await addQuestionToExam(requiredPayload);
      }
      if (response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }
      setSelectedQuestion(null);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={selectedQuestion ? "Edit Question" : "Add Question"}
      visible={showAddEditQuestionModal}
      footer={false}
      onCancel={() => {
        setShowAddEditQuestionModal(false);
        setSelectedQuestion(null);
      }}
      width={800}
    >
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          name: selectedQuestion?.name,
          name_hi: selectedQuestion?.name_hi,
          A: selectedQuestion?.options?.A,
          B: selectedQuestion?.options?.B,
          C: selectedQuestion?.options?.C,
          D: selectedQuestion?.options?.D,
          A_hi: selectedQuestion?.options_hi?.A,
          B_hi: selectedQuestion?.options_hi?.B,
          C_hi: selectedQuestion?.options_hi?.C,
          D_hi: selectedQuestion?.options_hi?.D,
          correctOption: selectedQuestion?.correctOption,
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="name" label="Question (English)">
            <input type="text" />
          </Form.Item>
          <Form.Item name="name_hi" label="Question (Hindi/Hinglish)">
            <input type="text" />
          </Form.Item>
        </div>
        <Form.Item name="correctOption" label="Correct Option">
          <input type="text" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="A" label="Option A (English)">
            <input type="text" />
          </Form.Item>
          <Form.Item name="A_hi" label="Option A (Hindi/Hinglish)">
            <input type="text" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="B" label="Option B (English)">
            <input type="text" />
          </Form.Item>
          <Form.Item name="B_hi" label="Option B (Hindi/Hinglish)">
            <input type="text" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="C" label="Option C (English)">
            <input type="text" />
          </Form.Item>
          <Form.Item name="C_hi" label="Option C (Hindi/Hinglish)">
            <input type="text" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="D" label="Option D (English)">
            <input type="text" />
          </Form.Item>
          <Form.Item name="D_hi" label="Option D (Hindi/Hinglish)">
            <input type="text" />
          </Form.Item>
        </div>

        <div className="flex justify-end mt-2 gap-3">
          <button
            className="primary-outlined-btn"
            type="button"
            onClick={() => setShowAddEditQuestionModal(false)}
          >
            Cancel
          </button>
          <button className="primary-contained-btn">Save</button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditQuestion;
