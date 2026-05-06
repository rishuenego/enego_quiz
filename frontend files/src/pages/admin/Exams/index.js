import { message, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const dispatch = useDispatch();

  const getExamsData = async (currentPage = 1) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams({
        page: currentPage,
        limit: 10,
      });
      dispatch(HideLoading());
      if (response.success && response.data) {
        setExams(response.data.exams || []);
        setTotalCount(response.data.totalCount || 0);
      } else {
        message.error(response.message || "Something went wrong");
        setExams([]);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
      setExams([]);
    }
  };

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData(page);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const columns = [
    {
      title: "Exam Name",
      dataIndex: "name",
    },
    {
      title: "Duration",
      dataIndex: "duration",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line"
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => deleteExam(record._id)}
          ></i>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getExamsData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  return (
    <div>
      <div className="flex justify-between mt-2 items-end">
        <PageTitle title="Exams" />

        <button
          className="add-exam-btn"
          onClick={() => navigate("/admin/exams/add")}
        >
          <i className="ri-add-circle-fill"></i>
          <span>Add Exam</span>
        </button>
      </div>
      <div className="divider"></div>

      <Table
        columns={columns}
        dataSource={exams}
        pagination={{
          current: page,
          total: totalCount,
          pageSize: 10,
          onChange: (p) => setPage(p),
        }}
      />
    </div>
  );
}

export default Exams;
