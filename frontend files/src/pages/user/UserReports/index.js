import React, { useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import moment from "moment";

function UserReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam?.name || "N/A"}</>,
    },
    {
      title: "Stage",
      dataIndex: "stage",
      render: (text, record) => <>{record.exam?.stage || "N/A"}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam?.totalMarks || "N/A"}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam?.passingMarks || "N/A"}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result?.correctAnswers?.length || 0}</>,
    },
    {
      title: "Time Taken",
      dataIndex: "totalTime",
      render: (text, record) => {
        const seconds = record.totalTime || 0;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return <>{mins}m {secs}s</>;
      },
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => (
        <span
          className={
            record.result?.verdict === "Pass" ? "text-success" : "text-danger"
          }
        >
          {record.result?.verdict || "N/A"}
        </span>
      ),
    },
  ];

  const getData = async (currentPage = 1) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser({
        page: currentPage,
        limit: 10,
      });
      if (response.success && response.data) {
        setReportsData(response.data.reports || []);
        setTotalCount(response.data.totalCount || 0);
      } else {
        message.error(response.message || "Something went wrong");
        setReportsData([]);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
      setReportsData([]);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  return (
    <div>
      <PageTitle title="My Reports" />
      <div className="divider"></div>

      <div className="flex gap-2 items-center mb-2">
        <div className="card-summary p-2">
          <h1 className="text-md">Total Exams Taken : {totalCount}</h1>
        </div>
      </div>

      {reportsData.length === 0 && page === 1 ? (
        <div className="mt-2">No reports found. Please take some exams to see your performance.</div>
      ) : (
        <Table
          columns={columns}
          dataSource={reportsData}
          rowKey={(record) => record._id}
          pagination={{
            current: page,
            total: totalCount,
            pageSize: 10,
            onChange: (p) => setPage(p),
          }}
        />
      )}
    </div>
  );
}

export default UserReports;
